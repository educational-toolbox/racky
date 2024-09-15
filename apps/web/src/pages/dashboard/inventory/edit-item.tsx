import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icon } from "~/components/shared/app-icon";
import { AppImage } from "~/components/shared/app-image";
import { ItemStatusSelector } from "~/components/shared/item-status-selector";
import { Loader } from "~/components/shared/loader";
import type { SheetButtonRef } from "~/components/shared/sheet-button";
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
import { s3 } from "~/hooks/use-s3";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import type { Item } from "~/lib/api/server-types";
import { createItemSchema } from "./create-item";
import { useInventoryFilters } from "./use-inventory-filters";

const editItemSchema = createItemSchema.extend({
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "DRAFT"]),
});

type EditItemForm = z.infer<typeof editItemSchema>;

export const EditItemButton = ({ item }: { item: Item }) => {
  const [params] = useInventoryFilters();
  const buttonRef = useRef<SheetButtonRef>(null);
  const { uploadedImageKey, isImageUploading, upload } = s3.useUploadImage();
  const [isImagePreviewLoading, setIsImagePreviewLoading] = useState(false);
  const { toast } = useToast();
  const createItemMutation = api.items.editItem.useMutation();
  const ctx = api.useUtils();
  const form = useForm<EditItemForm>({
    defaultValues: {
      name: item.name,
      status: item.status,
    },
    resolver: zodResolver(editItemSchema),
  });

  const categoryId = params["categoryId"];

  const onSubmit = useCallback(
    async (data: EditItemForm) => {
      if (categoryId === undefined) {
        return;
      }
      try {
        const result = await createItemMutation.mutateAsync({
          catalogueItemId: item.catalogueItemId,
          name: data.name,
          picture: uploadedImageKey || item.picture,
          id: item.id,
          status: data.status || item.status,
        });
        await ctx.items.getItems.invalidate();
        toast({
          title: `Item "${result.name}" modified`,
          icon: "success",
        });
        buttonRef.current?.close();
      } catch (error) {
        toast({
          title: "Failed to modify item",
          description: error instanceof Error ? error.message : undefined,
          icon: "error",
        });
      }
    },
    [uploadedImageKey, createItemMutation, categoryId, toast, item],
  );

  if (categoryId === undefined) {
    return null;
  }

  return (
    <SheetButton
      button={{
        icon: "Pencil",
        variant: "outline",
      }}
      sheet={{
        title: "Modify Item",
      }}
      ref={buttonRef}
    >
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
                  <Input placeholder="Ex: HDMI 2.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <ItemStatusSelector<"item">
                    set="item"
                    selectedItem={field.value}
                    onSelect={(newV) =>
                      field.onChange({ target: { value: newV } })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Image</FormLabel>
            {uploadedImageKey != null ? (
              <AppImage
                useS3
                fileKey={uploadedImageKey}
                onLoadingStateChange={setIsImagePreviewLoading}
              />
            ) : (
              <AppImage
                useS3
                fileKey={item.picture!}
                onLoadingStateChange={setIsImagePreviewLoading}
              />
            )}
            <FormControl>
              <Button
                onClick={() => upload()}
                className="w-full"
                variant="secondary"
                type="button"
                disabled={isImagePreviewLoading || isImageUploading}
              >
                {isImageUploading ? (
                  <Loader size="sm" />
                ) : (
                  <Icon name="Upload" />
                )}
                {isImageUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
          <SheetFooter>
            <Button
              type="submit"
              disabled={createItemMutation.isPending || isImagePreviewLoading}
            >
              Edit
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetButton>
  );
};
