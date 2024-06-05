import type { Package2 } from "lucide-react";
import { HomeIcon, PackageOpenIcon } from "lucide-react";
import { create } from "zustand";

export interface MenuItem {
  icon: typeof Package2;
  label: string;
  href: string;
  exact?: boolean;
  hidden?: boolean;
}

export interface MenuItemsStore {
  items: readonly MenuItem[];

  add: (item: MenuItem, idx?: number) => void;
  hide: (href: string) => void;
  getLabel: (href: string) => string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: HomeIcon,
    exact: true,
    hidden: false,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: PackageOpenIcon,
  },
];

export const useMenuItems = create<MenuItemsStore>((set) => ({
  items: DEFAULT_MENU_ITEMS,
  add(item, idx) {
    set((state) => {
      const items = [...state.items];
      if (idx !== undefined) {
        items.splice(idx, 0, item);
      } else {
        items.push(item);
      }
      return { items };
    });
  },
  hide(href) {
    set((state) => ({
      items: state.items.map((item) =>
        item.href === href ? { ...item, hidden: true } : item
      ),
    }));
  },
  getLabel(href) {
    const item = this.items.find((item) => item.href === href);
    return item ? item.label : "";
  },
}));
