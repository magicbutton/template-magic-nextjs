"use client";
import React from "react";
import { useState } from "react";

import { callWorkspace } from "@/components/actions/call-workspace";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
export default function Page(props: {
  params: { sessionid: string };
  searchParams: { done: string };
}) {
  const { sessionid } = props.params;
  const { done } = props.searchParams;
  const [workspace, setWorkspace] = useState<JSX.Element>();
  const [running, setrunning] = useState(false);
  const pathname = usePathname();
  return (
    <div>
      {done && <div>Done</div>}
      {!done && (
        <Button
          disabled={running}
          onClick={async () => {
            setrunning(true);
            const workspaceUI = await callWorkspace(
              sessionid,
              "execute", // "ping
              "ping",
              ["www.dr.dk", "-c", "4"],
              30,
              { onSuccess: "redirect", finalUrl: pathname + "?done=true" }
            );
            setWorkspace(workspaceUI);
          }}
        >
          Call Workspace
        </Button>
      )}

      {workspace}
    </div>
  );
}
