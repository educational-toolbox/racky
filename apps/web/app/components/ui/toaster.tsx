"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { Icon } from "./app-icon";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        icon,
        description,
        action,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {(icon !== undefined || title !== undefined) && (
                <div className="flex gap-2 items-center">
                  {icon && <ToastIcon icon={icon} />}
                  {title && <ToastTitle>{title}</ToastTitle>}
                </div>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

function ToastIcon({
  icon,
}: {
  icon: "info" | "success" | "error" | "warning" | undefined;
}) {
  switch (icon) {
    case "info":
      return <Icon name="Info" />;
    case "success":
      return <Icon name="CircleCheck" />;
    case "error":
      return <Icon name="CircleX" />;
    case "warning":
      return <Icon name="CircleAlert" />;
    default:
      return null;
  }
}
