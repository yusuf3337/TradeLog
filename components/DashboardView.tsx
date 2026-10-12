"use client";

import { useState, useMemo, useEffect } from 'react';
import { Target, Activity, DollarSign, TrendingUp, ShieldAlert, List, ArrowUpRight, ArrowDownRight, Briefcase, FlaskConical, Clock, CheckCircle2, AlertTriangle, ImageIcon, Pencil, Trash2, CalendarDays, Sliders, Check, X, Shield, Sparkles, Trophy } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';
import { Trade, AccountType, TradeType } from '@/types/trade';

interface DashboardViewProps {
  lang: 'tr' | 'en';
  filterAccount: 'Tümü' | AccountType;
  filterType: 'Tümü' | TradeType;
  setFilterType: (type: 'Tümü' | TradeType) => void;
  filteredTrades: Trade[];
  todayPnL: number;
  winRate: number;
  totalTrades: number;
  totalRR: number;
  totalPnL: number;
  quote: string;
  activeTab: string;
  handleEdit: (trade: Trade) => void;
  handleDelete: (id: string) => void;
  setSelectedImagePreview: (url: string | null) => void;
}

export default function DashboardView({
  lang,
  filterAccount,
  filterType,
  setFilterType,
  filteredTrades,
  todayPnL,
  winRate,
  totalTrades,
  totalRR,
  totalPnL,
  quote,
  activeTab,
  handleEdit,
  handleDelete,
  setSelectedImagePreview
}: DashboardViewProps) {
  const t = TRANSLATIONS[lang];
  const [statPeriod, setStatPeriod] = useState<'month' | 'week' | 'all'>('month');

  // Aylık Kâr Hedefi ve Maksimum Drawdown Limitleri (localStorage kalıcı)
  const [monthlyTargetPnL, setMonthlyTargetPnL] = useState<number>(2000);
  const [monthlyMaxLoss, setMonthlyMaxLoss] = useState<number>(1000);
  const [isEditingGoals, setIsEditingGoals] = useState<boolean>(false);
  const [tempTargetPnL, setTempTargetPnL] = useState<string>('2000');
  const [tempMaxLoss, setTempMaxLoss] = useState<string>('1000');

  useEffect(() => {
    const savedTarget = localStorage.getItem('@tradevault_monthly_target_pnl');
    const savedLoss = localStorage.getItem('@tradevault_monthly_max_loss');
    if (savedTarget && !isNaN(parseFloat(savedTarget))) {
      setMonthlyTargetPnL(parseFloat(savedTarget));
      setTempTargetPnL(savedTarget);
    }
    if (savedLoss && !isNaN(parseFloat(savedLoss))) {
      setMonthlyMaxLoss(parseFloat(savedLoss));
      setTempMaxLoss(savedLoss);
    }
  }, []);

  const handleSaveGoals = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTarget = tempTargetPnL.toString().replace(',', '.').trim();
    const cleanLoss = tempMaxLoss.toString().replace(',', '.').trim();

    const parsedTarget = parseFloat(cleanTarget);
    const parsedLoss = parseFloat(cleanLoss);

    if (isNaN(parsedTarget) || parsedTarget <= 0 || isNaN(parsedLoss) || parsedLoss <= 0) {
      return;
    }

    // Risk Mantığı Kuralı: Kayıp limiti kâr hedefini aşamaz
    if (parsedLoss > parsedTarget) {
      alert(t.invalidDrawdownError.replace('${loss}', parsedLoss.toLocaleString()).replace('${target}', parsedTarget.toLocaleString()));
      return;
    }

    setMonthlyTargetPnL(parsedTarget);
    setMonthlyMaxLoss(parsedLoss);
    localStorage.setItem('@tradevault_monthly_target_pnl', parsedTarget.toString());
    localStorage.setItem('@tradevault_monthly_max_loss', parsedLoss.toString());
    setIsEditingGoals(false);
  };

  // Mevcut ay ismi (Türkçe / İngilizce)
  const currentMonthName = useMemo(() => {
    const month = new Date().toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1);
  }, [lang]);

  // Seçili periyoda göre filtrelenmiş işlemler
  const periodTrades = useMemo(() => {
    if (statPeriod === 'all') return filteredTrades;

    const now = new Date();
    if (statPeriod === 'month') {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-indexed
      return filteredTrades.filter(tr => {
        if (!tr.date) return false;
        const [y, m] = tr.date.split('-').map(Number);
        return y === currentYear && (m - 1) === currentMonth;
      });
    }

    if (statPeriod === 'week') {
      const nowCopy = new Date(now);
      const day = nowCopy.getDay();
      // Pazartesi başlangıcı (Pazar 0 ise -6, diğer günler 1 - day)
      const diffToMonday = nowCopy.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(nowCopy);
      monday.setDate(diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      return filteredTrades.filter(tr => {
        if (!tr.date) return false;
        const [y, m, d] = tr.date.split('-').map(Number);
        const tradeDate = new Date(y, m - 1, d);
        return tradeDate >= monday && tradeDate <= sunday;
      });
    }

    return filteredTrades;
  }, [filteredTrades, statPeriod]);

  // Periyot bazlı metrik hesaplamaları
  const periodTotalTrades = periodTrades.length;
  const periodWinTrades = periodTrades.filter(tr => tr.result === 'Win').length;
  const periodWinRate = periodTotalTrades > 0 ? Math.round((periodWinTrades / periodTotalTrades) * 100) : 0;
  const periodRR = periodTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? curr.rr : (curr.result === 'Loss' ? -(curr.rr > 0 ? curr.rr : 1) : 0)), 0);
  const periodPnL = periodTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);

  // Mevcut ayın net kâr / zararı (Hedef radarı için her zaman mevcut ay hesaplanır)
  const currentMonthPnL = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return filteredTrades.filter(tr => {
      if (!tr.date) return false;
      const [y, m] = tr.date.split('-').map(Number);
      return y === currentYear && (m - 1) === currentMonth;
    }).reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);
  }, [filteredTrades]);

  // Kâr hedefi ilerlemesi (%)
  const profitProgressPct = useMemo(() => {
    if (monthlyTargetPnL <= 0) return 0;
    if (currentMonthPnL <= 0) return 0;
    return Math.min(100, Math.round((currentMonthPnL / monthlyTargetPnL) * 100));
  }, [currentMonthPnL, monthlyTargetPnL]);

  // Drawdown kullanım oranı (%)
  const drawdownPct = useMemo(() => {
    if (monthlyMaxLoss <= 0) return 0;
    if (currentMonthPnL >= 0) return 0;
    return Math.min(100, Math.round((Math.abs(currentMonthPnL) / monthlyMaxLoss) * 100));
  }, [currentMonthPnL, monthlyMaxLoss]);

  // Hedeflenen Risk/Ödül Oranı (Hedef / Drawdown)
  const goalRRRatio = useMemo(() => {
    if (monthlyMaxLoss <= 0 || monthlyTargetPnL <= 0) return null;
    return (monthlyTargetPnL / monthlyMaxLoss).toFixed(2);
  }, [monthlyTargetPnL, monthlyMaxLoss]);

  // Modal Canlı Validasyon & Risk/Ödül Analizi
  const numTargetInput = parseFloat(tempTargetPnL.toString().replace(',', '.'));
  const numLossInput = parseFloat(tempMaxLoss.toString().replace(',', '.'));
  const isTargetValid = !isNaN(numTargetInput) && numTargetInput > 0;
  const isLossValid = !isNaN(numLossInput) && numLossInput > 0;
  const isDrawdownBiggerThanTarget = isTargetValid && isLossValid && numLossInput > numTargetInput;
  const liveRRRatio = isTargetValid && isLossValid && numLossInput > 0 ? (numTargetInput / numLossInput) : null;

  return (
    <>
      {/* Prop Firm DD Uyarı Kartı */}
      {filterAccount === 'Fon (Prop)' && todayPnL < 0 && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-rose-500 font-medium text-sm">{t.ddWarningTitle}</h4>
              <p className="text-rose-500/70 text-xs mt-0.5">{t.ddWarningDesc.replace('${amount}', Math.abs(todayPnL).toString())}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vitrin Üst Barı: Başlık & Periyot Filtresi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-main flex items-center gap-2">
            <span>{t.performanceOverview}</span>
            {statPeriod === 'month' && (
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {currentMonthName}
              </span>
            )}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {statPeriod === 'month' 
              ? (lang === 'tr' ? `${currentMonthName} ayı kümülatif işlem karnesi` : `Cumulative metrics for ${currentMonthName}`)
              : statPeriod === 'week'
              ? (lang === 'tr' ? 'Bu haftaki işlem karnesi' : 'Trading performance for this week')
              : (lang === 'tr' ? 'Tüm zamanların toplam işlem karnesi' : 'All-time cumulative trading record')}
          </p>
        </div>

        {/* Periyot Seçici Toggle (Pill) */}
        <div className="inline-flex bg-bg-panel border border-border-main p-1 rounded-2xl gap-1 self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setStatPeriod('month')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statPeriod === 'month'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
            }`}
          >
            {t.thisMonth}
          </button>
          <button
            onClick={() => setStatPeriod('week')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statPeriod === 'week'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
            }`}
          >
            {t.thisWeek}
          </button>
          <button
            onClick={() => setStatPeriod('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statPeriod === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-text-muted hover:text-text-main hover:bg-bg-hover'
            }`}
          >
            {t.allTime}
          </button>
        </div>
      </div>

      {/* İstatistik Vitrini - Terminal Estetiği */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6">
        {/* Kazanma Oranı */}
        <div className="bg-bg-panel border border-border-main p-5 rounded-2xl transition-all hover:border-zinc-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
                  {statPeriod === 'month' ? t.monthlyWinRate : statPeriod === 'week' ? t.weeklyWinRate : t.allTimeWinRate}
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            </div>
            <h2 className="text-3xl font-light font-mono text-text-main my-2 tracking-tight">% {periodWinRate}</h2>
          </div>
          <div className="pt-2 border-t border-border-main/50 flex flex-wrap items-center justify-between gap-1 text-[11px] text-text-muted font-mono">
            <span>{periodTotalTrades} {t.basedOn}</span>
            {statPeriod !== 'all' && (
              <span className="text-text-muted/70">
                {t.overallRef}: %{winRate}
              </span>
            )}
          </div>
        </div>

        {/* Net RR */}
        <div className="bg-bg-panel border border-border-main p-5 rounded-2xl transition-all hover:border-zinc-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
                  {statPeriod === 'month' ? t.monthlyNetRR : statPeriod === 'week' ? t.weeklyNetRR : t.allTimeNetRR}
                </span>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${periodRR >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            </div>
            <h2 className={`text-3xl font-light font-mono my-2 tracking-tight ${periodRR >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {periodRR > 0 ? '+' : ''}{periodRR.toFixed(2)}R
            </h2>
          </div>
          <div className="pt-2 border-t border-border-main/50 flex flex-wrap items-center justify-between gap-1 text-[11px] text-text-muted font-mono">
            <span>{t.periodCumulativeRR}</span>
            {statPeriod !== 'all' && (
              <span className="text-text-muted/70">
                {t.overallRef}: {totalRR > 0 ? '+' : ''}{totalRR.toFixed(1)}R
              </span>
            )}
          </div>
        </div>

        {/* Net PnL */}
        <div className="bg-bg-panel border border-border-main p-5 rounded-2xl transition-all hover:border-zinc-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
                  {statPeriod === 'month' ? t.monthlyNetPnL : statPeriod === 'week' ? t.weeklyNetPnL : t.allTimeNetPnL}
                </span>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${periodPnL >= 0 ? 'bg-cyan-400' : 'bg-rose-400'}`}></span>
            </div>
            <h2 className={`text-3xl font-light font-mono my-2 tracking-tight ${periodPnL >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              {periodPnL > 0 ? '+' : ''}${periodPnL.toLocaleString()}
            </h2>
          </div>
          <div className="pt-2 border-t border-border-main/50 flex flex-wrap items-center justify-between gap-1 text-[11px] text-text-muted font-mono">
            <span>{t.periodRealizedAmount}</span>
            {statPeriod !== 'all' && (
              <span className="text-text-muted/70">
                {t.overallRef}: {totalPnL > 0 ? '+' : ''}${totalPnL.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Motivasyon / Trader Notu */}
        <div className="bg-bg-panel border border-border-main p-5 rounded-2xl transition-all hover:border-zinc-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
                  {t.dailyMotivation}
                </span>
              </div>
            </div>
            <p className="text-xs text-text-muted my-2 italic line-clamp-2 leading-relaxed">
              "{quote}"
            </p>
          </div>
          <div className="pt-2 border-t border-border-main/50 text-[10px] text-text-muted/60 font-mono uppercase tracking-wider">
            TradeVault Mindset
          </div>
        </div>
      </div>

      {/* Aylık Hedef & Risk Radarı - Terminal Tasarımı */}
      <div className="bg-bg-panel border border-border-main rounded-2xl p-5 mb-8 transition-all hover:border-zinc-700/80 shadow-xs">
        {/* Üst Bar: Başlık, Terminal Rozeti & Düzenle Butonu */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3 pb-3 border-b border-border-main/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-main">
              {t.monthlyGoalRadar}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-app border border-border-main text-text-muted">
              {currentMonthName}
            </span>
            {goalRRRatio && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hidden sm:inline-block">
                1 : {goalRRRatio} R:R
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setTempTargetPnL(monthlyTargetPnL.toString());
              setTempMaxLoss(monthlyMaxLoss.toString());
              setIsEditingGoals(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-bg-app hover:bg-bg-hover border border-border-main text-text-muted hover:text-text-main transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.setGoals}</span>
          </button>
        </div>

        {/* İkili İlerleme Göstergesi (Kâr Hedefi & Drawdown Koruma Marjı) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 1. Kâr Hedefi İlerlemesi */}
          <div className="bg-bg-app border border-border-main/70 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
                  {t.profitTarget}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  %{profitProgressPct}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2.5 flex-wrap gap-1">
                <div>
                  <span className={`text-2xl font-light font-mono ${currentMonthPnL > 0 ? 'text-emerald-400' : 'text-text-main'}`}>
                    {currentMonthPnL > 0 ? '+' : ''}${currentMonthPnL.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-muted ml-1.5 font-mono">/ ${monthlyTargetPnL.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  {currentMonthPnL >= monthlyTargetPnL ? (
                    <span className="text-xs text-emerald-400 font-medium font-mono flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 inline text-amber-400" />
                      {t.targetReached}
                    </span>
                  ) : (
                    <span className="text-[11px] text-text-muted font-mono">
                      {t.remainingToTarget}: <span className="text-text-main font-semibold">${Math.max(0, monthlyTargetPnL - (currentMonthPnL > 0 ? currentMonthPnL : 0)).toLocaleString()}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Terminal Çubuğu */}
              <div className="w-full h-2 rounded-full bg-bg-panel border border-border-main overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(profitProgressPct > 0 ? 2 : 0, profitProgressPct))}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 2. Maksimum Zarar / Drawdown Koruma Marjı */}
          <div className="bg-bg-app border border-border-main/70 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-medium">
                  {t.maxDrawdownLimit}
                </span>
                <span className={`text-xs font-mono font-bold ${drawdownPct > 70 ? 'text-rose-400' : 'text-text-muted'}`}>
                  %{drawdownPct} {t.drawdownUsed}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2.5 flex-wrap gap-1">
                <div>
                  <span className={`text-2xl font-light font-mono ${currentMonthPnL < 0 ? 'text-rose-400' : 'text-text-main'}`}>
                    ${currentMonthPnL < 0 ? Math.abs(currentMonthPnL).toLocaleString() : '0'}
                  </span>
                  <span className="text-xs text-text-muted ml-1.5 font-mono">/ ${monthlyMaxLoss.toLocaleString()} limit</span>
                </div>
                <div className="text-right">
                  {currentMonthPnL < 0 && Math.abs(currentMonthPnL) >= monthlyMaxLoss ? (
                    <span className="text-[11px] text-rose-400 font-medium font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 inline text-rose-500" />
                      {t.drawdownExceeded}
                    </span>
                  ) : currentMonthPnL < 0 && drawdownPct >= 70 ? (
                    <span className="text-[11px] text-amber-400 font-medium font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 inline text-amber-400" />
                      {t.drawdownDanger}
                    </span>
                  ) : (
                    <span className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      {t.drawdownSafe} (${Math.max(0, monthlyMaxLoss - (currentMonthPnL < 0 ? Math.abs(currentMonthPnL) : 0)).toLocaleString()})
                    </span>
                  )}
                </div>
              </div>

              {/* Terminal Drawdown Çubuğu */}
              <div className="w-full h-2 rounded-full bg-bg-panel border border-border-main overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    drawdownPct >= 80 ? 'bg-rose-500' :
                    drawdownPct >= 50 ? 'bg-amber-500' :
                    'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(drawdownPct > 0 ? 2 : 0, drawdownPct))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hedef Belirleme Modalı */}
      {isEditingGoals && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-panel border border-border-main rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-main">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-text-main uppercase tracking-wider">{t.editGoalsModalTitle}</h3>
                  <p className="text-[11px] text-text-muted">Aylık sermaye ve risk planı</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingGoals(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoals} noValidate className="space-y-4">
              {/* Kâr Hedefi */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-text-muted uppercase tracking-wider">
                    {t.profitTarget} ($)
                  </label>
                  <span className="text-[10px] text-text-muted font-mono">Hedeflenen getiri</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    placeholder="Örn: 50, 100, 1000..."
                    value={tempTargetPnL}
                    onChange={(e) => setTempTargetPnL(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-bg-app border border-border-main rounded-xl text-text-main font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                {/* Hızlı Ön Tanımlar */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] font-mono text-text-muted mr-1">Öneriler:</span>
                  {[50, 100, 250, 500, 1000, 2000].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setTempTargetPnL(val.toString())}
                      className="px-2 py-0.5 rounded text-[10px] bg-bg-app hover:bg-bg-hover border border-border-main text-text-muted hover:text-text-main font-mono transition-colors cursor-pointer"
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maksimum Drawdown Limiti */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-text-muted uppercase tracking-wider">
                    {t.maxDrawdownLimit} ($)
                  </label>
                  <span className="text-[10px] text-text-muted font-mono">Maks. kayıp toleransı</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    placeholder="Örn: 25, 50, 500..."
                    value={tempMaxLoss}
                    onChange={(e) => setTempMaxLoss(e.target.value)}
                    className={`w-full pl-8 pr-4 py-2 bg-bg-app border rounded-xl text-text-main font-mono text-sm focus:outline-none transition-colors ${
                      isDrawdownBiggerThanTarget ? 'border-rose-500/80 bg-rose-500/5' : 'border-border-main focus:border-rose-500'
                    }`}
                  />
                </div>
                {/* Hızlı Ön Tanımlar */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] font-mono text-text-muted mr-1">Öneriler:</span>
                  {[25, 50, 100, 250, 500].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setTempMaxLoss(val.toString())}
                      className="px-2 py-0.5 rounded text-[10px] bg-bg-app hover:bg-bg-hover border border-border-main text-text-muted hover:text-text-main font-mono transition-colors cursor-pointer"
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canlı Risk:Ödül (R:R) Barometresi */}
              {isTargetValid && isLossValid && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-bg-app border border-border-main text-xs font-mono">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Activity className="w-3.5 h-3.5 text-zinc-400" />
                    {t.riskRewardRatio}:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-main">
                      1 : {liveRRRatio ? liveRRRatio.toFixed(2) : '-'} R
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isDrawdownBiggerThanTarget ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      liveRRRatio && liveRRRatio >= 1.5 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isDrawdownBiggerThanTarget ? t.poorRRBadge : t.healthyRRBadge}
                    </span>
                  </div>
                </div>
              )}

              {/* Hata Uyarısı: Drawdown Kâr Hedefinden Büyük Olduğunda */}
              {isDrawdownBiggerThanTarget && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-400 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div className="leading-relaxed">
                    <div className="font-semibold text-rose-400 mb-0.5">Mantıksız Risk/Ödül Parametresi</div>
                    {t.invalidDrawdownError.replace('${loss}', numLossInput.toLocaleString()).replace('${target}', numTargetInput.toLocaleString())}
                  </div>
                </div>
              )}

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsEditingGoals(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isDrawdownBiggerThanTarget || !isTargetValid || !isLossValid}
                  className={`px-5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    isDrawdownBiggerThanTarget || !isTargetValid || !isLossValid
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.saveGoals}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* İşlem Günlüğü (Timeline) Başlık & Filtreler */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-text-main">{t.recentTrades}</h3>
          <div className="text-xs text-text-muted mt-1">{t.recentTradesDesc}</div>
        </div>

        <div className="flex bg-bg-panel border border-border-main rounded-full p-1 overflow-x-auto hide-scrollbar">
          {[t.all, t.scalp, t.dayTrade, t.swing].map((type, idx) => {
            const typeVal = idx === 0 ? 'Tümü' : idx === 1 ? 'Scalp' : idx === 2 ? 'Day Trade' : 'Swing';
            return (
              <button
                key={type}
                onClick={() => setFilterType(typeVal as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filterType === typeVal ? 'bg-indigo-500/20 text-indigo-500' : 'text-text-muted hover:text-text-main'}`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {filteredTrades.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-hover rounded-3xl bg-bg-panel">
          <div className="w-16 h-16 bg-bg-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <List className="w-8 h-8 text-text-muted" />
          </div>
          <h4 className="text-text-main font-medium mb-1">{t.notFoundTitle}</h4>
          <p className="text-sm text-text-muted">{t.notFoundDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTrades.map((trade) => (
            <div key={trade.id} className="bg-bg-panel border border-border-main rounded-2xl p-5 hover:border-border-hover transition-colors group flex flex-col xl:flex-row gap-6 relative overflow-hidden">

              {/* Plan Sadakati Bandı */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${trade.followedPlan ? 'bg-emerald-500/50' : 'bg-rose-500/50'}`}></div>

              {/* Sol Kısım */}
              <div className="flex items-center gap-5 xl:w-[30%] shrink-0 pl-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  trade.result === 'Win' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  trade.result === 'Loss' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                  'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                }`}>
                  {trade.direction === 'Long' ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownRight className="w-7 h-7" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-text-main font-medium text-lg tracking-tight">{trade.symbol}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                      trade.result === 'Win' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                      trade.result === 'Loss' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                      'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {trade.result === 'Win' ? t.win : trade.result === 'Loss' ? t.loss : t.be}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border flex items-center gap-1 ${
                      trade.account === 'Fon (Prop)' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                      trade.account === 'Demo' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      'bg-bg-hover text-text-muted border-border-main'
                    }`}>
                      {trade.account === 'Fon (Prop)' ? <Briefcase className="w-3 h-3" /> :
                       trade.account === 'Demo' ? <FlaskConical className="w-3 h-3" /> :
                       <Activity className="w-3 h-3" />}
                      {trade.account}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-2 truncate">
                    <Clock className="w-3 h-3" /> {trade.date} {trade.time}
                    <span className="w-1 h-1 bg-border-hover rounded-full"></span>
                    <span className="text-indigo-500/80">{trade.type === 'Scalp' ? t.scalp : trade.type === 'Day Trade' ? t.dayTrade : t.swing}</span>
                  </div>

                  {(trade.entryPrice || trade.lotSize) && (
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted font-mono">
                      {trade.lotSize && <span>Lot: <b className="text-text-main">{trade.lotSize}</b></span>}
                      {trade.entryPrice && <span>Gir: <b className="text-text-main">{trade.entryPrice}</b></span>}
                      {trade.riskPercent && <span>Risk: <b className="text-rose-500">%{trade.riskPercent}</b></span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Orta Kısım */}
              <div className="flex-1 grid grid-cols-3 gap-4 items-center px-0 xl:px-6 xl:border-x border-border-main">
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 text-center xl:text-left">{t.rrResult}</div>
                  <div className={`text-base font-medium text-center xl:text-left ${trade.result === 'Win' ? 'text-emerald-500' : trade.result === 'Loss' ? 'text-rose-500' : 'text-text-muted'}`}>
                    {trade.result === 'Loss' ? `-${trade.rr > 0 ? trade.rr : 1}R` : trade.result === 'Win' ? `+${trade.rr}R` : '0R'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 text-center xl:text-left">{t.pnlAmount}</div>
                  <div className={`text-base font-medium text-center xl:text-left ${trade.result === 'Win' ? 'text-cyan-500' : trade.result === 'Loss' ? 'text-rose-500' : 'text-text-muted'}`}>
                    {trade.result === 'Loss' ? `-$${Math.abs(trade.pnl)}` : trade.result === 'Win' ? `+$${Math.abs(trade.pnl)}` : '$0'}
                  </div>
                </div>
                <div className="flex flex-col items-center xl:items-start">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t.followedPlan}</div>
                  {trade.followedPlan ? (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md"><CheckCircle2 className="w-3 h-3" /> {t.yes}</div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md"><AlertTriangle className="w-3 h-3" /> {t.no}</div>
                  )}
                </div>
              </div>

              {/* Sağ Kısım */}
              <div className="xl:w-[30%] flex flex-col justify-between shrink-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {trade.setup && <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded border border-indigo-500/20">{trade.setup}</span>}
                  {trade.psychology.slice(0, 2).map(p => (
                    <span key={p} className="text-[10px] px-2 py-0.5 bg-bg-hover text-text-muted rounded border border-border-main">{p}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-xs text-text-muted line-clamp-2 italic max-w-[80%] pr-2">
                    {trade.notes || t.noNotes}
                  </p>

                  <div className="flex gap-1 shrink-0">
                    {trade.imageUrl && (
                      <button
                        onClick={() => setSelectedImagePreview(trade.imageUrl!)}
                        className="text-text-muted hover:text-indigo-500 transition-colors p-2 bg-bg-hover rounded-lg hover:bg-border-hover"
                        title={t.viewChart}
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}

                    <button onClick={() => handleEdit(trade)} className="text-text-muted hover:text-indigo-500 transition-colors p-2 bg-bg-hover rounded-lg hover:bg-border-hover">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(trade.id)} className="text-text-muted hover:text-rose-500 transition-colors p-2 bg-bg-hover rounded-lg hover:bg-rose-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </>
  );
}
