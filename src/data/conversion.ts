export type Entry<T extends {} | ArrayLike<any>> = [keyof T, T[keyof T]];

export type Merge<A, B> = ({ [K in keyof A]: K extends keyof B ? B[K] : A[K] }
	& B) extends infer O ? { [K in keyof O]: O[K] }
	: never;

export type RecordFromEntries<T extends Array<[PropertyKey, any]>> =
	T extends Array<[infer K extends PropertyKey, infer V]> ? Record<K, V>
	: never;

export function typedObjectKeys<T extends {} | ArrayLike<any>>(obj: T): Array<keyof T> {
	return Object.keys(obj) as Array<keyof T>;
}

export function typedObjectValues<T extends {} | ArrayLike<any>>(obj: T): Array<T[keyof T]> {
	return Object.values(obj);
}

export function typedObjectEntries<T extends {} | ArrayLike<any>>(obj: T): Array<Entry<T>> {
	return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

export function typedObjectFromEntries<K extends string, V>(entries: Iterable<[K, V]>): Record<K, V> {
	return Object.fromEntries(entries) as Record<K, V>;
}

export function typedObjectTransformEntries<
	T extends {} | ArrayLike<any>,
	Fn extends (entries: Entry<T>[]) => Entry<any>[],
>(obj: T, transform: Fn): RecordFromEntries<ReturnType<Fn>> {
	// @ts-expect-error I don't think I can type this properly, but also it doesn't entirely matter.
	return typedObjectFromEntries(transform(typedObjectEntries(obj)));
}
