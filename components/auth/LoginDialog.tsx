"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { SiGithub, SiGoogle } from "react-icons/si";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrlOverride?: string;
}

export function LoginDialog({
  isOpen,
  onClose,
  callbackUrlOverride,
}: LoginDialogProps) {
  const { messages } = useI18n();
  const pathname = usePathname();
  const callbackUrl = callbackUrlOverride || pathname || "/";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-xl border border-border/30 bg-background/80 text-foreground backdrop-blur-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {messages.common.auth.login.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {messages.common.auth.login.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full justify-center gap-2 rounded-xl border-border/30 text-sm font-medium hover:border-border/50"
            aria-label={messages.common.auth.login.google}
          >
            <SiGoogle className="h-4 w-4 text-foreground" aria-hidden="true" />
            <span>{messages.common.auth.login.google}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => signIn("github", { callbackUrl })}
            className="w-full justify-center gap-2 rounded-xl border-border/30 text-sm font-medium hover:border-border/50"
            aria-label={messages.common.auth.login.github}
          >
            <SiGithub className="h-4 w-4 text-foreground" aria-hidden="true" />
            <span>{messages.common.auth.login.github}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
