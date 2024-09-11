import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { api } from "~/lib/api/client";
import { useInventoryFilters } from "./use-inventory-filters";
import { Icon } from "~/components/shared/app-icon";
import { Loader } from "~/components/shared/loader";
import { AppImage } from "~/components/shared/app-image";
import { useToast } from "~/hooks/use-toast";

const schema = z.object({
  name: z.string(),
});

type CreateItemForm = z.infer<typeof schema>;

export const CreateItemButton = () => {
  const [params] = useInventoryFilters();
  const buttonRef = useRef<SheetButtonRef>(null);
  const { uploadedImageKey, isImageUploading, upload } = s3.useUploadImage();
  const [isImagePreviewLoading, setIsImagePreviewLoading] = useState(false);
  const { catalogId, categoryId, search } = params;
  const { toast } = useToast();
  const createItemMutation = api.items.addItem.useMutation();
  const ctx = api.useUtils();
  const form = useForm<CreateItemForm>({
    defaultValues: {
      name: search ?? "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: CreateItemForm) => {
      if (uploadedImageKey == null) {
        return;
      }
      try {
        const result = await createItemMutation.mutateAsync({
          catalogueItemId: catalogId!,
          picture: uploadedImageKey,
          status: "active",
          id: categoryId,
          name: data.name,
        });
        await ctx.items.getItems.invalidate({
          catalogItemId: catalogId!,
          categoryId: categoryId,
        });
        toast({
          title: `Item "${result.name}" created`,
          icon: "success",
        });
        buttonRef.current?.close();
      } catch (error) {
        toast({
          title: "Failed to create item",
          description: error instanceof Error ? error.message : undefined,
          icon: "error",
        });
      }
    },
    [uploadedImageKey, createItemMutation, catalogId, categoryId, toast]
  );

  if (catalogId === undefined || categoryId === undefined) {
    return null;
  }

  return (
    <SheetButton
      button={{
        icon: "Plus",
        text: "Create Item",
        variant: "secondary",
      }}
      sheet={{
        title: "Create Item",
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
          <FormItem>
            <FormLabel>Image</FormLabel>
            {uploadedImageKey != null ? (
              <AppImage
                useS3
                fileKey={uploadedImageKey}
                onLoadingStateChange={setIsImagePreviewLoading}
              />
            ) : (
              <br />
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
              disabled={
                createItemMutation.isPending ||
                isImagePreviewLoading ||
                uploadedImageKey == null
              }
            >
              Create
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetButton>
  );
};
