"use client";

import { LayoutDashboard, Calendar as CalendarIcon, BarChart3, List, HelpCircle, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';

interface SidebarProps {
  activeTab: 'dashboard' | 'calendar' | 'analytics' | 'all-trades';
  setActiveTab: (tab: 'dashboard' | 'calendar' | 'analytics' | 'all-trades') => void;
  lang: 'tr' | 'en';
  startTour: () => void;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportJSON: () => void;
  handleExportCSV: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  lang,
  startTour,
  handleImport,
  handleExportJSON,
  handleExportCSV
}: SidebarProps) {
  const t = TRANSLATIONS[lang];

  return (
    <aside className="w-20 hidden md:flex flex-col items-center py-8 bg-bg-panel border-r border-border-main z-10 shrink-0 transition-colors duration-300">
      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/10 mb-12 border border-border-main bg-black flex items-center justify-center">
        <img src="/logo.png" alt="TradeJournal" className="w-full h-full object-cover" />
      </div>

      <nav className="flex flex-col gap-6 w-full items-center">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-3 rounded-xl group relative transition-all ${activeTab === 'dashboard' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-bg-hover text-text-muted hover:text-text-main hover:bg-border-hover'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.dashboard}</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`p-3 rounded-xl group relative transition-all ${activeTab === 'calendar' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-bg-hover text-text-muted hover:text-text-main hover:bg-border-hover'}`}
        >
          <CalendarIcon className="w-6 h-6" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.calendar}</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`p-3 rounded-xl group relative transition-all ${activeTab === 'analytics' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-bg-hover text-text-muted hover:text-text-main hover:bg-border-hover'}`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.analytics}</span>
        </button>

        <button
          onClick={() => setActiveTab('all-trades')}
          className={`p-3 rounded-xl group relative transition-all ${activeTab === 'all-trades' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-bg-hover text-text-muted hover:text-text-main hover:bg-border-hover'}`}
        >
          <List className="w-6 h-6" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.allTrades}</span>
        </button>
      </nav>

      {/* VERİ İÇE/DIŞA AKTARMA & EXCEL & YARDIM */}
      <div className="mt-auto flex flex-col gap-3">
        <button onClick={startTour} className="p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover group relative transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {t.tourStart}
          </span>
        </button>

        <button onClick={handleExportCSV} className="p-3 rounded-xl text-text-muted hover:text-emerald-500 hover:bg-emerald-500/10 group relative transition-colors">
          <FileSpreadsheet className="w-5 h-5" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.exportCSV}</span>
        </button>

        <label className="p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover group relative transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.importBackup}</span>
        </label>

        <button onClick={handleExportJSON} className="p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover group relative transition-colors">
          <Download className="w-5 h-5" />
          <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.exportBackup}</span>
        </button>
      </div>
    </aside>
  );
}
