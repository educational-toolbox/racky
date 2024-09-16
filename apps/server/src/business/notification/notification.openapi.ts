import { OpenapiMetaBuilder } from '../../trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('notifications').tags('Notifications');

export const openapi = () => base.clone();
