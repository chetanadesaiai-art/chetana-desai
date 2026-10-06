import React, { useState } from 'react';
import { ProjectItem, TaskItem, RaidItem } from '../types/pmo';

interface AiAssistantViewProps {
  projects: ProjectItem[];
  tasks: TaskItem[];
  raidItems: RaidItem[];
  onShowToast: (message: string, isAlert?: boolean) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; onClick: () => void }[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  projects,
  tasks,
  raidItems,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am your AI PMO Coordinator. I've analyzed your 18 IT projects, current RAID log, and upcoming milestones for Sprint 24.4.\n\nKey Alert: Two critical path items require immediate coordination today before 14:00 Governance sync:\n1. CRM Upgrade UAT DB export delta failure (David Kim / Marcus Vance)\n2. Cloud Migration firewall rule exception sign-off (Robert Hansen)`,
      timestamp: '09:41 AM',
      suggestedActions: [
        {
          label: 'Approve & Push Nudge to Marcus Vance',
          onClick: () => onShowToast('Dispatched Teams message & Outlook reminder to Marcus Vance.'),
        },
        {
          label: 'Generate SteerCo Deck Summary',
          onClick: () => onShowToast('Drafted 1-page SteerCo Executive Summary.'),
        },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    'Analyze schedule slip on Microsoft Teams Migration',
    'Draft urgent firewall sign-off escalation for Robert Hansen',
    'Reconcile resource conflict between Sarah Chen and Marcus Vance',
    'Simulate 2-week slip on CRM Go-Live',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let replyText = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('teams') || qLower.includes('slip')) {
        replyText = `**Analysis on PRJ-2287 (Microsoft Teams Migration):**\n\n• Current Slip: **-18 days** (Go-Live shifted to Dec 12, 2024)\n• Root Blocker: Telco carrier approval letter delayed 5 business days.\n• Active Milestone: Tenant Federation & PSTN is currently at 42% completion.\n\n**Recommendation:**\n1. Escalate to Telco carrier account director via high-priority CAB ticket.\n2. Parallelize pilot cohort testing for EMEA branch offices to recoup 6 days.\n3. Re-assign 2 telecom specialists from Service Desk workstream.`;
      } else if (qLower.includes('firewall') || qLower.includes('robert') || qLower.includes('hansen')) {
        replyText = `**Draft Escalation to Robert Hansen (Chief CISO Office):**\n\n"Subject: URGENT: Cloud Migration Firewall Rule Exception Sign-Off (#CM-409)\n\nHi Robert,\n\nOur production VPC peering and firewall ingress rules for Cloud Migration (AWS Core Infrastructure) are scheduled for cutover within 48h. The exception docket #118 has passed initial SecOps review and requires your final governance sign-off today before 14:00 to prevent staging delays.\n\nPlease confirm approval or delegate authority for today's 14:00 sync."`;
      } else if (qLower.includes('conflict') || qLower.includes('resource') || qLower.includes('reconcile')) {
        replyText = `**Resource Conflict Reconciliation Proposal:**\n\n• Conflict: Marcus Vance is allocated at 130% across Cloud DB Replication and CRM Upgrade schema reviews.\n• Sarah Chen requires additional network engineering oversight for PSTN cutover.\n\n**Proposed Resolution:**\n1. Offload Oracle delta script syntax review to David Kim (Lead DBA).\n2. Allocate Jordan Patel (Service Desk PM) to assist Sarah Chen with cutover change request documentation.\n3. Preserves Go-Live targets without overtime burn.`;
      } else {
        replyText = `**PMO Coordinator Analysis:**\n\nBased on your portfolio parameters ($14.8M / $15.2M budget, 97% adherence), 12 projects are On Track, 4 At Risk, and 2 Delayed.\n\nI have cross-checked this against the 38 active milestones and 7 critical RAID items. Would you like me to stage a formal follow-up or generate an audit packet?`;
      }

      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 850);
  };

  return (
    <div className="flex flex-col w-full gap-space-md max-w-4xl mx-auto pb-14 h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[26px]">neurology</span>
            AI Portfolio Coordinator
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Autonomous schedule arbitration, blocker escalation, and executive briefings
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-secondary-container/15 text-secondary font-label-sm text-label-sm font-semibold">
          Copilot v2.4 Active
        </span>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex gap-space-xs overflow-x-auto no-scrollbar py-1">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-variant font-label-sm text-label-sm whitespace-nowrap border border-surface-container-high transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-surface-container-lowest rounded-xl border border-surface-container shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-secondary text-on-secondary rounded-br-xs'
                  : 'bg-surface-container-low text-on-surface rounded-bl-xs border border-surface-container'
              }`}
            >
              <p className="font-body-sm text-body-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </p>

              {msg.suggestedActions && (
                <div className="flex flex-col gap-1.5 mt-2.5 pt-2 border-t border-surface-container">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={action.onClick}
                      className="text-left text-xs font-semibold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="font-label-sm text-[10px] text-on-surface-variant mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-surface-container rounded-xl max-w-[200px]">
            <span className="material-symbols-outlined text-secondary animate-spin text-[18px]">
              progress_activity
            </span>
            <span className="text-xs font-medium text-on-surface">Analyzing portfolio...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border border-surface-container shadow-sm"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Coordinator (e.g., draft SteerCo briefing, analyze risk)..."
          className="flex-1 bg-transparent px-3 py-1.5 font-body-sm text-body-sm text-on-surface outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="h-10 px-4 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center gap-1.5 disabled:opacity-40 transition-opacity cursor-pointer font-semibold shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
