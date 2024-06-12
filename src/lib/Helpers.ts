export function formatNumber(value: number) {
	const formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return formatter.format(value);
}
