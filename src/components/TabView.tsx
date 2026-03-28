'use client';

import { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  emoji: string;
}

interface TabViewProps {
  tabs: Tab[];
  children: React.ReactNode[];
  defaultTab?: string;
}

export default function TabView({ tabs, children, defaultTab }: TabViewProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {children[activeIndex] || children[0]}
      </div>
    </div>
  );
}
