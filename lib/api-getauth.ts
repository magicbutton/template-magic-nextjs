import { jwtDecode } from "jwt-decode";

export async function getUPNfromBearer(
  request: Request
): Promise<{ upn: string; errorMessage: string }> {
  // Extract the Authorization header
  const authHeader = request.headers.get("Authorization");

  // Check if the Authorization header is present and is a Bearer token
  let token = null;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.substring(7); // Extract the token after "Bearer "
  }
  if (!token) {
    return { upn: "", errorMessage: "Unauthorized" };
  }
  const jwt: any = jwtDecode(token);
  return { upn: jwt.upn, errorMessage: "" };
}
