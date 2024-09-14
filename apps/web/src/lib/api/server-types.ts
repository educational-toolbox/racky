import type { AppRouter } from "@educational-toolbox/racky-api/trpc/trpc.router";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Domain
export type Item = RouterOutputs["items"]["getItems"][0];
export type ItemStatus = Item["status"];
export type ItemReservationStatus =
  RouterOutputs["reservation"]["create"]["status"];

export type Reservation = RouterOutputs["reservation"]["getMy"][number];
