import { getUserFromUPN } from "@/app/api/workspace";

export async function GET(
  request: Request,
  { params }: { params: { upn: string } }
) {
  const { upn } = params;
  try {
    const result = await getUserFromUPN(upn);
    return Response.json(result);
  } catch (error) {
    return Response.error();
  }
}
