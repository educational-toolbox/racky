import { cn } from "~/lib/utils";
import { Icon } from "./app-icon";

export type LoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  rootClassName?: string;
  centered?: boolean;
  rootStyle?: React.CSSProperties;
  loaderStyle?: React.CSSProperties;
};

export const Loader = ({ size = "md", ...props }: LoaderProps) => {
  return (
    <div
      className={cn(
        { "flex flex-row items-center": props.centered },
        props.rootClassName
      )}
      style={props.rootStyle}
    >
      <Icon
        name="LoaderCircle"
        style={props.loaderStyle}
        className={cn(
          "animate-spin",
          {
            "mx-auto": props.centered,
            "w-4 h-4": size === "sm",
            "w-6 h-6": size === "md",
            "w-8 h-8": size === "lg",
          },
          props.className
        )}
      />
    </div>
  );
};
