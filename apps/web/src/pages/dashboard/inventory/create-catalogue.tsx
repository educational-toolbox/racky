import { useRef } from "react";
import type {
  SheetButtonProps,
  SheetButtonRef,
} from "~/components/shared/sheet-button";
import { SheetButton } from "~/components/shared/sheet-button";
import { api } from "~/lib/api/client";

const buttonConfig: SheetButtonProps["button"] = {
  icon: "Plus",
  className: "gap",
  tooltip: {
    content: "Create catalogue",
    delay: 0,
  },
};
const sheetConfig: SheetButtonProps["sheet"] = {
  title: "Create catalogue",
};

export const CreateCatalogueButton = () => {
  const createCatalogueMutation = api.catalog.createCatalogueItem.useMutation();
  const buttonRef = useRef<SheetButtonRef>(null);

  return (
    <SheetButton ref={buttonRef} button={buttonConfig} sheet={sheetConfig}>
      hi
    </SheetButton>
  );
};
