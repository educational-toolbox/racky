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

export const CancelReservationButton = ({
  reservation,
}: {
  reservation: Reservation;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const cancelReservationMutation = api.reservation.cancel.useMutation();
  const ctx = api.useUtils();

  const handleCancel = async () => {
    try {
      await cancelReservationMutation.mutateAsync({ id: reservation.id });
      await ctx.reservation.getMy.invalidate();
      toast({
        title: "Reservation cancelled",
        icon: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to cancel reservation",
        description: error instanceof Error ? error.message : undefined,
        icon: "error",
      });
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full mt-2">
          <Icon name="CalendarX" />
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel your
            reservation. You'll have to make a new reservation if you want to
            use the item.
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
              variant="destructive"
              onClick={() => {
                handleCancel().catch(console.error);
              }}
            >
              Yes, cancel
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
