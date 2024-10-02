"use client";
import { useEffect } from "react";

export function SetCookie(props: {
  cookie: string;
  value: string;
  lifetime: number;
}) {
  const { cookie, value, lifetime } = props;
  // nextjs redirect
  useEffect(() => {
    localStorage.setItem(cookie, value);
  }, [props.cookie, props.value]);

  return <div>Setting cookie</div>;
}
