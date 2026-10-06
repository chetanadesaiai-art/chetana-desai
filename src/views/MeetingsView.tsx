import React, { useState } from 'react';
import { MeetingItem, AiActionItem } from '../types/pmo';
import { APP_ASSETS } from '../data/mockData';

interface MeetingsViewProps {
  meetings: MeetingItem[];
  aiActions: AiActionItem[];
  onShowToast: (message: string, isAlert?: boolean) => void;
  onAddTaskToMyDay?: (title: string) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  meetings,
  aiActions,
  onShowToast,
  onAddTaskToMyDay,
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('meet-crm-sync');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [actionsList, setActionsList] = useState<AiActionItem[]>(aiActions);

  const activeMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      onShowToast('AI Action Items re-synthesized from meeting transcript (3 commitments detected).');
    }, 1200);
  };

  const handleUploadTranscript = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onShowToast('Audio transcript uploaded & NLP parsing complete! Extracted 2 new agenda topics.');
    }, 1500);
  };

  const handleAssignJira = (title: string) => {
    onShowToast(`Exported action item "${title}" to Jira PMO Epic as sub-task.`);
  };

  const handleAddToMyDay = (action: AiActionItem) => {
    if (onAddTaskToMyDay) {
      onAddTaskToMyDay(action.title);
    }
    onShowToast(`Added "${action.title}" to My Day operational queue.`);
  };

  const handleSetAlert = (title: string) => {
    onShowToast(`High-priority push alert armed for "${title}".`);
  };

  const handleNudgeOwner = (owner: string) => {
    onShowToast(`Instant nudge ping delivered to ${owner} on Microsoft Teams.`);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-4xl mx-auto pb-14">
      {/* Header Section */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col min-w-0">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight font-bold">
              Meetings & Syncs
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Manage agendas, notes, and AI-extracted commitments
            </p>
          </div>

          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-secondary font-label-sm text-label-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="grid grid-cols-2 gap-space-sm mt-space-xs">
          <button
            onClick={() => onShowToast('Scheduled 30-min Governance checkpoint for Friday 10:00 AM.')}
            className="flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-semibold hover:bg-surface-container-high hover:text-on-surface"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Schedule Meeting</span>
          </button>

          <button
            onClick={handleUploadTranscript}
            disabled={isUploading}
            className="flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-xl bg-surface-container text-secondary font-label-md text-label-md shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-semibold hover:bg-surface-variant"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isUploading ? 'progress_activity' : 'upload_file'}
            </span>
            <span className="truncate">{isUploading ? 'Processing Audio...' : 'Upload Transcript'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Upcoming Selector / Sync Cadence */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
            Sync Cadence
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">3 Today</span>
        </div>

        <div className="flex gap-space-sm overflow-x-auto no-scrollbar py-0.5 -mx-margin px-margin">
          {meetings.map((m) => {
            const isSelected = m.id === selectedMeetingId;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMeetingId(m.id)}
                className={`flex-shrink-0 flex items-center gap-space-sm p-space-sm pr-space-md rounded-xl shadow-sm cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-surface-container-high border-secondary/30'
                    : 'bg-surface-container-lowest opacity-75 hover:opacity-100 border-surface-container'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {m.id === 'meet-crm-sync' ? 'groups' : m.id === 'meet-cloud-review' ? 'cloud_sync' : 'record_voice_over'}
                  </span>
                </div>

                <div className="flex flex-col min-w-[130px]">
                  <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                    {m.title}
                  </span>
                  <span
                    className={`font-code-sm text-code-sm font-mono ${
                      isSelected ? 'text-secondary font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {m.dateTime.split('•')[1]?.trim() || m.dateTime}
                  </span>
                </div>

                {isSelected && <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Active Meeting Detail Card */}
      <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-md overflow-hidden border border-surface-container">
        {/* Meeting Top Bar */}
        <div className="p-space-md bg-surface-container-low flex flex-col gap-space-xs border-b border-surface-container">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1" />
                  {activeMeeting.streamCode}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-medium">
                  {activeMeeting.sprint}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-1 font-semibold">
                {activeMeeting.title}
              </h2>
            </div>

            <button
              onClick={() => onShowToast('Meeting actions docket opened')}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>

          <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
            <span>{activeMeeting.dateTime}</span>
          </div>

          {/* Attendees Strip with Photo Placeholders */}
          <div className="flex items-center justify-between pt-space-xs mt-space-xs">
            <div className="flex items-center -space-x-2">
              <img
                className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest shadow-xs"
                alt="Elena Rostova"
                src={APP_ASSETS.elenaAvatar}
                referrerPolicy="no-referrer"
              />
              <img
                className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest shadow-xs"
                alt="David Kim"
                src={APP_ASSETS.davidAvatar}
                referrerPolicy="no-referrer"
              />
              <img
                className="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest shadow-xs"
                alt="Priya Sharma"
                src={APP_ASSETS.priyaAvatar}
                referrerPolicy="no-referrer"
              />
              <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-label-sm text-label-sm ring-2 ring-surface-container-lowest font-bold">
                LW
              </div>
              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm ring-2 ring-surface-container-lowest font-bold">
                +1
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {activeMeeting.participantsCount} Participants
            </span>
          </div>
        </div>

        {/* Agenda & Raw Notes Accordion Area */}
        <div className="p-space-md flex flex-col gap-space-md">
          {/* Agenda Accordion Item */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-secondary">ballot</span>
                Meeting Agenda
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-mono">
                {activeMeeting.agenda.length} Topics
              </span>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
              {activeMeeting.agenda.map((item, idx) => (
                <div key={idx} className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface">
                  <span className="w-4 h-4 rounded-full bg-surface-container flex items-center justify-center font-code-sm text-[10px] text-secondary font-bold font-mono">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Notes Transcript Excerpt */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">description</span>
                Meeting Notes (Raw Minutes)
              </span>
              <span
                onClick={() => onShowToast('Full transcript modal displayed: 42 minutes recorded audio.')}
                className="font-label-sm text-label-sm text-secondary cursor-pointer hover:underline font-semibold"
              >
                Full Transcript
              </span>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container-high/60 font-body-sm text-body-sm text-on-surface leading-relaxed relative border border-surface-container">
              <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-sm text-[10px] font-mono">
                <span className="material-symbols-outlined text-[12px]">mic</span> Audio Parsed
              </div>
              <p className="italic text-on-surface-variant pr-20">
                “Discussed UAT delay.{' '}
                <span className="bg-tertiary-fixed/70 text-on-tertiary-fixed px-1 rounded font-medium">
                  Infrastructure team committed to spin up cluster by Oct 9.
                </span>{' '}
                Priya noted{' '}
                <span className="bg-error-container text-on-error-container px-1 rounded font-medium">
                  QA cannot start without fresh customer anonymized test data from Business Team by Oct 8.
                </span>{' '}
                David will assist with schema mappings on Oct 10.”
              </p>
            </div>
          </div>

          {/* Key Decisions Log */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[16px] text-secondary">gavel</span>
              Key Decisions Log
            </span>

            <div className="flex flex-col gap-1.5">
              {activeMeeting.keyDecisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-space-xs p-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="leading-tight">
                    <strong className="font-semibold text-on-surface">Decided:</strong>{' '}
                    {decision.replace('Decided:', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Action Item Spotlight Section */}
      <div className="flex flex-col rounded-xl bg-surface-container-low p-space-md gap-space-md relative overflow-hidden shadow-sm border border-surface-container-high">
        {/* Ambient Accent SVG */}
        <div className="absolute -right-8 -top-8 w-28 h-28 pointer-events-none opacity-20">
          <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeDasharray="6 6" strokeWidth="8" />
            <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>

        {/* Spotlight Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm z-10">
          <div className="flex items-center gap-space-xs">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  AI Action Item Generator
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold">
                  v2.4 Neural
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-secondary font-medium">
                {actionsList.length} new actions identified from minutes
              </span>
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center gap-space-xs px-3.5 py-2 rounded-xl bg-secondary text-on-secondary font-label-sm text-label-sm shadow-sm active:scale-95 transition-all cursor-pointer font-semibold"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${isRegenerating ? 'animate-spin' : ''}`}
            >
              sync
            </span>
            <span>{isRegenerating ? 'Analyzing Audio...' : 'Re-generate from Notes'}</span>
          </button>
        </div>

        {/* Action Item Cards Stream */}
        <div className="flex flex-col gap-space-sm z-10">
          {actionsList.map((action) => (
            <div
              key={action.id}
              className="flex flex-col p-space-md rounded-xl bg-surface-container-lowest shadow-sm gap-space-xs relative group hover:shadow-md transition-shadow border border-surface-container"
            >
              <div className="flex items-start justify-between gap-space-sm flex-wrap">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                      action.priority === 'P0'
                        ? 'bg-error text-on-error'
                        : action.priority === 'P1'
                        ? 'bg-error-container/60 text-on-error-container'
                        : 'bg-surface-variant text-on-surface'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        action.priority === 'P0'
                          ? 'bg-on-error animate-ping'
                          : action.priority === 'P1'
                          ? 'bg-error'
                          : 'bg-on-surface-variant'
                      }`}
                    />
                    {action.priorityLabel}
                  </span>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-medium">
                    {action.status}
                  </span>

                  <span className="font-code-sm text-code-sm text-on-surface-variant flex items-center gap-0.5 font-mono">
                    <span className="material-symbols-outlined text-[12px]">source</span>
                    {action.sectionRef}
                  </span>
                </div>

                <span
                  className={`font-label-sm text-label-sm flex items-center gap-1 font-semibold ${
                    action.priority === 'P0' ? 'text-error font-bold' : action.priority === 'P1' ? 'text-error' : 'text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {action.priority === 'P0' ? 'warning' : 'event'}
                  </span>
                  {action.dueDate}
                </span>
              </div>

              <div className="flex flex-col">
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {action.title}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {action.description}
                </p>
              </div>

              {/* Progress bar if present */}
              {action.progressPercent !== undefined && action.progressPercent > 0 && (
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden my-1">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${action.progressPercent}%` }} />
                </div>
              )}

              {/* Meta and Owner */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-space-xs">
                  {action.ownerAvatar ? (
                    <img
                      className="w-6 h-6 rounded-full object-cover"
                      alt={action.owner}
                      src={action.ownerAvatar}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-label-sm text-[10px] font-bold">
                      {action.ownerInitials || 'OW'}
                    </div>
                  )}
                  <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">
                    {action.owner} <span className="text-on-surface-variant font-normal">({action.ownerRole})</span>
                  </span>
                </div>
              </div>

              {/* One-touch Coordinator Action Strip */}
              <div className="grid grid-cols-3 gap-space-xs pt-space-xs mt-space-xs">
                <button
                  onClick={() => handleAssignJira(action.title)}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant font-label-sm text-[11px] transition-colors cursor-pointer font-semibold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px] text-secondary">alt_route</span>
                  <span className="truncate">Assign in Jira</span>
                </button>

                {action.priority === 'P0' ? (
                  <button
                    onClick={() => handleNudgeOwner(action.owner)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-secondary text-on-secondary font-label-sm text-[11px] shadow-sm cursor-pointer font-semibold hover:bg-secondary/90"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span className="truncate">Nudge Owner</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToMyDay(action)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant font-label-sm text-[11px] transition-colors cursor-pointer font-semibold"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary">add_task</span>
                    <span className="truncate">Add to My Day</span>
                  </button>
                )}

                <button
                  onClick={() => handleSetAlert(action.title)}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant font-label-sm text-[11px] transition-colors cursor-pointer font-semibold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px] text-secondary">alarm</span>
                  <span className="truncate">Set Alert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Project Syncs Carousel Section */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Upcoming Project Syncs
            </h3>
            <span className="w-5 h-5 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] flex items-center justify-center font-bold">
              4
            </span>
          </div>

          <button
            onClick={() => onShowToast('Master PMO sync calendar opened')}
            className="font-label-md text-label-md text-secondary hover:underline cursor-pointer font-semibold"
          >
            View Calendar
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-space-sm overflow-x-auto no-scrollbar py-1 -mx-margin px-margin">
          {/* Card 1 */}
          <div className="flex flex-col flex-shrink-0 w-64 p-space-md rounded-xl bg-surface-container-lowest shadow-sm gap-space-xs hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-[10px] font-mono font-bold">
                ARCH-88
              </span>
              <span className="font-code-sm text-code-sm text-secondary font-medium font-mono">
                Tomorrow 2:00 PM
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
              Cloud Core Architecture Review
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Quarterly cloud scaling topology review and disaster recovery failover dry-run.
            </p>
            <div className="flex items-center justify-between pt-space-xs mt-auto">
              <div className="flex items-center -space-x-1.5">
                <img
                  className="w-5 h-5 rounded-full object-cover"
                  alt="Architect"
                  src={APP_ASSETS.architectAvatar}
                  referrerPolicy="no-referrer"
                />
                <div className="w-5 h-5 rounded-full bg-surface-variant text-on-surface font-label-sm text-[9px] flex items-center justify-center font-bold">
                  MK
                </div>
                <div className="w-5 h-5 rounded-full bg-surface-variant text-on-surface font-label-sm text-[9px] flex items-center justify-center font-bold">
                  +3
                </div>
              </div>
              <button
                onClick={() => onShowToast('Opened Architecture pre-read document (14 pages)')}
                className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 hover:underline cursor-pointer font-semibold"
              >
                <span>Pre-read</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col flex-shrink-0 w-64 p-space-md rounded-xl bg-surface-container-lowest shadow-sm gap-space-xs hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-[10px] font-mono font-bold">
                OPS-ROLLOUT
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-mono">
                Thu Oct 10 • 11:30 AM
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
              Teams Rollout Standup
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Organization-wide migration checkpoint, pilot cohort feedback, and telecom routing checks.
            </p>
            <div className="flex items-center justify-between pt-space-xs mt-auto">
              <div className="flex items-center -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[9px] flex items-center justify-center font-bold">
                  SC
                </div>
                <div className="w-5 h-5 rounded-full bg-surface-variant text-on-surface font-label-sm text-[9px] flex items-center justify-center font-bold">
                  DR
                </div>
              </div>
              <button
                onClick={() => onShowToast('Opened Teams Rollout agenda outline')}
                className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 hover:underline cursor-pointer font-semibold"
              >
                <span>Agenda</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col flex-shrink-0 w-64 p-space-md rounded-xl bg-surface-container-lowest shadow-sm gap-space-xs hover:shadow-md transition-shadow border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-mono font-bold">
                SEC-AUDIT
              </span>
              <span className="font-code-sm text-code-sm text-on-surface-variant font-mono">
                Fri Oct 11 • 03:00 PM
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
              SOC2 Audit Alignment
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Review automated vulnerability scans and external auditor query responses.
            </p>
            <div className="flex items-center justify-between pt-space-xs mt-auto">
              <div className="flex items-center -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[9px] flex items-center justify-center font-bold">
                  ER
                </div>
              </div>
              <button
                onClick={() => onShowToast('Opened SOC2 auditor evidence repository')}
                className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 hover:underline cursor-pointer font-semibold"
              >
                <span>Evidence</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
