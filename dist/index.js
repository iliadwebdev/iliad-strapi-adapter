Object.defineProperty(exports, '__esModule', { value: true });

var iliadHermesTs = require('iliad-hermes-ts');
var qs = require('qs');

// Dependencies
// ============
// SHARED UTILS
// ============
var StrapiUtils;
(function (StrapiUtils) {
    function sanitizeQuery(query = "", addQueryPrefix = true) {
        // If query is an object, convert it to a string
        if (typeof query === "object") {
            query = qs.stringify(query);
        }
        // If query starts with an ampersand, remove it - this is to prevent polluting query through nested sanitization.
        query = query.startsWith("&") ? query.slice(1) : query;
        let qp = addQueryPrefix ? "?" : "";
        query ? (query = `${qp}${query}`) : (query = "");
        return query.replaceAll("&?", "&"); // Monkey patch, this sanitization function needs to be revisited.
    }
    StrapiUtils.sanitizeQuery = sanitizeQuery;
    function mergeQueries(...queries) { }
    StrapiUtils.mergeQueries = mergeQueries;
    async function coerceData(data = null, collection, id, extractSingleCollectionResponse = false, client) {
        let result;
        let apiResponse;
        let type;
        try {
            if (!data)
                throw new Error("No data returned from Strapi");
            apiResponse = data;
            type = "attributes" in apiResponse?.data ? "entry" : "collection";
        }
        catch (error) {
            console.error(`Error parsing entry ${collection}/${id}: ${error.message}`);
            return { data: undefined, error };
        }
        if (type === "entry") {
            result = apiResponse.data;
        }
        else {
            if (extractSingleCollectionResponse) {
                if (Array.isArray(apiResponse.data)) {
                    result = apiResponse.data[0];
                }
                else {
                    result = apiResponse.data;
                }
            }
            else {
                result = apiResponse;
            }
        }
        return { data: result, error: undefined };
    }
    StrapiUtils.coerceData = coerceData;
    function indexArrayFromMeta(meta) {
        return Array(meta.pagination.pageCount)
            .fill(0)
            .map((_, i) => i + 2)
            .slice(0, meta.pagination.pageCount - 1);
    }
    StrapiUtils.indexArrayFromMeta = indexArrayFromMeta;
    function mergeDefaultHermesOptions(options = {}) {
        return {
            verboseLogging: false,
            extractData: false,
            ...options,
        };
    }
    StrapiUtils.mergeDefaultHermesOptions = mergeDefaultHermesOptions;
    async function extractStrapiData(input) {
        function isObject(obj) {
            return obj !== null && typeof obj === "object";
        }
        function isArray(obj) {
            return Array.isArray(obj);
        }
        function isEntryObject(value) {
            return isObject(value) && "id" in value && "attributes" in value;
        }
        function isRelation(value) {
            if (!("data" in value))
                return false;
            if (isArray(value.data) &&
                value.data.every((item) => isObject(item) && "id" in item && "attributes" in item))
                return true;
            if (isObject(value.data) &&
                "id" in value.data &&
                "attributes" in value.data)
                return true;
            return false;
        }
        async function recursivelyExtractAttributes(input) {
            switch (true) {
                case isArray(input): {
                    const a_promises = input.map(async (item) => recursivelyExtractAttributes(item));
                    return await Promise.all(a_promises);
                }
                case isObject(input): {
                    let _input = { ...input };
                    if (isRelation(input)) {
                        return await recursivelyExtractAttributes(input.data);
                    }
                    if (isEntryObject(input)) {
                        const { id, attributes, ...rest } = input;
                        _input = {
                            ...{
                                id,
                                ...attributes,
                            },
                            ...rest,
                        };
                    }
                    const e_promises = Object.entries(_input).map(async ([key, value]) => [
                        key,
                        await recursivelyExtractAttributes(value),
                    ]);
                    return Object.fromEntries(await Promise.all(e_promises));
                }
                default: {
                    return input;
                }
            }
        }
        let initialInput;
        if (input?.data) {
            initialInput = input.data;
        }
        else {
            initialInput = input;
        }
        return await recursivelyExtractAttributes(initialInput);
    }
    StrapiUtils.extractStrapiData = extractStrapiData;
})(StrapiUtils || (StrapiUtils = {}));
var StrapiUtils$1 = StrapiUtils;

