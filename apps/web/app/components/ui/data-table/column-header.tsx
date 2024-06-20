import type { Column } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Icon from "../icon";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <Icon name="ArrowDown" className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <Icon name="ArrowUp" className="ml-2 h-4 w-4" />
            ) : (
              <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getIsSorted() !== false && (
            <>
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <Icon
                  name="ArrowUpDown"
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                />
                Clear
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <Icon
                  name="ArrowUp"
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <Icon
                  name="ArrowDown"
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                />
                Desc
              </DropdownMenuItem>
            </>
          )}
          {column.getCanHide() && column.getCanSort() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <Icon
                name="EyeOff"
                className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
              />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
