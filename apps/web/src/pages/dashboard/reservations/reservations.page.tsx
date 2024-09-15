import { Title } from "~/components/title";
import { RequireAccessLevel } from "~/lib/auth";
import { UserReservations } from "./user-reservations";
import { AdminReservations } from "./admin-reservations";

export const ReservationsPage = () => {
  return (
    <>
      <Title>Reservations</Title>
      <RequireAccessLevel level="USER" exclusive>
        <UserReservations />
      </RequireAccessLevel>
      <RequireAccessLevel level="ADMIN" exclusive>
        <AdminReservations />
      </RequireAccessLevel>
    </>
  );
};
