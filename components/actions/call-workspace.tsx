"use server";

import { workspaceExecute } from "@/lib/workspace";
import { createStreamableUI } from "ai/rsc";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SetCookie } from "./set-cookie";
import Script from "next/script";

function Redirect(props: { finalUrl: string }) {
  // nextjs redirect

  redirect(props.finalUrl);

  return <div>Redirecting</div>;
}

export interface CallWorkspaceOptions {
  onSuccess: "redirect" | "setcookie";
  finalUrl?: string;
  cookie?: string;
  cookieLifetime?: number;
}
export async function callWorkspace(
  sessionid: string,
  action: string,
  cmd: string,
  args: string[],
  timeout: number,
  options: CallWorkspaceOptions
) {
  const workspaceUI = createStreamableUI();
  const timeoutHandle = setTimeout(() => {
    workspaceUI.done(<div>Timed out</div>);
  }, timeout * 1000);

  const callback = (value: any) => {
    let completed = false;
    let component = <div></div>;
    try {
      const data = JSON.parse(value);
      switch (data.type) {
        case "append":
          component = <div style={{ color: "gray" }}>{data.body}</div>;
          workspaceUI.append(component);
          break;
        case "update":
          component = <div style={{ color: "gray" }}>{data.body}</div>;
          workspaceUI.update(component);
          break;
        case "error":
          clearTimeout(timeoutHandle);
          component = <div style={{ color: "gray" }}>{data.body}</div>;
          workspaceUI.error(component);
          completed = true;
          break;
        case "done":
          clearTimeout(timeoutHandle);
          switch (options.onSuccess) {
            case "redirect":
              component = <Redirect finalUrl={options.finalUrl ?? "/"} />;

              break;
            case "setcookie":
              component = (
                <div>
                  Pong
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `
                  <script>
                  alert('Hello world!')
                  </script>
                  `,
                    }}
                  ></div>
                </div>
              );

            default:
              break;
          }
          completed = true;
          //component = <div>{data.text}</div>;
          break;

        default:
          // component = <div style={{ color: "gray" }}>{data.body}</div>;
          break;
      }
    } catch (error) {
      console.log("error", error);
      component = <div style={{ color: "red" }}>Error</div>;
    }
    workspaceUI.append(component);
    return completed;
  };
  workspaceExecute(sessionid, action, cmd, args, callback);

  return workspaceUI.value;
}
