/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string): boolean {
	// If the param matches alliance, corporation, character, system or region it's a valid match
	return /^(latest|abyssal|wspace|highsec|lowsec|nullsec|big|solo|npc|5b|10b|citadels|t1|t2|t3|frigate|destroyers|cruisers|battlecruisers|battleships|capitals|freighters|supercarriers|titans)$/.test(
		param
	);
}
