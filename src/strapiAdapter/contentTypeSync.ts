// import { XOR, StandardResponse } from "@iliad.dev/ts-utils/@types";

import { runAsyncSynchronously } from "@iliad.dev/ts-utils";
import { ContentTypesSyncOptions } from "./strapiAdapter";
import { Hermes } from "@iliad.dev/hermes";

type A = XOR<1, 2>;

export async function downloadContentTypes(
  hermes: Hermes,
  { outDir }: ContentTypesSyncOptions
): Promise<StandardResponse<string[]>> {
  console.log("Downloading content types");

  return await hermes.axios.get<string[]>("/content-types", undefined);
}
