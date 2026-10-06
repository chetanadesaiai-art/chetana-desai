export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type TaskStatus = 'Blocked' | 'In Progress' | 'Review' | 'Done' | 'Pending';
export type HealthStatus = 'green' | 'amber' | 'red';

export interface TaskItem {
  id: string;
  code: string;
  project: string;
  projectCode: string;
  title: string;
  owner: string;
  ownerRole: string;
  ownerAvatar?: string;
  priority: Priority;
  priorityLabel: string;
  status: TaskStatus;
  dueDate: string;
  isOverdue?: boolean;
  dependency?: string;
  nextAction?: string;
  timeframe?: string;
  followUpTarget?: string;
  lastUpdate?: {
    author: string;
    timeAgo: string;
    note: string;
  };
}

export interface WaitingItem {
  id: string;
  code: string;
  project: string;
  title: string;
  waitingForParty: string;
  partyAvatarText: string;
  followUpTarget: string;
  statusText: string;
  urgency: 'critical' | 'pending' | 'normal';
  daysPending?: number;
}

export interface ProjectItem {
  id: string;
  code: string;
  department: string;
  departmentIcon: string;
  name: string;
  health: HealthStatus;
  healthLabel: 'ON TRACK' | 'AT RISK' | 'DELAYED';
  pmName: string;
  pmInitials: string;
  goLiveDate: string;
  activeMilestone: string;
  progressPercent: number;
  risksCount: number;
  highRisksCount: number;
  slipDays: number;
  budgetPercent?: number;
  signOffPercent?: number;
}

export interface MeetingItem {
  id: string;
  streamCode: string;
  sprint: string;
  title: string;
  dateTime: string;
  participantsCount: number;
  participants: {
    name: string;
    role?: string;
    avatar?: string;
    initials?: string;
  }[];
  agenda: string[];
  rawNotesQuote: string;
  keyDecisions: string[];
}

export interface AiActionItem {
  id: string;
  sectionRef: string;
  title: string;
  description: string;
  priority: Priority;
  priorityLabel: string;
  status: string;
  dueDate: string;
  owner: string;
  ownerRole: string;
  ownerAvatar?: string;
  ownerInitials?: string;
  progressPercent?: number;
}

export interface GateApproval {
  id: string;
  dateMonth: string;
  dateDay: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface AuditLogItem {
  id: string;
  author: string;
  action: string;
  timeAgo: string;
  project: string;
  colorClass: string;
  codeSnippet?: string;
}

export interface RaidItem {
  id: string;
  type: 'Risk' | 'Assumption' | 'Issue' | 'Dependency';
  project: string;
  title: string;
  owner: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  rag: 'Red' | 'Amber' | 'Green';
  status: 'Open' | 'Mitigating' | 'Resolved';
  impact: string;
  mitigationPlan: string;
}
