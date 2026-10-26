import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { State, demoState, empty, expire, issue } from "./domain";
const schema = `CREATE TABLE IF NOT EXISTS bc_state (id integer PRIMARY KEY CHECK(id=1), data jsonb NOT NULL); ALTER TABLE bc_state ENABLE ROW LEVEL SECURITY; REVOKE ALL ON bc_state FROM PUBLIC; DO $$ BEGIN IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON bc_state FROM anon; END IF; IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON bc_state FROM authenticated; END IF; END $$;`;
let local: Promise<PGlite> | undefined;
let sql: ReturnType<typeof postgres> | undefined;
let queue = Promise.resolve();
export const demo = () => process.env.APP_MODE !== "production";
export function clock() {
  if (demo() && process.env.DEMO_NOW) return Date.parse(process.env.DEMO_NOW);
  return Date.now();
}
async function database() {
  if (!local)
    local = (async () => {
      const dir = resolve(process.env.PGLITE_DIR || ".data/postgres");
      await mkdir(dir, { recursive: true });
      return new PGlite(dir);
    })();
  return local;
}
export async function transaction<T>(
  fn: (state: State) => T | Promise<T>,
): Promise<T> {
  const run = async () => {
    if (process.env.DATABASE_URL) {
      sql ??= postgres(process.env.DATABASE_URL, { max: 3, prepare: false });
      return sql
        .begin(async (tx) => {
          await tx`SELECT pg_advisory_xact_lock(32002026)`;
          if (demo()) await tx.unsafe(schema);
          const rows =
            await tx`SELECT data FROM bc_state WHERE id=1 FOR UPDATE`;
          const s: State =
            rows[0]?.data ?? (demo() ? demoState(clock()) : empty());
          s.research ??= [];
          s.expenses ??= [];
          expire(s, clock());
          for (const user of s.users)
            if (user.approved) issue(s, user, clock());
          const clean = structuredClone(s);
          let result: T;
          let error: unknown;
          try {
            result = await fn(s);
          } catch (e) {
            error = e;
          }
          await tx`INSERT INTO bc_state(id,data) VALUES(1,${tx.json((error ? clean : s) as any)}) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data`;
          if (error) return { error };
          return { result: result! };
        })
        .then((x: any) => {
          if (x.error) throw x.error;
          return x.result;
        });
    }
    if (!demo()) throw new Error("Production cần DATABASE_URL riêng");
    const db = await database();
    await db.exec(schema);
    const outcome = await db.transaction(async (tx) => {
      const rows = await tx.query<{ data: State }>(
        "SELECT data FROM bc_state WHERE id=1",
      );
      const s = rows.rows[0]?.data ?? demoState(clock());
      s.research ??= [];
      s.expenses ??= [];
      expire(s, clock());
      for (const user of s.users) if (user.approved) issue(s, user, clock());
      const clean = structuredClone(s);
      let result: T;
      let error: unknown;
      try {
        result = await fn(s);
      } catch (e) {
        error = e;
      }
      await tx.query(
        "INSERT INTO bc_state(id,data) VALUES(1,$1) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data",
        [JSON.stringify(error ? clean : s)],
      );
      return { result: result!, error };
    });
    if (outcome.error) throw outcome.error;
    return outcome.result;
  };
  const next = queue.then(run, run);
  queue = next.then(
    () => {},
    () => {},
  );
  return next;
}
export async function closeStore() {
  if (local) await (await local).close();
  if (sql) await sql.end();
}
