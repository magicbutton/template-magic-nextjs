import { run } from "@/app/koksmat/magicservices";

export async function GET(request: Request) {
  try {
    return Response.json({ status: "ok" });
  } catch (error) {
    return Response.error();
  }
}
