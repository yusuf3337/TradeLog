"use client";

import { Calculator, X, Info, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '@/constants/translations';

interface LotCalculatorModalProps {
  isCalcOpen: boolean;
  setIsCalcOpen: (open: boolean) => void;
  calcData: {
    category: 'forex' | 'jpy' | 'xauusd' | 'xagusd' | 'crypto';
    symbol: string;
    balance: string;
    riskPercent: string;
    entryPrice: string;
    stopLoss: string;
    takeProfit: string;
  };
  setCalcData: React.Dispatch<React.SetStateAction<any>>;
  selectCalcPreset: (sym: string, cat: 'forex' | 'jpy' | 'xauusd' | 'xagusd' | 'crypto', defaultEntry: string, defaultSL: string, defaultTP: string) => void;
  handleApplyCalcToTrade: () => void;
  lang: 'tr' | 'en';
}

export default function LotCalculatorModal({
  isCalcOpen,
  setIsCalcOpen,
  calcData,
  setCalcData,
  selectCalcPreset,
  handleApplyCalcToTrade,
  lang
}: LotCalculatorModalProps) {
  if (!isCalcOpen) return null;

  const t = TRANSLATIONS[lang];

  // QNB Invest & MT5 Calculation Engine
  const calcBalanceNum = parseFloat(calcData.balance || '0');
  const calcRiskPctNum = parseFloat(calcData.riskPercent || '0');
  const calcEntryNum = parseFloat(calcData.entryPrice || '0');
  const calcSLNum = parseFloat(calcData.stopLoss || '0');
  const calcTPNum = parseFloat(calcData.takeProfit || '0');

  const riskedDollar = calcBalanceNum * (calcRiskPctNum / 100);
  const slDistance = Math.abs(calcEntryNum - calcSLNum);

  let rawMt5Lot = 0;
  let distanceUnitText = '';
  let lotSensivityText = '';
  let slLossAmount = 0;
  let tpProfitAmount = 0;

  if (calcEntryNum > 0 && calcSLNum > 0 && slDistance > 0 && riskedDollar > 0) {
    if (calcData.category === 'xauusd') {
      distanceUnitText = `$${slDistance.toFixed(2)} Fiyat Hareketi`;
      lotSensivityText = 'QNB Invest / MT5: 0.01 Lot ile Her $1.00 Fiyat Hareketi = $1.00 Kâr/Zarar';
      rawMt5Lot = riskedDollar / (slDistance * 100);
    } else if (calcData.category === 'forex') {
      const pips = slDistance / 0.0001;
      distanceUnitText = `${pips.toFixed(1)} Pips`;
      lotSensivityText = 'QNB Invest / MT5: 0.01 Lot ile 1 Pip (0.0001) = $0.10 Kâr/Zarar (10 Pip = $1.00)';
      rawMt5Lot = riskedDollar / (pips * 10);
    } else if (calcData.category === 'jpy') {
      const pips = slDistance / 0.01;
      distanceUnitText = `${pips.toFixed(1)} Pips`;
      lotSensivityText = 'QNB Invest / MT5: 0.01 Lot ile 1 Pip (0.01) = $0.10 Kâr/Zarar';
      rawMt5Lot = riskedDollar / (pips * 10);
    } else if (calcData.category === 'xagusd') {
      distanceUnitText = `$${slDistance.toFixed(2)} Fiyat Hareketi`;
      lotSensivityText = '0.01 Lot ile Her $1.00 Fiyat Hareketi = $50.00 Kâr/Zarar';
      rawMt5Lot = riskedDollar / (slDistance * 5000);
    } else {
      distanceUnitText = `$${slDistance.toFixed(2)} Değişim`;
      lotSensivityText = '0.01 Lot ile Her $100.00 Fiyat Hareketi = $1.00 Kâr/Zarar';
      rawMt5Lot = riskedDollar / slDistance;
    }
  }

  const mt5LotVal = rawMt5Lot > 0 ? Math.max(0.01, Math.round(rawMt5Lot * 100) / 100) : 0;
  const formattedMt5Lot = mt5LotVal > 0 ? mt5LotVal.toFixed(2) : '0.00';

  if (mt5LotVal > 0 && calcEntryNum > 0 && calcSLNum > 0 && slDistance > 0) {
    if (calcData.category === 'xauusd') {
      slLossAmount = mt5LotVal * slDistance * 100;
      if (calcTPNum > 0) {
        tpProfitAmount = mt5LotVal * Math.abs(calcTPNum - calcEntryNum) * 100;
      }
    } else if (calcData.category === 'forex') {
      const pipsSL = slDistance / 0.0001;
      slLossAmount = mt5LotVal * pipsSL * 10;
      if (calcTPNum > 0) {
        const pipsTP = Math.abs(calcTPNum - calcEntryNum) / 0.0001;
        tpProfitAmount = mt5LotVal * pipsTP * 10;
      }
    } else if (calcData.category === 'jpy') {
      const pipsSL = slDistance / 0.01;
      slLossAmount = mt5LotVal * pipsSL * 10;
      if (calcTPNum > 0) {
        const pipsTP = Math.abs(calcTPNum - calcEntryNum) / 0.01;
        tpProfitAmount = mt5LotVal * pipsTP * 10;
      }
    } else if (calcData.category === 'xagusd') {
      slLossAmount = mt5LotVal * slDistance * 5000;
      if (calcTPNum > 0) {
        tpProfitAmount = mt5LotVal * Math.abs(calcTPNum - calcEntryNum) * 5000;
      }
    } else {
      slLossAmount = mt5LotVal * slDistance;
      if (calcTPNum > 0) {
        tpProfitAmount = mt5LotVal * Math.abs(calcTPNum - calcEntryNum);
      }
    }
  }

  let calculatedTargetRR = 0;
  if (calcTPNum > 0 && calcEntryNum > 0 && calcSLNum > 0 && slDistance > 0) {
    calculatedTargetRR = Math.abs(calcTPNum - calcEntryNum) / slDistance;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-80 flex items-center justify-center p-4">
      <div className="bg-bg-panel border border-border-main rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Üst Bar */}
        <div className="p-6 border-b border-border-main flex items-center justify-between bg-bg-app">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-main">{t.calcTitle}</h3>
              <p className="text-xs text-text-muted">{t.calcDesc}</p>
            </div>
          </div>
          <button onClick={() => setIsCalcOpen(false)} className="p-2 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">

          {/* Hızlı Enstrüman Şablon Butonları */}
          <div>
            <label className="block text-[11px] text-text-muted uppercase tracking-wider mb-2 font-medium">Popüler Şablonlar</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => selectCalcPreset('XAU/USD', 'xauusd', '4300.00', '4250.00', '4350.00')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${calcData.category === 'xauusd' ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' : 'bg-bg-input border-border-main text-text-muted hover:text-text-main'}`}>
                Altın (XAU)
              </button>
              <button onClick={() => selectCalcPreset('EUR/USD', 'forex', '1.0850', '1.0820', '1.0910')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${calcData.category === 'forex' ? 'bg-indigo-500/20 text-indigo-500 border-indigo-500/40' : 'bg-bg-input border-border-main text-text-muted hover:text-text-main'}`}>
                EUR/USD (1.000 Birim)
              </button>
              <button onClick={() => selectCalcPreset('USD/JPY', 'jpy', '154.50', '154.00', '155.50')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${calcData.category === 'jpy' ? 'bg-indigo-500/20 text-indigo-500 border-indigo-500/40' : 'bg-bg-input border-border-main text-text-muted hover:text-text-main'}`}>
                USD/JPY
              </button>
              <button onClick={() => selectCalcPreset('XAG/USD', 'xagusd', '28.50', '28.00', '29.50')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${calcData.category === 'xagusd' ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40' : 'bg-bg-input border-border-main text-text-muted hover:text-text-main'}`}>
                Gümüş (XAG)
              </button>
              <button onClick={() => selectCalcPreset('BTC/USDT', 'crypto', '95000', '94000', '97000')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${calcData.category === 'crypto' ? 'bg-purple-500/20 text-purple-500 border-purple-500/40' : 'bg-bg-input border-border-main text-text-muted hover:text-text-main'}`}>
                BTC / Kripto
              </button>
            </div>
          </div>

          {/* Kasa Bakiyesi ve Risk Yüzdesi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-text-muted mb-1">{t.calcBalance}</label>
              <input type="number" value={calcData.balance} onChange={e => setCalcData({ ...calcData, balance: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-sm font-mono text-text-main focus:outline-none focus:border-indigo-500/50" placeholder="10000" />
            </div>
            <div>
              <label className="block text-[11px] text-text-muted mb-1">{t.calcRiskPct}</label>
              <div className="relative">
                <input type="number" step="0.1" value={calcData.riskPercent} onChange={e => setCalcData({ ...calcData, riskPercent: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-sm font-mono text-text-main focus:outline-none focus:border-indigo-500/50" placeholder="1.0" />
                <span className="absolute right-3 top-2.5 text-xs text-text-muted font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Fiyat Girdileri */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-text-muted mb-1">{t.calcEntry}</label>
              <input type="number" step="any" value={calcData.entryPrice} onChange={e => setCalcData({ ...calcData, entryPrice: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-sm font-mono text-center text-text-main focus:outline-none focus:border-indigo-500/50" placeholder="4300.00" />
            </div>
            <div>
              <label className="block text-[11px] text-rose-500/80 mb-1">{t.calcSL}</label>
              <input type="number" step="any" value={calcData.stopLoss} onChange={e => setCalcData({ ...calcData, stopLoss: e.target.value })} className="w-full bg-bg-input border border-rose-500/30 rounded-xl px-3 py-2 text-sm font-mono text-center text-rose-500 focus:outline-none focus:border-rose-500/50" placeholder="4250.00" />
            </div>
            <div>
              <label className="block text-[11px] text-emerald-500/80 mb-1">{t.calcTP}</label>
              <input type="number" step="any" value={calcData.takeProfit} onChange={e => setCalcData({ ...calcData, takeProfit: e.target.value })} className="w-full bg-bg-input border border-emerald-500/30 rounded-xl px-3 py-2 text-sm font-mono text-center text-emerald-500 focus:outline-none focus:border-emerald-500/50" placeholder="4350.00" />
            </div>
          </div>

          {/* Lot Hassasiyeti Bilgi Notu */}
          {lotSensivityText && (
            <div className="bg-bg-app border border-border-main p-3 rounded-xl flex items-center gap-2 text-xs text-text-muted">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{lotSensivityText}</span>
            </div>
          )}

          {/* HESAPLANAN MT5 SONUÇ VİTRİNİ */}
          <div className="bg-linear-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-inner">
            
            {/* Ana Lot Büyüklüğü Rozeti */}
            <div className="flex justify-between items-center bg-bg-panel/80 backdrop-blur-md p-4 rounded-xl border border-indigo-500/20">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-text-muted block">{t.calcSuggestedLot}</span>
                <span className="text-[10px] text-text-muted/70">MT5 Min Step 0.01 hassasiyetinde</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-extrabold text-indigo-500 tracking-tight">
                  {formattedMt5Lot} <span className="text-sm font-normal text-text-main">Lot</span>
                </span>
                {rawMt5Lot > 0 && <span className="block text-[10px] text-text-muted font-mono">Tam: {rawMt5Lot.toFixed(4)}</span>}
              </div>
            </div>

            {/* Detay Metrikler Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-bg-panel/50 p-3 rounded-xl border border-border-main/50">
                <span className="text-[10px] text-text-muted uppercase block mb-0.5">{t.calcSLLossAmount}</span>
                <span className="font-mono text-sm font-bold text-rose-500">-${slLossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="bg-bg-panel/50 p-3 rounded-xl border border-border-main/50">
                <span className="text-[10px] text-text-muted uppercase block mb-0.5">Stop Mesafesi</span>
                <span className="font-mono text-sm font-semibold text-text-main">{distanceUnitText || '-'}</span>
              </div>

              <div className="bg-bg-panel/50 p-3 rounded-xl border border-border-main/50 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-text-muted uppercase block mb-0.5">{t.calcTargetRR}</span>
                <span className="font-mono text-sm font-bold text-emerald-500">
                  {calculatedTargetRR > 0 ? `${calculatedTargetRR.toFixed(2)}R` : '-'}
                </span>
              </div>
            </div>

            {tpProfitAmount > 0 && (
              <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                <span className="text-xs text-emerald-500 font-medium">{t.calcRewardAmount}:</span>
                <span className="font-mono text-sm font-bold text-emerald-500">+${tpProfitAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Alt Butonlar */}
        <div className="p-4 border-t border-border-main bg-bg-app flex justify-between items-center">
          <button
            onClick={handleApplyCalcToTrade}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
          >
            {t.applyToTrade} <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setIsCalcOpen(false)} className="px-4 py-2 bg-bg-input border border-border-main text-text-muted hover:text-text-main rounded-xl text-xs font-medium transition-colors">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
