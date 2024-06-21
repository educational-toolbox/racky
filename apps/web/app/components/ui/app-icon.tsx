import type { LucideProps } from "lucide-react";
import { icons } from "lucide-react";

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon size={18} {...props} />;
};
