import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import type { RouterOutputs } from "~/lib/api/server-types";
import { useSession } from "~/lib/auth";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SheetFooter } from "../ui/sheet";
import { ToastAction } from "../ui/toast";
import { Loader } from "./loader";
import type { SheetButtonRef } from "./sheet-button";
import { SheetButton } from "./sheet-button";

export const userInfoFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
});

export type UserInfoForm = z.infer<typeof userInfoFormSchema>;

export const EditUserInfo = () => {
  const session = useSession();
  const { data: userInfo, isLoading } = api.user.getUser.useQuery(
    { id: session.user!.id },
    {
      enabled: session.state === "authenticated",
    },
  );
  if (isLoading) {
    return <Loader />;
  }
  if (!userInfo) {
    return null;
  }
  return <EditUserInfoButton user={userInfo} />;
};

export const EditUserInfoButton = ({
  user,
}: {
  user: NonNullable<RouterOutputs["user"]["getUser"]>;
}) => {
  const { toast } = useToast();
  const ctx = api.useUtils();

  const buttonRef = useRef<SheetButtonRef>(null);
  const editMutation = api.user.edit.useMutation();
  const form = useForm<UserInfoForm>({
    defaultValues: {
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
    resolver: zodResolver(userInfoFormSchema),
  });

  const shouldAlert =
    (user.firstName == null || user.firstName.trim() === "") &&
    (user.lastName == null || user.lastName.trim() === "");

  const onSubmit = async (data: UserInfoForm) => {
    try {
      await editMutation.mutateAsync({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await ctx.user.getUser.invalidate({ id: user.id });
      toast({
        title: "Profile updated",
      });
      buttonRef.current?.close();
    } catch (error) {
      const message =
        error instanceof Error && "message" in error
          ? error.message
          : undefined;
      toast({
        title: "Failed to update profile",
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
  };

  return (
    <SheetButton
      ref={buttonRef}
      button={{
        icon: "UserCog",
        tooltip: { content: "Edit User Info", delay: 0, side: "right" },
        variant: shouldAlert ? "destructive" : "ghost",
      }}
      sheet={{ title: "Edit your information", side: "left" }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-6 mb-4"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: johndoe@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter>
            <Button type="submit" disabled={editMutation.isPending}>
              Edit
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetButton>
  );
};
