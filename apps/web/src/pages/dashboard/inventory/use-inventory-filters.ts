import { useExtractedSearchParams } from "~/hooks/use-extracted-searchparams";

export const useInventoryFilters = () => {
  return useExtractedSearchParams<"categoryId" | "catalogId" | "search">();
};
