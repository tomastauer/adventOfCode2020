export function isBetween(value: any, lowerBound: number, upperBound: number) {
	const n = Number(value);
	return n >= lowerBound && n <= upperBound;
}