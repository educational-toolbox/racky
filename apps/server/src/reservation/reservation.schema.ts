import { z } from 'zod';
import { ReservationStatus } from '@prisma/client';

export const reservationSchemaRead = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(ReservationStatus),
});

export type ReservationRead = z.infer<typeof reservationSchemaRead>;

export const reservationSchemaWrite = reservationSchemaRead.omit({ id: true });

export type ReservationWrite = z.infer<typeof reservationSchemaWrite>;
