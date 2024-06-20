"use client";

import type { PropsWithChildren } from "react";
import { Fragment } from "react";

import { Package2, PanelLeft } from "lucide-react";
import { AppLink } from "~/app-link";

import { RedirectToSignIn } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "~/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { SignOutButton, SignedIn, SignedOut } from "~/lib/auth";
import { cn, normalizeUrlPath, slugToTitle } from "~/lib/utils";
import type { MenuItem } from "./menu-items.store";
import { useMenuItems } from "./menu-items.store";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const path = usePathname();
  const crumbs = path.split("/").filter(Boolean);
  const { items } = useMenuItems();
  const cleanPathname = normalizeUrlPath(path);

  return (
    <>
      {/* ON SIGNED IN */}
      <SignedIn>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          {/* DESKTOP MENU */}
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <DesktopMenuWrapper items={items} pathname={cleanPathname} />
          </aside>

          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            {/* MOBILE MENU */}
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <MobileMenuWrapper items={items} pathname={cleanPathname} />
              <DashboardBreadcrumbs crumbs={crumbs} />
              <div className="ml-auto">
                <SignOutButton />
              </div>
            </header>

            {/* MAIN SECTION */}
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      </SignedIn>
      {/* ON SIGNED OUT */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function MobileMenuWrapper(props: {
  items: readonly MenuItem[];
  pathname: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="flex flex-col h-full gap-6 text-lg font-medium">
          <MobileMenu items={props.items} pathname={props.pathname} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DesktopMenuWrapper(props: {
  items: readonly MenuItem[];
  pathname: string;
}) {
  return (
    <>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <AppLink
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </AppLink>
        <DesktopMenu items={props.items} pathname={props.pathname} />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <ThemeSwitcher />
          </TooltipTrigger>
          <TooltipContent side="right">Change theme</TooltipContent>
        </Tooltip>
      </nav>
    </>
  );
}

function DashboardBreadcrumbs({ crumbs }: { crumbs: string[] }) {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {crumbs.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <AppLink href="/">Dashboard</AppLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {crumbs.length > 0 && <BreadcrumbSeparator />}
        {crumbs.map((crumb, index) => {
          if (index === crumbs.length - 1) {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{slugToTitle(crumb)}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <AppLink
                    href={normalizeUrlPath(
                      "/" + crumbs.slice(0, index - 1).join("/"),
                    )}
                  >
                    {slugToTitle(crumb)}
                  </AppLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function MobileMenu({
  pathname,
  items,
}: {
  pathname: string;
  items: readonly MenuItem[];
}) {
  return (
    <>
      <AppLink
        href="/"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
      >
        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">Acme Inc</span>
      </AppLink>
      {items.map((item) =>
        item.type === "item" ? (
          <AppLink
            key={item.href}
            href={item.href}
            className={cn("flex items-center gap-4 px-2.5", {
              "text-muted-foreground hover:text-foreground": !isLinkActive(
                item,
                pathname,
              ),
              "text-foreground": isLinkActive(item, pathname),
            })}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </AppLink>
        ) : (
          <Separator key={item.id} />
        ),
      )}
    </>
  );
}

function DesktopMenu({
  pathname,
  items,
}: {
  pathname: string;
  items: readonly MenuItem[];
}) {
  return (
    <>
      {items.map((item) =>
        item.type === "item" ? (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <AppLink
                href={item.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                  {
                    "text-muted-foreground": !isLinkActive(item, pathname),
                    "bg-accent text-accent-foreground": isLinkActive(
                      item,
                      pathname,
                    ),
                  },
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </AppLink>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          <Separator key={item.id} />
        ),
      )}
    </>
  );
}

function isLinkActive(item: MenuItem, pathname: string) {
  if (item.type === "separator") return false;
  return (
    (item.exact === true && item.href === pathname) ||
    (item.exact !== true && pathname.startsWith(item.href))
  );
}
