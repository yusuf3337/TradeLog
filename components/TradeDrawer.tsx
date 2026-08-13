"use client";

import { Plus, X, ArrowUpRight, ArrowDownRight, ImageIcon, Target } from 'lucide-react';
import { TRANSLATIONS, PSY_OPTIONS } from '@/constants/translations';
import { AccountType, TradeType, Direction, TradeResult } from '@/types/trade';

interface TradeDrawerProps {
  isDrawerOpen: boolean;
  closeDrawer: () => void;
  editingTradeId: string | null;
  formData: {
    date: string;
    time: string;
    symbol: string;
    direction: Direction;
    type: TradeType;
    account: AccountType;
    entryPrice: string;
    stopLoss: string;
    takeProfit: string;
    lotSize: string;
    riskPercent: string;
    result: TradeResult;
    rr: string;
    targetRr: string;
    pnl: string;
    setup: string;
    imageUrl: string;
    notes: string;
    followedPlan: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedPsy: string[];
  togglePsy: (psy: string) => void;
  handleSave: () => void;
  lang: 'tr' | 'en';
}

export default function TradeDrawer({
  isDrawerOpen,
  closeDrawer,
  editingTradeId,
  formData,
  setFormData,
  selectedPsy,
  togglePsy,
  handleSave,
  lang
}: TradeDrawerProps) {
  const t = TRANSLATIONS[lang];

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-125 bg-bg-panel border-l border-border-main z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="h-20 border-b border-border-main px-6 flex items-center justify-between shrink-0 bg-bg-app">
          <div>
            <h2 className="text-lg font-medium text-text-main flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" /> {editingTradeId ? t.editTrade : t.newTrade}
            </h2>
          </div>
          <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-8">

          {/* BÖLÜM 1 */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-border-main pb-2">{t.section1}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.date}</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.time}</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.symbol}</label>
                <input type="text" placeholder="XAU/USD, EUR/USD, BTC..." value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50 placeholder:text-text-muted/50 font-medium" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.accountType}</label>
                <div className="flex gap-2">
                  <select value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value as any })} className="w-1/2 bg-bg-input border border-border-main rounded-xl px-2 py-3 text-xs text-text-main focus:outline-none focus:border-indigo-500/50 text-center">
                    <option value="Kişisel">{t.personal}</option>
                    <option value="Fon (Prop)">{t.propFirm}</option>
                    <option value="Demo">{t.demo}</option>
                  </select>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-1/2 bg-bg-input border border-border-main rounded-xl px-2 py-3 text-xs text-text-main focus:outline-none focus:border-indigo-500/50 text-center">
                    <option value="Scalp">{t.scalp}</option>
                    <option value="Day Trade">{t.dayTrade}</option>
                    <option value="Swing">{t.swing}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-bg-input border border-border-main rounded-xl p-1 flex">
              <button onClick={() => setFormData({ ...formData, direction: 'Long' })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.direction === 'Long' ? 'bg-indigo-600 text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}>
                <ArrowUpRight className="w-4 h-4" /> {t.long}
              </button>
              <button onClick={() => setFormData({ ...formData, direction: 'Short' })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.direction === 'Short' ? 'bg-indigo-600 text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}>
                <ArrowDownRight className="w-4 h-4" /> {t.short}
              </button>
            </div>
          </div>

          {/* BÖLÜM 2 */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-border-main pb-2 flex justify-between">
              <span>{t.section2}</span>
              <span className="text-[9px] text-text-muted/70 normal-case mt-0.5">{t.optionalOptions}</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.entryPrice}</label>
                <input type="number" step="any" placeholder="0.00" value={formData.entryPrice} onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2.5 text-sm text-center text-text-main focus:outline-none focus:border-indigo-500/50 font-mono" />
              </div>
              <div>
                <label className="block text-[11px] text-rose-500/80 mb-1.5">{t.stopLoss}</label>
                <input type="number" step="any" placeholder="0.00" value={formData.stopLoss} onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })} className="w-full bg-bg-input border border-rose-500/20 rounded-xl px-3 py-2.5 text-sm text-center text-rose-500 focus:outline-none focus:border-rose-500/50 font-mono" />
              </div>
              <div>
                <label className="block text-[11px] text-emerald-500/80 mb-1.5">{t.takeProfit}</label>
                <input type="number" step="any" placeholder="0.00" value={formData.takeProfit} onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })} className="w-full bg-bg-input border border-emerald-500/20 rounded-xl px-3 py-2.5 text-sm text-center text-emerald-500 focus:outline-none focus:border-emerald-500/50 font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.lotSize}</label>
                <input type="number" step="any" placeholder="Örn: 0.01, 0.14, 0.80" value={formData.lotSize} onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50 font-mono" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.riskPercent}</label>
                <div className="relative">
                  <input type="number" step="0.1" placeholder="Örn: 1.0" value={formData.riskPercent} onChange={(e) => setFormData({ ...formData, riskPercent: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
                  <span className="absolute right-4 top-3 text-sm text-text-muted">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* BÖLÜM 3 */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-border-main pb-2">{t.section3}</h3>

            <div>
              <label className="block text-[11px] text-text-muted mb-1.5">{t.tradeResult}</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setFormData({ ...formData, result: 'Win' })} className={`py-3 rounded-xl border text-sm font-medium transition-colors ${formData.result === 'Win' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : 'bg-bg-input border-border-main text-text-muted'}`}>{t.win}</button>
                <button onClick={() => setFormData({ ...formData, result: 'Loss' })} className={`py-3 rounded-xl border text-sm font-medium transition-colors ${formData.result === 'Loss' ? 'bg-rose-500/10 border-rose-500/50 text-rose-600 dark:text-rose-400' : 'bg-bg-input border-border-main text-text-muted'}`}>{t.loss}</button>
                <button onClick={() => setFormData({ ...formData, result: 'BE' })} className={`py-3 rounded-xl border text-sm font-medium transition-colors ${formData.result === 'BE' ? 'bg-zinc-500/10 border-zinc-500/50 text-zinc-600 dark:text-zinc-300' : 'bg-bg-input border-border-main text-text-muted'}`}>{t.be}</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.targetRR}</label>
                <input type="number" step="0.1" placeholder="3.0R" value={formData.targetRr} onChange={(e) => setFormData({ ...formData, targetRr: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2.5 text-sm text-center text-text-main font-mono" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.achievedRR}</label>
                <input type="number" step="0.1" placeholder="3.0R" value={formData.rr} onChange={(e) => setFormData({ ...formData, rr: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2.5 text-sm text-center text-text-main font-mono" />
              </div>
              <div>
                <label className="block text-[11px] text-cyan-500/80 mb-1.5">{t.pnlAmount} ($)</label>
                <input type="number" placeholder="500" value={formData.pnl} onChange={(e) => setFormData({ ...formData, pnl: e.target.value })} className="w-full bg-bg-input border border-cyan-500/20 rounded-xl px-3 py-2.5 text-sm text-center text-cyan-500 font-mono" />
              </div>
            </div>

            <div className="bg-bg-input border border-border-main rounded-xl p-4 flex items-center justify-between mt-2">
              <div>
                <h4 className="text-sm text-text-main font-medium">{t.followedPlanQuest}</h4>
                <p className="text-[10px] text-text-muted mt-0.5">{t.followedPlanDesc}</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, followedPlan: !formData.followedPlan })}
                className={`w-12 h-6 rounded-full relative transition-colors ${formData.followedPlan ? 'bg-emerald-500' : 'bg-rose-500'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.followedPlan ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* BÖLÜM 4 */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest border-b border-border-main pb-2">{t.section4}</h3>

            <div>
              <label className="block text-[11px] text-text-muted mb-1.5">{t.setupReason}</label>
              <input type="text" placeholder="Örn: 4H Destek + 15m Engulfing" value={formData.setup} onChange={(e) => setFormData({ ...formData, setup: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div>
              <label className="block text-[11px] text-text-muted mb-2">{t.emotion}</label>
              <div className="flex flex-wrap gap-2">
                {PSY_OPTIONS[lang].map(p => (
                  <button key={p} onClick={() => togglePsy(p)} className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${selectedPsy.includes(p) ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-500' : 'bg-bg-input border-border-main text-text-muted hover:border-border-hover hover:bg-bg-hover'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-text-muted mb-1.5">{t.chartUrl}</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3 top-3.5 text-text-muted" />
                <input type="url" placeholder="https://www.tradingview.com/..." value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl pl-10 pr-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-text-muted mb-1.5">{t.notes}</label>
              <textarea rows={3} placeholder="..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50 resize-none" />
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-border-main shrink-0 bg-bg-app">
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" /> {editingTradeId ? t.saveChanges : t.saveTrade}
          </button>
        </div>

      </div>
    </>
  );
}
