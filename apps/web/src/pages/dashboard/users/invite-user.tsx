import { Icon } from "~/components/shared/app-icon";
import { Button } from "~/components/ui/button";
import { SheetFooter } from "~/components/ui/sheet";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { SheetButtonRef } from "~/components/shared/sheet-button";
import { SheetButton } from "~/components/shared/sheet-button";
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
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";

const schema = z.object({
  email: z.string().email(),
});

type InviteUserForm = z.infer<typeof schema>;

export const InviteUser = ({ orgId }: { orgId: string }) => {
  const sendInviteMutation = api.org.createInvite.useMutation();
  const buttonRef = useRef<SheetButtonRef>(null);

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
        const inviteUrl = new URL(window.location as unknown as string);
        inviteUrl.pathname = `/accept-invite/${result.id}`;
        const inviteLink = inviteUrl.toString();

        if (result.result === "already_invited") {
          toast({
            title: "User already invited",
            description: `The user has already been invited to the organization`,
            action: <CopyInviteLinkButton inviteLink={inviteLink} />,
          });
        } else {
          toast({
            title: `Inivtation sent`,
            action: <CopyInviteLinkButton inviteLink={inviteLink} />,
          });
        }
        form.reset();
        buttonRef.current?.close();
      } catch (error) {
        const message =
          error instanceof Error && "message" in error
            ? error.message
            : undefined;
        toast({
          title: "Failed to send an invitation",
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
    [form, orgId, sendInviteMutation, toast],
  );

  return (
    <SheetButton
      ref={buttonRef}
      button={{
        icon: "UserPlus",
      }}
      sheet={{
        title: "Invite a user to your organization",
        description:
          "Enter the email address of the user you would like to invite.",
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-6 mb-4"
        >
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
                  The user will receive an email with an invitation to join the
                  organization.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter>
            <Button type="submit" disabled={sendInviteMutation.isPending}>
              <Icon name="Send" size={16} />
              Send
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetButton>
  );
};

const CopyInviteLinkButton = ({ inviteLink }: { inviteLink: string }) => {
  const [copiedValue, copy, reset] = useCopyToClipboard();
  const isLinkCopied = inviteLink === copiedValue;
  useEffect(() => {
    const timeout = setTimeout(() => {
      reset();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Button onClick={() => copy(inviteLink)} disabled={isLinkCopied}>
      <Icon name={isLinkCopied ? "Check" : "Clipboard"} size={16} />
      {isLinkCopied ? "Copied" : "Copy invite link"}
    </Button>
  );
};
