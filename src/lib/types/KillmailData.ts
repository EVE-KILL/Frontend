import type { Killmail } from './Killmail';
import type { Pagination } from './Pagination';

export interface KillmailData {
	data: Killmail[];
  pagination: Pagination;
}
