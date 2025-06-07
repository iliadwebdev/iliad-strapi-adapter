import type { ErrorResponse } from "@iliad.dev/ts-utils";

import Options from "@classes/Options";
import Feature from "../Feature";

class Authentication extends Feature {
  constructor(options: Options) {
    super(options);
  }

  auth(): ErrorResponse {
    return {
      error: { message: "Not implemented", code: 500 },
      data: undefined,
    };
  }
}

export default Authentication;
export { Authentication };
