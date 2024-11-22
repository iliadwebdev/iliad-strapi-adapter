import { ContentTypesSyncOptions } from './strapiAdapter.cjs';
import { Hermes } from '@iliad.dev/hermes';
import '../@types/adapter.cjs';
import '../@types/strapi.cjs';
import '@strapi/strapi';

declare function downloadContentTypes(hermes: Hermes, { outDir }: ContentTypesSyncOptions): Promise<StandardResponse<string[]>>;

export { downloadContentTypes };
