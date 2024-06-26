"use client";

import { useTheme } from "next-themes";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef, useCallback } from "react";

import { Button } from "~/components/ui/button";
import { Icon } from "./ui/app-icon";

export const ThemeSwitcher = forwardRef<
  ComponentRef<typeof Button>,
  Omit<ComponentPropsWithoutRef<typeof Button>, "variant" | "size" | "onClick">
>(function (props, ref) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [setTheme, theme]);

  return (
    <Button
      {...props}
      variant="link"
      className="text-primary-background dark:text-primary-foreground transition-colors"
      size="icon"
      onClick={toggleTheme}
      ref={ref}
    >
      <Icon
        name="Sun"
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Icon
        name="Moon"
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
