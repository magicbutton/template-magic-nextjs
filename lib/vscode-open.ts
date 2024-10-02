export async function vsCodeOpen(
  authtoken: string,
  filename: string,
  cwd: string
): Promise<boolean> {
  const args = [filename, "--add"];
  const command = "code";

  const request1 = new Request(`/api/autopilot/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authtoken}`,
    },
    body: JSON.stringify({
      sessionid: "x",
      action: "execute",
      command,
      args,
      cwd,
    }),
  });
  const result = await fetch(request1).catch((e) => {
    console.error(e);
    return false;
  });

  if (!result) return false;

  return true;
}
