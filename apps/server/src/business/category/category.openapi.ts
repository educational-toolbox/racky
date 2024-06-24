import { OpenapiMetaBuilder } from '../../trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('categories').tags('Category');

export const openapi = () => base.clone();
