import { spawn } from "child_process";

/**
 *
 * @param cmd
 * @param args
 * @param cwd
 * @returns
 *
 * @example
 * const result = await osExec("pwsh", ["-c", "echo 'Hello, World!'"]);
 * console.log(result);
 *
 * or
 *
 * with control over the working directory
 *
 * const result = await osExec("pwsh", ["-c", "echo 'Hello, World!'"], "/tmp");
 * console.log(result);
 */
export function osExec(
  cmd: string,
  args: string[],
  cwd?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("osExec", cmd, args, cwd);
    const program = spawn(cmd, args, { cwd });

    let stdout = "";
    let stderr = "";

    // Capture stdout data
    program.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    // Capture stderr data
    program.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Handle the process closing
    program.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`${cmd} exited with code ${code}: ${stderr}`));
      }
    });

    // Handle errors in the process
    program.on("error", (err) => {
      reject(err);
    });
  });
}
