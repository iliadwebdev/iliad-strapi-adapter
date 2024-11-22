import { APIResponseCollection, APIResponse, APIResponseData } from './strapi.js';
export { StrapiResponse } from './strapi.js';
import { Common } from '@strapi/strapi';

type ErrorMessage = {
    message: string;
    code: number;
};
type SuccessResponse<T> = {
    data: T;
    error: undefined;
};
type ErrorResponse = {
    data: undefined;
    error: ErrorMessage;
};
type StrapiEntry = {
    id: number;
    attributes: any;
};
type TransformedStrapiEntry = {
    id: number;
    [key: string]: any;
};
type StrapiMetaData = {
    pagination: {
        pageCount: number;
        pageSize: number;
        total: number;
        page: number;
    };
    [key: string]: any;
};
type EnvVariable = string | undefined;
type StrapiResponseType = "entry" | "collection";
type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;
type ContextClient = "axios" | "fetch";
type StrapiData<T extends Common.UID.ContentType> = APIResponseCollection<T> | APIResponse<T> | APIResponseData<T>;
type StrapiDataObject<T extends Common.UID.ContentType> = {
    [key: string]: StrapiData<T>;
};

export type { ContextClient, EnvVariable, ErrorMessage, ErrorResponse, StandardResponse, StrapiData, StrapiDataObject, StrapiEntry, StrapiMetaData, StrapiResponseType, SuccessResponse, TransformedStrapiEntry };
