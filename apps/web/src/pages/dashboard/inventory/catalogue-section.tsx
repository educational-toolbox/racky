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
                  <CreateCatalogueButton disabled={categoryId === undefined} />
                </RequireAccessLevel>
                <SubcategorySelector />
              </div>
              <Input
                icon="Search"
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
  const [params, update] = useInventoryFilters();
  const selectedCategory = params["categoryId"];
  const { data: catalogItems, isLoading } = api.catalog.catalogueItems.useQuery(
    { categoryId: selectedCategory! },
    { enabled: selectedCategory !== undefined }
  );
  const validCatalogItems = catalogItems ?? [];
  const selectedCatalogueId = params["catalogId"];
  return (
    <Select
      defaultValue="default"
      value={
        selectedCatalogueId === undefined ? "default" : selectedCatalogueId
      }
      onValueChange={(selectedCatalogueId) =>
        update({
          catalogId:
            selectedCatalogueId === "default" ? undefined : selectedCatalogueId,
        })
      }
    >
      <SelectTrigger className="min-w-[180px] max-w-min">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">
          {isLoading ? (
            <Loader />
          ) : (
            `All catalogues - ${validCatalogItems.length}`
          )}
        </SelectItem>
        {validCatalogItems.map((catalogItem) => (
          <SelectItem value={catalogItem.id} key={catalogItem.id}>
            {catalogItem.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
