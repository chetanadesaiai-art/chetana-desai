import React, { useState, useMemo } from 'react';
import { ProjectItem } from '../types/pmo';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onOpenNewProject: () => void;
  onShowToast: (message: string, isAlert?: boolean) => void;
  onNavigateToTab: (tab: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenNewProject,
  onShowToast,
  onNavigateToTab,
}) => {
  const [pulseDismissed, setPulseDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'amber' | 'red' | 'green'>('all');
  const [selectedDept, setSelectedDept] = useState('Enterprise IT');
  const [selectedPm, setSelectedPm] = useState('PM: All Leads');
  const [selectedPriority, setSelectedPriority] = useState('Priority: P1 & P2');
  const [expandedDrawer, setExpandedDrawer] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status filter
      if (statusFilter !== 'all' && project.health !== statusFilter) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesCode = project.code.toLowerCase().includes(query);
        const matchesPm = project.pmName.toLowerCase().includes(query);
        const matchesDept = project.department.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesPm && !matchesDept) {
          return false;
        }
      }
      // PM dropdown filter
      if (selectedPm !== 'PM: All Leads' && !project.pmName.includes(selectedPm)) {
        return false;
      }
      return true;
    });
  }, [projects, statusFilter, searchQuery, selectedPm]);

  const toggleDrawer = (id: string) => {
    setExpandedDrawer(prev => (prev === id ? null : id));
  };

  const handleDownload = (format: 'PDF' | 'Excel') => {
    onShowToast(`Compiling Executive PMO Portfolio Pack in ${format} format... Generated!`);
  };

  return (
    <div className="flex flex-col w-full gap-space-md max-w-4xl mx-auto pb-12">
      {/* AI Executive Pulse Alert */}
      {!pulseDismissed && (
        <div className="bg-surface-container-high rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col gap-space-xs border border-surface-container-highest">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-secondary">auto_awesome</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                AI Portfolio Coordinator
              </span>
            </div>
            <span className="font-code-sm text-code-sm text-on-surface-variant font-mono">
              Live Sync: 09:41 AM
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface">
            Two critical path milestones conflict across{' '}
            <span className="font-semibold text-on-surface">Cloud Migration</span> and{' '}
            <span className="font-semibold text-on-surface">MS Teams Federation</span>. Vendor cutover scheduled within 48h.
          </p>

          <div className="flex items-center gap-space-xs pt-space-xs">
            <button
              onClick={() => {
                onShowToast('AI Orchestrator: Re-allocation proposal staged for Sarah Chen & Marcus Vance.');
              }}
              className="h-8 px-space-md bg-secondary text-on-secondary rounded-lg font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform cursor-pointer font-semibold shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Auto-Reconcile Schedule</span>
            </button>

            <button
              onClick={() => setPulseDismissed(true)}
              className="h-8 px-space-sm text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm cursor-pointer"
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-10 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:bg-surface-container transition-colors border border-surface-container"
            placeholder="Search 18 IT Projects, PMs, or IDs..."
            type="search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-on-surface-variant hover:text-on-surface cursor-pointer"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Status Category Tabs */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm transition-all cursor-pointer font-semibold ${
              statusFilter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All Projects ({projects.length})
          </button>

          <button
            onClick={() => setStatusFilter('amber')}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer font-semibold ${
              statusFilter === 'amber'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            At Risk (4)
          </button>

          <button
            onClick={() => setStatusFilter('red')}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer font-semibold ${
              statusFilter === 'red'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-error mr-1.5" />
            Delayed (2)
          </button>

          <button
            onClick={() => setStatusFilter('green')}
            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all cursor-pointer font-semibold ${
              statusFilter === 'green'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            On Track (12)
          </button>
        </div>

        {/* Dropdown Metadata Filters */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pt-1">
          <div className="relative flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg flex-shrink-0 border border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant mr-1.5">domain</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent font-label-sm text-label-sm text-on-surface outline-none cursor-pointer pr-4 appearance-none"
            >
              <option>Enterprise IT</option>
              <option>Cloud Infrastructure</option>
              <option>Cybersecurity</option>
              <option>Customer Experience</option>
            </select>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant absolute right-1.5 pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg flex-shrink-0 border border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant mr-1.5">person</span>
            <select
              value={selectedPm}
              onChange={(e) => setSelectedPm(e.target.value)}
              className="bg-transparent font-label-sm text-label-sm text-on-surface outline-none cursor-pointer pr-4 appearance-none"
            >
              <option>PM: All Leads</option>
              <option>Elena Rostova</option>
              <option>Marcus Vance</option>
              <option>Sarah Chen</option>
              <option>Jordan Patel</option>
            </select>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant absolute right-1.5 pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg flex-shrink-0 border border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant mr-1.5">flag</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent font-label-sm text-label-sm text-on-surface outline-none cursor-pointer pr-4 appearance-none"
            >
              <option>Priority: P1 & P2</option>
              <option>P1 - Blocker Critical</option>
              <option>P2 - High Delivery</option>
              <option>P3 - Moderate</option>
            </select>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant absolute right-1.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Executive Portfolio Health Meter */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-surface-container">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">donut_large</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Portfolio Health
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-code-sm text-code-sm text-secondary bg-surface-container px-2.5 py-1 rounded-md font-mono">
            <span className="font-bold">$14.8M / $15.2M</span>
            <span className="text-on-surface-variant font-label-sm font-sans">(97% Adherence)</span>
          </div>
        </div>

        {/* Segmented Health Bar */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex gap-0.5">
            <div
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
              style={{ width: '67%' }}
              title="67% On Track"
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: '22%' }}
              title="22% At Risk"
            />
            <div
              className="h-full bg-error rounded-r-full transition-all duration-500"
              style={{ width: '11%' }}
              title="11% Delayed"
            />
          </div>

          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant px-0.5">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                12 Green <span className="font-semibold text-on-surface">67%</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>
                4 Amber <span className="font-semibold text-on-surface">22%</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span>
                2 Red <span className="font-semibold text-on-surface">11%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Swipeable Metric Mini-Chips */}
        <div className="flex gap-space-sm overflow-x-auto no-scrollbar pt-space-xs">
          <div className="flex flex-col bg-surface-container-low p-space-sm rounded-lg min-w-[124px] flex-shrink-0 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Active Milestones</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tabular-nums">38</span>
              <span className="font-label-sm text-label-sm text-emerald-600 font-semibold">8 Due Wk</span>
            </div>
          </div>

          <div className="flex flex-col bg-surface-container-low p-space-sm rounded-lg min-w-[124px] flex-shrink-0 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Critical RAID</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-sm text-headline-sm text-error font-bold tabular-nums">7</span>
              <span className="font-label-sm text-label-sm text-error font-semibold">+2 New</span>
            </div>
          </div>

          <div className="flex flex-col bg-surface-container-low p-space-sm rounded-lg min-w-[124px] flex-shrink-0 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Avg Burn Rate</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tabular-nums">91.4%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">On Plan</span>
            </div>
          </div>

          <div className="flex flex-col bg-surface-container-low p-space-sm rounded-lg min-w-[124px] flex-shrink-0 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Allocated FTEs</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tabular-nums">64</span>
              <span className="font-label-sm text-label-sm text-amber-600 font-semibold">89% Cap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-space-xs px-0.5">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Portfolios</span>
          <span className="bg-surface-container text-secondary font-code-sm text-code-sm px-2 py-0.5 rounded-full font-bold">
            {filteredProjects.length} of {projects.length} shown
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            aria-label="Sort projects"
            onClick={() => onShowToast('Sorted projects by critical path urgency')}
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant flex items-center justify-center hover:bg-surface-container shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>
          <button
            aria-label="Compact grid toggle"
            onClick={() => onShowToast('Switched to dense agenda view')}
            className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface-variant flex items-center justify-center hover:bg-surface-container shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">view_agenda</span>
          </button>
        </div>
      </div>

      {/* Projects List Cards */}
      <div className="flex flex-col gap-space-md">
        {filteredProjects.map((project) => {
          const isDrawerOpen = expandedDrawer === project.id;
          return (
            <div
              key={project.id}
              className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm transition-all hover:shadow-md border border-surface-container"
            >
              {/* Header / ID / RAG */}
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-code-sm text-code-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-mono font-bold">
                      {project.code}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">{project.departmentIcon}</span>
                      {project.department}
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mt-1 truncate font-semibold">
                    {project.name}
                  </h2>
                </div>

                {/* RAG Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm flex-shrink-0 font-bold ${
                    project.health === 'green'
                      ? 'bg-emerald-50 text-emerald-800'
                      : project.health === 'amber'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      project.health === 'green'
                        ? 'bg-emerald-500'
                        : project.health === 'amber'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-error animate-ping'
                    }`}
                  />
                  {project.healthLabel}
                </span>
              </div>

              {/* PM Info & Target Date */}
              <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant bg-surface-container-low p-space-xs px-space-sm rounded-lg border border-surface-container">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-label-sm text-[11px] font-bold">
                    {project.pmInitials}
                  </div>
                  <span className="text-on-surface font-medium truncate max-w-[130px]">
                    {project.pmName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">event</span>
                  <span>
                    Go-Live: <strong className="text-on-surface font-semibold">{project.goLiveDate}</strong>
                  </span>
                </div>
              </div>

              {/* Milestone Detail */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-on-surface-variant">Active Milestone</span>
                  <span className="text-on-surface font-medium truncate max-w-[220px]">
                    {project.activeMilestone}
                  </span>
                </div>

                <div className="w-full flex items-center gap-space-sm">
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.health === 'green'
                          ? 'bg-emerald-500'
                          : project.health === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-error'
                      }`}
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                  <span className="font-code-sm text-code-sm text-on-surface font-bold min-w-[32px] text-right font-mono">
                    {project.progressPercent}%
                  </span>
                </div>
              </div>

              {/* Metadata Badges & Actions Trigger */}
              <div className="flex items-center justify-between pt-space-xs flex-wrap gap-2">
                <div className="flex items-center gap-space-xs flex-wrap">
                  {project.risksCount > 0 ? (
                    <span
                      className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                        project.health === 'red'
                          ? 'text-error bg-error-container/70'
                          : 'text-amber-700 bg-amber-100/60'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {project.health === 'red' ? 'error' : 'warning'}
                      </span>
                      {project.risksCount} Risks ({project.highRisksCount} High)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      0 Open Risks
                    </span>
                  )}

                  {project.slipDays !== 0 && (
                    <span
                      className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                        project.health === 'red'
                          ? 'text-error bg-error-container/70'
                          : 'text-on-surface-variant bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {project.slipDays}d Slip
                    </span>
                  )}

                  {project.budgetPercent && (
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      Budget: {project.budgetPercent}%
                    </span>
                  )}

                  {project.signOffPercent && (
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-semibold">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      Sign-off: {project.signOffPercent}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleDrawer(project.id)}
                    className="h-8 px-space-sm rounded-lg bg-surface-container text-secondary hover:bg-surface-container-high font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-semibold transition-colors"
                  >
                    <span>Actions</span>
                    <span className="material-symbols-outlined text-[16px]">more_vert</span>
                  </button>
                </div>
              </div>

              {/* Expandable Coordinator Drawer */}
              {isDrawerOpen && (
                <div className="flex flex-col gap-space-xs pt-space-sm bg-surface-container-low p-space-sm rounded-lg transition-all border border-surface-container mt-1 animate-in fade-in">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pb-1 border-b border-surface-container">
                    <span className="font-semibold">Coordinator Quick Actions · {project.code}</span>
                    <button
                      onClick={() => toggleDrawer(project.id)}
                      className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs pt-1">
                    <button
                      onClick={() => onShowToast(`Generated full status report docket for ${project.code}`)}
                      className="h-9 px-2 bg-surface-container-lowest text-on-surface rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 shadow-xs hover:bg-surface-container transition-colors cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">visibility</span>
                      <span>View Status Report</span>
                    </button>

                    <button
                      onClick={() => onNavigateToTab('raid')}
                      className={`h-9 px-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer font-semibold ${
                        project.health === 'red' ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">report_problem</span>
                      <span>{project.health === 'red' ? 'Escalate RAID' : 'Log RAID Item'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Export PMO Report Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container mt-space-xs">
        <div className="flex items-center gap-space-sm w-full sm:w-auto">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
              Executive Portfolio Pack
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              Q4 SteerCo Presentation Deck Ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs w-full sm:w-auto">
          <button
            onClick={() => handleDownload('PDF')}
            className="flex-1 sm:flex-none h-10 px-space-md rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>PDF Export</span>
          </button>
          <button
            onClick={() => handleDownload('Excel')}
            className="flex-1 sm:flex-none h-10 px-space-md rounded-lg bg-secondary text-on-secondary hover:opacity-90 font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            <span>Excel PMO Pack</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button (+ Register New Project) */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={onOpenNewProject}
          className="h-12 px-4 rounded-full bg-primary text-on-primary shadow-xl flex items-center gap-2 hover:bg-surface-container-high hover:text-on-surface active:scale-95 transition-all cursor-pointer font-semibold border border-surface-container"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span className="font-headline-sm text-headline-sm text-sm pr-1">Register New Project</span>
        </button>
      </div>
    </div>
  );
};
