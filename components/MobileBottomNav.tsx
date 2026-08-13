"use client";

import { LayoutDashboard, Calendar as CalendarIcon, BarChart3, List } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';
import { AccountType } from '@/types/trade';

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'calendar' | 'analytics' | 'all-trades';
  setActiveTab: (tab: 'dashboard' | 'calendar' | 'analytics' | 'all-trades') => void;
  filterAccount: 'Tümü' | AccountType;
  setFilterAccount: (acc: 'Tümü' | AccountType) => void;
  lang: 'tr' | 'en';
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  filterAccount,
  setFilterAccount,
  lang
}: MobileBottomNavProps) {
  const t = TRANSLATIONS[lang];

  return (
    <>
      {/* MOBİL HESAP FİLTRELEME BARI */}
      <div className="md:hidden bg-bg-panel/90 border-b border-border-main px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
        <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">Hesap:</span>
        <div className="flex bg-bg-app border border-border-main rounded-full p-0.5 gap-1">
          {[
            { label: t.all, val: 'Tümü' },
            { label: t.personal, val: 'Kişisel' },
            { label: t.propFirm, val: 'Fon (Prop)' },
            { label: t.demo, val: 'Demo' }
          ].map((acc) => (
            <button
              key={acc.val}
              onClick={() => setFilterAccount(acc.val as any)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${filterAccount === acc.val ? 'bg-indigo-600 text-white shadow-sm' : 'text-text-muted'}`}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOBİL ALT GEZİNTİ BARI (BOTTOM NAVIGATION BAR) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-panel/95 backdrop-blur-lg border-t border-border-main z-40 flex items-center justify-around px-2 shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 w-full py-1 ${activeTab === 'dashboard' ? 'text-indigo-500 font-semibold' : 'text-text-muted'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">{t.dashboard}</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center gap-1 w-full py-1 ${activeTab === 'calendar' ? 'text-indigo-500 font-semibold' : 'text-text-muted'}`}
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px]">{t.calendar}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center gap-1 w-full py-1 ${activeTab === 'analytics' ? 'text-indigo-500 font-semibold' : 'text-text-muted'}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">{t.analytics}</span>
        </button>

        <button
          onClick={() => setActiveTab('all-trades')}
          className={`flex flex-col items-center justify-center gap-1 w-full py-1 ${activeTab === 'all-trades' ? 'text-indigo-500 font-semibold' : 'text-text-muted'}`}
        >
          <List className="w-5 h-5" />
          <span className="text-[10px]">{t.allTrades}</span>
        </button>
      </nav>
    </>
  );
}
