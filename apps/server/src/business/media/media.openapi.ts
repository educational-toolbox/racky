import { OpenapiMetaBuilder } from '~/trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('media').tags('Media');

export const openapi = () => base.clone();
