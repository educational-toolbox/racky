import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef } from "react";
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
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import type { RouterOutputs } from "~/lib/api/server-types";

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
  const buttonRef = useRef<SheetButtonRef>(null);

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
        });
        buttonRef.current?.close();
      } catch (error) {
        const message =
          error instanceof Error && "message" in error
            ? error.message
            : undefined;
        toast({
          title: "Failed to update organization",
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
    [ctx.org.list, editMutation, org.id, toast],
  );

  return (
    <SheetButton
      button={{
        icon: "Pencil",
        tooltip: `Edit organization "${org.name || "-"}"`,
      }}
      sheet={{
        title: "Edit organization",
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
    </SheetButton>
  );
};
