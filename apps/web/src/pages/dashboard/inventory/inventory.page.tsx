import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { CategorySection } from "./category-section";
import { CatalogueSection } from "./catalogue-section";
import { Title } from "~/components/title";

export const InventoryPage = () => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <span>Mobile view not supported yet. Sorry</span>;
  }
  return (
    <>
      <Title>Inventory management</Title>
      <ResizablePanelGroup direction="horizontal" className="min-h-full">
        <ResizablePanel defaultSize={25} className="pr-2 pb-2 -mt-2 pt-2">
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
