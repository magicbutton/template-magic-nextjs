import { run } from "@/actions/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const result = await run<any>(
      res.channel,
      res.args,
      res.body,
      res.timeout,
      res.transactionId
    );
    let hasError = result.hasError;
    if (hasError) {
      return new Response(JSON.stringify({ error: result.errorMessage }));
    }
    if (!result.data?.Result) {
      return new Response(
        JSON.stringify({
          error: "No error signalled, but empty result returned",
        })
      );
    }

    const returnValue = result.data?.Result;
    return new Response(JSON.stringify(returnValue));
  } catch (error) {
    return Response.error();
  }
}
