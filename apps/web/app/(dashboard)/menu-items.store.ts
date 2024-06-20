import type { Package2 } from "lucide-react";
import { create } from "zustand";

type SeparatorId = `$separator-${string}`;
type ItemId = `$item-${string}`;

export type MenuItem =
  | {
      type: "item";
      id: ItemId;
      icon: typeof Package2;
      label: string;
      href: string;
      exact?: boolean;
      hidden?: boolean;
      className?: string;
    }
  | {
      type: "separator";
      id: SeparatorId;
      hidden?: boolean;
    };

export interface MenuItemsStore {
  items: readonly MenuItem[];

  add: (item: MenuItem, idx?: number) => void;
  hide: (id: ItemId | SeparatorId) => void;
  remove: (id: ItemId | SeparatorId) => void;
  getLabel: (href: string) => string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [];

export const useMenuItems = create<MenuItemsStore>((set) => ({
  items: DEFAULT_MENU_ITEMS,
  add(item, idx) {
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) {
        return state;
      }
      const items = [...state.items];
      if (idx !== undefined) {
        items.splice(idx, 0, item);
      } else {
        items.push(item);
      }
      return { items };
    });
  },
  remove(id) {
    set((state) => {
      if (!state.items.some((i) => i.id === id)) {
        return state;
      }
      return {
        items: state.items.filter((item) => item.id !== id),
      };
    });
  },
  hide(id) {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, hidden: true } : item,
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
