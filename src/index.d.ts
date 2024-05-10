import type { Hermes, HermesOptions } from 'iliad-hermes-ts';
import type {
  TransformedStrapiEntry,
  StrapiResponseType,
  StandardResponse,
  SuccessResponse,
  StrapiResponse,
  StrapiMetaData,
  ErrorResponse,
  ErrorMessage,
  StrapiEntry,
} from './@types/strapi.d.ts';

declare class StrapiContext {
  constructor(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    options?: HermesOptions
  );

  static createStrapiContext(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    options?: HermesOptions
  ): StrapiContext;

  // Get Functions

  getFullCollection<T>(
    collection: string,
    query: string | object,
    _hermes: Hermes
  ): Promise<StandardResponse<T>>;

  getEntryBySlug<T>(
    collection: string,
    slug: string,
    query: string | object,
    _hermes: Hermes
  ): Promise<StandardResponse<T>>;

  getCollection<T>(
    collection: string,
    page: number,
    pageSize: number,
    query: string | object,
    _hermes: Hermes
  ): Promise<StandardResponse<T>>;

  getEntry<T>(
    collection: string,
    id: number,
    query: string | object,
    _hermes: Hermes
  ): Promise<StandardResponse<T>>;

  getSingle<T>(
    collection: string,
    query: string | object,
    _hermes: Hermes
  ): Promise<StandardResponse<T>>;
}

export default StrapiContext;
