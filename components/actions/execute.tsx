"use client";

import { https, Result } from "@/app/koksmat/httphelper";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

import { useMsal, useAccount } from "@azure/msal-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CaseProps {
  scopes: string[];
  title: string;
  testurl: string;
  token?: string;
}
const UserProfileAPI: CaseProps = {
  scopes: ["User.Read"],
  title: "Read user profile",
  testurl: "https://graph.microsoft.com/v1.0/me",
};

export interface ProcessProps {
  database: string;
  servicename: string;
  processname: string;
  payload: any;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
  onMounted?: (ExecutionTracer: JSX.Element) => void;
}
export async function execute(
  database: string,
  servicename: string,
  processname: string,
  payload: any,
  onMounted?: (ExecutionTracer: JSX.Element) => void
): Promise<Result<string>> {
  return new Promise((resolve, reject) => {
    const ExecutionTracer = (
      <Execute
        database={database}
        servicename={servicename}
        processname={processname}
        payload={payload}
        onError={(error) => resolve({ hasError: true, errorMessage: error })}
        onSuccess={(response) => resolve({ hasError: false, data: "" })}
      />
    );
    if (onMounted) {
      onMounted(ExecutionTracer);
    }
  });
}

export function Execute(props: ProcessProps) {
  const { database, servicename, processname, payload, onError, onSuccess } =
    props;
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [latestResponse, setlatestResponse] = useState<any>();
  const [token, settoken] = useState("");
  const [latestError, setlatestError] = useState<any>();

  const magicbox = useContext(MagicboxContext);
  const aquireToken = async (thisCase: CaseProps) => {
    setlatestError(undefined);
    setlatestResponse(undefined);
    if (account && thisCase) {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: thisCase?.scopes ?? [],
          account: account,
        });
        thisCase.token = response.accessToken;
        magicbox.setAuthToken(response.accessToken, "MSAL");
        settoken(response.accessToken);
        const getResponse = await https(
          response.accessToken,
          "GET",
          thisCase.testurl
        );
        setlatestResponse(getResponse);
      } catch (error) {
        try {
          const response = await instance.acquireTokenPopup({
            scopes: thisCase?.scopes ?? [],
            account: account,
          });
          thisCase.token = response.accessToken;
          settoken(response.accessToken);
          magicbox.setAuthToken(response.accessToken, "MSAL");

          const getResponse = await https(
            response.accessToken,
            "GET",
            thisCase.testurl
          );
          setlatestResponse(getResponse);
        } catch (error) {
          setlatestError(error);
        }
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      if (magicbox.authtoken) {
        settoken(magicbox.authtoken);
        return;
      }
      await aquireToken(UserProfileAPI);
    };
    load();
  }, []);
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const calledTimestamp = new Date();
      const args = [
        "execute",
        database,
        processname,
        token,
        JSON.stringify(payload),
      ];

      const result = await https(token, "POST", "/api/run", {
        args,
        channel: servicename,
        timeout: 600,
      });

      //const result = await run(servicename, args, "", 600, "x");

      magicbox.logServiceCall({
        calledTimestamp,
        responedTimestamp: new Date(),
        request: {
          args: ["process", processname, JSON.stringify(payload)],
          body: "",
          channel: servicename,
          timeout: 600,
        },
        servicename,
        response: result,
        transactionId: "x",
      });

      if (result.hasError) {
        onError?.(result.errorMessage ?? "unknown error");
      } else {
        onSuccess?.(result.data);
      }
    };
    load();
  }, [token]);
  return <div></div>;
}

export default function ExecuteTransaction(props: {
  children?: any;
  database: string;
  processname: string;
  payload: any;
  transactionId: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  options?: { suppressError?: boolean; suppressProgress?: boolean };
}) {
  const { children, database, payload, processname, transactionId } = props;
  const [running, setrunning] = useState(false);
  const [error, seterror] = useState("");
  const [result, setresult] = useState("");

  const doShowError = () => {
    if (props.options?.suppressError) {
      return false;
    }
    if (error) {
      return true;
    }
    return false;
  };

  const doShowProgress = () => {
    if (props.options?.suppressProgress) {
      return false;
    }
    if (running) {
      return true;
    }
    return false;
  };

  // hack to ensure that the process will run when the transactionId changes
  useEffect(() => {
    setrunning(true);
  }, [transactionId]);

  if (!transactionId) {
    return null;
  }

  const component = (
    <div>
      {doShowError() && <div className="p-10 bg-red-500">Error: {error}</div>}
      {running && (
        <div>
          <Execute
            database={database}
            servicename="magic-mix.app"
            processname={processname}
            payload={payload}
            onError={(error: any) => {
              setrunning(false);
              seterror(error);
              if (props.onError) {
                props.onError(error);
              }
            }}
            onSuccess={(result: any) => {
              setrunning(false);
              if (result.hasError) {
                seterror(result.errorMessage);
                if (props.onError) {
                  props.onError(result.errorMessage);
                }
              } else {
                setresult(result.data);
                if (props.onSuccess) {
                  props.onSuccess(result.data);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
  let wrapper = component;

  if (true) {
    wrapper = (
      <div>
        {component}
        {result && children}

        {result && <Button>Done</Button>}
      </div>
    );
  }

  return wrapper;
}
