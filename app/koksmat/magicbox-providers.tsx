"use client";

import { use, useEffect, useMemo, useState } from "react";
import {
  MagicboxContextType,
  MagicboxContext,
  Session,
  User,
  AuthSource,
  ServiceCallLogEntry,
  Product,
} from "./magicbox-context";
import { IPublicClientApplication, PopupRequest } from "@azure/msal-browser";
import { MagicRequest } from "./magicservices";
import { Result } from "./httphelper";
import { set } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
type Props = {
  children?: React.ReactNode;
};

export const MagicboxProvider = ({ children }: Props) => {
  const [session, setsession] = useState<Session>();
  const [version, setversion] = useState(0);
  const [user, setuser] = useState<User>();
  const [authtoken, setauthtoken] = useState("");
  const [authSource, setauthSource] = useState<AuthSource>("");
  const [pca, setpca] = useState<IPublicClientApplication>();
  const [transactionId, settransactionId] = useState("");
  const [currentWorkspace, setcurrentWorkspace] = useState("");

  const [currentOrganization, setcurrentOrganization] = useState("");
  const [currentRepository, setcurrentRepository] = useState("");
  const [currentBranch, setcurrentBranch] = useState("");
  const [basket, setbasket] = useState<Product[]>([]);

  const { toast } = useToast();
  const servicecalllog = useMemo<ServiceCallLogEntry[]>(() => {
    return [];
  }, []);

  const [showtracer, setshowtracer] = useState(false);
  const handlePaste = (data: string) => {
    setbasket([...basket, { type: "text", data }]);
    setversion(version + 1);
    toast({
      title: "Added text to basket",
    });
  };
  const magicbox: MagicboxContextType = {
    currentWorkspace,
    setCurrentWorkspace: (workspace: string) => {
      if (workspace === currentWorkspace) return;
      setcurrentOrganization("");
      setcurrentRepository("");
      setcurrentBranch("");

      localStorage.setItem("currentWorkspace", workspace);
      setcurrentWorkspace(workspace);
      setversion(version + 1);
      toast({
        title: "Workspace " + workspace + " set as current.",
      });
    },
    session,
    version,
    refresh: () => {
      setversion(version + 1);
    },
    signIn: async function (
      scopes: string[],
      loginHint?: string
    ): Promise<boolean> {
      if (!pca) throw new Error("MSAL not registered");

      const request: PopupRequest = {
        scopes,
        loginHint,
      };

      try {
        const result = await pca.loginPopup(request);
        setuser({
          name: result.account.name ?? result.account.username,
          email: result.account.username,
          image: "",
          id: result.account.localAccountId,
          roles: result.account.idTokenClaims?.roles ?? [],
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    signOut: function (): void {
      pca?.logoutPopup();
      setuser(undefined);
      setauthSource("");
      setauthtoken("");
    },
    setAccount: function (
      username: string,
      email: string,
      image: string,
      id: string,
      roles: string[]
    ): void {
      setuser({ name: username, email: email, image: image, id, roles });
    },

    user,
    registerAuth: function (pca: IPublicClientApplication): void {
      setpca(pca);
    },
    authtoken,
    authSource,
    setAuthToken: function (token: string, source: AuthSource): void {
      setauthSource(source);
      setauthtoken(token);
    },
    setTransactionId: function (id: string): void {
      settransactionId(id);
    },
    transactionId,
    servicecalllog,
    logServiceCall: function (request: ServiceCallLogEntry): void {
      servicecalllog.push(request);
      setversion(version + 1);
    },
    clearServiceCallLog: function (): void {
      servicecalllog.splice(0, servicecalllog.length);
      setversion(version + 1);
    },
    showTracer: showtracer,
    setShowTracer: function (showTracer: boolean): void {
      localStorage.setItem("showtracer", showTracer ? "true" : "false");
      setshowtracer(showTracer);
    },
    currentOrganization,
    setCurrentOrganization: function (organization: string): void {
      if (organization === currentOrganization) return;
      localStorage.setItem("currentOrganization", organization);
      setcurrentOrganization(organization);
      setcurrentRepository("");
      setcurrentBranch("");
    },
    currentRepository,
    setCurrentRepository: function (repository: string): void {
      if (repository === currentRepository) return;
      localStorage.setItem("currentRepository", repository);
      setcurrentBranch("");
      setcurrentRepository(repository);
    },
    currentBranch,
    setCurrentBranch: function (branch: string): void {
      localStorage.setItem("currentBranch", branch);
      setcurrentBranch(branch);
    },
    handlePaste,
    basket,
    handleFileDrop: function (data: any): void {
      handlePaste(data);
    },
    handleTextDrop: function (data: string): void {
      handlePaste(data);
    },
  };

  useEffect(() => {
    const showtracer = localStorage.getItem("showtracer");
    if (showtracer) {
      setshowtracer(showtracer === "true");
    }
    const currentWorkspace = localStorage.getItem("currentWorkspace");
    if (currentWorkspace) {
      setcurrentWorkspace(currentWorkspace);
    }
    const currentOrganization = localStorage.getItem("currentOrganization");
    if (currentOrganization) {
      setcurrentOrganization(currentOrganization);
    }
    const currentRepository = localStorage.getItem("currentRepository");
    if (currentRepository) {
      setcurrentRepository(currentRepository);
    }
    const currentBranch = localStorage.getItem("currentBranch");
    if (currentBranch) {
      setcurrentBranch(currentBranch);
    }
  }, []);
  return (
    <MagicboxContext.Provider value={magicbox}>
      {children}
    </MagicboxContext.Provider>
  );
};
