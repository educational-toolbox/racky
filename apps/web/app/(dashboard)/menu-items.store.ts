import { create } from "zustand";
import type { IconName } from "~/components/ui/app-icon";

type SeparatorId = `$separator-${string}`;
type ItemId = `$item-${string}`;

export type MenuItem =
  | {
      type: "item";
      id: ItemId;
      icon: IconName;
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

  add: (item: MenuItem, idx?: number) => MenuItem["id"];
  hide: (id: ItemId | SeparatorId) => MenuItem["id"];
  remove: (id: ItemId | SeparatorId) => MenuItem["id"];
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
    return item.id;
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
    return id;
  },
  hide(id) {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, hidden: true } : item,
      ),
    }));
    return id;
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
