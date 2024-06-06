import type { Package2 } from "lucide-react";
import {
  HomeIcon,
  PackageOpenIcon,
  TestTube2Icon,
  TestTubeIcon,
} from "lucide-react";
import { create } from "zustand";

type SeparatorId = `$separator-${string}`;

export type MenuItem =
  | {
      type: "item";
      icon: typeof Package2;
      label: string;
      href: string;
      exact?: boolean;
      hidden?: boolean;
    }
  | {
      type: "separator";
      id: SeparatorId;
      hidden?: boolean;
    };

export interface MenuItemsStore {
  items: readonly MenuItem[];

  add: (item: MenuItem, idx?: number) => void;
  // eslint-disable-next-line @typescript-eslint/ban-types -- allow any string or template-like string (temp hack until next ts version)
  hide: (hrefOrId: (string & {}) | SeparatorId) => void;
  getLabel: (href: string) => string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    type: "item",
    label: "server protected example",
    href: "/protected/server-example",
    icon: HomeIcon,
    exact: true,
    hidden: false,
  },
  {
    type: "item",
    label: "client protected example",
    href: "/protected/client-example",
    icon: TestTube2Icon,
  },
  {
    type: "separator",
    id: "$separator-1",
  },
  {
    type: "item",
    label: "server public example",
    href: "/public/server-example",
    icon: PackageOpenIcon,
  },
  {
    type: "item",
    label: "client public example",
    href: "/public/client-example",
    icon: TestTubeIcon,
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
  hide(hrefOrId) {
    set((state) => ({
      items: state.items.map((item) =>
        (item.type === "item" ? item.href : item.id) === hrefOrId
          ? { ...item, hidden: true }
          : item,
      ),
    }));
  },
  getLabel(href) {
    const item = this.items.find(
      (item) => "href" in item && item.href === href,
    );
    if (!item || item.type === "separator") {
      return "";
    }
    return item ? item.label : "";
  },
}));
