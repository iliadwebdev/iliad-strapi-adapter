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

type NotFoundResponse = ErrorResponse & {
  error: ErrorMessage & { code: 404 };
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

type StrapiResponse = {
  meta: StrapiMetaData;
  data: StrapiEntry | Array<StrapiEntry>;
};

type StrapiResponseType = 'entry' | 'collection';

type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;

export {
  TransformedStrapiEntry,
  StrapiResponseType,
  StandardResponse,
  SuccessResponse,
  StrapiResponse,
  StrapiMetaData,
  HermesOptions,
  ErrorResponse,
  ErrorMessage,
  StrapiEntry,
};
