import { OpenapiMetaBuilder } from '../../trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('catalog').tags('Catalog');

export const openapi = () => base.clone();
