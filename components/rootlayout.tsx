import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APPNAME } from "@/app/global";
import { Fragment, useContext } from "react";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import Tracer from "@/app/koksmat/components/tracer";
import { ChefHatIcon } from "./icons/ChefHatIcon";
import { AppWindowMac, Globe } from "lucide-react";
import useWorkspaceConnectionStatus from "./hooks/use-workspace-connectionstatus";
import { KoksmatChef } from "./icons/KoksmatChef";
import GlobalShopButton from "./global-shop-button";

export namespace href {
  export const HOME = "/" + APPNAME;
  export const APPS = "/" + APPNAME + "/apps";
  export const WORKSPACES = "/" + APPNAME + "/workspace";

  export const DATABASE = "/" + APPNAME + "/database";
  export const APIS = "/" + APPNAME + "/api";
  export const ADMIN = "/" + APPNAME + "/admin";
  export const ACCESS = "/" + APPNAME + "/access";
  export const PROCESS = "/" + APPNAME + "/process";
  export const SHARE = "/" + APPNAME + "/share";
  export const ROLE = "/" + APPNAME + "/role";
}
export function NavigationItems(props: { withCaptions: boolean }) {
  const withCaptions = props.withCaptions;

  if (!withCaptions) {
    return (
      <TooltipProvider>
        <Link
          href={href.HOME}
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          prefetch={false}
        >
          <KoksmatChef className="h-6 w-6 transition-all group-hover:scale-110" />
          <span className="sr-only">Magic Button Studio</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.PROCESS}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <CookingPotIcon className="h-5 w-5" />
              <span className="sr-only">Processes</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Processes</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.WORKSPACES}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <AppWindowMac className="h-5 w-5" />
              <span className="sr-only">Workspaces</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Workspaces</TooltipContent>
        </Tooltip>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.SHARE}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <ShareIcon className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Share</TooltipContent>
        </Tooltip> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.DATABASE}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <DatabaseIcon className="h-5 w-5" />
              <span className="sr-only">Databases</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Databases</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.DATABASE}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Services</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Services</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.ACCESS}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <ShieldIcon className="h-5 w-5" />
              <span className="sr-only">Access Control</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Access Control</TooltipContent>
        </Tooltip>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href.ADMIN}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              prefetch={false}
            >
              <SettingsIcon className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip> */}
      </TooltipProvider>
    );
  } else {
    return (
      <Fragment>
        <Link
          href={href.HOME}
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          prefetch={false}
        >
          <ChefHatIcon className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">Magic Button Studio</span>
        </Link>

        <Link
          href={href.PROCESS}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <CookingPotIcon className="h-5 w-5" />
          Workspaces
        </Link>
        <Link
          href={href.DATABASE}
          className="flex items-center gap-4 px-2.5 text-foreground"
          prefetch={false}
        >
          <DatabaseIcon className="h-5 w-5" />
          Databases
        </Link>

        <Link
          href="#"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <ShareIcon className="h-5 w-5" />
          Shared
        </Link>
        <Link
          href={href.ACCESS}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <ShieldIcon className="h-5 w-5" />
          Access Control
        </Link>
        {/* <Link
          href={href.ADMIN}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <SettingsIcon className="h-5 w-5" />
          Settings
        </Link> */}
      </Fragment>
    );
  }
  return <div>rootlayout</div>;
}

export function RootLayout(props: { breadcrumb: any; children: any }) {
  const children = props.children;
  const breadcrumb = props.breadcrumb;
  const magicbox = useContext(MagicboxContext);

  const connectionStatus = useWorkspaceConnectionStatus(
    magicbox.currentWorkspace
  );

  return (
    <div className="flex min-h-[calc(100vh-400px) max-h-[calc(100vh-400px) w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <NavigationItems withCaptions={false} />
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="sr-only">User</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">User</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium ">
                <NavigationItems withCaptions={true} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="">{breadcrumb}</div>
          {/* <div className="flex space-x-2  ">
            {magicbox.currentWorkspace && (
              <Link
                href={"/" + APPNAME + "/workspace/" + magicbox.currentWorkspace}
              >
                <ConnectionStatus connectionStatus={connectionStatus} />
              </Link>
            )}
          </div> */}
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search databases..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <GlobalShopButton />
        </header>
        <main>
          <div className="flex">
            <div className="grow">{children}</div>
            {magicbox.showTracer && (
              <div className="hidden md:block min-w-56 bg-slate-100-300 mt-20">
                <Tracer />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function LayoutGridIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CookingPotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h20" />
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <path d="m4 8 16-4" />
      <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
    </svg>
  );
}

function FolderIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function HeaterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 8c2-3-2-3 0-6" />
      <path d="M15.5 8c2-3-2-3 0-6" />
      <path d="M6 10h.01" />
      <path d="M6 14h.01" />
      <path d="M10 16v-4" />
      <path d="M14 16v-4" />
      <path d="M18 16v-4" />
      <path d="M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" />
      <path d="M5 20v2" />
      <path d="M19 20v2" />
    </svg>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ShieldIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
