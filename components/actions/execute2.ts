"use client";

import { https, Result } from "@/app/koksmat/httphelper";

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
  token: string,
  database: string,
  servicename: string,
  processname: string,
  payload: any
): Promise<Result<string>> {
  const args = [
    "execute",
    database,
    processname,
    token,
    JSON.stringify(payload),
  ];

  const response: any = await https<string>(token, "POST", "/api/run", {
    args,
    channel: servicename,
    timeout: 600,
  });
  const result: Result<string> = {
    data: response.data?.data,
    hasError: response.data?.hasError,
    errorMessage: response.data?.errorMessage,
  };

  return result;
}
