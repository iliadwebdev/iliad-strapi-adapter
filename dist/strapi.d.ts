import { HermesOptions, Hermes } from 'iliad-hermes-ts';

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

type StrapiMetaData = {
  pagination: {
    pageCount: number;
    pageSize: number;
    total: number;
    page: number;
  };
  [key: string]: any;
};

type StrapiResponse = {
  meta: StrapiMetaData;
  data: StrapiEntry | Array<StrapiEntry>;
};

type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;

type ContextClient = 'axios' | 'fetch';
type StrapiData = StrapiResponse | StrapiEntry | StrapiEntry[];
type StrapiDataObject = {
  [key: string]: StrapiData;
};

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

export { StrapiUtils, StrapiContext as default };
