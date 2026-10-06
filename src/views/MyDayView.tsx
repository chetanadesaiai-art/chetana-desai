import React, { useState } from 'react';
import { TaskItem, WaitingItem, GateApproval, AuditLogItem } from '../types/pmo';

interface MyDayViewProps {
  tasks: TaskItem[];
  waitingItems: WaitingItem[];
  gateApprovals: GateApproval[];
  auditLogs: AuditLogItem[];
  onAddTask: () => void;
  onCreateFollowUp: () => void;
  onLogRisk: () => void;
  onAddMeeting: () => void;
  onGenerateSummary: () => void;
  onShowToast: (message: string, isAlert?: boolean, actionLabel?: string, onAction?: () => void) => void;
  onNavigateToTab: (tab: string) => void;
  onTaskDone: (taskId: string) => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  tasks,
  waitingItems,
  gateApprovals,
  auditLogs,
  onAddTask,
  onCreateFollowUp,
  onLogRisk,
  onAddMeeting,
  onGenerateSummary,
  onShowToast,
  onNavigateToTab,
  onTaskDone,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'p1'>('all');
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [briefingDismissed, setBriefingDismissed] = useState(false);
  const [briefingDispatched, setBriefingDispatched] = useState(false);

  // Filter tasks based on selected mode
  const filteredTasks = filterMode === 'all'
    ? tasks
    : tasks.filter(t => t.priority === 'P1');

  const handleApproveSend = () => {
    setBriefingDispatched(true);
    onShowToast('Stakeholder follow-up dispatched to Marcus Vance via Outlook & Teams.');
  };

  const handlePing = (task: TaskItem) => {
    onShowToast(`Instant ping sent to ${task.owner} (${task.ownerRole}) for "${task.title.substring(0, 24)}..."`);
  };

  const handleReschedule = (task: TaskItem) => {
    onShowToast(`+24h extension docket staged for ${task.code} (${task.title.substring(0, 20)}...)`, true);
  };

  const handleNudge = (target: string, desc: string) => {
    onShowToast(`Nudge delivered to ${target} via MS Teams & Outlook sync.`);
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg max-w-4xl mx-auto">
      {/* Executive Header & Date Summary */}
      <div className="flex flex-col space-y-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-secondary" />
            <span className="font-label-md text-label-md text-secondary tracking-wider uppercase font-semibold">
              Live Operations · PMO Queue
            </span>
          </div>
          <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-medium">
            Sprint 24.4 · Day 7
          </span>
        </div>

        <div className="flex items-baseline justify-between flex-wrap gap-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-bold">
            Today's Focus: Tuesday, Oct 8
          </h1>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">sync</span>
            Synced 2m ago
          </span>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          4 critical items require immediate orchestration before 14:00 Governance sync.
        </p>
      </div>

      {/* Quick Action Ribbon (Horizontal Scrolling Pill Buttons) */}
      <div className="flex items-center gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin py-1">
        <button
          onClick={onAddTask}
          className="flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-secondary text-on-secondary shadow-sm hover:bg-secondary/90 transition-all active:scale-95 text-left cursor-pointer font-semibold"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span className="font-label-md text-label-md">+ Add Task</span>
        </button>

        <button
          onClick={onCreateFollowUp}
          className="flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-all active:scale-95 text-left cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">mark_chat_unread</span>
          <span className="font-label-md text-label-md">Create Follow-up</span>
        </button>

        <button
          onClick={onLogRisk}
          className="flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-all active:scale-95 text-left cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-error">warning</span>
          <span className="font-label-md text-label-md">Log Risk</span>
        </button>

        <button
          onClick={onAddMeeting}
          className="flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-all active:scale-95 text-left cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_add_on</span>
          <span className="font-label-md text-label-md">Add Meeting</span>
        </button>

        <button
          onClick={onGenerateSummary}
          className="flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-all active:scale-95 text-left cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary-container">auto_awesome</span>
          <span className="font-label-md text-label-md">✨ Generate Daily Summary</span>
        </button>
      </div>

      {/* Critical Daily Metrics Banner (4 responsive grid KPI cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
        {/* Overdue Tasks */}
        <div
          onClick={() => {
            setFilterMode('p1');
            onShowToast('Filtered view to critical overdue tasks');
          }}
          className="flex flex-col p-3 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-surface-container"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-error" />
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Overdue Tasks
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" /> Urgent
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-error font-bold tabular-nums">
              3
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">delays</span>
          </div>
          <span className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">error</span> Action required
          </span>
        </div>

        {/* Today's Tasks */}
        <div
          onClick={() => {
            setFilterMode('all');
            onShowToast('Showing all 8 scheduled tasks for today');
          }}
          className="flex flex-col p-3 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-surface-container"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Today's Tasks
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-[10px] font-bold">
              Active
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tabular-nums">
              8
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">scheduled</span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">priority_high</span> 2 high priority
          </span>
        </div>

        {/* Pending Follow-ups */}
        <div
          onClick={() => onNavigateToTab('tasks')}
          className="flex flex-col p-3 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-surface-container"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-surface-tint" />
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Follow-ups
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px]">
              Queue
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tabular-nums">
              5
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">pending</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-[13px]">schedule</span> 3 awaiting replies
          </span>
        </div>

