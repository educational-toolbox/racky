import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type {
  SheetButtonProps,
  SheetButtonRef,
} from "~/components/shared/sheet-button";
import { SheetButton } from "~/components/shared/sheet-button";
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
import { SheetFooter } from "~/components/ui/sheet";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import { useOrganizationId } from "../organization-context";
import { useInventoryFilters } from "./use-inventory-filters";

const schema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must be at most 50 characters.",
    }),
});

type CreateCategoryForm = z.infer<typeof schema>;

const buttonConfig: SheetButtonProps["button"] = {
  icon: "Plus",
  text: "Create category",
  position: "end",
};

const sheetConfig: SheetButtonProps["sheet"] = {
  title: "Create a new category",
};

export const CreateCategory = () => {
  const orgId = useOrganizationId({ strict: true });
  const [, update] = useInventoryFilters();
  const buttonRef = useRef<SheetButtonRef>(null);

  const { toast } = useToast();

  const form = useForm<CreateCategoryForm>({
    defaultValues: { name: "" },
    resolver: zodResolver(schema),
  });

  const createMutation = api.category.addCategory.useMutation();
  const ctx = api.useUtils();

  const onSubmit = useCallback(
    async (data: CreateCategoryForm) => {
      try {
        const created = await createMutation.mutateAsync({
          organizationId: orgId,
          name: data.name,
        });
        await ctx.category.getCategories.invalidate();
        toast({
          title: "Category created",
        });
        buttonRef.current?.close();
        update({ categoryId: created.id });
      } catch (error) {
        const message =
          error instanceof Error && "message" in error
            ? error.message
            : undefined;
        toast({
          title: "Failed to create category",
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
    [ctx.org.list, createMutation, orgId, toast]
  );

  return (
    <SheetButton ref={buttonRef} button={buttonConfig} sheet={sheetConfig}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-6 mb-4"
        >
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
            <Button type="submit" disabled={createMutation.isPending}>
              Create
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetButton>
  );
};
