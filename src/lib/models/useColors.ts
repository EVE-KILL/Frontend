export const useColors = () => {
	const generateBackgroundColors = (baseColor: string) => {
		const baseRgb = hexToRgb(baseColor);
		const whiteRgb = hexToRgb('#FFFFFF');
		const colors: { [key: string]: string } = {};
		const steps = [0.05, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.78, 0.89, 1.0];
		const tailwindColorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

		for (let i = 0; i < steps.length; i++) {
			const factor = steps[i];
			const interpolatedColor = interpolateColor(whiteRgb, baseRgb, factor);
			colors[tailwindColorSteps[i]] = rgbToHex(interpolatedColor[0], interpolatedColor[1], interpolatedColor[2]);
		}

		return colors;
	};

	const generateColors = (baseColor: string, overlayColor: string, opacity: number) => {
		// The idea here is that we generate a valid set of colors based on the provided base color, overlay color, and opacity
		const colors: { [key: string]: string } = {};
		const backgroundColors = generateBackgroundColors(baseColor);
		const colorSteps = Object.keys(backgroundColors);

		for (const colorStep of colorSteps) {
			const baseRgb = hexToRgb(backgroundColors[colorStep]);
			const overlayRgb = hexToRgb(overlayColor);

			const r = Math.round((1 - opacity) * baseRgb[0] + opacity * overlayRgb[0]);
			const g = Math.round((1 - opacity) * baseRgb[1] + opacity * overlayRgb[1]);
			const b = Math.round((1 - opacity) * baseRgb[2] + opacity * overlayRgb[2]);

			const resultingColor = rgbToHex(r, g, b);
			colors[colorStep] = resultingColor;
		}

		return colors;
	};

	const interpolateColor = (color1: number[], color2: number[], factor: number) => {
		const result = color1.slice();
		for (let i = 0; i < 3; i++) {
			result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
		}
		return result;
	};

	const hexToRgb = (hex: string) => {
		hex = hex.replace(/^#/, '');
		const bigint = parseInt(hex, 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;

		return [r, g, b];
	};

	const rgbToHex = (r: number, g: number, b: number) => {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
	};

	const getSecurityColor = (securityStatus: number) => {
		if (securityStatus >= 0.5) {
			return '#00FF00';
		} else if (securityStatus >= 0) {
			return '#66FF00';
		} else if (securityStatus >= -0.25) {
			return '#FFFF00';
		} else if (securityStatus >= -0.5) {
			return '#FF6600';
		} else {
			return '#FF0000';
		}
	}

	return {
		generateBackgroundColors,
		generateColors,
		getSecurityColor
	};
};
