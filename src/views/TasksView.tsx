import React, { useState, useMemo } from 'react';
import { TaskItem, WaitingItem } from '../types/pmo';

interface TasksViewProps {
  tasks: TaskItem[];
  waitingItems: WaitingItem[];
  onShowToast: (message: string, isAlert?: boolean, actionLabel?: string, onAction?: () => void) => void;
  onAddTask: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  waitingItems,
  onShowToast,
  onAddTask,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'followup' | 'overdue'>('waiting');
  const [groupBy, setGroupBy] = useState<'project' | 'owner' | 'followup'>('project');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescending, setSortDescending] = useState(false);
  const [selectedTaskForDrafter, setSelectedTaskForDrafter] = useState<TaskItem | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (activeTab === 'overdue' && !task.isOverdue) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          task.owner.toLowerCase().includes(q) ||
          task.project.toLowerCase().includes(q) ||
          task.code.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, activeTab, searchQuery]);

  const handlePushNudge = () => {
    onShowToast('Teams ping & escalation note dispatched to Greg Morrison (Security Board).');
  };

  const handleNudgeTeams = (target: string) => {
    onShowToast(`Interactive Teams adaptive card nudge delivered to ${target}.`);
  };

  const handleEscalatePm = (code: string) => {
    onShowToast(`High-priority escalation flag attached to ${code} for Lead PM Marcus Vance.`, true);
  };

  const handleFollowUpCall = (party: string) => {
    onShowToast(`Logged outbound vendor phone call with ${party}. Follow-up reminder set.`);
  };

  const handleWalkthrough = (person: string) => {
    onShowToast(`10-Minute Walkthrough calendar invite dispatched to ${person}.`);
  };

  return (
    <div className="flex flex-col w-full pb-14 space-y-space-md max-w-4xl mx-auto">
      {/* AI Sentinel Pulse Bar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md shadow-sm border border-surface-container-highest">
        <div className="flex items-start justify-between gap-space-sm flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Coordination Radar
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[10px] uppercase tracking-wider font-bold">
                  3 at Risk
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                Greg Morrison hasn’t responded in 48h for <span className="font-medium text-on-surface">Cloud Migration</span> firewall approval. Auto-nudge drafted.
              </p>
            </div>
          </div>

          <button
            onClick={handlePushNudge}
            className="h-8 px-space-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-1 shadow-sm active:scale-95 transition-transform flex-shrink-0 cursor-pointer font-semibold hover:bg-surface-container-high hover:text-on-surface"
            id="quick-resolve-btn"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Push Nudge</span>
          </button>
        </div>
      </div>

      {/* Segmented Tabs Filter Bar (Horizontal Scrollable) */}
      <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap cursor-pointer font-semibold ${
            activeTab === 'all'
              ? 'bg-secondary-container text-on-secondary-container shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container border border-surface-container'
          }`}
        >
          All Tasks <span className="ml-1 text-on-surface-variant/70 font-code-sm text-code-sm font-mono">34</span>
        </button>

        <button
          onClick={() => setActiveTab('waiting')}
          className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer font-semibold ${
            activeTab === 'waiting'
              ? 'bg-secondary-container text-on-secondary-container shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container border border-surface-container'
          }`}
        >
          <span>Waiting For</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface-container-lowest text-secondary font-code-sm text-[11px] font-bold font-mono">
            8
          </span>
          <span className="w-2 h-2 rounded-full bg-error animate-ping" />
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap cursor-pointer font-semibold ${
            activeTab === 'followup'
              ? 'bg-secondary-container text-on-secondary-container shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container border border-surface-container'
          }`}
        >
          Follow-up Schedule <span className="ml-1 text-on-surface-variant/70 font-code-sm text-code-sm font-mono">12</span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap cursor-pointer font-semibold ${
            activeTab === 'overdue'
              ? 'bg-secondary-container text-on-secondary-container shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container border border-surface-container'
          }`}
        >
          Overdue <span className="ml-1 text-error font-code-sm text-code-sm font-bold font-mono">4</span>
        </button>
      </div>

      {/* Search & Grouping Controls */}
      <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined text-outline absolute left-3 text-[18px]">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-9 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:bg-surface-container transition-all border border-surface-container"
            placeholder="Filter by task, owner, or blocker..."
            type="text"
          />
          <button
            onClick={() => onShowToast('Voice filter listening... Say a task name or owner')}
            className="absolute right-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
            title="Voice Search"
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Group By:</span>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded-lg border border-surface-container">
            <button
              onClick={() => setGroupBy('project')}
              className={`px-2 py-1 rounded font-label-sm text-label-sm cursor-pointer ${
                groupBy === 'project'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Project
            </button>
            <button
              onClick={() => setGroupBy('owner')}
              className={`px-2 py-1 rounded font-label-sm text-label-sm cursor-pointer ${
                groupBy === 'owner'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => setGroupBy('followup')}
              className={`px-2 py-1 rounded font-label-sm text-label-sm cursor-pointer ${
                groupBy === 'followup'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Follow-up
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Dedicated Stakeholder "WAITING FOR" Queue */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-error" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Waiting On External Parties
            </h2>
            <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container text-secondary font-bold font-mono">
              2 Critical
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Active Handoffs</span>
        </div>

        {/* Waiting Items List */}
        <div className="flex flex-col space-y-space-sm">
          {waitingItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col space-y-space-sm border border-surface-container"
            >
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-bold font-mono">
                      {item.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface font-label-sm text-label-sm font-medium">
                      {item.project}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        item.urgency === 'critical'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.urgency === 'critical' ? 'bg-error' : 'bg-outline'
                        }`}
                      />
                      {item.statusText}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1.5 leading-snug font-semibold">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => onShowToast(`Action options for ${item.code}`)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
                  aria-label="Options"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>

              {/* Detail Matrix */}
              <div className="bg-surface-container-low rounded-lg p-space-sm grid grid-cols-2 gap-space-xs font-body-sm text-body-sm border border-surface-container">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Waiting For (Party)
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-surface-dim text-on-surface flex items-center justify-center font-label-sm text-[10px] font-bold">
                      {item.partyAvatarText}
                    </div>
                    <span className="font-medium text-on-surface truncate">{item.waitingForParty}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Follow-up Target
                  </span>
                  <span
                    className={`font-medium mt-0.5 flex items-center gap-1 ${
                      item.urgency === 'critical' ? 'text-error' : 'text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {item.urgency === 'critical' ? 'alarm' : 'event'}
                    </span>
                    {item.followUpTarget}
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center gap-space-xs pt-1">
                {item.code === '#CM-409' ? (
                  <>
                    <button
                      onClick={() => handleNudgeTeams('Greg Morrison (Security Board)')}
                      className="flex-1 h-9 px-2 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-secondary-container transition-colors shadow-xs cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>Nudge via Teams</span>
                    </button>
                    <button
                      onClick={() => handleEscalatePm(item.code)}
                      className="h-9 px-3 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-variant transition-colors cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px] text-error">flag</span>
                      <span>Escalate PM</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleFollowUpCall(item.waitingForParty)}
                      className="flex-1 h-9 px-2 bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-variant transition-colors shadow-xs cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">phone_in_talk</span>
                      <span>Log Follow-up Call</span>
                    </button>
                    <button
                      onClick={() => onShowToast(`Scheduled follow-up reminder for ${item.code}`)}
                      className="h-9 px-3 bg-surface-container text-on-surface-variant rounded-lg font-label-md text-label-md flex items-center justify-center hover:bg-surface-variant cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">schedule_send</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Master Execution Tasks */}
      <div className="flex flex-col space-y-space-sm pt-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Deliverables & Workstreams
            </h2>
            <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono font-medium">
              Active Sprint
            </span>
          </div>

          <button
            onClick={() => {
              setSortDescending(!sortDescending);
              onShowToast(`Sorted tasks ${sortDescending ? 'ascending' : 'descending'} by deadline`);
            }}
            className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            <span>Sort by Due Date</span>
            <span
              className="material-symbols-outlined text-[14px] transition-transform"
              style={{ transform: sortDescending ? 'rotate(180deg)' : 'none' }}
            >
              arrow_downward
            </span>
          </button>
        </div>

        {/* Task Card 1: CRM-103 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative flex flex-col space-y-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-bold font-mono">
                #CRM-103
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">
                CRM Upgrade
              </span>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">
                P1 - High
              </span>
            </div>

            <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface font-medium">In Progress</span>
            </div>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-semibold">
              Run Dry-Run ETL Data Migration Validation Script
            </h3>
            <div className="flex items-center gap-2 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                <span className="text-on-surface font-medium">David Kim</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">(Lead DBA)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-xs py-1">
            <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-outline text-[16px]">calendar_month</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                  Timeframe
                </span>
                <span className="font-code-sm text-code-sm text-on-surface font-medium truncate font-mono">
                  Oct 01 → Oct 09
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-outline text-[16px]">notifications_active</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                  Follow-up Target
                </span>
                <span className="font-code-sm text-code-sm text-on-surface font-medium truncate font-mono">
                  Oct 09, 9:00 AM
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg border border-surface-container-high">
            <span className="material-symbols-outlined text-[16px] text-secondary">link</span>
            <span className="font-body-sm text-body-sm text-on-surface truncate">
              <span className="text-on-surface-variant">Depends on:</span> Staging Schema Freeze (
              <span className="font-code-sm text-code-sm text-secondary font-semibold font-mono">#CR-102</span>)
            </span>
          </div>

          <div className="rounded-lg bg-surface-container-low p-2.5 flex flex-col space-y-1 border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">history</span>
                Last Update · 3 hrs ago by D. Kim
              </span>
              <span className="font-code-sm text-code-sm text-secondary font-semibold font-mono">Verified</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface italic leading-normal">
              “ETL dry run completed with 3 minor field mapping warnings.”
            </p>
          </div>

          <div className="flex items-start gap-2 bg-surface-container-high/60 p-2.5 rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">arrow_forward</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Immediate Next Action
              </span>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">
                Resolve address zip code parser syntax
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 gap-space-xs">
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>
                Waiting For: <strong className="text-on-surface font-semibold">None (Active)</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-space-xs pt-1">
            <button
              onClick={() => onShowToast('Task status synced to Confluence & Jira boards.')}
              className="h-9 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-variant transition-colors cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Status</span>
            </button>

            <button
              onClick={() => onShowToast('Audit note appended: Validation run logged.')}
              className="h-9 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-variant transition-colors cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Note</span>
            </button>

            <button
              onClick={() => onShowToast('AI Drafter: Generated status summary and patch recommendation for David Kim.')}
              className="h-9 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center justify-center gap-1 shadow-xs hover:bg-secondary transition-colors cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>AI Drafter</span>
            </button>
          </div>
        </div>

        {/* Task Card 2: MT-214 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative flex flex-col space-y-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-bold font-mono">
                #MT-214
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface font-label-sm text-label-sm font-medium">
                Teams Migration
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                P2 - Medium
              </span>
            </div>

            <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm text-on-surface font-medium">Handoff Review</span>
            </div>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-semibold">
              Batch 4 VoIP SIP Trunk Cutover Verification
            </h3>
            <div className="flex items-center gap-2 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                <span className="text-on-surface font-medium">Elena Rostova</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">(Telecom Specialist)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-xs py-1">
            <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-outline text-[16px]">calendar_month</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                  Due Date
                </span>
                <span className="font-code-sm text-code-sm text-on-surface font-medium font-mono">Oct 11, 2024</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-outline text-[16px]">notifications_active</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                  Follow-up Target
                </span>
                <span className="font-code-sm text-code-sm text-secondary font-medium font-mono">
                  Tomorrow 11:30 AM
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg border border-surface-container-high">
            <span className="material-symbols-outlined text-[16px] text-secondary">link</span>
            <span className="font-body-sm text-body-sm text-on-surface truncate">
              <span className="text-on-surface-variant">Blocker:</span> Telco carrier route verification sign-off
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Follow-up #1 scheduled</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowToast('Follow-up call logged for Elena Rostova.')}
                className="h-8 px-2.5 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-1 hover:bg-surface-variant cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Follow-up</span>
              </button>
              <button
                onClick={() => onShowToast('Opened task review docket for MT-214')}
                className="h-8 px-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-1 cursor-pointer font-semibold hover:bg-surface-container-high hover:text-on-surface"
              >
                <span>Review Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Card 3: SD-044 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative flex flex-col space-y-space-sm border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-bold font-mono">
                #SD-044
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                Service Desk
              </span>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                P1 - High
              </span>
            </div>

            <div className="flex items-center gap-1 bg-error-container px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="font-label-sm text-label-sm text-on-error-container font-semibold">Action Overdue</span>
            </div>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-semibold">
              Tier 1 Incident Escalation Playbook Sign-off
            </h3>
            <div className="flex items-center gap-2 mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                <span className="text-on-surface font-medium">Marcus Vance</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">(Ops Director)</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-surface-container-low p-2.5 flex flex-col space-y-1 border border-surface-container">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>Stalled 4 days</span>
              <span className="text-error font-medium">Requires Coordinator Escalation</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-snug">
              Marcus requested revisions to Section 4.2 (Outage Bridge Activation) on Friday. Revised draft waiting on his desk.
            </p>
          </div>

          <div className="flex items-center gap-space-xs pt-1">
            <button
              onClick={() => handleWalkthrough('Marcus Vance')}
              className="flex-1 h-9 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 shadow-xs cursor-pointer font-semibold hover:bg-secondary/90"
            >
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              <span>Schedule 10-Min Walkthrough</span>
            </button>
            <button
              onClick={() => onShowToast('Escalated to PMO Steering Committee docket.')}
              className="h-9 px-3 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center hover:bg-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">more_horiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
