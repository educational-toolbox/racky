"use client";

import { Icon } from "~/components/ui/app-icon";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api/client";
import { ToastAction } from "~/components/ui/toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const schema = z.object({
  email: z.string().email(),
});

type InviteUserForm = z.infer<typeof schema>;

export const InviteUser = ({ orgId }: { orgId: string }) => {
  const sendInviteMutation = api.org.createInvite.useMutation();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InviteUserForm>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: InviteUserForm) => {
      try {
        const result = await sendInviteMutation.mutateAsync({
          id: orgId,
          email: data.email,
        });
        if (result.result === "already_invited") {
          toast({
            title: "User already invited",
            description:
              "The user has already been invited to the organization",
            icon: "info",
          });
        } else {
          toast({
            title: "Inivtation sent",
            icon: "success",
          });
        }
        form.reset();
        setOpen(false);
      } catch (error) {
        const message =
          error instanceof Error && "message" in error
            ? error.message
            : undefined;
        toast({
          title: "Failed to send an invitation",
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
    [form, orgId, sendInviteMutation, toast],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon">
          <Icon name="UserPlus" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-6 mb-4"
          >
            <SheetHeader>
              <SheetTitle>Invite a user to your organization</SheetTitle>
              <SheetDescription>
                Enter the email address of the user you would like to invite.
              </SheetDescription>
            </SheetHeader>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: user@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The user will receive an email with an invitation to join
                    the organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                type="submit"
                className="gap-1"
                disabled={sendInviteMutation.isPending}
              >
                <Icon name="Send" size={16} />
                Send
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
