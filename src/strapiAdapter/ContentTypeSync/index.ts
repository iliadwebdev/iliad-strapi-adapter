import type { StandardResponse } from "@iliad.dev/ts-utils";

import { requestNewContentTypes, downloadContentTypes } from "./utils";
import { Hermes } from "@iliad.dev/hermes";

import { Options } from "@classes/Options";
import { Feature } from "../Feature";

// This class facilitates the contentType syncronization feature.
class ContentTypeSync extends Feature {
  constructor(options: Options) {
    super(options);
  }

  async syncContentTypes(): Promise<StandardResponse<null>> {
    if (this.options.contentTypesSyncOptions === undefined) {
      return {
        data: undefined,
        error: { message: "No content types sync options set.", code: 500 },
      };
    }

    if (this.options.contentTypesSyncOptions.requestOnSync === true) {
      await requestNewContentTypes(this.hermes, this.contentTypeEndpoint);
    }

    return downloadContentTypes(
      this.hermes,
      this.options.contentTypesSyncOptions,
      this.contentTypeEndpoint
    );
  }

  get Hermes(): Hermes {
    return this.hermes;
  }

  private get contentTypeEndpoint(): string {
    const endpoint = super.apiEndpoint(
      this.options.contentTypesSyncOptions.contentTypesEndpoint
    );

    return endpoint;
  }

  async requestNewContentTypes(): Promise<StandardResponse<null>> {
    return requestNewContentTypes(this.hermes, this.contentTypeEndpoint);
  }
}

export default ContentTypeSync;
export { ContentTypeSync };
export * from "./types";
