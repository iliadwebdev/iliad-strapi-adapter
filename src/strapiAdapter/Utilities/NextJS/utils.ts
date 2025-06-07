// Types
import type { Redirect } from "next/dist/lib/load-custom-routes";

// Classes
import StrapiInstance from "src/strapiAdapter/StrapiInstance";

export async function fetchRedirects(
  strapiInstance: StrapiInstance
): Promise<Redirect[]> {
  const { data, error } = await strapiInstance.GET("/redirects");

  // @ts-ignore
  if (error || !data?.redirects) {
    return [];
  }

  // @ts-ignore
  const response = data?.redirects as Redirect[];

  // Ensure data is in the correct format (array of Redirect objects)
  // Adjust this based on the actual structure of 'data'
  // @ts-ignore
  return response || [];
}
