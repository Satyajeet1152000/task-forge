"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";

import { SIGNUP_AVATAR_PATHS } from "../signup-avatars.constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelect: (avatarPath: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (avatarPath: string): void => {
    onSelect(avatarPath);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="h-24 w-24">
        <AvatarImage src={selectedAvatar} alt="Selected avatar" />
        <AvatarFallback>
          <Icon icon="mdi:account" className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Change avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose your avatar</DialogTitle>
            <DialogDescription>Pick an avatar for your profile.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {SIGNUP_AVATAR_PATHS.map((avatarPath) => {
              const isSelected = avatarPath === selectedAvatar;
              return (
                <button
                  key={avatarPath}
                  type="button"
                  onClick={() => handleSelect(avatarPath)}
                  className={cn(
                    "flex shrink-0 items-center justify-center relative rounded-full p-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected && "ring-2 ring-green-500 ring-offset-2",
                  )}
                  aria-label={`Select avatar ${avatarPath}`}
                  aria-pressed={isSelected}
                >
                  <Image
                    src={avatarPath}
                    alt=""
                    width={56}
                    height={56}
                    className="size-16 rounded-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarPicker;
