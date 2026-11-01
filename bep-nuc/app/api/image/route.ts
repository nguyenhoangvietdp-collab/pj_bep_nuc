import {NextRequest,NextResponse} from "next/server";
import {identity} from "../../../lib/auth";
import {transaction} from "../../../lib/store";
import {receiveLotImage,storeLotImage} from "../../../lib/lot-images";
export const runtime="nodejs";
export async function POST(req:NextRequest){
 try{if(req.headers.get("origin")!==new URL(process.env.APP_URL||"http://127.0.0.1:3200").origin)return NextResponse.json({error:"Origin không hợp lệ"},{status:403});const id=await identity();const url=process.env.NEXT_PUBLIC_SUPABASE_URL??"",key=process.env.SUPABASE_SERVICE_ROLE_KEY??"";if(!url||!key)return NextResponse.json({error:"Chưa cấu hình nơi lưu ảnh lô"},{status:503});return NextResponse.json(await receiveLotImage(req,id,transaction,(bytes,mime)=>storeLotImage(url,key,bytes,mime)));}catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
}
