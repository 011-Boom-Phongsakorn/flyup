export type MeetingType = 'online' | 'onsite' | 'hybrid';
export type MeetingStatus = 'open' | 'closed' | 'canceled';
export type FilterMode = 'upcoming' | 'past' | 'all';

export interface Meeting {
  id: number;
  milestone_id: number;
  date: string;
  time: string;
  meeting_type: MeetingType;
  link?: string | null;
  place?: string | null;
  about: string;
  status: MeetingStatus;
}

export interface MilestoneOption {
  id: number;
  phase_no?: number;
  title: string;
  status: string;
  project_id: number;
  project_title: string;
}

export interface CreateMeetingPayload {
  milestone_id: number;
  date: string;
  time: string;
  meeting_type: MeetingType;
  link?: string;
  place?: string;
  about: string;
}

export const MEETING_TYPE_LABEL: Record<MeetingType, string> = {
  online: 'ออนไลน์',
  onsite: 'ออนไซต์',
  hybrid: 'ไฮบริด',
};

export const MEETING_ELIGIBLE_PROJECT_STATES = ['funding', 'executing', 'closed'];
export const MEETING_ELIGIBLE_MILESTONE_STATUS = 'approved';
