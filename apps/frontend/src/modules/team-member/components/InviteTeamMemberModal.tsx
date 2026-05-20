"use client";

import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useCreateMemberInvite } from "../team-member.queries";
import { buildInviteRoute } from "../team-member.utils";

import {
  type InviteFormValues,
  INVITE_EXPIRATION_OPTIONS,
  useInviteForm,
} from "./invite-form.hook";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface InviteTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({ open, onOpenChange }) => {
  const createInviteMutation = useCreateMemberInvite();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { form, buildPayload } = useInviteForm();

  const isSuccessView = generatedLink !== null;

  useEffect(() => {
    if (!open) {
      setGeneratedLink(null);
      form.reset();
    }
  }, [open, form]);

  const submitLabel = useMemo(() => {
    if (isSuccessView) {
      return "Close";
    }

    return createInviteMutation.isPending ? "Creating..." : "Generate Invite Link";
  }, [createInviteMutation.isPending, isSuccessView]);

  const handlePrimaryAction = (): void => {
    if (isSuccessView) {
      onOpenChange(false);
      return;
    }

    void form.handleSubmit(async (values: InviteFormValues) => {
      const invite = await createInviteMutation.mutateAsync(buildPayload(values));
      toast.success("Invite link created");
      setGeneratedLink(`${window.location.origin}${buildInviteRoute(invite.code)}`);
    })();
  };

  const handleCopyLink = async (): Promise<void> => {
    if (!generatedLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedLink);
      toast.success("Invite link copied");
    } catch {
      toast.error("Failed to copy invite link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            {isSuccessView
              ? "Share this link with your teammate. They can join your team from the invite page."
              : "Create an invite link with optional email restriction, expiration, and usage limits."}
          </DialogDescription>
        </DialogHeader>

        {!isSuccessView ? (
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restrict to email (optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="colleague@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expirationDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires in</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-3 gap-2"
                      >
                        {INVITE_EXPIRATION_OPTIONS.map((option) => {
                          const isSelected = field.value === option.value;

                          return (
                            <FormItem key={option.value} className="space-y-0">
                              <FormLabel
                                htmlFor={`invite-expiry-${option.value}`}
                                className={cn(
                                  "flex cursor-pointer items-center justify-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700",
                                  isSelected && "border-lime-400 bg-lime-50 text-slate-900",
                                )}
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`invite-expiry-${option.value}`}
                                  className="sr-only"
                                />
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max uses (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="Unlimited" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Invite link</p>
            <div className="flex items-center gap-2">
              <Input readOnly value={generatedLink ?? ""} className="font-mono text-xs" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void handleCopyLink()}
              >
                <Icon icon="mdi:content-copy" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {!isSuccessView && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createInviteMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handlePrimaryAction}
            disabled={createInviteMutation.isPending}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamMemberModal;
