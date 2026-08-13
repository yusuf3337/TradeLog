"use client";

import { useMemo } from 'react';
import { BarChart3, TrendingUp, Zap, CheckCircle2, AlertTriangle, Award, PieChart } from 'lucide-react';
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
            <div className="min-w-[600px] h-[260px] relative">
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

      {/* 2. DİSİPLİN KARTLARI & DUYGU DURUMU KIRILIMI */}
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

      {/* 3. DUYGU DURUMU PERFORMANSI */}
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
