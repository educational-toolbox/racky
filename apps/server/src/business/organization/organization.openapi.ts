import { OpenapiMetaBuilder } from '~/trpc/openapi-meta.builder';

const base = new OpenapiMetaBuilder('organization').tags('Organization');

export const openapi = () => base.clone();
