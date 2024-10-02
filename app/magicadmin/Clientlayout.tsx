"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import { AppProvider } from "@/components/appcontextprovider";
import { href } from "@/components/rootlayout";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import Authenticate, { UserProfileAPI } from "../koksmat/authenticate";
import { useContext, useState } from "react";
import { BreadcrumbProvider } from "@/components/contexts/breadcrumb-context";

import {
  Activity,
  AppWindowMac,
  Boxes,
  CookingPotIcon,
  DatabaseIcon,
  Globe,
  Home,
  Moon,
  Shield,
} from "lucide-react";
import TabNavigatorWithReorder from "@/components/tab-navigator-with-reorder";
import GlobalPasteHandling from "@/components/global-paste-handling";
import { GlobalDropHandling } from "@/components/global-drop-handling";
import ResizableLayout from "@/components/layout-left-aside";
import LeftNavigation, { NavItem } from "@/components/left-navigation";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { KoksmatChef } from "@/components/icons/KoksmatChef";
import GlobalShopButton from "@/components/global-shop-button";
import { APPNAME } from "../global";
import Link from "next/link";
import { useExampleHook } from "@/components/providers/lookup-provider";
import ErrorBoundary from "@/components/error-boundary";
import ThemeToggle from "@/components/theme-toggle";
import { MagicboxContext } from "../koksmat/magicbox-context";
import Tracer from "../koksmat/components/tracer";

export default function ClientLayout(props: { children: any }) {
  const { children } = props;
  const [leftNavCollapsed, setleftNavCollapsed] = useState(false);
  const [ismobile, setismobile] = useState(false);
  const magicbox = useContext(MagicboxContext);
  const iconClassname = "h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7";
  const topItems: NavItem[] = [
    {
      icon: <KoksmatChef className={iconClassname} />,
      label: "Home",
      href: href.HOME,
      info: "Go to home page",
    },

    {
      icon: <CookingPotIcon className={iconClassname} />,
      href: href.PROCESS,
      label: "Processes",
      info: "Control and govern your app",
    },
    {
      icon: <AppWindowMac className={iconClassname} />,
      href: href.WORKSPACES,
      label: "Workspace",
      info: "Connect with your workspace",
    },
    {
      icon: <DatabaseIcon className={iconClassname} />,
      label: "Databases",
      href: href.DATABASE,
      info: "Work with data",
    },
    {
      icon: <Globe className={iconClassname} />,
      label: "APIs",
      href: href.APIS,
      info: "Browse services",
    },
    {
      icon: <Boxes className={iconClassname} />,
      href: "/studio/workspace/auto/kubernetes",
      label: "Infrastructure",
      info: "Monitor infrastructure",
    },
    {
      icon: <Shield className={iconClassname} />,
      label: "Access Control",
      href: "/studio/access",
      info: "Control access",
    },
  ];

  const bottomItems: NavItem[] = [
    {
      icon: (
        <ThemeToggle>
          <Moon className={iconClassname + "rotate-90 transition-all dark:rotate-0 "} />
        </ThemeToggle>
      ),
      label: "Theme",
      href: "#",
      info: "Change your theme",
    },
    {
      icon: <Settings className={iconClassname} />,
      label: "Settings",
      href: "/studio/settings",
      info: "Adjust your settings",
    },
    {
      icon: <HelpCircle className={iconClassname} />,
      label: "Help",
      href: "https://learn.koksmat.com",
      info: "Get help and support",
    },
    {
      icon: <LogOut className={iconClassname} />,
      label: "Logout",
      onClick: async () => {
        await magicbox.signOut();
      },
      href: "#",
      info: "Sign out of your account",
    },
  ];
  return (
    <AppProvider>
      <ErrorBoundary>
        <Authenticate apiScope={UserProfileAPI}>
          <BreadcrumbProvider lookupHandlers={[useExampleHook()]}>
            <GlobalDropHandling />
            <ResizableLayout
              logo={<Link href={"/" + APPNAME}></Link>}
              onMobileChange={(ismobile) => setismobile(ismobile)}
              onCollapseChange={(collapsed) => setleftNavCollapsed(collapsed)}
              leftnav={
                <LeftNavigation
                  topItems={topItems}
                  bottomItems={bottomItems}
                  isCollapsed={leftNavCollapsed}
                  isMobile={ismobile}
                />
              }
              breadcrumb={<GlobalBreadcrumb />}
              topnav={<TabNavigatorWithReorder />}
              shop={<GlobalShopButton />}
              centerfooter={<GlobalPasteHandling />}
            >
              {children}
              <div className="hidden md:block">
                {magicbox.showTracer && <Tracer />}
              </div>
            </ResizableLayout>
          </BreadcrumbProvider>
        </Authenticate>
      </ErrorBoundary>
    </AppProvider>
  );
}
