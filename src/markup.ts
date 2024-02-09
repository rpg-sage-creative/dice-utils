/** Simple function to ensure everywhere we bold a value, we do it the same. */
export function markAsMax(value: number | string): string {
	return `<b>${value}</b>`;
}

/** Simple function to ensure everywhere we italicize a value, we do it the same. */
export function markAsMin(value: number | string): string {
	return `<i>${value}</i>`;
}

/** Simple function to ensure everywhere we strike a value, we do it the same. */
export function markAsDropped(value: number | string): string {
	return `<s>${value}</s>`;
}

/** Simple function to ensure everywhere we mark a value as fixed, we do it the same. */
export function markAsFixed(value: number | string): string {
	return `${value}f`;
}

/** Simple function to ensure everywhere we mark a value as causing an explosion, we do it the same. */
export function markExploded(value: number | string): string {
	return `${value}ₓ`;
}

/** Simple function to ensure everywhere we mark a value as the result of an explosion, we do it the same. */
export function markAsExplosion(value: number | string): string {
	return `${value}⁺`;
}