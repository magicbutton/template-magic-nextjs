import { run } from "@/app/koksmat/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { log } from "@/lib/log";
import { NatsMessageReceiver } from "@/lib/nats-message-receiver";
import { getDate } from "date-fns";
import { NatsConnection, connect, StringCodec } from "nats";
import { NatsRPC } from "@/lib/nats-rpc";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export async function POST(
  request: Request,
  { params }: { params: { sessionid: string } }
) {
  const body = await request.text();
  const args = body.split("\n");

  const result = await NatsRPC(params.sessionid, "", "pwsh", args);

  return new Response(result);
}

/**
 * 
 * 
  const { packageid } = req.query;

 
  res.status(200).json(result);
 */
