import type { ComponentRef} from "react";
import { forwardRef } from "react";
import { Link, useRoute } from "wouter";
import { normalizeUrl, normalizeUrlPath } from "~/lib/utils";

type AppLinkProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "href" | "children" | "onClick" | "className"
> & {
  href: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  absolute?: boolean;
} & (
    | { className?: string }
    | {
        activeClassName?: (active: boolean) => string | undefined;
      }
  );

export const AppLink = forwardRef<ComponentRef<"a">, AppLinkProps>(function (
  { href, children, onClick, absolute, ...props },
  ref
) {
  let finalHref = href;

  const [isActive] = useRoute(finalHref);

  if (typeof finalHref === "undefined") {
    throw new Error("href or to prop is required");
  }

  if (!finalHref.startsWith("http")) {
    finalHref = normalizeUrlPath(finalHref);
  } else {
    finalHref = normalizeUrl(finalHref);
  }

  if (absolute) {
    finalHref = "~" + finalHref;
  }

  let computedClassName: string | undefined = undefined;

  if ("className" in props) {
    computedClassName = props.className;
    delete props.className;
  } else if ("activeClassName" in props) {
    computedClassName = props.activeClassName?.(isActive) ?? "";
    delete props.activeClassName;
  }

  return (
    <Link href={finalHref} onClick={onClick} asChild>
      <a {...props} className={computedClassName} ref={ref}>
        {children}
      </a>
    </Link>
  );
});

AppLink.displayName = "AppLink";
