"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/modules/auth/auth-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
