import { NatsConnection, connect, StringCodec } from "nats";

export async function workspaceExecute(
  sessionId: string,
  action: string,
  command: string,
  args: string[],
  callback: (response: any) => boolean
) {
  let nc: NatsConnection | null = null;

  const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
  nc = await connect({
    servers: [connectionString],
  });
  let waiting = true;
  let loopcounter = 0;
  nc.publish(
    "autopilot.request." + sessionId,
    StringCodec().encode(JSON.stringify({ action, command, args }))
  );
  try {
    const sub = nc.subscribe("autopilot.response." + sessionId, {
      callback: (err, msg) => {
        const sc = StringCodec();
        if (err) {
          console.log("subscription error", err.message);
          return;
        }
        const requestBody = sc.decode(msg.data);
        const completed = callback(requestBody);
        console.log("response", requestBody);
        if (completed) {
          waiting = false;
          sub.unsubscribe();
        }
      },
    });
    while (waiting) {
      loopcounter++;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (loopcounter > 60) {
        waiting = false;
        sub.unsubscribe();
      }
    }
  } catch (error) {
    console.log("workspaceExecute error", error);
  } finally {
    if (nc) {
      nc.close();
    }
  }
}
