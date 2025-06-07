import type { Hermes, HermesOptions } from "@iliad.dev/hermes";
import type { StrictContentTypesSyncOptions } from "@features";
import type { StringLike, ContextClient } from "@types";
import type {
  StrapiInstanceParams,
  WarningConfig,
} from "../../strapiAdapter/StrapiInstance/types";
import {
  parseStrapiInstanceParams,
  createHermesInstance,
} from "../../strapiAdapter/StrapiInstance/utils";

// Options hold the configuration for the Strapi Instance provided by the user.
class Options {
  // API Information and Configuration
  strapiApiLocation: StringLike;
  strapiBearerToken: StringLike;
  api: string;

  // Hermes Configuration
  hermesOptions: HermesOptions;
  client: ContextClient;
  hermes: Hermes;

  // Strapi Adapter Options
  private _contentTypesSyncOptions: StrictContentTypesSyncOptions;
  normalizeStrapiData: boolean;
  warnings: WarningConfig;

  constructor(params: StrapiInstanceParams) {
    const {
      contentTypesSyncOptions,
      normalizeStrapiData,
      strapiApiLocation,
      strapiBearerToken,
      strapiApiEndpoint,
      hermesOptions,
      warnings,
      client,
    } = parseStrapiInstanceParams(params);
    this.hermes = createHermesInstance(
      hermesOptions,
      strapiApiLocation,
      strapiBearerToken
    );

    this._contentTypesSyncOptions = contentTypesSyncOptions;
    this.normalizeStrapiData = normalizeStrapiData;
    this.strapiApiLocation = strapiApiLocation;
    this.strapiBearerToken = strapiBearerToken;
    this.hermesOptions = hermesOptions;
    this.api = strapiApiEndpoint;
    this.warnings = warnings;
    this.client = client;
  }

  protected objectify() {
    return {
      contentTypesSyncOptions: this.contentTypesSyncOptions,
      strapiApiLocation: this.strapiApiLocation,
      strapiBearerToken: this.strapiBearerToken,
      hermesOptions: this.hermesOptions,
      warnings: this.warnings,
      client: this.client,
      hermes: this.hermes,
      api: this.api,
    };
  }

  get contentTypesSyncOptions(): StrictContentTypesSyncOptions {
    if (!this._contentTypesSyncOptions) {
      throw new Error("No content types sync options set.");
    }
    return this._contentTypesSyncOptions;
  }
}

export default Options;
export { Options };
