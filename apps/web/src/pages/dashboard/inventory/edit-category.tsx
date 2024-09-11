import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icon } from "~/components/shared/app-icon";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import { useOrganizationId } from "../organization-context";

const schema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must be at most 50 characters.",
    }),
});

type EditCategoryForm = z.infer<typeof schema>;

export const UpdateCategory = (
  existing: EditCategoryForm & { selected?: boolean }
) => {
  const orgId = useOrganizationId({ strict: true });

  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<EditCategoryForm>({
    defaultValues: { name: existing.name, id: existing.id },
    resolver: zodResolver(schema),
  });

  const updateMutation = api.category.editCategory.useMutation();
  const ctx = api.useUtils();

  const onSubmit = useCallback(
    async (data: EditCategoryForm) => {
      try {
        await updateMutation.mutateAsync({
          id: data.id,
          name: data.name,
          organizationId: orgId,
        });
        await ctx.category.getCategories.invalidate();
        toast({
          title: "Category updated",
        });
        setOpen(false);
      } catch (error) {
        const message =
          error instanceof Error && "message" in error
            ? error.message
            : undefined;
        toast({
          title: "Failed to update category",
          description: message,
          action: (
            <ToastAction
              onClick={() => onSubmit(data)}
              altText="Resubmit the form"
            >
              Retry
            </ToastAction>
          ),
        });
      }
    },
    [ctx.org.list, updateMutation, orgId, toast]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        size="icon"
        variant={existing.selected ? "outline" : "secondary"}
        onClick={() => setOpen(true)}
      >
        <Icon name="Pencil" />
      </Button>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-6 mb-4"
          >
            <SheetHeader>
              <SheetTitle>Update category</SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Acme. Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
