"use client";

import React, { ReactNode, useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * 
 * @param param0 
 * @returns 
 * 
 * export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  );
}

 */
export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, seterrorDetails] = useState<ErrorEvent>();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const errorHandler = (error: ErrorEvent) => {
      console.error("Uncaught error:", error);
      seterrorDetails(error);
      setHasError(true);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="p-4 rounded-md bg-destructive/15 text-destructive">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-semibold">Something went wrong</h3>
        </div>
        <p className="mt-2 text-sm">
          An error occurred in this section. We apologize for the inconvenience.
        </p>
        <p>
          <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
        </p>
        <Button
          onClick={() => setHasError(false)}
          variant="outline"
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
