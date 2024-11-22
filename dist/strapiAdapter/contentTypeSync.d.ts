import { ContentTypesSyncOptions } from './strapiAdapter.js';
import { Hermes } from '@iliad.dev/hermes';
import '../@types/adapter.js';
import '../@types/strapi.js';
import '@strapi/strapi';

declare function downloadContentTypes(hermes: Hermes, { outDir }: ContentTypesSyncOptions): Promise<StandardResponse<string[]>>;

export { downloadContentTypes };
