export function createIngredienceTemmplate(
  database: string,
  processname: string,
  interfaceName: string,
  interfaceContent: string
) {
  return {
    foldername: "actions",
    filename: database + "-" + processname + ".tsx",
    interfaceName,
    interfaceContent,
    tsxContent: `
/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: true
---
*/   
  


import React, { useEffect, useState } from "react";
import ExecuteTransaction from "./execute";

${interfaceContent}

export default function ShareCreateBite(props: {
  transactionid: string;
  request: ${interfaceName} | null | undefined;
}) {
  const { request, transactionid } = props;
  const hasRequestBeenInitialized = () => {
    return request !== null && request !== undefined;
  };
  const [payload, setpayload] = useState<${interfaceName} | null | undefined>(
    null
  );
  useEffect(() => {
    if (!hasRequestBeenInitialized()) return;

    setpayload(request);
  }, [request]);

  return (
    <div>
      {hasRequestBeenInitialized() && (
        <ExecuteTransaction
          database="${database}"
          payload={payload}
          processname="${processname}"
          transactionId={transactionid}
        />
      )}
    </div>
  );
}
  
  `,
  };
}
