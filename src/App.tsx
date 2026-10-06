/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast, ToastState } from './components/Toast';
import {
  NewProjectModal,
  AddTaskModal,
  LogRaidModal,
  AiSummaryModal,
} from './components/Modals';

import { MyDayView } from './views/MyDayView';
import { ProjectsView } from './views/ProjectsView';
import { TasksView } from './views/TasksView';
import { MeetingsView } from './views/MeetingsView';
import { RaidView } from './views/RaidView';
import { AiAssistantView } from './views/AiAssistantView';
import { MilestonesView } from './views/MilestonesView';
import { PmoReportsView } from './views/PmoReportsView';

import {
  INITIAL_PROJECTS,
  INITIAL_RADAR_TASKS,
  INITIAL_WAITING_ITEMS,
  INITIAL_WORKSTREAM_TASKS,
  INITIAL_MEETINGS,
  INITIAL_AI_ACTIONS,
  GATE_APPROVALS,
  AUDIT_LOGS,
  INITIAL_RAID_ITEMS,
} from './data/mockData';
import { ProjectItem, TaskItem, RaidItem } from './types/pmo';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('my-day');
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [radarTasks, setRadarTasks] = useState<TaskItem[]>(INITIAL_RADAR_TASKS);
  const [workstreamTasks, setWorkstreamTasks] = useState<TaskItem[]>(INITIAL_WORKSTREAM_TASKS);
  const [waitingItems, setWaitingItems] = useState(INITIAL_WAITING_ITEMS);
  const [raidItems, setRaidItems] = useState<RaidItem[]>(INITIAL_RAID_ITEMS);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS);

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isLogRaidModalOpen, setIsLogRaidModalOpen] = useState(false);
  const [isAiSummaryModalOpen, setIsAiSummaryModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    isAlert: false,
  });

  const showToast = (
    message: string,
    isAlert = false,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setToast({
      show: true,
      message,
      isAlert,
      actionLabel,
      onAction,
    });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Add Task Handler
  const handleCreateTask = (taskData: Partial<TaskItem>) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      code: taskData.code || `#TK-${Math.floor(100 + Math.random() * 900)}`,
      project: taskData.project || 'General',
      projectCode: (taskData.project || 'GEN').slice(0, 3).toUpperCase(),
      title: taskData.title || 'Untitled task',
      owner: taskData.owner || 'Elena Rostova',
      ownerRole: taskData.ownerRole || 'Project Lead',
      priority: taskData.priority || 'P2',
      priorityLabel: taskData.priorityLabel || 'P2 MED',
      status: taskData.status || 'In Progress',
      dueDate: taskData.dueDate || 'Today',
      isOverdue: false,
      dependency: taskData.dependency,
      nextAction: taskData.nextAction,
    };

    setRadarTasks(prev => [newTask, ...prev]);
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        author: 'Elena Rostova',
        action: `created task "${newTask.title.substring(0, 26)}..."`,
        timeAgo: 'Just now',
        project: newTask.project,
        colorClass: 'bg-secondary',
      },
      ...prev,
    ]);
    showToast(`Task ${newTask.code} registered and assigned to ${newTask.owner}!`);
  };

  // Add Project Charter Handler
  const handleCreateProject = (projectData: Partial<ProjectItem>) => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      code: projectData.code || `PRJ-${Math.floor(2000 + Math.random() * 900)}`,
      name: projectData.name || 'New Project Charter',
      department: projectData.department || 'Enterprise IT',
      departmentIcon: projectData.departmentIcon || 'business',
      health: 'green',
      healthLabel: 'ON TRACK',
      pmName: projectData.pmName || 'Elena Rostova',
      pmInitials: projectData.pmInitials || 'ER',
      goLiveDate: projectData.goLiveDate || 'Dec 15, 2024',
      activeMilestone: 'Charter Sign-off & Baseline',
      progressPercent: 5,
      risksCount: 0,
      highRisksCount: 0,
      slipDays: 0,
    };

    setProjects(prev => [newProj, ...prev]);
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        author: 'PMO Director',
        action: `registered new project charter "${newProj.name}"`,
        timeAgo: 'Just now',
        project: newProj.name,
        colorClass: 'bg-secondary-container',
      },
      ...prev,
    ]);
    showToast(`Project Charter ${newProj.code} registered in portfolio!`);
  };

  // Add RAID item Handler
  const handleCreateRaid = (raidData: Partial<RaidItem>) => {
    const newRaid: RaidItem = {
      id: raidData.id || `R-${Math.floor(100 + Math.random() * 900)}`,
      type: raidData.type || 'Risk',
      project: raidData.project || 'General',
      title: raidData.title || 'Untitled risk',
      owner: raidData.owner || 'David Kim',
      severity: raidData.severity || 'High',
      rag: raidData.rag || 'Amber',
      status: 'Open',
      impact: raidData.impact || 'Potential project schedule slip',
      mitigationPlan: raidData.mitigationPlan || 'Active coordination underway',
    };

    setRaidItems(prev => [newRaid, ...prev]);
    showToast(`RAID entry ${newRaid.id} logged for ${newRaid.project}.`, newRaid.rag === 'Red');
  };

  const handleTaskDone = (taskId: string) => {
    setRadarTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'Done' } : t))
    );
    showToast('Task marked complete & audit trail logged!');
  };

  return (
    <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen">
      {/* Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAiPulse={() => setCurrentTab('ai-assistant')}
        onOpenNotifications={() => showToast('3 urgent notifications: 2 P1 blockers & 1 overdue sign-off.')}
        unreadCount={3}
      />

      {/* Main View Container */}
      <main className="flex flex-col relative w-full pt-28 pb-28 px-margin bg-background flex-1">
        {currentTab === 'my-day' && (
          <MyDayView
            tasks={radarTasks}
            waitingItems={waitingItems}
            gateApprovals={GATE_APPROVALS}
            auditLogs={auditLogs}
            onAddTask={() => setIsAddTaskModalOpen(true)}
            onCreateFollowUp={() => setCurrentTab('tasks')}
            onLogRisk={() => setIsLogRaidModalOpen(true)}
            onAddMeeting={() => setCurrentTab('meetings')}
            onGenerateSummary={() => setIsAiSummaryModalOpen(true)}
            onShowToast={showToast}
            onNavigateToTab={setCurrentTab}
            onTaskDone={handleTaskDone}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onShowToast={showToast}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksView
            tasks={[...radarTasks, ...workstreamTasks]}
            waitingItems={waitingItems}
            onShowToast={showToast}
            onAddTask={() => setIsAddTaskModalOpen(true)}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {currentTab === 'meetings' && (
          <MeetingsView
            meetings={INITIAL_MEETINGS}
            aiActions={INITIAL_AI_ACTIONS}
            onShowToast={showToast}
            onAddTaskToMyDay={(title) => {
              handleCreateTask({
                title,
                project: 'CRM Upgrade',
                priority: 'P1',
                priorityLabel: 'P1 HIGH',
              });
            }}
          />
        )}

        {currentTab === 'raid' && (
          <RaidView
            raidItems={raidItems}
            onLogRisk={() => setIsLogRaidModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'ai-assistant' && (
          <AiAssistantView
            projects={projects}
            tasks={radarTasks}
            raidItems={raidItems}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'milestones' && (
          <MilestonesView
            projects={projects}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'pmo-reports' && (
          <PmoReportsView
            projects={projects}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        myDayBadge={4}
        tasksBadge={2}
      />

      {/* Global Toast Feedback */}
      <Toast toast={toast} onClose={handleCloseToast} />

      {/* Creation & Interaction Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <LogRaidModal
        isOpen={isLogRaidModalOpen}
        onClose={() => setIsLogRaidModalOpen(false)}
        onSubmit={handleCreateRaid}
      />

      <AiSummaryModal
        isOpen={isAiSummaryModalOpen}
        onClose={() => setIsAiSummaryModalOpen(false)}
        onCopyOrShare={(text) => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
          }
          showToast('Executive briefing copied to clipboard!');
          setIsAiSummaryModalOpen(false);
        }}
      />
    </div>
  );
}
