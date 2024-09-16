import { api } from "~/lib/api/client";
import type { RouterOutputs } from "~/lib/api/server-types";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icon } from "./app-icon";
import { Loader } from "./loader";
import { formatRelative } from "date-fns/formatRelative";
import { useToast } from "~/hooks/use-toast";

export const NotificationsButton = () => {
  const { data, isLoading } = api.notifications.getMy.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const notifications = data ?? [];
  const count = notifications.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          <Icon name="Bell" />
          {count > 0 && (
            <span className="absolute w-4 h-4 rounded-full bg-blue-700 dark:bg-yellow-400 top-0 right-0 text-xs translate-x-1/2 -translate-y-1/2">
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2">
        <NotificationsInner
          notifications={notifications}
          isLoading={isLoading}
        />
      </PopoverContent>
    </Popover>
  );
};

const NotificationsInner = ({
  notifications,
  isLoading,
}: {
  notifications: RouterOutputs["notifications"]["getMy"];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Loader centered />;
  }
  if (notifications.length === 0) {
    return <div className="p-4 text-center">No notifications</div>;
  }
  return (
    <>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded border p-2 flex gap-1 items-start"
        >
          <div>
            <div className="text-xs text-muted-foreground">
              {formatRelative(notification.createdAt, new Date(), {
                weekStartsOn: 1,
              })}
            </div>
            <div className="text-sm font-semibold">{notification.title}</div>
            <div className="text-xs">{notification.message}</div>
          </div>
          <MarkAsReadButton notificationId={notification.id} />
        </div>
      ))}
    </>
  );
};

const MarkAsReadButton = ({ notificationId }: { notificationId: string }) => {
  const mutation = api.notifications.markAsRead.useMutation();
  const ctx = api.useUtils();
  const { toast } = useToast();

  const onClickHandler = async () => {
    try {
      await mutation.mutateAsync({ id: notificationId });
      await ctx.notifications.getMy.invalidate();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="ml-auto"
      disabled={mutation.isPending}
      onClick={onClickHandler}
    >
      <Icon name="Check" />
    </Button>
  );
};
