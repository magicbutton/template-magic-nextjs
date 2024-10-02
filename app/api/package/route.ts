import { run } from "@/app/koksmat/magicservices";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const result = await run(
      res.channel,
      res.args,
      res.body,
      res.timeout,
      res.transactionId
    );
    return Response.json(result);
  } catch (error) {
    return Response.error();
  }
}
