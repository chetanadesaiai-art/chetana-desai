import React from 'react';
import { APP_ASSETS } from '../data/mockData';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAiPulse: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAiPulse,
  onOpenNotifications,
  unreadCount = 3,
}) => {
  const getSubTitle = () => {
    switch (currentTab) {
      case 'my-day':
        return 'PMO Workspace · My Day';
      case 'projects':
        return 'PMO Workspace · Projects';
      case 'tasks':
        return 'PMO Workspace · Tasks';
      case 'meetings':
        return 'PMO Workspace · Meetings';
      case 'milestones':
        return 'PMO Workspace · Milestones';
      case 'pmo-reports':
        return 'PMO Workspace · Reports';
      case 'raid':
        return 'PMO Workspace · RAID Register';
      case 'ai-assistant':
        return 'PMO Workspace · AI Copilot';
      default:
        return 'PMO Workspace';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      {/* Primary Brand & Actions Bar */}
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm max-w-7xl mx-auto w-full">
        <div
          className="flex items-center gap-space-sm min-w-0 flex-1 cursor-pointer"
          onClick={() => onTabChange('my-day')}
        >
          <img
            alt="AI Project Coordinator Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src={APP_ASSETS.logo}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                Project Coordinator
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
              {getSubTitle()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs flex-shrink-0">
          <button
            aria-label="AI Quick Pulse"
            onClick={onOpenAiPulse}
            className="h-10 px-3 rounded-full bg-surface-container flex items-center gap-1.5 text-secondary hover:bg-surface-variant transition-colors active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">neurology</span>
            <span className="font-label-sm text-label-sm hidden sm:inline font-semibold">
              AI Pulse
            </span>
          </button>

          <button
            aria-label="Urgent Notifications"
            onClick={onOpenNotifications}
            className="w-10 h-10 relative flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 bg-error text-on-error rounded-full font-label-sm text-[10px] leading-none font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <div
            className="flex items-center justify-center w-10 h-10 cursor-pointer"
            onClick={() => onTabChange('pmo-reports')}
            title="User Profile: PMO Director"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container hover:ring-secondary transition-all"
              src={APP_ASSETS.userProfile}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Ribbon (Meetings, Milestones, PMO Reports) */}
      <div className="px-margin pb-2 pt-0.5 flex items-center gap-space-md overflow-x-auto no-scrollbar max-w-7xl mx-auto w-full">
        <button
          onClick={() => onTabChange('meetings')}
          className={`font-label-md text-label-md whitespace-nowrap py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'meetings'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          Meetings
        </button>
        <button
          onClick={() => onTabChange('milestones')}
          className={`font-label-md text-label-md whitespace-nowrap py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'milestones'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => onTabChange('pmo-reports')}
          className={`font-label-md text-label-md whitespace-nowrap py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'pmo-reports'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          PMO Reports
        </button>
      </div>
    </header>
  );
};
