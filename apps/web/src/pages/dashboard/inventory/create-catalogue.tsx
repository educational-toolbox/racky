import { useRef } from "react";
import type {
  SheetButtonProps,
  SheetButtonRef,
} from "~/components/shared/sheet-button";
import { SheetButton } from "~/components/shared/sheet-button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import { useInventoryFilters } from "./use-inventory-filters";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { SheetFooter } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const schema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must be at most 50 characters.",
    }),
  description: z.string(),
});

type CreateCatalogueForm = z.infer<typeof schema>;

const sheetConfig: SheetButtonProps["sheet"] = {
  title: "Create catalogue",
};

export const CreateCatalogueButton = ({ disabled = false }) => {
  const buttonConfig: SheetButtonProps["button"] = {
    icon: "Plus",
    className: "gap",
    disabled,
    tooltip: {
      content: "Create catalogue",
      delay: 0,
    },
  };

  const createCatalogueMutation = api.catalog.createCatalogueItem.useMutation();
  const buttonRef = useRef<SheetButtonRef>(null);
  const [params, update] = useInventoryFilters();
  const { toast } = useToast();
  const ctx = api.useUtils();
  const form = useForm<CreateCatalogueForm>({
    defaultValues: { name: "", description: "" },
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: CreateCatalogueForm) => {
    const { categoryId } = params;
    if (!categoryId) {
      return;
    }
    try {
      const result = await createCatalogueMutation.mutateAsync({
        categoryId,
        description: data.description,
        name: data.name,
        quantity: 0,
      });
      toast({
        title: "Catalogue created",
        description: `Catalogue created`,
      });
      await ctx.catalog.catalogueItems.invalidate({ categoryId });
      update({ catalogId: result.id });
      buttonRef.current?.close();
    } catch (error) {
      toast({
        title: "Error creating catalogue",
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };
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
                <FormLabel>Catalogue name</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Cable HDMI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ex: All our HDMI cables" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter>
            <Button type="submit" disabled={createCatalogueMutation.isPending}>
              Create
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetButton>
  );
};
