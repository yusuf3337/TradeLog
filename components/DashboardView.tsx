"use client";

import { Target, Activity, DollarSign, TrendingUp, ShieldAlert, List, ArrowUpRight, ArrowDownRight, Briefcase, FlaskConical, Clock, CheckCircle2, AlertTriangle, ImageIcon, Pencil, Trash2 } from 'lucide-react';
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

      {/* İstatistik Vitrini */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-bg-panel border border-border-main p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-indigo-500" />
          </div>
          <p className="text-text-muted text-sm font-medium mb-2 relative z-10">{t.winRate}</p>
          <h2 className="text-4xl font-light text-text-main relative z-10">% {winRate}</h2>
          <div className="mt-4 flex items-center gap-2 text-xs text-text-muted relative z-10">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {totalTrades} {t.basedOn}
          </div>
        </div>

        <div className="bg-bg-panel border border-border-main p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-emerald-500" />
          </div>
          <p className="text-text-muted text-sm font-medium mb-2 relative z-10">{t.netRR}</p>
          <h2 className={`text-4xl font-light relative z-10 ${totalRR >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalRR > 0 ? '+' : ''}{totalRR.toFixed(2)}R
          </h2>
          <div className="mt-4 flex items-center gap-2 text-xs text-text-muted relative z-10">
            <span className={`w-2 h-2 rounded-full ${totalRR >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {t.cumulativeRR}
          </div>
        </div>

        <div className="bg-bg-panel border border-border-main p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-cyan-500" />
          </div>
          <p className="text-text-muted text-sm font-medium mb-2 relative z-10">{t.netPnL}</p>
          <h2 className={`text-4xl font-light relative z-10 ${totalPnL >= 0 ? 'text-cyan-500' : 'text-rose-500'}`}>
            {totalPnL > 0 ? '+' : ''}${totalPnL.toLocaleString()}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-xs text-text-muted relative z-10">
            <span className={`w-2 h-2 rounded-full ${totalPnL >= 0 ? 'bg-cyan-500' : 'bg-rose-500'}`}></span>
            {t.realizedAmount}
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/10 p-6 rounded-3xl flex flex-col justify-center items-center text-center group hover:border-indigo-500/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-text-main font-medium mb-2">{t.dailyMotivation}</h3>
          <p className="text-xs text-indigo-500/80 max-w-50 italic">"{quote}"</p>
        </div>
      </div>

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
