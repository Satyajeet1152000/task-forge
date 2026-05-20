"use client";

import { Icon } from "@iconify/react";
import { GoogleLogin, type CredentialResponse, useGoogleOAuth } from "@react-oauth/google";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleAuthButtonProps {
  label: string;
  onSuccess: (credential: string) => void;
  disabled?: boolean;
  className?: string;
}

interface GoogleAuthButtonContentProps {
  label: string;
  onSuccess: (credential: string) => void;
  disabled?: boolean;
  className?: string;
}

const GoogleAuthButtonContent: React.FC<GoogleAuthButtonContentProps> = ({
  label,
  onSuccess,
  disabled = false,
  className,
}) => {
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const handleSuccess = (response: CredentialResponse): void => {
    if (response.credential) {
      onSuccess(response.credential);
    }
  };

  const handleError = (): void => {
    toast.error("Google sign-in failed. Please try again.");
  };

  if (!scriptLoadedSuccessfully || disabled) {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn("flex h-12 w-full items-center justify-center gap-2", className)}
        disabled
      >
        <Icon icon="mdi:loading" className="h-5 w-5 animate-spin" />
        {label}
      </Button>
    );
  }

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
        logo_alignment="center"
        containerProps={{ className: "w-full justify-center" }}
        use_fedcm_for_button={false}
      />
    </div>
  );
};

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  label,
  onSuccess,
  disabled = false,
  className,
}) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  if (!googleClientId) {
    return (
      <Button type="button" variant="outline" className={cn("h-12 w-full", className)} disabled>
        {label}
      </Button>
    );
  }

  return (
    <GoogleAuthButtonContent
      label={label}
      onSuccess={onSuccess}
      disabled={disabled}
      className={className}
    />
  );
};

export default GoogleAuthButton;
