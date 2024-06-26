import { OpenapiMetaBuilder } from '../../trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('user').tags('User');

export const openapi = () => base.clone();
