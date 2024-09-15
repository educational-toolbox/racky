import type { Reservation } from "~/lib/api/server-types";
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
import { Icon } from "~/components/shared/app-icon";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { api } from "~/lib/api/client";
import { useToast } from "~/hooks/use-toast";

export const ApproveReservationButton = ({
  reservation,
}: {
  reservation: Reservation;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const approveReservationMutation = api.reservation.update.useMutation();
  const ctx = api.useUtils();

  const handleApprove = async () => {
    try {
      await approveReservationMutation.mutateAsync({
        id: reservation.id,
        status: "CONFIRMED",
      });
      await ctx.reservation.getAllForMyOrg.invalidate();
      toast({
        title: "Reservation approved",
        icon: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to approve reservation",
        description: error instanceof Error ? error.message : undefined,
        icon: "error",
      });
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full mt-2">
          <Icon name="Check" />
          Approve
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will approve the reservation
            request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                handleApprove().catch(console.error);
              }}
            >
              Yes, approve
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
