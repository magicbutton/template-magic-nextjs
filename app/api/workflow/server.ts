"use server";
import { Result } from "@/app/koksmat/httphelper";
import { NatsConnection, connect, StringCodec } from "nats";

export interface WorkflowRequest {
  body: string;
  channel: string;
  timeout: number;
}

export async function workflowEmit<T>(
  subject: string,
  body: string,
  timeout: number,
  channel: string
): Promise<Result<T>> {
  const req: WorkflowRequest = {
    body,
    channel,
    timeout,
  };

  let errorMessage: string | undefined = undefined;
  let hasError = false;
  let nc: NatsConnection | null = null;
  let data: any;
  let serviceCallResult: Result<any>;

  try {
    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });
    const payload = JSON.stringify(body);

    const sc = StringCodec();
    const encodedPayload = sc.encode(payload);
    const response = await nc
      .request(subject, encodedPayload, { timeout: timeout * 1000 })
      .catch((error) => {
        console.log("connecting to NATS", connectionString);
        console.log("subject", subject);
        console.log("payload", payload);

        console.error("Error", error);
        hasError = true;
        errorMessage = (error as any).message;
      });
    if (response) {
      const resultingString = sc.decode(response.data);
      serviceCallResult = JSON.parse(resultingString);

      errorMessage = serviceCallResult.errorMessage ?? "Unknown error 1.0";
      hasError = serviceCallResult.hasError;
      if (!hasError) {
        data = serviceCallResult;
      } else {
        data = undefined;
      }
    }
  } catch (error) {
    hasError = true;
    errorMessage = (error as any).message;
  } finally {
    if (nc) {
      nc.close();
    }
  }

  const result: Result<T> = {
    hasError,
    errorMessage,
    data,
  };

  return result;
}
