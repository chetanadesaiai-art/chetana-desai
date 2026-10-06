import React from 'react';
import { ProjectItem } from '../types/pmo';

interface PmoReportsViewProps {
  projects: ProjectItem[];
  onShowToast: (message: string) => void;
}

export const PmoReportsView: React.FC<PmoReportsViewProps> = ({ projects, onShowToast }) => {
  const handleExport = (type: string) => {
    onShowToast(`Generating and bundling ${type} for SteerCo presentation... Done!`);
  };

  return (
    <div className="flex flex-col w-full gap-space-md max-w-4xl mx-auto pb-14">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Executive PMO Reports
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Q4 Steering Committee briefings, capital allocations & audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF Deck')}
            className="h-9 px-3.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('Excel Pack')}
            className="h-9 px-3.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary/90 font-label-md text-label-md flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>Excel PMO Pack</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            CAPEX / OPEX Budget Adherence
          </span>
          <span className="font-code-sm text-code-sm bg-surface-container text-secondary px-2 py-0.5 rounded font-mono font-bold">
            $14,820,000 / $15,200,000 (97.5%)
          </span>
        </div>

        <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden flex gap-0.5">
          <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: '67%' }} />
          <div className="bg-amber-500 h-full" style={{ width: '22%' }} />
          <div className="bg-error h-full rounded-r-full" style={{ width: '11%' }} />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-lg bg-surface-container-low text-center border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Forecast Variance</span>
            <span className="block font-headline-sm text-headline-sm text-emerald-600 font-bold mt-0.5">
              -$380,000
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-container-low text-center border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Allocated FTEs</span>
            <span className="block font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
              64.2 FTE
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-container-low text-center border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Burn Velocity</span>
            <span className="block font-headline-sm text-headline-sm text-secondary font-bold mt-0.5">
              91.4%
            </span>
          </div>
        </div>
      </div>

      {/* Project Status Summary Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
        <div className="p-3.5 border-b border-surface-container flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Portfolio Health Matrix
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Live Telemetry Sync: 2m ago
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm text-body-sm">
            <thead className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border-b border-surface-container">
              <tr>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Lead PM</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Progress</th>
                <th className="py-2.5 px-3">Go-Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">{proj.name}</span>
                      <span className="font-code-sm text-[11px] text-on-surface-variant font-mono">
                        {proj.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant">{proj.pmName}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        proj.health === 'green'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.health === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {proj.healthLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-on-surface">
                    {proj.progressPercent}%
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant font-medium">
                    {proj.goLiveDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
