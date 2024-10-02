export function capitalizeFirstChar(str: string): string {
  if (str.length === 0) return str; // Return empty string if input is empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}
