import { getUPNfromToken } from "@/app/api/workspace";
import { log } from "@/lib/log";
import { NatsMessageReceiver } from "@/lib/nats-message-receiver";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { sessionid: string } }
) {
  log("GET /autopilot/session/[sessionid]");

  // Extract the Authorization header
  const authHeader = request.headers.get("Authorization");

  // Check if the Authorization header is present and is a Bearer token
  let token = null;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.substring(7); // Extract the token after "Bearer "
  }
  if (!token) {
    log("Missing token");
    return new Response(JSON.stringify({ errormessage: "Unauthorized" }));
  }

  //const jwt: any = jwtDecode(token);

  const upn = await getUPNfromToken(token);

  const msg = await NatsMessageReceiver(params.sessionid);

  return new Response(msg ? msg : JSON.stringify({ errormessage: "timeout" }));
}

/**
 * 
 * 
  const { packageid } = req.query;

 
  res.status(200).json(result);
 */
