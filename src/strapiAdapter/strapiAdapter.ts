import { Hermes } from 'iliad-hermes-ts';

// TYPES
import type {
  StrapiEntry,
  HermesOptions,
  ErrorResponse,
  StrapiMetaData,
  StrapiResponse,
  SuccessResponse,
  StandardResponse,
  StrapiResponseType,
  TransformedStrapiEntry,
} from '../@types/strapi.d.ts';

// UTILITY FUNCTIONS
import StrapiUtils from '../utils/utils.js';

// I should move this entire implementation to a StrapiContext class that extends Hermes, and then export a default instance of that class.
class StrapiContext {
  hermes: Hermes;
  constructor(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    options?: HermesOptions
  ) {
    this.hermes = new Hermes(
      contextLabel,
      StrapiUtils.mergeDefaultHermesOptions(options)
    ).addBaseUrl(strapiApiLocation as string);

    if (strapiBearerToken) {
      this.hermes.addBaseHeaders({
        Authorization: `Bearer ${strapiBearerToken}`,
      });
    }
  }

  // CONTEXT UTILITIES
  static createStrapiContext(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    options?: HermesOptions
  ): StrapiContext {
    return new StrapiContext(
      contextLabel,
      strapiApiLocation,
      strapiBearerToken,
      options
    );
  }

  // GET FUNCTIONS
  async getFullCollection<T = StrapiResponse>(
    collection: string,
    query: string | object = '',
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<T>> {
    query = StrapiUtils.sanitizeQuery(query);

    let data: StrapiEntry[] = [];
    let meta;

    _firstPage: {
      let { data: firstPage, error } = await this.getCollection(
        collection,
        1,
        25,
        query
      );

      if (error) {
        console.error(`Error fetching collection ${collection}:`, error, {
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      if (!firstPage) {
        console.error(`No data returned from Strapi`);
        return {
          data: undefined,
          error: { message: 'No data returned from Strapi', code: 500 },
        } as ErrorResponse;
      }

      meta = firstPage.meta;
      data = firstPage.data as StrapiEntry[];
    }

    let indexArray = StrapiUtils.indexArrayFromMeta(meta);

    let promises = indexArray.map(async (i) => {
      let { data: page, error } = await this.getCollection(
        collection,
        i,
        25,
        query
      );

      if (error) {
        console.error(`Error fetching collection ${collection}:`, error, {
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      if (!page) {
        console.error(`No data returned from Strapi`);
        return {
          data: undefined,
          error: { message: 'No data returned from Strapi', code: 500 },
        } as ErrorResponse;
      }

      return page.data as StrapiEntry[];
    });

    let pages = await Promise.all(promises);

    pages.forEach((page) => {
      if (Array.isArray(page)) {
        data = data.concat(page);
      }
    });

    return await StrapiUtils.coerceData(
      {
        meta,
        data,
      } as StrapiResponse,
      collection
    );
  }

  async getEntryBySlug<T = StrapiEntry>(
    collection: string,
    slug: string,
    query: string | object = '',
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<T>> {
    let _q = StrapiUtils.sanitizeQuery(query, false);
    let __q = `&filters[slug][$eq]=${slug}`;

    if (_q) {
      __q += `&${_q}`;
    }

    let { data, error } = await this.getCollection(collection, 1, 1, __q);

    if (error) {
      console.error(
        `Error fetching entry by slug ${collection}/${slug}:`,
        error,
        { query: __q }
      );
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, slug, true);
  }

  async getCollection<T = StrapiResponse>(
    collection: string,
    page: number = 1,
    pageSize: number = 25,
    query: string | object = '',
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<T>> {
    let _q = StrapiUtils.sanitizeQuery(query, false);
    let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

    if (_q) {
      __q += `&${_q}`;
    }

    let { data, error } = await _hermes.axios.get(`${collection}${__q}`);

    if (error) {
      console.error(`Error fetching collection ${collection}:`, error, {
        query: __q,
      });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection);
  }

  async getEntry<T = StrapiEntry>(
    collection: string,
    id: number,
    query: string | object = '',
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<T>> {
    query = StrapiUtils.sanitizeQuery(query);

    let { data, error } = await _hermes.axios.get(
      `${collection}/${id}${query}`
    );

    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, id);
  }

  async getSingle<T = StrapiEntry>(
    collection: string,
    query: string | object = '',
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<T>> {
    query = StrapiUtils.sanitizeQuery(query);

    let { data, error } = await _hermes.axios.get(`${collection}${query}`);

    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection);
  }

  async getNextEntry(
    id: number,
    collection: string,
    dateKey: string,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<SuccessResponse<StrapiEntry> | ErrorResponse>;
  async getNextEntry(
    date: string | Date,
    collection: string,
    dateKey: string,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<SuccessResponse<StrapiEntry> | ErrorResponse>;
  async getNextEntry(
    idOrDate: number | string | Date,
    collection: string,
    dateKey: string = 'createdAt',
    query?: string | object,
    _hermes: Hermes = this.hermes
  ): Promise<SuccessResponse<StrapiEntry> | ErrorResponse> {
    query = StrapiUtils.sanitizeQuery(query);
    let date: string;

    if (idOrDate instanceof Date || typeof idOrDate === 'string') {
      date = new Date(idOrDate).toISOString();
    } else {
      // If there's no date provided, fetch the entry to get the date
      let { data, error } = await this.getEntry<StrapiEntry>(
        collection,
        idOrDate
      );
      if (error) {
        console.error(
          `Error fetching entry ${collection}/${idOrDate}:`,
          error,
          { query }
        );
        return { data: undefined, error } as ErrorResponse;
      }

      date = data?.attributes[dateKey];

      if (!date) {
        console.error(`No date found in entry ${collection}/${idOrDate}`);
        return {
          data: undefined,
          error: {
            message: `No date found in entry ${collection}/${idOrDate}`,
            code: 500,
          },
        } as ErrorResponse;
      }
    }

    let _query = `filters[${dateKey}][$gt]=${date}&sort[0]=date:asc&${query}`;

    let { data, error } = await this.getCollection(collection, 1, 1, _query);

    if (error) {
      console.error(`Error fetching next entry ${collection}:`, error, {
        query: _query,
      });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, undefined, true);
  }

  // STATIC FUNCTIONS
  public static extractStrapiData = StrapiUtils.extractStrapiData;
  extractStrapiData = StrapiUtils.extractStrapiData;
}

export default StrapiContext;
