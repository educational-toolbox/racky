"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Icon } from "~/components/ui/app-icon";
import { Button } from "~/components/ui/button";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { useSession } from "~/lib/auth";
import { api } from "~/utils/api/client";
import type { RouterOutputs } from "~/utils/api/server";

export const DeleteOrganization = ({
  org,
}: {
  org: RouterOutputs["org"]["list"][0];
}) => {
  const { toast } = useToast();
  const ctx = api.useUtils();
  const deleteMutation = api.org.delete.useMutation();
  const session = useSession();

  const onDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: org.id });
      await ctx.org.list.refetch();
      toast({
        title: "Organization deleted",
        description: "Organization has been successfully deleted",
        icon: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
        icon: "error",
        action: (
          <ToastAction altText="Retry organization deletion" onClick={onDelete}>
            Retry
          </ToastAction>
        ),
      });
    }
  };

  if (session.user?.orgId === org.id) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" tooltip="Delete organization" size="icon">
          <Icon name="Trash2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            <Icon name="Trash2" className="mr-2" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
