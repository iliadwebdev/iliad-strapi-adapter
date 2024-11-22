import { ContextClient, SuccessResponse, ErrorResponse, StrapiMetaData, StrapiData, StrapiDataObject } from '../@types/adapter.cjs';
import { Common } from '@strapi/strapi';
import { HermesOptions } from 'iliad-hermes-ts';
import '../@types/strapi.cjs';

declare namespace StrapiUtils {
    function sanitizeQuery(query?: string | object, addQueryPrefix?: boolean): string;
    function mergeQueries(...queries: any[]): void;
    function coerceData<T extends Common.UID.ContentType>(data: any, collection: string, id?: number | string, extractSingleCollectionResponse?: boolean, client?: ContextClient): Promise<SuccessResponse<any> | ErrorResponse>;
    function indexArrayFromMeta(meta: StrapiMetaData): number[];
    function mergeDefaultHermesOptions(options?: Partial<HermesOptions>): HermesOptions;
    function extractStrapiData<TContentTypeUID extends Common.UID.ContentType>(input: StrapiData<TContentTypeUID> | StrapiDataObject<TContentTypeUID>): Promise<any>;
}

export { StrapiUtils as default };
