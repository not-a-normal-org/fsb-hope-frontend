// Plain constants shared by the server action (validation) and the client
// controls (dropdown). Kept OUT of the 'use server' actions module — a
// 'use server' file may only export async functions, so a const exported from
// there reaches the client as a server reference, not the array itself.

export const LEAD_STATUSES = ['new', 'contacted', 'searching', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
