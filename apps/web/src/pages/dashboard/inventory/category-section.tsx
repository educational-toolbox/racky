import { Loader } from "~/components/shared/loader";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api/client";
import { RequireAccessLevel } from "~/lib/auth";
import { useInventoryFilters } from "./use-inventory-filters";
import { CreateCategory } from "./create-category";
import { UpdateCategory } from "./edit-category";

const CategorySelector = () => {
  const { data: categories, isLoading } = api.category.getCategories.useQuery();
  const [params, update] = useInventoryFilters();

  if (isLoading) return <Loader centered />;
  const selectedCategory = params["categoryId"];
  if (!categories) return "Please create a category";
  return (
    <>
      {categories.map((categ) => {
        const isSelected = selectedCategory === categ.id;
        return (
          <div key={categ.id} className="flex gap-1">
            <Button
              variant={isSelected ? "outline" : "secondary"}
              className="grow"
              onClick={() =>
                update({
                  categoryId: isSelected ? undefined : categ.id,
                  catalogId: undefined,
                })
              }
            >
              {categ.name}
            </Button>
            <RequireAccessLevel level="ADMIN" exclusive>
              {isSelected && (
                <UpdateCategory id={categ.id} name={categ.name} selected />
              )}
            </RequireAccessLevel>
          </div>
        );
      })}
    </>
  );
};

export const CategorySection = () => {
  return (
    <div className="flex flex-col gap-2">
      <RequireAccessLevel level="ADMIN" exclusive>
        <CreateCategory />
      </RequireAccessLevel>
      <CategorySelector />
    </div>
  );
};
