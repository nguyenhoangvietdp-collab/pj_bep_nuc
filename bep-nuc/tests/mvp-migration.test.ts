import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";
test("MVP migration is empty, idempotent and blocks direct browser roles",async()=>{
 const db=new PGlite();
 try{
  await db.exec("CREATE ROLE anon; CREATE ROLE authenticated;");
  const migration=await readFile(new URL("../supabase/migrations/202610270001_initial.sql",import.meta.url),"utf8");
  await db.exec(migration);
  const initial=await db.query<{data:any}>("SELECT data FROM bc_state");assert.equal(initial.rows[0].data.shops.length,0);assert.equal(initial.rows[0].data.orders.length,0);
  await db.exec("SET ROLE anon");await assert.rejects(db.query("SELECT data FROM bc_state"));await db.exec("RESET ROLE");
  await db.exec("SET ROLE authenticated");await assert.rejects(db.query("SELECT data FROM bc_state"));await db.exec("RESET ROLE");
  await db.exec("SET ROLE bep_nuc_runtime");await db.query("UPDATE bc_state SET data=jsonb_set(data,'{audit}','[{\"action\":\"migration-test\"}]'::jsonb) WHERE id=1");await assert.rejects(db.query("DELETE FROM bc_state"));await db.exec("RESET ROLE");
  await db.exec(migration);const after=await db.query<{data:any}>("SELECT data FROM bc_state");assert.equal(after.rows[0].data.audit[0].action,"migration-test");
 }finally{await db.close();}
});
