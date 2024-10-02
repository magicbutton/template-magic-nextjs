import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const componentsDir = path.join(process.cwd(), "components");
  const files = fs.readdirSync(componentsDir);
  const componentFiles = files.filter(
    (file) => file.endsWith(".tsx") || file.endsWith(".jsx")
  );
  const componentNames = componentFiles.map((file) => path.parse(file).name);

  return NextResponse.json(componentNames);
}
