import { OpenapiMetaBuilder } from '~/trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('item').tags('Item');

export const openapi = () => base.clone();
