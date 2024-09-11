import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Loader } from "~/components/shared/loader";
import { Card, CardHeader } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table/table";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useDebounce } from "~/hooks/use-debounce";
import { useExtractedSearchParams } from "~/hooks/use-extracted-searchparams";
import { api } from "~/lib/api/client";
import { RequireAccessLevel } from "~/lib/auth";
import { columns } from "./columns";
import { CreateCatalogueButton } from "./create-catalogue";
import { useInventoryFilters } from "./use-inventory-filters";

export const CatalogueSection = () => {
  const [params, update] = useInventoryFilters();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    update({ search: debouncedSearch === "" ? undefined : debouncedSearch });
  }, [debouncedSearch, update]);

  const categoryId = params["categoryId"];
  const catalogueId = params["catalogId"];
  const { data: items, isLoading } = api.items.getItems.useQuery(
    {
      categoryId: categoryId,
      catalogItemId: catalogueId,
      search: debouncedSearch,
    },
    { enabled: categoryId !== undefined }
  );

  return (
    <Card>
      <CardHeader>
        <DataTable
          loading={isLoading}
          extra={
            <>
              <div className="flex items-center gap-2">
                <RequireAccessLevel level="ADMIN">
                  <CreateCatalogueButton />
                </RequireAccessLevel>
                <SubcategorySelector />
              </div>
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </>
          }
          columns={columns}
          data={items ?? []}
          withPagination={{ pageSizes: [10], selectableRows: true }}
        />
      </CardHeader>
    </Card>
  );
};

const SubcategorySelector = () => {
  const [params, update] = useExtractedSearchParams();
  const selectedCategory = params["categoryId"];
  const { data: catalogItems, isLoading } = api.catalog.catalogueItems.useQuery(
    { categoryId: selectedCategory! },
    { enabled: selectedCategory !== undefined }
  );
  const validCatalogItems = catalogItems ?? [];
  const selectedCatalogItem = params["catalogItemId"];

  let placeholder: ReactNode = "Select a subcategory";
  if (selectedCategory === undefined) {
    placeholder = "Select a category";
  }
  if (isLoading) {
    placeholder = <Loader />;
  }
  if (selectedCatalogItem === undefined || validCatalogItems.length === 0) {
    placeholder = "All subcategories";
  }
  return (
    <Select>
      <SelectTrigger
        className="min-w-[180px] max-w-min"
        disabled={placeholder !== "Select a subcategory"}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {validCatalogItems.map((catalogItem) => (
          <SelectItem
            value={catalogItem.id}
            key={catalogItem.id}
            onClick={() =>
              update({
                catalogItemId:
                  selectedCatalogItem === catalogItem.id
                    ? undefined
                    : catalogItem.id,
              })
            }
          >
            {catalogItem.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
