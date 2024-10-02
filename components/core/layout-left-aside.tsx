"use client";

import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

export default function ResizableLayout(props: {
  onMobileChange: (ismobile: boolean) => void;
  onCollapseChange: (collapsed: boolean) => void;
  breadcrumb: React.ReactNode;
  topnav: React.ReactNode;
  shop: React.ReactNode;
  logo: React.ReactNode;
  leftnav: React.ReactNode;
  leftfooter?: React.ReactNode;
  centerfooter?: React.ReactNode;
  rightfooter?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [burgermenuOpen, setburgermenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64); // Initial height of 64px (h-16)
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setburgermenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    props.onMobileChange(isMobile);
  }, [isMobile, props]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const scrollPosition = mainRef.current.scrollTop;
        setHeaderHeight(Math.max(0, 64 - scrollPosition));
      }
    };

    mainRef.current?.addEventListener("scroll", handleScroll);
    return () => mainRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCollapse = () => {
    setIsCollapsed(true);
    props.onCollapseChange(true);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
    props.onCollapseChange(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {!isMobile && (
          <>
            <ResizablePanel
              defaultSize={4}
              collapsible={true}
              minSize={15}
              maxSize={20}
              collapsedSize={4}
              onCollapse={handleCollapse}
              onExpand={handleExpand}
              className="bg-muted"
            >
              <div className="flex items-center justify-center h-full">
                {props.leftnav}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel defaultSize={isMobile ? 100 : 80}>
          <div className="flex flex-col h-full">
            <header
              ref={headerRef}
              className="sticky top-0 z-50 bg-background transition-all duration-200 ease-in-out"
              style={{ height: `${headerHeight}px` }}
            >
              <div className="flex items-center px-2 h-full">
                {isMobile && (
                  <Fragment>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() => setburgermenuOpen(true)}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                    <Sheet
                      onOpenChange={(open) => setburgermenuOpen(open)}
                      open={burgermenuOpen}
                    >
                      <SheetContent
                        side="left"
                        className="w-[80%] sm:w-[385px]"
                      >
                        <div className="h-full py-6 pr-6">{props.leftnav}</div>
                      </SheetContent>
                    </Sheet>
                  </Fragment>
                )}
                {props.topnav}
                {props.shop}
              </div>
              <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4">
                {props.breadcrumb}
              </div>
            </header>

            <main
              ref={mainRef}
              className="flex-grow overflow-auto relative w-full h-full"
            >
              <div className="p-10  w-full min-h-[80vh] flex">{props.children}</div>
            </main>
            <footer className="bg-muted border-t h-12 flex items-center justify-between px-4">
              <div>{props.leftfooter}</div>
              <div>{props.centerfooter}</div>
              <div>{props.rightfooter}</div>
            </footer>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
