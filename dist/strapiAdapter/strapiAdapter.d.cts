import { Hermes, HermesOptions } from '@iliad.dev/hermes';
import { ContextClient, EnvVariable, StandardResponse, StrapiData, StrapiDataObject } from '../@types/adapter.cjs';
import { APIResponseCollection, APIResponseData } from '../@types/strapi.cjs';
import { Common } from '@strapi/strapi';

type ContentTypesSyncOptions = {
    outDir: string;
};
declare class StrapiContext {
    hermes: Hermes;
    client: ContextClient;
    constructor(contextLabel: string, strapiApiLocation: EnvVariable & URL, strapiBearerToken?: EnvVariable, client?: ContextClient, options?: HermesOptions);
    static createStrapiContext(contextLabel: string, strapiApiLocation: EnvVariable & URL, strapiBearerToken?: EnvVariable, options?: HermesOptions): StrapiContext;
    private getWithClient;
    getFullCollection<TContentTypeUID extends Common.UID.ContentType>(collection: string, query?: string | object, _hermes?: Hermes): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>>;
    getEntryBySlug<TContentTypeUID extends Common.UID.ContentType>(collection: string, slug: string, query?: string | object, _hermes?: Hermes): Promise<StandardResponse<APIResponseData<TContentTypeUID>>>;
    getCollection<TContentTypeUID extends Common.UID.CollectionType>(collection: string, page?: number, pageSize?: number, query?: string | object, _hermes?: Hermes): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>>;
    getEntry<TContentTypeUID extends Common.UID.ContentType>(collection: string, id: number, query?: string | object, _hermes?: Hermes): Promise<StandardResponse<APIResponseData<TContentTypeUID>>>;
    getSingle<TContentTypeUID extends Common.UID.ContentType>(collection: string, query?: string | object, _hermes?: Hermes): Promise<StandardResponse<APIResponseData<TContentTypeUID>>>;
    get Hermes(): Hermes;
    withContentTypes(options: ContentTypesSyncOptions): StrapiContext;
    static extractStrapiData<T extends Common.UID.ContentType>(input: StrapiData<T> | StrapiDataObject<T>): Promise<any>;
    extractStrapiData<T extends Common.UID.ContentType>(input: StrapiData<T> | StrapiDataObject<T>): Promise<any>;
}

export { type ContentTypesSyncOptions, StrapiContext as default };
