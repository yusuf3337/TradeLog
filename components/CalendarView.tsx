"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw, X, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TRANSLATIONS, MONTH_NAMES, WEEKDAY_NAMES } from '@/constants/translations';
import { Trade } from '@/types/trade';

interface CalendarViewProps {
  lang: 'tr' | 'en';
  trades: Trade[];
  filteredTrades: Trade[];
  openNewTradeForDay: (dateStr: string) => void;
}

export default function CalendarView({
  lang,
  trades,
  filteredTrades,
  openNewTradeForDay
}: CalendarViewProps) {
  const t = TRANSLATIONS[lang];

  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);

  const availableYears = Array.from(
    new Set([
      new Date().getFullYear(),
      ...trades.map(tr => {
        const y = parseInt(tr.date?.split('-')[0]);
        return isNaN(y) ? new Date().getFullYear() : y;
      })
    ])
  ).sort((a, b) => b - a);

  const getCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);

    let startDayOfWeek = firstDay.getDay() - 1; // 0=Mon, ..., 6=Sun
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDay.getDate();
    const prevMonthLastDay = new Date(calendarYear, calendarMonth, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevDate = new Date(calendarYear, calendarMonth - 1, day);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      days.push({ dateStr: `${y}-${m}-${d}`, dayNum: day, isCurrentMonth: false });
    }

    for (let d = 1; d <= totalDays; d++) {
      const m = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      days.push({ dateStr: `${calendarYear}-${m}-${dayStr}`, dayNum: d, isCurrentMonth: true });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const nextDate = new Date(calendarYear, calendarMonth + 1, d);
        const y = nextDate.getFullYear();
        const m = String(nextDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d).padStart(2, '0');
        days.push({ dateStr: `${y}-${m}-${dayStr}`, dayNum: d, isCurrentMonth: false });
      }
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  const monthTrades = filteredTrades.filter(tr => {
    if (!tr.date) return false;
    const [y, m] = tr.date.split('-').map(Number);
    return y === calendarYear && m === calendarMonth + 1;
  });

  const monthPnL = monthTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);
  const monthWins = monthTrades.filter(tr => tr.result === 'Win').length;
  const monthWinRate = monthTrades.length > 0 ? Math.round((monthWins / monthTrades.length) * 100) : 0;

  const daysMap = new Map<string, Trade[]>();
  monthTrades.forEach(tr => {
    if (!daysMap.has(tr.date)) daysMap.set(tr.date, []);
    daysMap.get(tr.date)!.push(tr);
  });

  let greenDaysCount = 0;
  let redDaysCount = 0;
  let beDaysCount = 0;

  daysMap.forEach((trList) => {
    const dayNet = trList.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);
    if (dayNet > 0) greenDaysCount++;
    else if (dayNet < 0) redDaysCount++;
    else beDaysCount++;
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Üst Kart & Kontroller */}
      <div className="bg-bg-panel border border-border-main p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-main">{t.calendar}</h2>
              <p className="text-xs text-text-muted">{t.calendarDesc}</p>
            </div>
          </div>
        </div>

        {/* Yıl & Ay Kontrolleri */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Yıl Butonları */}
          <div className="flex bg-bg-input border border-border-main rounded-xl p-1">
            {availableYears.map(y => (
              <button
                key={y}
                onClick={() => setCalendarYear(y)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${calendarYear === y ? 'bg-indigo-600 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Ay Gezinme */}
          <div className="flex items-center gap-2 bg-bg-input border border-border-main rounded-xl p-1">
            <button
              onClick={() => {
                if (calendarMonth === 0) {
                  setCalendarMonth(11);
                  setCalendarYear(prev => prev - 1);
                } else {
                  setCalendarMonth(prev => prev - 1);
                }
              }}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-border-hover transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-text-main min-w-25 text-center">
              {MONTH_NAMES[lang][calendarMonth]} {calendarYear}
            </span>
            <button
              onClick={() => {
                if (calendarMonth === 11) {
                  setCalendarMonth(0);
                  setCalendarYear(prev => prev + 1);
                } else {
                  setCalendarMonth(prev => prev + 1);
                }
              }}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-border-hover transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bugün Butonu */}
          <button
            onClick={() => {
              setCalendarYear(new Date().getFullYear());
              setCalendarMonth(new Date().getMonth());
            }}
            className="p-2 bg-bg-input border border-border-main rounded-xl text-text-muted hover:text-text-main hover:bg-border-hover transition-colors"
            title="Bugüne Dön"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aylık Özet Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-bg-panel border border-border-main p-4 rounded-2xl">
          <p className="text-[11px] text-text-muted font-medium mb-1">{t.monthlyPnL}</p>
          <h4 className={`text-xl font-semibold font-mono ${monthPnL > 0 ? 'text-emerald-500' : monthPnL < 0 ? 'text-rose-500' : 'text-text-main'}`}>
            {monthPnL > 0 ? '+' : ''}${monthPnL.toLocaleString()}
          </h4>
        </div>

        <div className="bg-bg-panel border border-border-main p-4 rounded-2xl">
          <p className="text-[11px] text-text-muted font-medium mb-1">{t.monthlyWinRate}</p>
          <h4 className="text-xl font-semibold text-text-main">% {monthWinRate}</h4>
        </div>

        <div className="bg-bg-panel border border-border-main p-4 rounded-2xl">
          <p className="text-[11px] text-text-muted font-medium mb-1">{t.greenDays} / {t.redDays}</p>
          <h4 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-emerald-500">{greenDaysCount}K</span>
            <span className="text-text-muted">/</span>
            <span className="text-rose-500">{redDaysCount}Z</span>
          </h4>
        </div>

        <div className="bg-bg-panel border border-border-main p-4 rounded-2xl">
          <p className="text-[11px] text-text-muted font-medium mb-1">{t.allTrades}</p>
          <h4 className="text-xl font-semibold text-text-main">{monthTrades.length} {t.tradesCount}</h4>
        </div>
      </div>

      {/* Takvim Izgarası */}
      <div className="bg-bg-panel border border-border-main rounded-3xl p-4 md:p-6 overflow-x-auto shadow-xl">

        {/* Gün Başlıkları */}
        <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3 min-w-175">
          {WEEKDAY_NAMES[lang].map((dayName) => (
            <div key={dayName} className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider py-2 bg-bg-app border border-border-main rounded-xl">
              {dayName}
            </div>
          ))}
        </div>

        {/* Gün Hücreleri */}
        <div className="grid grid-cols-7 gap-2 md:gap-3 min-w-175">
          {calendarDays.map((cell, idx) => {
            const dayTrades = cell.isCurrentMonth
              ? filteredTrades.filter(tr => tr.date === cell.dateStr)
              : [];

            const dayPnL = dayTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            let bgStyle = "bg-bg-app/40 border-border-main/50 text-text-muted hover:border-indigo-500/40 hover:bg-bg-hover";
            let pnlTextColor = "text-text-muted/60";

            if (cell.isCurrentMonth && dayTrades.length > 0) {
              if (dayPnL > 0) {
                bgStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/30 hover:scale-[1.01] shadow-xs shadow-emerald-500/10";
                pnlTextColor = "text-emerald-600 dark:text-emerald-400 font-semibold";
              } else if (dayPnL < 0) {
                bgStyle = "bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/30 hover:scale-[1.01] shadow-xs shadow-rose-500/10";
                pnlTextColor = "text-rose-600 dark:text-rose-400 font-semibold";
              } else {
                bgStyle = "bg-zinc-500/20 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/25";
                pnlTextColor = "text-zinc-400 font-medium";
              }
            }

            return (
              <div
                key={`${cell.dateStr}-${idx}`}
                onClick={() => {
                  if (cell.isCurrentMonth && dayTrades.length > 0) {
                    setSelectedDayDate(cell.dateStr);
                  }
                }}
                className={`min-h-25 md:min-h-30 p-3 rounded-2xl border flex flex-col justify-between transition-all relative group ${
                  cell.isCurrentMonth ? (dayTrades.length > 0 ? 'cursor-pointer hover:shadow-lg' : 'cursor-default') : 'opacity-25 pointer-events-none'
                } ${bgStyle} ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-bg-app' : ''}`}
              >
                {/* Tarih Numarası */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isToday ? 'bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-text-muted'}`}>
                    {cell.dayNum}
                  </span>
                  {isToday && <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500">Bugün</span>}
                </div>

                {/* Orta Tutar */}
                {cell.isCurrentMonth && (
                  <div className="my-auto text-center py-1">
                    {dayTrades.length > 0 ? (
                      <div className={`text-sm md:text-base font-mono tracking-tight ${pnlTextColor}`}>
                        {dayPnL > 0 ? '+' : ''}${dayPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    ) : (
                      <div className="text-xs text-text-muted/30 font-mono">$0.00</div>
                    )}
                  </div>
                )}

                {/* Alt İşlem Sayısı */}
                {cell.isCurrentMonth && (
                  <div className="text-[10px] text-center text-text-muted font-medium bg-bg-panel/70 py-0.5 rounded-md border border-border-main/40 flex items-center justify-center gap-1 group-hover:border-indigo-500/30 transition-colors">
                    {dayTrades.length} {t.tradesCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* GÜNLÜK İŞLEM DETAY MODALI */}
      {selectedDayDate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-80 flex items-center justify-center p-4">
          <div className="bg-bg-panel border border-border-main rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Başlık */}
            <div className="p-6 border-b border-border-main flex items-center justify-between bg-bg-app">
              <div>
                <h3 className="text-lg font-semibold text-text-main flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-500" />
                  {t.dayDetailTitle}: <span className="font-mono text-indigo-500">{selectedDayDate}</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {filteredTrades.filter(tr => tr.date === selectedDayDate).length} {t.tradesCount} bulundu.
                </p>
              </div>
              <button
                onClick={() => setSelectedDayDate(null)}
                className="p-2 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-main transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* İşlem Listesi */}
            <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar flex-1">
              {filteredTrades.filter(tr => tr.date === selectedDayDate).map(trade => (
                <div key={trade.id} className="bg-bg-app border border-border-main p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-border-hover transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      trade.result === 'Win' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      trade.result === 'Loss' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                    }`}>
                      {trade.direction === 'Long' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-text-main text-sm">{trade.symbol}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          trade.result === 'Win' ? 'bg-emerald-500/20 text-emerald-500' :
                          trade.result === 'Loss' ? 'bg-rose-500/20 text-rose-500' :
                          'bg-zinc-500/20 text-zinc-400'
                        }`}>{trade.result}</span>
                        <span className="text-[10px] text-text-muted font-medium px-1.5 py-0.5 rounded bg-bg-hover border border-border-main">
                          {trade.account}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted font-mono truncate">
                        {trade.time} | Lot: {trade.lotSize || '-'} | RR: {trade.result === 'Loss' ? `-${trade.targetRr}` : `+${trade.rr}`}R | Tarz: {trade.type}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-base font-semibold font-mono ${trade.result === 'Win' ? 'text-emerald-500' : trade.result === 'Loss' ? 'text-rose-500' : 'text-zinc-400'}`}>
                      {trade.result === 'Loss' ? `-$${Math.abs(trade.pnl)}` : trade.result === 'Win' ? `+$${Math.abs(trade.pnl)}` : '$0'}
                    </div>
                    {trade.notes && <div className="text-[10px] text-text-muted italic max-w-37.5 truncate mt-0.5">{trade.notes}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Alt Kısım */}
            <div className="p-4 border-t border-border-main bg-bg-app flex justify-between items-center">
              <button
                onClick={() => {
                  const dayDate = selectedDayDate;
                  setSelectedDayDate(null);
                  openNewTradeForDay(dayDate!);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> {t.addTradeForDay}
              </button>
              <button
                onClick={() => setSelectedDayDate(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-bg-input border border-border-main text-text-muted hover:text-text-main transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