        {/* High-Priority Risks */}
        <div
          onClick={() => onNavigateToTab('raid')}
          className="flex flex-col p-3 rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-surface-container"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-error" />
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Active Risks
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10px] font-bold">
              RAID P1
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-error font-bold tabular-nums">
              2
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">unmitigated</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-[13px] text-error">shield</span> CRM & Cloud
          </span>
        </div>
      </div>

      {/* AI Daily Briefing & Alert Card */}
      {!briefingDismissed && (
        <div
          className={`flex flex-col rounded-xl bg-surface-container-low p-4 shadow-sm relative overflow-hidden transition-all border border-surface-container-high ${
            briefingDispatched ? 'opacity-70' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">neurology</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    AI Coordinator Insight
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[10px] font-bold">
                    Copilot
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Predictive schedule blocker analysis
                </span>
              </div>
            </div>

            <button
              aria-label="Toggle Details"
              onClick={() => setBriefingOpen(!briefingOpen)}
              className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer transition-transform"
            >
              <span
                className="material-symbols-outlined text-[20px] transition-transform"
                style={{ transform: briefingOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
              >
                expand_less
              </span>
            </button>
          </div>

          {briefingOpen && (
            <div className="mt-3 flex flex-col space-y-2.5">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                <span className="font-semibold text-error">2 critical blockers identified</span> on{' '}
                <strong>CRM Upgrade UAT sign-off</strong>. The integration test run failed on Oracle DB delta exports.
                Stakeholder follow-up has been pre-drafted for <strong>Marcus Vance (Principal Architect)</strong> with
                recommended fallback paths.
              </p>

              <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-start gap-2 text-on-surface-variant border border-surface-container">
                <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">mail</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                    Draft: UAT Blocker Resolution & Gate 3 Schedule Impact
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                    "Marcus, please confirm schema realignment patch deployment ETA before 14:00..."
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleApproveSend}
                  disabled={briefingDispatched}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg font-label-md text-label-md transition-all active:scale-95 cursor-pointer font-semibold ${
                    briefingDispatched
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-secondary text-on-secondary hover:bg-secondary/90'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {briefingDispatched ? 'check' : 'send'}
                  </span>
                  <span>{briefingDispatched ? 'Dispatched to Outlook & Teams' : 'Approve & Send (1-tap)'}</span>
                </button>

                <button
                  onClick={() => {
                    setBriefingDismissed(true);
                    onShowToast('AI Briefing dismissed for today.', true);
                  }}
                  className="px-3 h-9 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant active:scale-95 transition-all font-label-md text-label-md cursor-pointer"
                  type="button"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 'My Tasks & Coordination Radar' (Comprehensive Interactive Mobile Card List) */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-secondary">checklist_rtl</span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Coordination Radar
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-0.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'text-on-surface bg-surface-container-lowest shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilterMode('p1')}
              className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm transition-colors cursor-pointer ${
                filterMode === 'p1'
                  ? 'text-on-surface bg-surface-container-lowest shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              P1 Critical
            </button>
          </div>
        </div>

        {/* Task List Container */}
        <div className="flex flex-col space-y-2.5">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'Done';
            return (
              <div
                key={task.id}
                className={`flex flex-col p-3.5 rounded-xl bg-surface-container-lowest shadow-sm space-y-2.5 border border-surface-container transition-all ${
                  isDone ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">
                      {task.project}
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant font-mono">
                      {task.code}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${
                        task.priority === 'P1'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {task.priorityLabel}
                    </span>
                  </div>

                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-[10px] font-semibold ${
                      task.status === 'Blocked'
                        ? 'bg-error text-on-error'
                        : task.status === 'In Progress'
                        ? 'bg-surface-container-high text-secondary'
                        : task.status === 'Done'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {task.status === 'Blocked' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-on-error animate-ping" />
                    )}
                    {task.status === 'In Progress' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    )}
                    {task.status}
                  </span>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-semibold">
                    {task.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Owner: <strong className="text-on-surface">{task.owner}</strong> ({task.ownerRole}) · Due:{' '}
                    <span className={task.isOverdue ? 'text-error font-semibold' : 'text-secondary font-medium'}>
                      {task.dueDate}
                    </span>
                  </p>
                </div>

                {/* Dependency & Next Action Callout */}
                <div className="p-2 rounded-lg bg-surface-container-low flex flex-col space-y-1">
                  {task.dependency && (
                    <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[15px] text-error">link_off</span>
                      <span>
                        Dependency: <strong className="text-on-surface">{task.dependency}</strong>
                      </span>
                    </div>
                  )}
                  {task.nextAction && (
                    <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
                      <span className="material-symbols-outlined text-[15px] text-secondary">arrow_forward</span>
                      <span>Next Action: {task.nextAction}</span>
                    </div>
                  )}
                </div>

                {/* One-Tap Action Toolbar */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    onClick={() => handlePing(task)}
                    className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant active:scale-95 transition-all cursor-pointer font-semibold text-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">notifications_active</span>
                    <span>Ping Owner</span>
                  </button>

                  <button
                    onClick={() => handleReschedule(task)}
                    className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant active:scale-95 transition-all cursor-pointer text-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">update</span>
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => onTaskDone(task.id)}
                    className="px-3 flex items-center justify-center gap-1 h-8 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary hover:text-on-secondary active:scale-95 transition-all cursor-pointer text-xs font-semibold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Done</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Follow-ups & 'Waiting For' (Summary Snippet) */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">hourglass_top</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Pending Follow-ups & 'Waiting For'
            </h2>
          </div>
          <span
            onClick={() => onNavigateToTab('tasks')}
            className="font-label-sm text-label-sm text-secondary cursor-pointer hover:underline font-semibold"
          >
            View All ({waitingItems.length})
          </span>
        </div>

        <div className="flex flex-col space-y-2">
          {waitingItems.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex items-start justify-between gap-3 border border-surface-container"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold ${
                    item.urgency === 'critical'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {item.urgency === 'critical' ? 'security' : 'gavel'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`font-label-sm text-label-sm font-semibold ${
                        item.urgency === 'critical' ? 'text-error' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.followUpTarget}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      · {item.waitingForParty}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleNudge(item.waitingForParty, item.title)}
                className="px-3 py-1 rounded-md bg-surface-container text-secondary hover:bg-surface-variant font-label-sm text-label-sm active:scale-95 transition-all cursor-pointer font-semibold"
                type="button"
              >
                Nudge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines & Pending Approvals */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-secondary">approval_delegation</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Upcoming Deadlines & Gate Approvals
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {gateApprovals.map((gate) => (
            <div
              key={gate.id}
              className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-surface-container"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-surface-container text-secondary flex-shrink-0">
                  <span className="font-label-sm text-[10px] uppercase font-bold">{gate.dateMonth}</span>
                  <span className="font-headline-sm text-[16px] font-bold leading-none">{gate.dateDay}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold truncate">
                    {gate.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {gate.subtitle}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm whitespace-nowrap font-medium">
                {gate.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Project Activity Feed (Coordinator Audit Log) */}
      <div className="flex flex-col space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history_toggle_off</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Coordinator Audit Log
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Live telemetry</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col space-y-3 border border-surface-container">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.colorClass}`} />
              <div className="flex flex-col min-w-0 flex-1">
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-medium text-on-surface">{log.author}</strong> {log.action}{' '}
                  {log.codeSnippet && (
                    <code className="font-code-sm text-code-sm bg-surface-container px-1 py-0.5 rounded font-mono">
                      {log.codeSnippet}
                    </code>
                  )}
                </p>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  {log.timeAgo} · {log.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
