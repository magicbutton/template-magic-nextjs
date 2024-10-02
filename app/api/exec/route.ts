import { NatsRPC } from "@/lib/nats-rpc";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await NatsRPC(
    body.sessionid,
    body.action,
    body.command,
    body.args
  );

  return new Response(response);
}
