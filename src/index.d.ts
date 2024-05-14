import type { Hermes, HermesOptions } from 'iliad-hermes-ts';
import type {
  TransformedStrapiEntry,
  StrapiResponseType,
  StandardResponse,
  StrapiDataObject,
  SuccessResponse,
  StrapiResponse,
  StrapiMetaData,
  ContextClient,
  ErrorResponse,
  ErrorMessage,
  StrapiEntry,
  StrapiData,
} from './@types/adapter';

declare class StrapiContext {
  constructor(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    client?: ContextClient,
    options?: HermesOptions
  );

  static createStrapiContext(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    options?: HermesOptions
  ): StrapiContext;

  // Get Functions
  getFullCollection<T = StrapiResponse>(
    collection: string,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<T>>;

  getEntryBySlug<T = StrapiEntry>(
    collection: string,
    slug: string,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<T>>;

  getCollection<T = StrapiResponse>(
    collection: string,
    page: number,
    pageSize: number,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<T>>;

  getEntry<T = StrapiEntry>(
    collection: string,
    id: number,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<T>>;

  getSingle<T = StrapiEntry>(
    collection: string,
    query: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<T>>;

  // Getters
  get hermes(): Hermes;

  // Static Methods
  static extractStrapiData(input: StrapiData | StrapiDataObject): object;
  extractStrapiData(input: StrapiData | StrapiDataObject): object;
}

declare namespace StrapiUtils {
  function extractStrapiData(input: StrapiData | StrapiDataObject): object;
}

export { StrapiUtils };

export default StrapiContext;
