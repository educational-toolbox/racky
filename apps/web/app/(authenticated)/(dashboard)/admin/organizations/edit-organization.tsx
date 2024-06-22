"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Icon } from "~/components/ui/app-icon";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api/client";
import type { RouterOutputs } from "~/utils/api/server";

const schema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(50, {
      message: "Name must be at most 50 characters.",
    }),
  zone: z.string().max(50, {
    message: "Zone must be at most 50 characters.",
  }),
});

type OrganizationEdit = z.infer<typeof schema>;

export const EditOrganization = ({
  org,
}: {
  org: RouterOutputs["org"]["list"][0];
}) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const ctx = api.useUtils();
  const editMutation = api.org.edit.useMutation();
  const form = useForm<OrganizationEdit>({
    defaultValues: {
      name: org.name,
      zone: org.zone,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: OrganizationEdit) => {
      try {
        await editMutation.mutateAsync({
          id: org.id,
          name: data.name,
          zone: data.zone,
        });
        await ctx.org.list.refetch();
        toast({
          title: "Organization updated",
          description: "The organization was successfully updated.",
          icon: "success",
        });
        setOpen(false);
      } catch (error) {
        const message =
          error instanceof Error && "message" in error
            ? error.message
            : undefined;
        toast({
          title: "Failed to update organization",
          description: message,
          icon: "error",
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
    [ctx.org.list, editMutation, org.id, toast],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        tooltip="Edit organization"
        size="icon"
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
              <SheetTitle>
                Edit organization &quot;{org.name || "-"}&quot;
              </SheetTitle>
              <SheetDescription>
                Edit the name and zone of the organization here.
              </SheetDescription>
            </SheetHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Acme. Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={editMutation.isPending}>
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
