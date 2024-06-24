import { OpenapiMetaBuilder } from '~/trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('reservations').tags('Reservation');

export const openapi = () => base.clone();
