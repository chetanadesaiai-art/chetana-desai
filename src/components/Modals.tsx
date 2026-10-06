import React, { useState } from 'react';
import { ProjectItem, TaskItem, RaidItem } from '../types/pmo';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-margin animate-in fade-in">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-space-lg flex flex-col gap-space-md shadow-2xl max-h-[85vh] overflow-y-auto border border-surface-container">
        <div className="flex items-center justify-between pb-1 border-b border-surface-container-low">
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// 1. Register New Project Modal
export const NewProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<ProjectItem>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [pmName, setPmName] = useState('Elena Rostova');
  const [goLiveDate, setGoLiveDate] = useState('2024-12-15');
  const [budget, setBudget] = useState('750000');
  const [department, setDepartment] = useState('Enterprise IT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const initials = pmName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PM';
    onSubmit({
      code: `PRJ-${Math.floor(2000 + Math.random() * 900)}`,
      name,
      department,
      departmentIcon: 'business',
      health: 'green',
      healthLabel: 'ON TRACK',
      pmName,
      pmInitials: initials,
      goLiveDate: new Date(goLiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      activeMilestone: 'Sprint Planning & Baseline',
      progressPercent: 5,
      risksCount: 0,
      highRisksCount: 0,
      slipDays: 0,
    });
    setName('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Initiate Project Charter">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Project Title</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high transition-colors"
            placeholder="e.g., ERP SAP S/4HANA Migration"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Workstream / Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high transition-colors cursor-pointer"
          >
            <option>Enterprise IT</option>
            <option>Cloud Infrastructure</option>
            <option>Cybersecurity</option>
            <option>Customer Experience</option>
            <option>Modern Workplace</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Assigned PM</label>
            <input
              value={pmName}
              onChange={(e) => setPmName(e.target.value)}
              required
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
              placeholder="Elena Rostova"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Target Go-Live</label>
            <input
              type="date"
              value={goLiveDate}
              onChange={(e) => setGoLiveDate(e.target.value)}
              required
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Estimated CAPEX / OPEX Budget ($)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="750000"
          />
        </div>

        <div className="flex items-center justify-end gap-space-xs pt-space-xs mt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-95 transition-all cursor-pointer font-semibold hover:bg-surface-container-high hover:text-on-surface"
          >
            Create PMO Charter
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// 2. Add Task Modal
export const AddTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<TaskItem>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('CRM Upgrade');
  const [owner, setOwner] = useState('David Kim');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P1');
  const [dueDate, setDueDate] = useState('Today 5:00 PM');
  const [dependency, setDependency] = useState('');
  const [nextAction, setNextAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      code: `#TK-${Math.floor(100 + Math.random() * 900)}`,
      title,
      project,
      projectCode: project.slice(0, 3).toUpperCase(),
      owner,
      ownerRole: 'Project Specialist',
      priority,
      priorityLabel: `${priority} HIGH`,
      status: 'In Progress',
      dueDate,
      dependency: dependency || undefined,
      nextAction: nextAction || 'Commence initial verification run',
    });
    setTitle('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Project Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Task Description</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="e.g. Audit ingress TLS termination on gateway"
          />
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Associated Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            >
              <option>CRM Upgrade</option>
              <option>Cloud Migration</option>
              <option>Teams Migration</option>
              <option>Service Desk</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Assigned Owner</label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Priority Tier</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            >
              <option value="P1">P1 - Critical Blocker</option>
              <option value="P2">P2 - Standard Delivery</option>
              <option value="P3">P3 - Low Priority</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Due Date / Time</label>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
              placeholder="Today 5:00 PM"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Hard Dependency (Optional)</label>
          <input
            value={dependency}
            onChange={(e) => setDependency(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="e.g. CISO Review #118"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Immediate Next Action</label>
          <input
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="e.g. Run automated verification suite"
          />
        </div>

        <div className="flex items-center justify-end gap-space-xs pt-space-xs mt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-sm active:scale-95 transition-all cursor-pointer font-semibold"
          >
            Create Task
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// 3. Log RAID Item Modal
export const LogRaidModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<RaidItem>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('CRM Upgrade');
  const [type, setType] = useState<'Risk' | 'Issue' | 'Dependency' | 'Assumption'>('Risk');
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [owner, setOwner] = useState('David Kim');
  const [impact, setImpact] = useState('');
  const [mitigationPlan, setMitigationPlan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const rag = severity === 'Critical' ? 'Red' : severity === 'High' ? 'Amber' : 'Green';
    onSubmit({
      id: `${type[0]}-${Math.floor(100 + Math.random() * 900)}`,
      type,
      project,
      title,
      owner,
      severity,
      rag,
      status: 'Open',
      impact: impact || 'Potential schedule slip or governance escalation',
      mitigationPlan: mitigationPlan || 'Track in daily standup and establish backup vendor contact',
    });
    setTitle('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log RAID Register Entry">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">RAID Category</label>
          <div className="grid grid-cols-4 gap-1">
            {(['Risk', 'Assumption', 'Issue', 'Dependency'] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  type === t ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Title / Description</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="e.g. Export delta sync latency exceeding SLA"
          />
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            >
              <option>CRM Upgrade</option>
              <option>Cloud Migration</option>
              <option>Teams Migration</option>
              <option>Service Desk</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            >
              <option value="Critical">Critical (P1 Red)</option>
              <option value="High">High (P2 Amber)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Owner</label>
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Business & Technical Impact</label>
          <textarea
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            rows={2}
            className="p-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="Impact on milestones, budget or compliance..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Mitigation Plan & Contingency</label>
          <textarea
            value={mitigationPlan}
            onChange={(e) => setMitigationPlan(e.target.value)}
            rows={2}
            className="p-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container border border-surface-container-high"
            placeholder="Specific countermeasures and checkpoint owners..."
          />
        </div>

        <div className="flex items-center justify-end gap-space-xs pt-space-xs mt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-error text-on-error font-label-md text-label-md shadow-sm active:scale-95 transition-all cursor-pointer font-semibold"
          >
            Register Item
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

// 4. AI Daily Summary Modal
export const AiSummaryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCopyOrShare: (text: string) => void;
}> = ({ isOpen, onClose, onCopyOrShare }) => {
  const summaryText = `EXECUTIVE PMO BRIEFING · Tuesday, Oct 8
--------------------------------------------------
Status: 4 Critical Path Blockers Identified

1. CRM Upgrade (#CR-419): UAT sign-off blocked by Oracle DB delta sync. Next action: schema patch deployment requested from Marcus Vance before 14:00 Governance sync.
2. Cloud Migration (#AWS-892): Final VPC peering firewall rules awaiting CISO sign-off from Robert Hansen.
3. Microsoft Teams (#MS-331): Telecom carrier route verification letter delayed -18 days. Escalation call scheduled tomorrow 11:30 AM.
4. Service Desk Transformation (#ITSM-701): Tier 1 incident playbook sign-off stalled. 10-min walk-through proposed with Ops Director.

Budget Health: $14.8M / $15.2M (97% adherence). 12 projects Green, 4 Amber, 2 Red.`;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="✨ AI Daily PMO Executive Summary">
      <div className="flex flex-col gap-space-sm">
        <div className="p-3 bg-surface-container rounded-xl text-xs font-mono text-on-surface leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border border-surface-container-highest">
          {summaryText}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Synthesized from live telemetry, 18 IT projects, active RAID items, and morning standup transcripts.
        </p>
        <div className="flex items-center justify-end gap-space-xs pt-space-xs">
          <button
            onClick={() => onCopyOrShare(summaryText)}
            className="h-10 px-4 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            Copy Briefing
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
