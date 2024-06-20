import type { LucideProps } from "lucide-react";
import { icons } from "lucide-react";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon size={18} {...props} />;
};

export default Icon;
