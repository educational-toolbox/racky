import { useState } from "react";
import { Icon } from "~/components/shared/app-icon";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet";

const tooltipConfig = {
  content: "Create catalogue",
  delay: 0,
};

export const CreateCatalogueButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="grow"
        tooltip={tooltipConfig}
      >
        <Icon name="Plus" />
      </Button>
      <SheetContent>
        <SheetTitle>Create catalogue</SheetTitle>
      </SheetContent>
    </Sheet>
  );
};
