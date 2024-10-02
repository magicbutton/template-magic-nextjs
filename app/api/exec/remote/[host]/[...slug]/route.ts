import { osExec } from "@/lib/osexec";
import { NatsRPC } from "@/lib/nats-rpc";
import { NatsConnection, connect, StringCodec, JetStreamManager } from "nats";

async function run(
  host: string,
  method: "GET" | "POST",
  slug: string[],
  request: Request
) {
  const cmd = slug.shift();
  const path = slug.join("/");
  const key = path + ":" + method;
  let nc: NatsConnection | null = null;
  let result = Response.json({ status: "unknown" }, { status: 404 });

  try {
    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });

    switch (key) {
      default:
        if (method === "GET") {
          const response = await NatsRPC(host, "n.a.", cmd!, slug);
          const p1 = JSON.parse(response);

          result = new Response(p1.body);
        }

        break;
    }
  } catch (error) {
    console.error("error", error);
    result = Response.json({ error: error }, { status: 500 });
  } finally {
    if (nc) {
      nc.close();
    }
  }
  return result;
}

export async function POST(
  request: Request,
  { params }: { params: { host: string; slug: string[] } }
) {
  return run(params.host, "POST", params.slug, request);
}
export async function GET(
  request: Request,
  { params }: { params: { host: string; slug: string[] } }
) {
  return run(params.host, "GET", params.slug, request);
}
