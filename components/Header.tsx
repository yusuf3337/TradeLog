"use client";

import { Sun, Moon, Calculator, Plus, Search, X } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';
import { AccountType } from '@/types/trade';

interface HeaderProps {
  lang: 'tr' | 'en';
  theme: 'dark' | 'light';
  changeLang: (lang: 'tr' | 'en') => void;
  changeTheme: (theme: 'dark' | 'light') => void;
  setIsCalcOpen: (open: boolean) => void;
  filterAccount: 'Tümü' | AccountType;
  setFilterAccount: (acc: 'Tümü' | AccountType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  openNewTradeDrawer: () => void;
}

export default function Header({
  lang,
  theme,
  changeLang,
  changeTheme,
  setIsCalcOpen,
  filterAccount,
  setFilterAccount,
  searchQuery,
  setSearchQuery,
  activeTab,
  openNewTradeDrawer
}: HeaderProps) {
  const t = TRANSLATIONS[lang];

  return (
    <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-bg-panel/80 backdrop-blur-md border-b border-border-main shrink-0 z-10 transition-colors duration-300 gap-3">
      
      {/* Sol Logo & Başlık */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg overflow-hidden border border-border-main bg-black flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-base md:text-xl font-medium text-text-main tracking-wide">{t.appTitle}</h1>
          <p className="text-[10px] md:text-xs text-text-muted mt-0.5 hidden lg:block">{t.appSubtitle}</p>
        </div>
      </div>

      {/* Orta Arama Barı (Arama & Filtreleme) */}
      <div className="flex-1 max-w-xs md:max-w-md relative hidden sm:block">
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-bg-input border border-border-main rounded-full pl-10 pr-9 py-2 text-xs text-text-main focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-text-muted hover:text-text-main">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sağ Aksiyonlar */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">

        {/* Dil ve Tema Seçimi */}
        <div className="flex items-center gap-1 md:gap-2 mr-1 border-r border-border-main pr-2 md:pr-4">
          <button onClick={() => changeLang(lang === 'tr' ? 'en' : 'tr')} className="text-xs font-bold bg-bg-input border border-border-main px-2 py-1.5 rounded-lg text-text-main hover:bg-border-hover transition-colors">
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <button onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 bg-bg-input border border-border-main rounded-lg text-text-main hover:bg-border-hover transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Lot Hesaplayıcı Butonu */}
        <button
          onClick={() => setIsCalcOpen(true)}
          className="bg-bg-input border border-border-main hover:bg-border-hover text-text-main px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
          title="MT5 Lot & Risk Hesaplayıcı"
        >
          <Calculator className="w-4 h-4 text-indigo-500" />
          <span className="hidden md:inline">{t.calculator}</span>
        </button>

        {/* Account Type Filter Pills (DESKTOP) */}
        <div className="hidden lg:flex bg-bg-app border border-border-main rounded-full p-1 gap-0.5">
          {[
            { label: t.all, val: 'Tümü' },
            { label: t.personal, val: 'Kişisel' },
            { label: t.propFirm, val: 'Fon (Prop)' },
            { label: t.demo, val: 'Demo' }
          ].map((acc) => (
            <button
              key={acc.val}
              onClick={() => setFilterAccount(acc.val as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterAccount === acc.val ? 'bg-indigo-500/20 text-indigo-500' : 'text-text-muted hover:text-text-main'}`}
            >
              {acc.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <button
            onClick={openNewTradeDrawer}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> <span>{t.newTrade}</span>
          </button>
        )}
      </div>
    </header>
  );
}
