import { https } from "@/app/koksmat/httphelper";
import { workflowEmit } from "../server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const host = process.env.MAGICMIXAPI ?? "http://localhost:8080";
    const result = await https("", "POST", `${host}/v1/subscription`, {
      id: body.id,
    });
    let hasError = result.hasError;
    if (hasError) {
      return new Response(JSON.stringify({ error: result.errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const returnValue = result.data;
    return new Response(JSON.stringify(returnValue), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
