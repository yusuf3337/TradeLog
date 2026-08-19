"use client";

import { useMemo } from 'react';
import { BarChart3, TrendingUp, Zap, CheckCircle2, AlertTriangle, Award, PieChart, Clock, Globe, Sun, Moon } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';
import { Trade, AccountType } from '@/types/trade';

interface AnalyticsViewProps {
  lang: 'tr' | 'en';
  filterAccount: 'Tümü' | AccountType;
  setFilterAccount: (acc: 'Tümü' | AccountType) => void;
  filteredTrades: Trade[];
  totalPnL: number;
}

export default function AnalyticsView({
  lang,
  filterAccount,
  setFilterAccount,
  filteredTrades,
  totalPnL
}: AnalyticsViewProps) {
  const t = TRANSLATIONS[lang];

  const chronologicalTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredTrades]);

  const equityData = useMemo(() => {
    let cumPnL = 0;
    return chronologicalTrades.map((t, idx) => {
      const tradePnL = t.result === 'Win' ? Math.abs(t.pnl) : (t.result === 'Loss' ? -Math.abs(t.pnl) : 0);
      cumPnL += tradePnL;
      return {
        index: idx + 1,
        date: t.date,
        symbol: t.symbol,
        pnl: tradePnL,
        cumPnL
      };
    });
  }, [chronologicalTrades]);

  const planFollowedTrades = filteredTrades.filter(t => t.followedPlan);
  const planNotFollowedTrades = filteredTrades.filter(t => !t.followedPlan);

  const planWinRate = planFollowedTrades.length > 0
    ? Math.round((planFollowedTrades.filter(t => t.result === 'Win').length / planFollowedTrades.length) * 100)
    : 0;

  const noPlanWinRate = planNotFollowedTrades.length > 0
    ? Math.round((planNotFollowedTrades.filter(t => t.result === 'Win').length / planNotFollowedTrades.length) * 100)
    : 0;

  const emotionStats = useMemo(() => {
    const map = new Map<string, { count: number; pnl: number; win: number }>();
    filteredTrades.forEach(tr => {
      const tradePnL = tr.result === 'Win' ? Math.abs(tr.pnl) : (tr.result === 'Loss' ? -Math.abs(tr.pnl) : 0);
      const emotions = tr.psychology && tr.psychology.length > 0 ? tr.psychology : ['Belirtilmedi'];
      emotions.forEach(emo => {
        if (!map.has(emo)) map.set(emo, { count: 0, pnl: 0, win: 0 });
        const item = map.get(emo)!;
        item.count++;
        item.pnl += tradePnL;
        if (tr.result === 'Win') item.win++;
      });
    });
    return Array.from(map.entries()).map(([emotion, stat]) => ({
      emotion,
      count: stat.count,
      pnl: stat.pnl,
      winRate: Math.round((stat.win / stat.count) * 100)
    })).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  const symbolStats = useMemo(() => {
    const map = new Map<string, { count: number; pnl: number; win: number }>();
    filteredTrades.forEach(tr => {
      const tradePnL = tr.result === 'Win' ? Math.abs(tr.pnl) : (tr.result === 'Loss' ? -Math.abs(tr.pnl) : 0);
      if (!map.has(tr.symbol)) map.set(tr.symbol, { count: 0, pnl: 0, win: 0 });
      const item = map.get(tr.symbol)!;
      item.count++;
      item.pnl += tradePnL;
      if (tr.result === 'Win') item.win++;
    });
    return Array.from(map.entries()).map(([symbol, stat]) => ({
      symbol,
      count: stat.count,
      pnl: stat.pnl,
      winRate: Math.round((stat.win / stat.count) * 100)
    })).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades]);

  const sessionStats = useMemo(() => {
    const sessions = [
      { id: 'asia', name: t.asiaSession, icon: Globe, range: [0, 8], colorClass: 'border-indigo-500/20 text-indigo-500 bg-indigo-500/10' },
      { id: 'london', name: t.londonSession, icon: Sun, range: [8, 13], colorClass: 'border-amber-500/20 text-amber-500 bg-amber-500/10' },
      { id: 'nyAm', name: t.nyAmSession, icon: Zap, range: [13, 17], colorClass: 'border-cyan-500/20 text-cyan-500 bg-cyan-500/10' },
      { id: 'nyPm', name: t.nyPmSession, icon: Clock, range: [17, 22], colorClass: 'border-purple-500/20 text-purple-500 bg-purple-500/10' },
      { id: 'night', name: t.nightSession, icon: Moon, range: [22, 24], colorClass: 'border-zinc-500/20 text-zinc-400 bg-zinc-500/10' }
    ];

    const stats = sessions.map(s => {
      const tradesInSession = filteredTrades.filter(tr => {
        if (!tr.time) return false;
        const hour = parseInt(tr.time.split(':')[0], 10);
        if (isNaN(hour)) return false;
        return hour >= s.range[0] && hour < s.range[1];
      });

      const count = tradesInSession.length;
      const winCount = tradesInSession.filter(tr => tr.result === 'Win').length;
      const winRate = count > 0 ? Math.round((winCount / count) * 100) : 0;
      const pnl = tradesInSession.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);

      return {
        ...s,
        count,
        winCount,
        winRate,
        pnl
      };
    });

    let bestSessionId = '';
    let maxPnL = -Infinity;
    stats.forEach(s => {
      if (s.count > 0 && s.pnl > maxPnL) {
        maxPnL = s.pnl;
        bestSessionId = s.id;
      }
    });

    return stats.map(s => ({
      ...s,
      isBest: s.id === bestSessionId && maxPnL > 0
    }));
  }, [filteredTrades, t]);

  const hourlyStats = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hourStr = i.toString().padStart(2, '0');
      const tradesInHour = filteredTrades.filter(tr => {
        if (!tr.time) return false;
        const hour = parseInt(tr.time.split(':')[0], 10);
        return hour === i;
      });

      const count = tradesInHour.length;
      const winCount = tradesInHour.filter(tr => tr.result === 'Win').length;
      const winRate = count > 0 ? Math.round((winCount / count) * 100) : 0;
      const pnl = tradesInHour.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);

      return {
        hour: i,
        label: `${hourStr}:00`,
        count,
        winRate,
        pnl
      };
    });

    const maxAbsPnL = Math.max(1, ...hours.map(h => Math.abs(h.pnl)));
    return { hours, maxAbsPnL };
  }, [filteredTrades]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Başlık Kartı & Hesap Filtreleyici */}
      <div className="bg-bg-panel border border-border-main p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-main">{t.analytics}</h2>
            <p className="text-xs text-text-muted mt-0.5">{t.analyticsDesc}</p>
          </div>
        </div>

        {/* Analiz Sekmesine Özel Hesap Seçici */}
        <div className="flex items-center gap-2 bg-bg-app border border-border-main rounded-full p-1.5 overflow-x-auto hide-scrollbar">
          <span className="text-[11px] font-medium text-text-muted pl-2 hidden sm:inline">Hesap Filtresi:</span>
          {[
            { label: t.all, val: 'Tümü' },
            { label: t.personal, val: 'Kişisel' },
            { label: t.propFirm, val: 'Fon (Prop)' },
            { label: t.demo, val: 'Demo' }
          ].map((acc) => (
            <button
              key={acc.val}
              onClick={() => setFilterAccount(acc.val as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${filterAccount === acc.val ? 'bg-indigo-600 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. EQUITY CURVE (SERMAYE BÜYÜME GRAFİĞİ - CUSTOM SVG) */}
      <div className="bg-bg-panel border border-border-main rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-text-main flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> {t.equityCurveTitle}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Filtrelenen Hesap: <b className="text-indigo-500 font-semibold">{filterAccount}</b>
            </p>
          </div>
          <span className={`text-xl font-mono font-bold ${totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalPnL > 0 ? '+' : ''}${totalPnL.toLocaleString()}
          </span>
        </div>

        {equityData.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-sm border border-dashed border-border-main rounded-2xl">
            Bu hesap türü için henüz kaydedilmiş işlem bulunmuyor.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-150 h-65 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={totalPnL >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={totalPnL >= 0 ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="40" y1="20" x2="780" y2="20" stroke="currentColor" className="text-border-main" strokeDasharray="4 4" opacity="0.3" />
                <line x1="40" y1="120" x2="780" y2="120" stroke="currentColor" className="text-border-main" strokeDasharray="4 4" opacity="0.5" />
                <line x1="40" y1="220" x2="780" y2="220" stroke="currentColor" className="text-border-main" strokeDasharray="4 4" opacity="0.3" />

                {(() => {
                  const minVal = Math.min(0, ...equityData.map(d => d.cumPnL));
                  const maxVal = Math.max(100, ...equityData.map(d => d.cumPnL));
                  const range = (maxVal - minVal) || 1;

                  const points = equityData.map((d, i) => {
                    const x = 40 + (i / Math.max(1, equityData.length - 1)) * 740;
                    const y = 220 - ((d.cumPnL - minVal) / range) * 200;
                    return `${x},${y}`;
                  });

                  const pathD = `M ${points.join(' L ')}`;
                  const areaD = `M 40,220 L ${points.join(' L ')} L 780,220 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#equityGrad)" />
                      <path d={pathD} fill="none" stroke={totalPnL >= 0 ? '#10b981' : '#f43f5e'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      {equityData.map((d, i) => {
                        const x = 40 + (i / Math.max(1, equityData.length - 1)) * 740;
                        const y = 220 - ((d.cumPnL - minVal) / range) * 200;
                        return (
                          <g key={i} className="group/node">
                            <circle cx={x} cy={y} r="5" fill={totalPnL >= 0 ? '#10b981' : '#f43f5e'} className="transition-transform group-hover/node:r-7" />
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 2. SEANS & SAATLİK PERFORMANS ANALİZİ */}
      <div className="bg-bg-panel border border-border-main rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-medium text-text-main flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-indigo-500" /> {t.sessionTitle}
          </h3>
          <p className="text-xs text-text-muted">{t.sessionDesc}</p>
        </div>

        {/* Seans Kartları Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sessionStats.map(s => {
            const IconComp = s.icon;
            return (
              <div
                key={s.id}
                className={`bg-bg-app border rounded-2xl p-4 flex flex-col justify-between transition-all relative ${
                  s.isBest ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30' : 'border-border-main'
                }`}
              >
                {s.isBest && (
                  <div className="absolute -top-2.5 right-3 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3" /> {t.bestSessionBadge}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.colorClass}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-text-main truncate">{s.name}</span>
                  </div>
                  <div className="text-[11px] text-text-muted flex items-center gap-2">
                    <span>{s.count} {t.tradesCount}</span>
                    <span>•</span>
                    <span className="text-indigo-500 font-medium">% {s.winRate} Win</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border-main/50 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted uppercase">Net PnL</span>
                  <span className={`font-mono text-sm font-bold ${s.pnl > 0 ? 'text-emerald-500' : s.pnl < 0 ? 'text-rose-500' : 'text-text-muted'}`}>
                    {s.pnl > 0 ? '+' : ''}${s.pnl.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 24-Saatlik PnL Dağılım Çubuğu */}
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-text-muted" /> {t.hourlyDistribution}
          </h4>

          <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <div className="min-w-160 flex items-end gap-1.5 h-36 bg-bg-app border border-border-main rounded-2xl p-4">
              {hourlyStats.hours.map(h => {
                const heightPct = h.pnl !== 0 ? Math.max(12, Math.round((Math.abs(h.pnl) / hourlyStats.maxAbsPnL) * 100)) : 6;
                const isPositive = h.pnl > 0;
                const isNegative = h.pnl < 0;

                return (
                  <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl border border-border-main font-mono text-center">
                      <div className="font-bold">{h.label} ({h.count} işlem)</div>
                      <div className={isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-zinc-400'}>
                        {h.pnl > 0 ? '+' : ''}${h.pnl.toLocaleString()} (%{h.winRate} Win)
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full flex items-end justify-center h-24">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-4.5 rounded-t-md transition-all group-hover:brightness-125 ${
                          isPositive ? 'bg-emerald-500 shadow-xs shadow-emerald-500/20' :
                          isNegative ? 'bg-rose-500 shadow-xs shadow-rose-500/20' :
                          (h.count > 0 ? 'bg-zinc-500' : 'bg-border-main/40')
                        }`}
                      ></div>
                    </div>

                    {/* Label */}
                    <span className={`text-[9px] font-mono ${h.count > 0 ? 'text-text-main font-semibold' : 'text-text-muted/40'}`}>
                      {h.hour}h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DİSİPLİN KARTLARI & DUYGU DURUMU KIRILIMI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Disiplin / Sadakat Kıyaslaması */}
        <div className="bg-bg-panel border border-border-main rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-medium text-text-main flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-500" /> {t.planAdherenceTitle}
            </h3>
            <p className="text-xs text-text-muted mb-6">Kurallara uymak başarı oranınızı doğrudan nasıl etkiliyor?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
              <p className="text-xs font-semibold text-emerald-500 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {t.planWinRate}
              </p>
              <h3 className="text-3xl font-bold text-emerald-500">% {planWinRate}</h3>
              <p className="text-[11px] text-text-muted mt-2">{planFollowedTrades.length} işlem baz alındı</p>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl">
              <p className="text-xs font-semibold text-rose-500 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> {t.noPlanWinRate}
              </p>
              <h3 className="text-3xl font-bold text-rose-500">% {noPlanWinRate}</h3>
              <p className="text-[11px] text-text-muted mt-2">{planNotFollowedTrades.length} işlem baz alındı</p>
            </div>
          </div>
        </div>

        {/* En Çok Kazandıran Varlıklar (Top Symbols) */}
        <div className="bg-bg-panel border border-border-main rounded-3xl p-6 shadow-xl">
          <h3 className="text-base font-medium text-text-main flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-indigo-500" /> {t.topSymbolsTitle}
          </h3>
          <p className="text-xs text-text-muted mb-4">Hangi sembollerde daha kârlısınız?</p>

          <div className="space-y-3">
            {symbolStats.slice(0, 4).map(st => (
              <div key={st.symbol} className="bg-bg-app border border-border-main p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-text-main font-mono">{st.symbol}</span>
                  <span className="text-xs text-text-muted">({st.count} işlem)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-indigo-500">% {st.winRate} Win</span>
                  <span className={`font-mono text-sm font-semibold ${st.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {st.pnl > 0 ? '+' : ''}${st.pnl.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DUYGU DURUMU PERFORMANSI */}
      <div className="bg-bg-panel border border-border-main rounded-3xl p-6 shadow-xl">
        <h3 className="text-base font-medium text-text-main flex items-center gap-2 mb-1">
          <PieChart className="w-5 h-5 text-cyan-500" /> {t.emotionTitle}
        </h3>
        <p className="text-xs text-text-muted mb-6">İşlem anındaki psikolojik durumunuza göre performans dağılımı</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {emotionStats.map(st => (
            <div key={st.emotion} className="bg-bg-app border border-border-main p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-text-main">{st.emotion}</span>
                <span className="text-[10px] bg-bg-hover text-text-muted px-2 py-0.5 rounded border border-border-main">{st.count} işlem</span>
              </div>
              <h4 className={`text-lg font-mono font-semibold ${st.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {st.pnl > 0 ? '+' : ''}${st.pnl.toLocaleString()}
              </h4>
              <div className="text-[11px] text-text-muted mt-1">% {st.winRate} Win Rate</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
