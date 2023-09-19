"use client";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import {
  InfoIcon,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Loader2,
  LucideIcon,
} from "lucide-react";

type ToastVariant =
  | "default"
  | "loading"
  | "info"
  | "warning"
  | "error"
  | "success";

const Icon = ({ variant, ...props }: { variant: ToastVariant }) => {
  const Icons: Record<ToastVariant, LucideIcon | null> = {
    default: null,
    loading: Loader2,
    info: InfoIcon,
    warning: AlertTriangle,
    error: XCircle,
    success: CheckCircle,
  };

  const IconComponent = Icons[variant];

  return IconComponent ? (
    <IconComponent
      {...props}
      className={`w-5 h-5 ${variant === "loading" ? "animate-spin" : ""}`}
    />
  ) : null;
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const { variant } = props;
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-3 items-start">
              {variant && (
                <div className="shrink-0 grow-0">
                  <Icon variant={variant} />
                </div>
              )}
              <div className="grid gap-1 grow shrink-0">
                {title && <ToastTitle>{title}</ToastTitle>}

                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            <ToastClose
              className={`${
                !title ? "top-1/2 transform -translate-y-1/2" : ""
              } invisible sm:visible`}
            />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
