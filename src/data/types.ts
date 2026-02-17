export type Constructor<T> = new (...args: any[]) => T;

/**
 * Shortcut to define a `N`-length tuple with values of type `T`.
 */
export type Tuple<T, N extends number>
	= N extends N ? number extends N
		? T[]
		: _TupleOf<T, N, []>
	: never;

type _TupleOf<T, N extends number, R extends unknown[]>
	= R["length"] extends N ? R
	: _TupleOf<T, N, [T, ...R]>;

/**
 * Recursively map over an input type and widen literals to their value type.
 * 
 * This widens:
 * - string literals to `string`,
 * - number literals to `number`,
 * - boolean literals to `boolean`,
 * - any of the above in arrays, tuples, or objects, recursively.
 */
export type ValueType<T>
	// don't touch functions, as this risks making invalid calls look valid in the type system
	= T extends (...args: any[]) => any ? T
	// replace literal types with their value type
	: T extends string ? string
	: T extends number ? number
	: T extends boolean ? boolean
	// map over the indexes in arrays and tuples
	: T extends readonly any[] ? { [K in keyof T]: ValueType<T[K]> }
	// map over the properties in objects
	: T extends object ? { [K in keyof T]: ValueType<T[K]> }
	// return all other types unchanged
	: T;

/**
 * Helper function to apply {@linkcode ValueType} to a value.
 */
export function valueType<T extends any = any>(value: T): ValueType<T> {
	return value as ValueType<T>;
}
