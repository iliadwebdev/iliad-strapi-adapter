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

type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;

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

export { StrapiContext as default };
