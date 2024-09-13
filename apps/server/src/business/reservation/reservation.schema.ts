import { ReservationStatus } from '@prisma/client';
import { z } from 'zod';

export const reservationSchemaRead = z.object({
  id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(ReservationStatus),
  itemId: z.string(),
});

export type ReservationRead = z.infer<typeof reservationSchemaRead>;

export const reservationSchemaWrite = reservationSchemaRead.omit({
  id: true,
  status: true,
});

export type ReservationWrite = z.infer<typeof reservationSchemaWrite>;
