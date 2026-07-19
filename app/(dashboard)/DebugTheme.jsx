"use client";

import { useTheme } from "next-themes";

export default function DebugTheme() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>theme: {theme}</p>
      <p>resolvedTheme: {resolvedTheme}</p>
    </div>
  );
}