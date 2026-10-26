import { act, catalogue, issue, readiness, view, type State, type RuntimePolicy } from "./domain.ts";
export type VerifiedIdentity = { id: string; email?: string };
export type EdgeConfig = { origin: string; policy: RuntimePolicy; bank?: { name: string; account: string; holder: string }; supportEmail?: string; acceptingOrders: boolean };
export type EdgeDependencies = {
  config: EdgeConfig;
  authenticate: (token: string) => Promise<VerifiedIdentity | null>;
  transaction: <T>(fn: (state: State) => T) => Promise<T>;
  now?: () => number;
};
class ClientError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function createEdgeHandler(deps: EdgeDependencies) {
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get("origin");
    const headers: Record<string,string> = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Vary": "Origin", "X-Content-Type-Options": "nosniff" };
    if (origin === deps.config.origin) {
      headers["Access-Control-Allow-Origin"] = origin;
      headers["Access-Control-Allow-Headers"] = "authorization, apikey, content-type, x-client-info";
      headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    }
    const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
    const run = <T>(fn: (state: State) => T) => deps.transaction(s => {
      try { return fn(s); } catch (e) { if (e instanceof ClientError) throw e; throw new ClientError(e instanceof Error ? e.message : "Yêu cầu không hợp lệ"); }
    });
    try {
      if (origin && origin !== deps.config.origin) return response({ error: "Origin không hợp lệ" },403);
      if (req.method === "OPTIONS") return new Response(null,{status:204,headers});
      if (!["GET","POST"].includes(req.method)) return response({error:"Phương thức không hỗ trợ"},405);
      const parts = new URL(req.url).pathname.split("/").filter(Boolean);
      const route = parts[parts.length-1];
      const now = deps.now?.() ?? Date.now();
      if (req.method === "GET" && route === "health") return response({ok:true});
      if (req.method === "GET" && route === "catalogue") return response(await run(s => ({ ...catalogue(s,now,true), demo:false, mapsEnabled:false, pilotOpen:deps.config.acceptingOrders && deps.config.policy.pilotEnabled && deps.config.policy.bankReady && readiness(s).ready })));
      if (!["auth","pilot","export"].includes(route)) return response({error:"Không tìm thấy API"},404);
      const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
      const identity = token ? await deps.authenticate(token) : null;
      if (!identity) return route === "auth" && req.method === "GET" && !token ? response({user:null,supportEmail:deps.config.supportEmail}) : response({error:"Phiên đăng nhập không hợp lệ hoặc đã hết hạn"},401);
      const user = await run(s => {
        let u=s.users.find(u=>u.id===identity.id);
        if (!u) { u={id:identity.id,name:(identity.email || "Sinh viên").slice(0,120),role:"student",approved:false}; s.users.push(u); }
        return {...u};
      });
      if (req.method === "GET" && route === "auth") return response({user,supportEmail:deps.config.supportEmail});
      if (!user.approved) return response({error:"Tài khoản đang chờ vận hành duyệt"},403);
      if (req.method === "GET" && route === "export") {
        if (user.role !== "ops") return response({error:"Chỉ vận hành được xuất đối soát"},403);
        return response(await run(s => {
          const current=s.users.find(u=>u.id===user.id);
          if(!current?.approved || current.role!=="ops")throw new ClientError("Chỉ vận hành được xuất đối soát",403);
          return {...s,exportedAt:now,requests:undefined,orders:s.orders.map(({code,...order})=>order)};
        }));
      }
      if (route !== "pilot") return response({error:"Phương thức không hỗ trợ"},405);
      if (req.method === "GET") return response(await run(s => {
        const current=s.users.find(u=>u.id===user.id)!; issue(s,current,now);
        if(!current.approved)throw new ClientError("Tài khoản đang chờ vận hành duyệt",403);
        // Pausing new reservations must not remove payment instructions from existing orders.
        return {...view(s,current,now),demo:false,mapsEnabled:false,supportEmail:deps.config.supportEmail,bank:deps.config.policy.bankReady?deps.config.bank:undefined};
      }));
      if (origin !== deps.config.origin) return response({error:"Origin không hợp lệ"},403);
      if (Number(req.headers.get("content-length") || 0)>32768) return response({error:"Yêu cầu quá lớn"},413);
      const text=await req.text(); if (new TextEncoder().encode(text).length>32768) return response({error:"Yêu cầu quá lớn"},413);
      let body: any; try { body=JSON.parse(text); } catch { return response({error:"JSON không hợp lệ"},400); }
      if (!body || typeof body.action!=="string" || !body.args || typeof body.args!=="object" || Array.isArray(body.args)) return response({error:"Sai yêu cầu"},400);
      if(!/^[a-z_]{1,32}$/.test(body.action) || typeof body.args.key!=="string" || body.args.key.length<8 || body.args.key.length>128) return response({error:"Khóa hoặc thao tác không hợp lệ"},400);
      if (body.action==="quote" && !deps.config.acceptingOrders) return response({error:"Tạm dừng nhận đơn mới. Bạn vẫn có thể theo dõi đơn hiện tại."},409);
      return response(await run(s => {
        const current=s.users.find(u=>u.id===user.id)!; issue(s,current,now);
        // Maps intentionally disabled on the zero-budget deployment.
        const args={...body.args}; delete args.location;
        return act(s,current,body.action,args,now,null,deps.config.policy);
      }));
    } catch (e) {
      if (e instanceof ClientError) return response({error:e.message},e.status);
      return response({error:"Dịch vụ tạm thời chưa sẵn sàng. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ."},503);
    }
  };
}
