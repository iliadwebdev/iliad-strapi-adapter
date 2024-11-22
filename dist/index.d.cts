import StrapiContext from './strapiAdapter/strapiAdapter.cjs';
export { default as StrapiUtils } from './utils/utils.cjs';
import '@iliad.dev/hermes';
import './@types/adapter.cjs';
import './@types/strapi.cjs';
import '@strapi/strapi';
import 'iliad-hermes-ts';



export { StrapiContext as default };
