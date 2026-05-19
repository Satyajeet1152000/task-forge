"use client";

import { Icon } from "@iconify/react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import React from "react";

import { Button } from "@/components/ui/button";

const GOOGLE_BUTTON_WIDTH = 320;

interface GoogleAuthButtonProps {
  label: string;
  onSuccess: (credential: string) => void;
  disabled?: boolean;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ label, onSuccess, disabled }) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const handleSuccess = (response: CredentialResponse): void => {
    if (response.credential) {
      onSuccess(response.credential);
    }
  };
  if (!googleClientId) {
    return null;
  }
  if (disabled) {
    return (
      <div className="flex w-full justify-center">
        <Button
          type="button"
          variant="outline"
          className="h-12"
          style={{ width: GOOGLE_BUTTON_WIDTH }}
          disabled
        >
          <Icon icon="mdi:loading" className="h-5 w-5 animate-spin" />
          {label}
        </Button>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <div className="h-12 overflow-hidden" style={{ width: GOOGLE_BUTTON_WIDTH }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => undefined}
          theme="outline"
          size="large"
          width={GOOGLE_BUTTON_WIDTH}
          text="continue_with"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;
