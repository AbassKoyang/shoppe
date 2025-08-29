"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // create QueryClient once per component instance
  const [client] = useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}