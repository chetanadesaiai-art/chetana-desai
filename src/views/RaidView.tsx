import React, { useState } from 'react';
import { RaidItem } from '../types/pmo';

interface RaidViewProps {
  raidItems: RaidItem[];
  onLogRisk: () => void;
  onShowToast: (message: string, isAlert?: boolean) => void;
}

export const RaidView: React.FC<RaidViewProps> = ({ raidItems, onLogRisk, onShowToast }) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRag, setSelectedRag] = useState<string>('All');
  const [items, setItems] = useState<RaidItem[]>(raidItems);

  const filteredItems = items.filter(item => {
    if (selectedType !== 'All' && item.type !== selectedType) return false;
    if (selectedRag !== 'All' && item.rag !== selectedRag) return false;
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: 'Open' | 'Mitigating' | 'Resolved') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    onShowToast(`Updated RAID item ${id} status to ${newStatus}`);
  };

  return (
    <div className="flex flex-col w-full gap-space-md max-w-4xl mx-auto pb-14">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            RAID Register & Governance
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Risks, Assumptions, Issues & Dependencies tracking
          </p>
        </div>

        <button
          onClick={onLogRisk}
          className="h-10 px-4 rounded-xl bg-error text-on-error font-label-md text-label-md flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">add_alert</span>
          <span>+ Log RAID Item</span>
        </button>
      </div>

      {/* Risk Heatmap Summary */}
      <div className="grid grid-cols-3 gap-space-sm">
        <div className="p-3.5 rounded-xl bg-error-container/50 border border-error/30 flex flex-col">
          <span className="font-label-sm text-label-sm text-error font-bold uppercase tracking-wider">
            Critical (P1 Red)
          </span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-error font-bold mt-1 tabular-nums">
            {items.filter(i => i.rag === 'Red').length}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Require SteerCo action
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex flex-col">
          <span className="font-label-sm text-label-sm text-amber-800 font-bold uppercase tracking-wider">
            Amber (P2 Watch)
          </span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-amber-700 font-bold mt-1 tabular-nums">
            {items.filter(i => i.rag === 'Amber').length}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Active mitigation in progress
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col">
          <span className="font-label-sm text-label-sm text-emerald-800 font-bold uppercase tracking-wider">
            Green (Monitored)
          </span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-emerald-700 font-bold mt-1 tabular-nums">
            {items.filter(i => i.rag === 'Green').length}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Within tolerances
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
        {['All', 'Risk', 'Issue', 'Dependency', 'Assumption'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedType(tab)}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer font-semibold ${
              selectedType === tab
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RAID Cards List */}
      <div className="flex flex-col gap-space-sm">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs border border-surface-container hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-space-sm flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-2 py-0.5 rounded font-mono font-bold">
                  {item.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                  {item.project}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                    item.rag === 'Red'
                      ? 'bg-error text-on-error'
                      : item.rag === 'Amber'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.severity} ({item.rag})
                </span>
              </div>

              <div className="flex items-center gap-1">
                {(['Open', 'Mitigating', 'Resolved'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(item.id, st)}
                    className={`px-2 py-0.5 rounded font-label-sm text-[11px] cursor-pointer transition-colors ${
                      item.status === st
                        ? 'bg-secondary text-on-secondary font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              {item.title}
            </h3>

            <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col space-y-1 text-body-sm text-body-sm border border-surface-container">
              <div>
                <strong className="text-on-surface">Impact: </strong>
                <span className="text-on-surface-variant">{item.impact}</span>
              </div>
              <div>
                <strong className="text-on-surface">Mitigation Plan: </strong>
                <span className="text-secondary font-medium">{item.mitigationPlan}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-label-sm text-label-sm text-on-surface-variant">
              <span>Owner: <strong className="text-on-surface">{item.owner}</strong></span>
              <button
                onClick={() => onShowToast(`Escalation docket created for RAID item ${item.id}`, true)}
                className="text-secondary hover:underline cursor-pointer font-semibold"
              >
                Escalate to SteerCo →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
