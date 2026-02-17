export function sum(...values: number[]): number {
	return values.reduce((acc, current) => acc + current, 0);
}
