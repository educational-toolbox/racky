import type { PropsWithChildren } from "react";
import { Fragment, useState } from "react";

import { AppLink } from "~/components/app-link";

import { useLocation } from "wouter";
import { Icon } from "~/components/shared/app-icon";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RequireAccessLevel, SignOutButton } from "~/lib/auth";
import { cn, normalizeUrlPath, slugToTitle } from "~/lib/utils";
import type { ItemTypeMenuItem, MenuItem } from "./menu-items.store";
import { useMenuItems } from "./menu-items.store";
import { useRoleOverride } from "~/hooks/admin/use-role-override";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { NotificationsButton } from "~/components/shared/notifications";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [path] = useLocation();
  const crumbs = path.split("/").filter(Boolean);
  const { items } = useMenuItems();
  const cleanPathname = normalizeUrlPath(path);
  const override = useRoleOverride();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {override.allowed && override.enabled && (
        <div className="fixed w-screen h-screen z-50 border-4 border-blue-700 dark:border-yellow-400 pointer-events-none">
          <div className="fixed left-1/2 -translate-x-1/2 bg-blue-700 dark:bg-yellow-400 pointer-events-none rounded-md px-2 pb-0.5 pt-2 -translate-y-2 text-background">
            Viewing as {override.viewAs}
          </div>
        </div>
      )}
      {/* DESKTOP MENU */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <DesktopMenuWrapper items={items} pathname={cleanPathname} />
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {/* MOBILE MENU */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileMenuWrapper items={items} pathname={cleanPathname} />
          <DashboardBreadcrumbs crumbs={crumbs} />
          <div className="ml-auto flex gap-1 items-center">
            <RequireAccessLevel level="ADMIN">
              {override.allowed && (
                <Button
                  size="icon"
                  variant="outline"
                  tooltip={{
                    content: `View as ${override.enabled ? "admin" : "user"}`,
                    delay: 100,
                  }}
                  onClick={() =>
                    override.setViewAs(override.enabled ? "ADMIN" : "USER")
                  }
                >
                  <Icon name={override.enabled ? "EyeOff" : "Eye"} />
                </Button>
              )}
              <Button
                size="icon"
                variant="destructive"
                tooltip="Go to admin panel"
                asChild
              >
                <AppLink href="/admin">
                  <Icon name="ShieldCheck" />
                  <span className="sr-only">Admin panel</span>
                </AppLink>
              </Button>
              <Separator
                orientation="vertical"
                className="inline-block w-[1px] h-6 mx-2"
                asChild
              >
                <div />
              </Separator>
            </RequireAccessLevel>
            <NotificationsButton />
            <SignOutButton />
          </div>
        </header>

        {/* MAIN SECTION */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {isMobile ? (
            <>
              <span className="text-center">
                Mobile view not supported yet. Sorry
              </span>
              <VisuallyHidden>{children}</VisuallyHidden>
            </>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

function MobileMenuWrapper(props: {
  items: readonly MenuItem[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Icon name="PanelLeft" className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="flex flex-col h-full gap-6 text-lg font-medium">
          <MobileMenu items={props.items} hide={() => setOpen(false)} />
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
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Icon
            name="Package2"
            className="h-4 w-4 transition-all group-hover:scale-110"
          />
          <span className="sr-only">Acme Inc</span>
        </AppLink>
        <DesktopMenu items={props.items} />
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
  items,
  hide,
}: {
  items: readonly MenuItem[];
  hide: () => void;
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>
          <AppLink
            href="/"
            onClick={hide}
            className="flex flex-row items-center gap-2"
          >
            <div className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
              <Icon
                name="Package2"
                className="h-5 w-5 transition-all group-hover:scale-110"
              />
            </div>
            <span className="sr-only">Acme Inc</span>
            Racky
          </AppLink>
        </SheetTitle>
      </SheetHeader>
      {items.map((item) =>
        item.type === "item" ? (
          <AppLink
            key={item.href}
            href={item.href}
            onClick={hide}
            activeClassName={(active) => {
              return cn("flex items-center gap-4 px-2.5", {
                "text-muted-foreground hover:text-foreground": !active,
                "text-foreground": active,
              });
            }}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </AppLink>
        ) : (
          <Separator key={item.id} />
        ),
      )}
    </>
  );
}

function DesktopMenu({ items }: { items: readonly MenuItem[] }) {
  return (
    <>
      {items.map((item) =>
        item.type === "item" ? (
          <DesktopMenuItem key={item.href} item={item} />
        ) : (
          <Separator key={item.id} />
        ),
      )}
    </>
  );
}

function DesktopMenuItem({ item }: { item: ItemTypeMenuItem }) {
  const getClassName = (active: boolean) =>
    cn(
      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
      {
        "text-muted-foreground": !active,
        "bg-accent text-accent-foreground": active,
      },
    );
  return (
    <Tooltip key={item.href}>
      <TooltipTrigger asChild>
        <div className="relative">
          <AppLink href={item.href} activeClassName={getClassName}>
            <Icon name={item.icon} className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
            {item.starred && (
              <Icon
                name="Shield"
                className="absolute -top-1 -right-1 h-3 w-3 dark:text-yellow-400 text-blue-700 dark:fill-yellow-400 fill-blue-700"
              />
            )}
          </AppLink>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
