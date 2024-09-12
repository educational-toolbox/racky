import { Title } from "~/components/title";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { CatalogueSection } from "./catalogue-section";
import { CategorySection } from "./category-section";

export const InventoryPage = () => {
  return (
    <>
      <Title>Inventory management</Title>
      <ResizablePanelGroup direction="horizontal" className="min-h-full">
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          maxSize={40}
          className="pr-2 pb-2 -mt-2 pt-2"
        >
          <CategorySection />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="pl-2 pb-2 -mt-2 pt-2">
          <CatalogueSection />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};
