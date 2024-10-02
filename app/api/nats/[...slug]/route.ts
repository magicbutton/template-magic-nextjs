import { osExec } from "@/lib/osexec";
import { NatsConnection, connect, StringCodec, JetStreamManager } from "nats";

async function run(method: "GET" | "POST", slug: string[], request: Request) {
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
      // case "js/streams:GET":
      //   const streams = await osExec("nats", ["stream", "list", "--json"]);
      //   result = new Response(streams);

      // case "js/streams:POST":
      //   result = Response.json(
      //     addStream(await nc.jetstream().jetstreamManager(), request)
      //   );
      default:
        if (method === "GET") {
          const streams = await osExec("nats", slug);
          result = new Response(streams);
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
  { params }: { params: { slug: string[] } }
) {
  return run("POST", params.slug, request);
}
export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  return run("GET", params.slug, request);
}
