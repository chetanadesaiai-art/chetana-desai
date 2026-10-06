import React, { useState } from 'react';
import { ProjectItem } from '../types/pmo';

interface MilestonesViewProps {
  projects: ProjectItem[];
  onShowToast: (message: string) => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({ projects, onShowToast }) => {
  const [filterProject, setFilterProject] = useState('All');

  const milestones = [
    {
      id: 'm-1',
      project: 'CRM Upgrade',
      code: 'PRJ-2041',
      title: 'Phase 3 - UAT User Sign-Off',
      targetDate: 'Nov 15, 2024',
      status: 'At Risk',
      progress: 74,
      rag: 'amber',
      gate: 'Gate 3 Governance Review',
      owner: 'Elena Rostova',
    },
    {
      id: 'm-2',
      project: 'Cloud Migration',
      code: 'PRJ-1904',
      title: 'Prod DB Replication Cluster Validation',
      targetDate: 'Oct 31, 2024',
      status: 'On Track',
      progress: 88,
      rag: 'green',
      gate: 'Change Advisory Board CR-8841',
      owner: 'Marcus Vance',
    },
    {
      id: 'm-3',
      project: 'Teams Migration',
      code: 'PRJ-2287',
      title: 'Tenant Federation & PSTN Cutover',
      targetDate: 'Dec 12, 2024',
      status: 'Delayed (-18d)',
      progress: 42,
      rag: 'red',
      gate: 'Telco Interconnect Gate',
      owner: 'Sarah Chen',
    },
    {
      id: 'm-4',
      project: 'Service Desk',
      code: 'PRJ-2410',
      title: 'Staff Training & Enterprise Cutover',
      targetDate: 'Oct 20, 2024',
      status: 'On Track',
      progress: 95,
      rag: 'green',
      gate: 'Operational Readiness Review (ORR)',
      owner: 'Jordan Patel',
    },
  ];

  const filtered = filterProject === 'All'
    ? milestones
    : milestones.filter(m => m.project === filterProject);

  return (
    <div className="flex flex-col w-full gap-space-md max-w-4xl mx-auto pb-14">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Milestones & Gate Approvals
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Critical path delivery timeline and Stage-Gate governance checkpoints
          </p>
        </div>

        <button
          onClick={() => onShowToast('Exported Milestone Critical Path timeline to MS Project / Gantt format')}
          className="h-9 px-3.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined text-[16px]">timeline</span>
          <span>Gantt Export</span>
        </button>
      </div>

      {/* Project Selector Filter */}
      <div className="flex gap-space-xs overflow-x-auto no-scrollbar py-0.5">
        {['All', 'CRM Upgrade', 'Cloud Migration', 'Teams Migration', 'Service Desk'].map(p => (
          <button
            key={p}
            onClick={() => setFilterProject(p)}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors cursor-pointer font-semibold ${
              filterProject === p
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Milestones Timeline Stream */}
      <div className="flex flex-col gap-space-sm relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-container-high">
        {filtered.map(item => (
          <div
            key={item.id}
            className="flex items-start gap-3 pl-1 relative"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ring-4 ring-background ${
                item.rag === 'green'
                  ? 'bg-emerald-500 text-white'
                  : item.rag === 'amber'
                  ? 'bg-amber-500 text-white'
                  : 'bg-error text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {item.rag === 'green' ? 'check' : item.rag === 'amber' ? 'hourglass_top' : 'priority_high'}
              </span>
            </div>

            <div className="flex-1 p-space-md rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-mono font-bold">
                    {item.code}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {item.project}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                    item.rag === 'green'
                      ? 'bg-emerald-50 text-emerald-800'
                      : item.rag === 'amber'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {item.title}
              </h3>

              {/* Progress bar */}
              <div className="w-full flex items-center gap-space-sm">
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.rag === 'green'
                        ? 'bg-emerald-500'
                        : item.rag === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-error'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="font-code-sm text-code-sm text-on-surface font-bold min-w-[32px] text-right font-mono">
                  {item.progress}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-body-sm text-body-sm text-on-surface-variant flex-wrap gap-2 border-t border-surface-container">
                <div>
                  Target Go-Live: <strong className="text-on-surface">{item.targetDate}</strong>
                </div>
                <div>
                  Governance Gate: <strong className="text-secondary">{item.gate}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
