"use client";

import { APPNAME } from "@/app/global";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  info: string;
  href: string;
  onClick?: () => void;
}

interface LeftNavigationProps {
  topItems?: NavItem[];
  bottomItems?: NavItem[];
  isCollapsed: boolean;
  isMobile: boolean;
}

export default function LeftNavigation({
  topItems = [],
  bottomItems = [],
  isCollapsed,
  isMobile,
}: LeftNavigationProps) {
  const pathname = usePathname();

  const NavButton: React.FC<NavItem> = ({
    icon,
    label,
    info,
    href,
    onClick,
  }) => {
    const isActive = pathname.startsWith(href) && href !== "/" + APPNAME;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href}>
              <button
                onClick={onClick}
                className={`w-full p-2 rounded-lg transition-colors flex items-center hover:text-slate-900 ${
                  isActive ? "text-blue-700" : "text-slate-500 hover:bg-muted"
                }`}
              >
                <span className="flex-shrink-0">{icon}</span>
                {!isCollapsed && !isMobile && (
                  <span className="ml-2">{label}</span>
                )}
                {isMobile && <span className="ml-2">{label}</span>}
              </button>
            </Link>
          </TooltipTrigger>
          {isMobile && (
            <TooltipContent side="right">
              <p>{info}</p>
            </TooltipContent>
          )}
          {isCollapsed && !isMobile && (
            <TooltipContent side="right">
              <p>{info}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={`h-full flex flex-col justify-between py-3 ${
        isCollapsed ? "items-center" : ""
      }`}
    >
      <div className="space-y-2 w-full">
        {topItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
      <div className="space-y-2 w-full">
        {bottomItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
