import { Common, Attribute, Utils } from '@strapi/strapi';
export { Attribute, Common, Utils } from '@strapi/strapi';

type IDProperty = {
    id: number;
};
type InvalidKeys<TSchemaUID extends Common.UID.Schema> = Utils.Object.KeysBy<Attribute.GetAll<TSchemaUID>, Attribute.Private | Attribute.Password>;
type GetValues<TSchemaUID extends Common.UID.Schema> = {
    [TKey in Attribute.GetOptionalKeys<TSchemaUID>]?: Attribute.Get<TSchemaUID, TKey> extends infer TAttribute extends Attribute.Attribute ? GetValue<TAttribute> : never;
} & {
    [TKey in Attribute.GetRequiredKeys<TSchemaUID>]-?: Attribute.Get<TSchemaUID, TKey> extends infer TAttribute extends Attribute.Attribute ? GetValue<TAttribute> : never;
} extends infer TValues ? Omit<TValues, InvalidKeys<TSchemaUID>> : never;
type RelationValue<TAttribute extends Attribute.Attribute> = TAttribute extends Attribute.Relation<infer _TOrigin, infer TRelationKind, infer TTarget> ? Utils.Expression.MatchFirst<[
    [
        Utils.Expression.Extends<TRelationKind, Attribute.RelationKind.WithTarget>,
        TRelationKind extends `${string}ToMany` ? Omit<APIResponseCollection<TTarget>, "meta"> : APIResponse<TTarget> | null
    ]
], `TODO: handle other relation kind (${TRelationKind})`> : never;
type ComponentValue<TAttribute extends Attribute.Attribute> = TAttribute extends Attribute.Component<infer TComponentUID, infer TRepeatable> ? IDProperty & Utils.Expression.If<TRepeatable, GetValues<TComponentUID>[], GetValues<TComponentUID> | null> : never;
type DynamicZoneValue<TAttribute extends Attribute.Attribute> = TAttribute extends Attribute.DynamicZone<infer TComponentUIDs> ? Array<Utils.Array.Values<TComponentUIDs> extends infer TComponentUID ? TComponentUID extends Common.UID.Component ? {
    __component: TComponentUID;
} & IDProperty & GetValues<TComponentUID> : never : never> : never;
type MediaValue<TAttribute extends Attribute.Attribute> = TAttribute extends Attribute.Media<infer _TKind, infer TMultiple> ? Utils.Expression.If<TMultiple, APIResponseCollection<"plugin::upload.file">, APIResponse<"plugin::upload.file"> | null> : never;
type GetValue<TAttribute extends Attribute.Attribute> = Utils.Expression.If<Utils.Expression.IsNotNever<TAttribute>, Utils.Expression.MatchFirst<[
    [
        Utils.Expression.Extends<TAttribute, Attribute.OfType<"relation">>,
        RelationValue<TAttribute>
    ],
    [
        Utils.Expression.Extends<TAttribute, Attribute.OfType<"dynamiczone">>,
        DynamicZoneValue<TAttribute>
    ],
    [
        Utils.Expression.Extends<TAttribute, Attribute.OfType<"component">>,
        ComponentValue<TAttribute>
    ],
    [
        Utils.Expression.Extends<TAttribute, Attribute.OfType<"media">>,
        MediaValue<TAttribute>
    ],
    [
        Utils.Expression.True,
        Attribute.GetValue<TAttribute, unknown>
    ]
], unknown>, unknown>;
interface APIResponseData<TContentTypeUID extends Common.UID.ContentType> extends IDProperty {
    attributes: GetValues<TContentTypeUID>;
}
interface APIResponseCollectionMetadata {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}
interface APIResponse<TContentTypeUID extends Common.UID.ContentType> {
    data: APIResponseData<TContentTypeUID>;
}
interface APIResponseCollection<TContentTypeUID extends Common.UID.ContentType> {
    data: APIResponseData<TContentTypeUID>[];
    meta: APIResponseCollectionMetadata;
}
type StrapiResponse<T extends Common.UID.ContentType> = APIResponseCollection<T> | APIResponse<T>;

export type { APIResponse, APIResponseCollection, APIResponseCollectionMetadata, APIResponseData, GetValue, GetValues, StrapiResponse };
