import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  myDayBadge?: number;
  tasksBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  myDayBadge = 4,
  tasksBadge = 2,
}) => {
  return (
    <nav
      className="fixed bottom-0 w-full z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-1px_10px_rgba(0,0,0,0.04)] border-t border-surface-container"
      aria-label="Primary Navigation"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-space-xs">
        {/* Tab 1: My Day */}
        <button
          onClick={() => onTabChange('my-day')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors cursor-pointer ${
            currentTab === 'my-day' ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'my-day' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">calendar_today</span>
          <span className="font-label-sm text-label-sm mt-0.5">My Day</span>
          {myDayBadge > 0 && (
            <span className="absolute top-1 right-2.5 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 bg-secondary text-on-secondary rounded-full font-label-sm text-[9px] leading-none font-bold">
              {myDayBadge}
            </span>
          )}
        </button>

        {/* Tab 2: Projects */}
        <button
          onClick={() => onTabChange('projects')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors cursor-pointer ${
            currentTab === 'projects' ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'projects' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">folder_copy</span>
          <span className="font-label-sm text-label-sm mt-0.5">Projects</span>
        </button>

        {/* Tab 3: Tasks */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors cursor-pointer ${
            currentTab === 'tasks' ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'tasks' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">fact_check</span>
          <span className="font-label-sm text-label-sm mt-0.5">Tasks</span>
          {tasksBadge > 0 && (
            <span className="absolute top-1 right-2.5 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 bg-secondary text-on-secondary rounded-full font-label-sm text-[9px] leading-none font-bold">
              {tasksBadge}
            </span>
          )}
        </button>

        {/* Tab 4: RAID */}
        <button
          onClick={() => onTabChange('raid')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors cursor-pointer ${
            currentTab === 'raid' ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'raid' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
          <span className="font-label-sm text-label-sm mt-0.5">RAID</span>
        </button>

        {/* Tab 5: AI Assistant */}
        <button
          onClick={() => onTabChange('ai-assistant')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors cursor-pointer ${
            currentTab === 'ai-assistant' ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={currentTab === 'ai-assistant' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
          <span className="font-label-sm text-label-sm mt-0.5">AI Assistant</span>
          <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(49,107,243,0.8)] animate-pulse" />
        </button>
      </div>
    </nav>
  );
};
