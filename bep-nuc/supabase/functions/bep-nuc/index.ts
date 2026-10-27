import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { createEdgeHandler } from "../../../lib/edge-api.ts";
import { empty, expire, issue, type State } from "../../../lib/domain.ts";
import { photonGeocode } from "../../../lib/geocoding.ts";
const env = (name: string) => Deno.env.get(name);
const url=env("SUPABASE_URL"), key=env("SUPABASE_ANON_KEY"), connection=env("MVP_DATABASE_URL"), origin=env("APP_ORIGIN");
if (!url || !key || !connection || !origin || new URL(origin).origin!==origin || !origin.startsWith("https://")) throw new Error("Missing or invalid production configuration");
const auth=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const sql=postgres(connection,{max:1,prepare:false,idle_timeout:1,connect_timeout:10});
const bank={name:env("BANK_NAME") || "",account:env("BANK_ACCOUNT") || "",holder:env("BANK_HOLDER") || ""};
Deno.serve(createEdgeHandler({
 geocode:address => photonGeocode(address),
 config:{origin,policy:{production:true,pilotEnabled:env("REAL_PILOT_ENABLED")==="true",bankReady:!!(bank.name&&bank.account&&bank.holder)},bank,supportEmail:env("SUPPORT_EMAIL"),acceptingOrders:env("ACCEPTING_ORDERS")!=="false"},
 authenticate:async token=>{const {data,error}=await auth.auth.getUser(token);return error||!data.user?null:{id:data.user.id,email:data.user.email};},
 transaction:async fn=>{
   const outcome=await sql.begin(async tx=>{
     await tx`SELECT pg_advisory_xact_lock(32002026)`;
     const rows=await tx`SELECT data FROM public.bc_state WHERE id=1 FOR UPDATE`;
     const state:State=rows[0]?.data ?? empty();
     const now=Date.now(); expire(state,now); for(const user of state.users) if(user.approved) issue(state,user,now);
     const clean=structuredClone(state);
     let result:unknown,error:unknown;
     try {result=fn(state);} catch(e){error=e;}
     await tx`INSERT INTO public.bc_state(id,data) VALUES(1,${tx.json((error?clean:state) as any)}) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data`;
     return {result,error};
   });
   if(outcome.error) throw outcome.error;
   return outcome.result as any;
 }
}));
