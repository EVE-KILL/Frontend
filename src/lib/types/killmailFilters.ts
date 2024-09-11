export interface KillmailFilters {
	dateRange: {
		start: string | null;
		end: string | null;
	};
	victim: {
		characterId: number | null;
		corporationId: number | null;
		allianceId: number | null;
		factionId: number | null;
		shipTypeId: number | null;
		shipGroupId: number | null;
	};
	attacker: {
		characterId: number | null;
		corporationId: number | null;
		allianceId: number | null;
		factionId: number | null;
		shipTypeId: number | null;
		shipGroupId: number | null;
	};
	location: {
		regionId: number | null;
		constellationId: number | null;
		systemId: number | null;
	};
	killedShip: {
		shipTypeId: number | null;
		shipGroupId: number | null;
		totalIskValueGreaterThan: number | null;
		totalIskValueLessThan: number | null;
		shipIskValueGreaterThan: number | null;
		shipIskValueLessThan: number | null;
	};
	misc: {
		kills: boolean;
		losses: boolean;
		solo: boolean;
		awox: boolean;
		npc: boolean;
		pointValueGreaterThan: number | null;
		pointValueLessThan: number | null;
		flags: string[];
	};
}
