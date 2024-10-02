"use client";

import { MsalProvider, useMsal } from "@azure/msal-react";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  IPublicClientApplication,
  PublicClientApplication,
} from "@azure/msal-browser";
import { msalConfig } from "@/app/koksmat/msal/config";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { https, Result } from "../httphelper";
import { th } from "date-fns/locale";
export interface CaseProps {
  scopes: string[];
  title: string;
  testurl: string;
  token?: string;
  result?: string;
  error?: string;
}

export interface AuthResult {
  token: string;
  sample: string;
}

export async function aquireToken(
  instance: IPublicClientApplication,
  account: AccountInfo,
  thisCase: CaseProps
): Promise<CaseProps> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: thisCase?.scopes ?? [],
        account: account,
      });
      thisCase.token = response.accessToken;
      const getResponse = await https<string>(
        response.accessToken,
        "GET",
        thisCase.testurl
      );

      thisCase.result = getResponse.data;
      thisCase.error = getResponse.hasError
        ? getResponse.errorMessage
        : undefined;
      resolve(thisCase);
    } catch (error) {
      try {
        const response = await instance.acquireTokenPopup({
          scopes: thisCase?.scopes ?? [],
          account: account,
        });
        thisCase.token = response.accessToken;
        const getResponse = await https<string>(
          response.accessToken,
          "GET",
          thisCase.testurl
        );
        thisCase.result = getResponse.data;
        thisCase.error = getResponse.hasError
          ? getResponse.errorMessage
          : undefined;
        resolve(thisCase);
      } catch (error) {
        reject(error);
      }
    }
  });
}

export function MSALWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [msalInstance, setmsalInstance] = useState<PublicClientApplication>();
  const [log, setlog] = useState<string[]>([]);
  const { accounts } = useMsal();
  const magicbox = useContext(MagicboxContext);
  const [account, setaccount] = useState<AccountInfo>();

  const [error, seterror] = useState("");

  useEffect(() => {
    const pca = new PublicClientApplication(msalConfig);
    setmsalInstance(pca);
  }, []);
  useEffect(() => {
    const load = async () => {
      if (!msalInstance) return;
      await msalInstance.initialize();

      magicbox.registerAuth(msalInstance);
      // Account selection logic is app dependent. Adjust as needed for different use cases.
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        const account = accounts[0];
        msalInstance.setActiveAccount(account);
        setaccount(account);
        magicbox.setAccount(
          account.name ?? "",
          account.username ?? "",
          "",
          account.localAccountId ?? "",
          account.idTokenClaims?.roles ?? []
        );
      }

      msalInstance.addEventCallback((event: EventMessage) => {
        console.log("MSAL", event.eventType);

        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          const account = payload.account;
          msalInstance.setActiveAccount(account);
          setaccount(account);
          magicbox.setAccount(
            account.name ?? "",
            account.username ?? "",
            "",
            account.localAccountId ?? "",
            account.idTokenClaims?.roles ?? []
          );
        }
      });
    };

    load();
  }, [msalInstance]);

  useEffect(() => {
    const load = async () => {
      if (!msalInstance) return;
      if (!account) return;
      const response = await aquireToken(msalInstance, account, {
        scopes: ["User.Read"],
        title: "Read user profile",
        testurl: "https://graph.microsoft.com/v1.0/me",
      });
      if (response.error) {
        seterror(response.error);
      } else {
        if (response.token) {
          magicbox.setAuthToken(response.token, "MSAL");
        } else {
          // unlikely case, but if token is not returned then raise an error
          console.log("No token");
          seterror("No token");
        }
      }
    };

    load();
  }, [msalInstance, account]);

  return (
    <div>
      {msalInstance && (
        <div>
          {error && <div className="text-red-400 p-10">{error}</div>}
          <MsalProvider instance={msalInstance}>{children}</MsalProvider>
        </div>
      )}
    </div>
  );
}
