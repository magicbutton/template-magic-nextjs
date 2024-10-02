export function pathJoin(...paths: string[]): string {
  // Join the paths using the slash as a separator
  return paths
    .map((part, index) => {
      // Remove leading slash for all but the first part
      if (index > 0) {
        part = part?.replace(/^\/+/, "");
      }
      // Remove trailing slash for all but the last part
      if (index < paths.length - 1) {
        part = part?.replace(/\/+$/, "");
      }
      return part;
    })
    .filter((part) => part?.length > 0) // Filter out empty parts
    .join("/");
}
