import { Hermes } from "@iliad.dev/hermes";
import Options from "@classes/Options";

// Types
import type { StrictContentTypesSyncOptions } from "@features";
import type { WarningConfig } from "../StrapiInstance/types";
import type { Nullable } from "@iliad.dev/ts-utils";

// This is the base Feature class that holds information common to all features.
class Feature {
  protected contentTypesSyncOptions: Nullable<StrictContentTypesSyncOptions> =
    null;

  warnings: WarningConfig;
  options: Options;
  hermes: Hermes;

  constructor(options: Options) {
    this.warnings = options.warnings;
    this.hermes = options.hermes;

    // Options need to be considered a static object, for the most part.
    this.options = options;
  }

  protected withContentTypes(options: any): void {
    console.log(`shouldn't be run`);
  }

  protected apiEndpoint(collection: string): string {
    let endpoint = `${this.options.api}/${collection}`;

    // Remove double slashes, preserving "http://" or "https://"
    endpoint = endpoint.replace(/([^:]\/)\/+/g, "$1");

    // Remove leading slash if present
    if (endpoint.startsWith("/")) {
      endpoint = endpoint.slice(1);
    }

    return endpoint;
  }
}

export * from "./types";
export default Feature;
export { Feature };
