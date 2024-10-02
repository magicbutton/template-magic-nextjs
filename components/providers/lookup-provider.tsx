"use client";
import { useRouter } from "next/navigation";
import Databases from "../database-databases";
import { href } from "../rootlayout";

// Define the interface for the useHook
export interface UsePathLookupHook {
  match: (path: string) => boolean; // match method that accepts a path parameter and returns a boolean
  lookup: React.ReactNode;
}

// Example implementation of the hook
export const useExampleHook = (): UsePathLookupHook => {
  const path = href.DATABASE;
  const router = useRouter();

  const match = (inputPath: string): boolean => {
    return path === inputPath;
  };

  const lookup = (
    <Databases
      visualisation={"list"}
      allowedVisualizations={["list", "cards"]}
      allowSwitch
      value={""}
      onChange={function (value: string): void {
        router.push(href.DATABASE + "/" + value);
      }}
    />
  );

  return {
    lookup,
    match,
  };
};
