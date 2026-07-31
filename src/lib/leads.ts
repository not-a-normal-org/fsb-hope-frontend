/**
 * Shared lead constants used by both the admin Leads view and the assignee's
 * portal queue. Plain module (no 'use server') so a client component can import
 * the array directly — a const exported from a server-actions file reaches the
 * client as a server reference, not the value.
 */

export const LEAD_STATUSES = ['new', 'contacted', 'searching', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