// I should move this entire implementation to a StrapiContext class that extends Hermes, and then export a default instance of that class.
class StrapiContext {
    hermes;
    client = "axios";
    constructor(contextLabel, strapiApiLocation, strapiBearerToken, client, options) {
        this.hermes = new iliadHermesTs.Hermes(contextLabel, StrapiUtils$1.mergeDefaultHermesOptions(options)).addBaseUrl(strapiApiLocation);
        if (strapiBearerToken) {
            this.hermes.addBaseHeaders({
                Authorization: `Bearer ${strapiBearerToken}`,
            });
        }
        if (client) {
            this.client = client || this.client;
        }
    }
    // CONTEXT UTILITIES
    static createStrapiContext(contextLabel, strapiApiLocation, strapiBearerToken, options) {
        return new StrapiContext(contextLabel, strapiApiLocation, strapiBearerToken, options);
    }
    async getWithClient(url, options) {
        url = url;
        let response;
        if (this.client === "axios") {
            response = await this.hermes.axios.get(url, options);
            response = response.data;
        }
        else {
            response = await this.hermes.fetch(url, options);
        }
        return response;
    }
    // GET FUNCTIONS
    async getFullCollection(collection, query = "", _hermes = this.hermes) {
        query = StrapiUtils$1.sanitizeQuery(query);
        let data = [];
        let meta;
        {
            let { data: firstPage, error } = await this.getCollection(collection, 1, 25, query);
            if (error) {
                console.error(`Error fetching collection ${collection}:`, error, {
                    query,
                });
                return { data: undefined, error };
            }
            if (!firstPage) {
                console.error(`No data returned from Strapi`);
                return {
                    data: undefined,
                    error: { message: "No data returned from Strapi", code: 500 },
                };
            }
            meta = firstPage.meta;
            data = firstPage.data;
        }
        let indexArray = StrapiUtils$1.indexArrayFromMeta(meta);
        let promises = indexArray.map(async (i) => {
            let { data: page, error } = await this.getCollection(collection, i, 25, query);
            if (error) {
                console.error(`Error fetching collection ${collection}:`, error, {
                    query,
                });
                return { data: undefined, error };
            }
            if (!page) {
                console.error(`No data returned from Strapi`);
                return {
                    data: undefined,
                    error: { message: "No data returned from Strapi", code: 500 },
                };
            }
            return page.data;
        });
        let pages = await Promise.all(promises);
        pages.forEach((page) => {
            if (Array.isArray(page)) {
                data = data.concat(page);
            }
        });
        return await StrapiUtils$1.coerceData({
            meta,
            data,
        }, collection);
    }
    async getEntryBySlug(collection, slug, query = "", _hermes = this.hermes) {
        let _q = StrapiUtils$1.sanitizeQuery(query, false);
        let __q = `&filters[slug][$eq]=${slug}`;
        if (_q) {
            __q += `&${_q}`;
        }
        let { data, error } = await this.getCollection(collection, 1, 1, __q);
        if (error) {
            console.error(`Error fetching entry by slug ${collection}/${slug}:`, error, { query: __q });
            return { data: undefined, error };
        }
        return await StrapiUtils$1.coerceData(data, collection, slug, true);
    }
    async getCollection(collection, page = 1, pageSize = 25, query = "", _hermes = this.hermes) {
        let _q = StrapiUtils$1.sanitizeQuery(query, false);
        let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
        if (_q) {
            __q += `&${_q}`;
        }
        let { data, error } = await this.getWithClient(`${collection}${__q}`, {
            next: { tags: [collection, "atlas::full-revalidation"] },
        });
        if (error) {
            console.error(`Error fetching collection ${collection}:`, error, {
                query: __q,
            });
            return { data: undefined, error };
        }
        return await StrapiUtils$1.coerceData(data, collection);
    }
    async getEntry(collection, id, query = "", _hermes = this.hermes) {
        query = StrapiUtils$1.sanitizeQuery(query);
        let { data, error } = await this.getWithClient(`${collection}/${id}${query}`, {
            next: { tags: [collection, "atlas::full-revalidation"] },
        });
        if (error) {
            console.error(`Error fetching entry ${collection}:`, error, { query });
            return { data: undefined, error };
        }
        return await StrapiUtils$1.coerceData(data, collection, id);
    }
    async getSingle(collection, query = "", _hermes = this.hermes) {
        query = StrapiUtils$1.sanitizeQuery(query);
        let { data, error } = await this.getWithClient(`${collection}${query}`, {
            next: { tags: [collection, "atlas::full-revalidation"] },
        });
        if (error) {
            console.error(`Error fetching entry ${collection}:`, error, { query });
            return { data: undefined, error };
        }
        return await StrapiUtils$1.coerceData(data, collection);
    }
    get Hermes() {
        return this.hermes;
    }
    // STATIC FUNCTIONS
    static extractStrapiData(input) {
        return StrapiUtils$1.extractStrapiData(input);
    }
    extractStrapiData(input) {
        return StrapiUtils$1.extractStrapiData(input);
    }
}

exports.StrapiUtils = StrapiUtils$1;
exports.default = StrapiContext;
//# sourceMappingURL=index.js.map
