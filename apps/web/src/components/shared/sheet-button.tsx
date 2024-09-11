import type { ComponentProps } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import type { IconName } from "./app-icon";
import { Icon } from "./app-icon";

export type SheetButtonProps = {
  button: {
    icon: IconName;
    text?: string;
    position?: "start" | "end";
    className?: string;
    tooltip?: ComponentProps<typeof Button>["tooltip"];
    variant?: ComponentProps<typeof Button>["variant"];
  };
  sheet: {
    title: string;
    description?: string;
    hidden?: boolean;
  };
  children: React.ReactNode;
};

export type SheetButtonRef = {
  close: () => void;
};

export const SheetButton = forwardRef<SheetButtonRef, SheetButtonProps>(
  ({ button, sheet, children }, ref) => {
    const [open, setOpen] = useState(false);
    const buttonPosition = button.position || "start";
    useImperativeHandle(ref, () => {
      return {
        close() {
          setOpen(false);
        },
      };
    }, []);
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          size={button.text ? "default" : "icon"}
          className={cn("gap-2", button.className)}
          onClick={() => setOpen(true)}
          tooltip={button.tooltip}
        >
          {buttonPosition === "start" && <Icon name={button.icon} />}
          {button.text}
          {buttonPosition === "end" && <Icon name={button.icon} />}
        </Button>
        <SheetContent>
          <SheetHeader>
            <SheetTitle hidden={sheet.hidden}>{sheet.title}</SheetTitle>
            {sheet.description && (
              <SheetDescription>{sheet.description}</SheetDescription>
            )}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }
);
