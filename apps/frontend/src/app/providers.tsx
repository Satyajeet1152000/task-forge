"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/query-client";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
        <Toaster richColors position="top-right" />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
