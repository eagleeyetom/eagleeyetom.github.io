declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"theatres": {
"en/baltazar.md": {
	id: "en/baltazar.md";
  slug: "en/baltazar";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/danza-mobile.md": {
	id: "en/danza-mobile.md";
  slug: "en/danza-mobile";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/krug-ii.md": {
	id: "en/krug-ii.md";
  slug: "en/krug-ii";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/lik.md": {
	id: "en/lik.md";
  slug: "en/lik";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/otczapy-theater.md": {
	id: "en/otczapy-theater.md";
  slug: "en/otczapy-theater";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/parostky-happy-exiles.md": {
	id: "en/parostky-happy-exiles.md";
  slug: "en/parostky-happy-exiles";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/parostky.md": {
	id: "en/parostky.md";
  slug: "en/parostky";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/rambazamba.md": {
	id: "en/rambazamba.md";
  slug: "en/rambazamba";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/troupe-mtt.md": {
	id: "en/troupe-mtt.md";
  slug: "en/troupe-mtt";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"en/tur.md": {
	id: "en/tur.md";
  slug: "en/tur";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-baltazar.md": {
	id: "pl/teatr-baltazar.md";
  slug: "pl/teatr-baltazar";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-danza-mobile.md": {
	id: "pl/teatr-danza-mobile.md";
  slug: "pl/teatr-danza-mobile";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-krug-ii.md": {
	id: "pl/teatr-krug-ii.md";
  slug: "pl/teatr-krug-ii";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-lik.md": {
	id: "pl/teatr-lik.md";
  slug: "pl/teatr-lik";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-otczapy.md": {
	id: "pl/teatr-otczapy.md";
  slug: "pl/teatr-otczapy";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-parostky-szczesliwi-wygnancy.md": {
	id: "pl/teatr-parostky-szczesliwi-wygnancy.md";
  slug: "pl/teatr-parostky-szczesliwi-wygnancy";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-parostky.md": {
	id: "pl/teatr-parostky.md";
  slug: "pl/teatr-parostky";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-rambazamba.md": {
	id: "pl/teatr-rambazamba.md";
  slug: "pl/teatr-rambazamba";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/teatr-tur.md": {
	id: "pl/teatr-tur.md";
  slug: "pl/teatr-tur";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
"pl/trupa-mtt.md": {
	id: "pl/trupa-mtt.md";
  slug: "pl/trupa-mtt";
  body: string;
  collection: "theatres";
  data: InferEntrySchema<"theatres">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
