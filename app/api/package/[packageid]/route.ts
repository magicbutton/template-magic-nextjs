import { run } from "@/app/koksmat/magicservices";
export async function GET(
  request: Request,
  { params }: { params: { packageid: string } }
) {
  const { packageid } = params;
  try {
    //const res = await request.json();
    const result = await run(
      "magic-mix.app",
      [
        "query",
        "share",
        `
        select * from bite where name = '${packageid}'

        `,
      ],
      "",
      600,
      "x"
    );
    return Response.json(result);
  } catch (error) {
    return Response.error();
  }
}

/**
 * 
 * 
  const { packageid } = req.query;

 
  res.status(200).json(result);
 */
