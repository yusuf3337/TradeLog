"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trade, AccountType, TradeType, Direction, TradeResult } from '@/types/trade';
import { MOTIVATIONAL_QUOTES, TOUR_STEPS, TRANSLATIONS } from '@/constants/translations';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileBottomNav from '@/components/MobileBottomNav';
import DashboardView from '@/components/DashboardView';
import CalendarView from '@/components/CalendarView';
import AnalyticsView from '@/components/AnalyticsView';
import TradeHistoryView from '@/components/TradeHistoryView';
import TradeDrawer from '@/components/TradeDrawer';
import LotCalculatorModal from '@/components/LotCalculatorModal';
import TourModal from '@/components/TourModal';
import ChartPreviewModal from '@/components/ChartPreviewModal';

export default function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);

  // Theme & Language
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES['tr'][0]);

  // Tabs, Search & Filters
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'analytics' | 'all-trades'>('dashboard');
  const [filterAccount, setFilterAccount] = useState<'Tümü' | AccountType>('Tümü');
  const [filterType, setFilterType] = useState<'Tümü' | TradeType>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Previews
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  // MT5 Lot Calculator State
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcData, setCalcData] = useState({
    category: 'xauusd' as 'forex' | 'jpy' | 'xauusd' | 'xagusd' | 'crypto',
    symbol: 'XAU/USD',
    balance: '10000',
    riskPercent: '1.0',
    entryPrice: '4300.00',
    stopLoss: '4250.00',
    takeProfit: '4350.00'
  });

  // Drawer Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    symbol: '',
    direction: 'Long' as Direction,
    type: 'Day Trade' as TradeType,
    account: 'Kişisel' as AccountType,
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    lotSize: '',
    riskPercent: '',
    result: 'Win' as TradeResult,
    rr: '',
    targetRr: '',
    pnl: '',
    setup: '',
    imageUrl: '',
    notes: '',
    followedPlan: true,
  });

  const [selectedPsy, setSelectedPsy] = useState<string[]>([]);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setIsMounted(true);

    // Load Theme Preference
    const savedTheme = localStorage.getItem('@tradevault_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load Language Preference
    const savedLang = localStorage.getItem('@tradevault_lang');
    if (savedLang === 'tr' || savedLang === 'en') {
      setLang(savedLang);
      setQuote(MOTIVATIONAL_QUOTES[savedLang][Math.floor(Math.random() * MOTIVATIONAL_QUOTES[savedLang].length)]);
    } else {
      setQuote(MOTIVATIONAL_QUOTES['tr'][Math.floor(Math.random() * MOTIVATIONAL_QUOTES['tr'].length)]);
    }

    // Check Tour
    const hasSeenTour = localStorage.getItem('@tradevault_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 800);
    }

    // Load Trades from Local Cache
    const saved = localStorage.getItem('@tradevault_trades_v3');
    if (saved) {
      try {
        setTrades(JSON.parse(saved));
      } catch (e) {
        console.error("Veri yüklenemedi", e);
      }
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
      const fourDaysAgo = new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0];

      const initialDemoTrades: Trade[] = [
        {
          id: uuidv4(),
          date: todayStr,
          time: '09:30',
          symbol: 'XAU/USD',
          direction: 'Long',
          type: 'Day Trade',
          account: 'Fon (Prop)',
          entryPrice: 4300.00,
          stopLoss: 4250.00,
          takeProfit: 4350.00,
          lotSize: 0.01,
          riskPercent: 0.5,
          result: 'Win',
          rr: 1.0,
          targetRr: 1.0,
          pnl: 50,
          setup: 'Likidite Avı + 15m Kırılım',
          imageUrl: '',
          psychology: ['Odaklı'],
          followedPlan: true,
          notes: 'Plana sadık kalındı.'
        },
        {
          id: uuidv4(),
          date: twoDaysAgo,
          time: '14:15',
          symbol: 'BTC/USDT',
          direction: 'Short',
          type: 'Scalp',
          account: 'Demo',
          entryPrice: 95400,
          stopLoss: 96000,
          takeProfit: 94200,
          lotSize: 0.25,
          riskPercent: 1.5,
          result: 'Win',
          rr: 2.0,
          targetRr: 2.0,
          pnl: 600,
          setup: 'Direnç Tepkisi + FVG',
          imageUrl: '',
          psychology: ['Sakin'],
          followedPlan: true,
          notes: 'Demo hesapta strateji testi yapıldı.'
        },
        {
          id: uuidv4(),
          date: fourDaysAgo,
          time: '16:00',
          symbol: 'EUR/USD',
          direction: 'Long',
          type: 'Day Trade',
          account: 'Kişisel',
          entryPrice: 1.0850,
          stopLoss: 1.0820,
          takeProfit: 1.0910,
          lotSize: 0.83,
          riskPercent: 1.0,
          result: 'Loss',
          rr: 0,
          targetRr: 2.0,
          pnl: -300,
          setup: 'Trend Devamı',
          imageUrl: '',
          psychology: ['FOMO'],
          followedPlan: false,
          notes: 'Erken giriş yapıldı, stop olundu.'
        }
      ];

      setTrades(initialDemoTrades);
      localStorage.setItem('@tradevault_trades_v3', JSON.stringify(initialDemoTrades));
    }
  }, []);

  // Tour Handlers
  const nextTourStep = () => {
    if (tourStep < TOUR_STEPS[lang].length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      closeTour();
    }
  };

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem('@tradevault_tour_seen', 'true');
  };

  const startTour = () => {
    setTourStep(0);
    setShowTour(true);
  };

  // Preference Handlers
  const changeTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('@tradevault_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLang = (newLang: 'tr' | 'en') => {
    setLang(newLang);
    localStorage.setItem('@tradevault_lang', newLang);
    setQuote(MOTIVATIONAL_QUOTES[newLang][Math.floor(Math.random() * MOTIVATIONAL_QUOTES[newLang].length)]);
  };

  // Drawer & Form Handlers
  const resetForm = () => {
    setEditingTradeId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      symbol: '',
      direction: 'Long',
      type: 'Day Trade',
      account: 'Kişisel',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
      lotSize: '',
      riskPercent: '',
      result: 'Win',
      rr: '',
      targetRr: '',
      pnl: '',
      setup: '',
      imageUrl: '',
      notes: '',
      followedPlan: true,
    });
    setSelectedPsy([]);
  };

  const openNewTradeDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const openNewTradeForDay = (dateStr: string) => {
    resetForm();
    setFormData(prev => ({ ...prev, date: dateStr }));
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (trade: Trade) => {
    setEditingTradeId(trade.id);
    setFormData({
      date: trade.date,
      time: trade.time || '',
      symbol: trade.symbol,
      direction: trade.direction,
      type: trade.type,
      account: trade.account,
      entryPrice: trade.entryPrice?.toString() || '',
      stopLoss: trade.stopLoss?.toString() || '',
      takeProfit: trade.takeProfit?.toString() || '',
      lotSize: trade.lotSize?.toString() || '',
      riskPercent: trade.riskPercent?.toString() || '',
      result: trade.result,
      rr: trade.rr.toString(),
      targetRr: trade.targetRr.toString(),
      pnl: trade.pnl.toString(),
      setup: trade.setup,
      imageUrl: trade.imageUrl || '',
      notes: trade.notes,
      followedPlan: trade.followedPlan,
    });
    setSelectedPsy(trade.psychology);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formData.symbol) {
      alert(t.symbolRequired);
      return;
    }

    const newTrade: Trade = {
      id: editingTradeId || uuidv4(),
      date: formData.date,
      time: formData.time,
      symbol: formData.symbol.toUpperCase(),
      direction: formData.direction,
      type: formData.type,
      account: formData.account,
      entryPrice: formData.entryPrice ? parseFloat(formData.entryPrice) : undefined,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
      riskPercent: formData.riskPercent ? parseFloat(formData.riskPercent) : undefined,
      result: formData.result,
      rr: parseFloat(formData.rr || '0'),
      targetRr: parseFloat(formData.targetRr || '0'),
      pnl: parseFloat(formData.pnl || '0'),
      setup: formData.setup,
      imageUrl: formData.imageUrl,
      notes: formData.notes,
      followedPlan: formData.followedPlan,
      psychology: selectedPsy,
    };

    let updatedTrades;
    if (editingTradeId) {
      updatedTrades = trades.map(tr => tr.id === editingTradeId ? newTrade : tr);
    } else {
      updatedTrades = [newTrade, ...trades];
    }

    updatedTrades.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateB.getTime() - dateA.getTime();
    });

    setTrades(updatedTrades);
    localStorage.setItem('@tradevault_trades_v3', JSON.stringify(updatedTrades));
    closeDrawer();
    resetForm();
    if (!editingTradeId) {
      setQuote(MOTIVATIONAL_QUOTES[lang][Math.floor(Math.random() * MOTIVATIONAL_QUOTES[lang].length)]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t.deleteConfirm)) {
      const updated = trades.filter(tr => tr.id !== id);
      setTrades(updated);
      localStorage.setItem('@tradevault_trades_v3', JSON.stringify(updated));
    }
  };

  const togglePsy = (p: string) => {
    if (selectedPsy.includes(p)) {
      setSelectedPsy(selectedPsy.filter(item => item !== p));
    } else {
      setSelectedPsy([...selectedPsy, p]);
    }
  };

  // Backup & Export Handlers (JSON & CSV)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trades, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tradejournal_yedek_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Tarih', 'Saat', 'Sembol', 'Yön', 'Hesap Türü', 'İşlem Tarzı',
      'Giriş Fiyatı', 'Stop Loss', 'Take Profit', 'Lot Miktarı', 'Risk (%)',
      'Sonuç', 'Elde Edilen RR', 'Hedef RR', 'PnL ($)', 'Strateji',
      'Psikoloji', 'Plana Uydu mu', 'Notlar', 'Grafik URL'
    ];

    const rows = trades.map(t => [
      t.id,
      t.date,
      t.time || '',
      t.symbol,
      t.direction,
      t.account,
      t.type,
      t.entryPrice ?? '',
      t.stopLoss ?? '',
      t.takeProfit ?? '',
      t.lotSize ?? '',
      t.riskPercent ?? '',
      t.result,
      t.rr,
      t.targetRr,
      t.pnl,
      `"${(t.setup || '').replace(/"/g, '""')}"`,
      `"${(t.psychology || []).join(', ')}"`,
      t.followedPlan ? 'Evet' : 'Hayır',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      `"${t.imageUrl || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tradejournal_islemler_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          const confirmMsg = t.importWarning.replace('{count}', json.length.toString());
          if (confirm(confirmMsg)) {
            const combined = [...json, ...trades];
            const uniqueTrades = Array.from(new Map(combined.map(item => [item.id, item])).values());
            uniqueTrades.sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
              const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
              return dateB.getTime() - dateA.getTime();
            });
            setTrades(uniqueTrades);
            localStorage.setItem('@tradevault_trades_v3', JSON.stringify(uniqueTrades));
            alert(t.importSuccess);
          }
        } else {
          alert(t.importError);
        }
      } catch (error) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Calculator Helper
  const selectCalcPreset = (sym: string, cat: 'forex' | 'jpy' | 'xauusd' | 'xagusd' | 'crypto', defaultEntry: string, defaultSL: string, defaultTP: string) => {
    setCalcData({
      category: cat,
      symbol: sym,
      balance: calcData.balance || '10000',
      riskPercent: calcData.riskPercent || '1.0',
      entryPrice: defaultEntry,
      stopLoss: defaultSL,
      takeProfit: defaultTP
    });
  };

  const handleApplyCalcToTrade = () => {
    setIsCalcOpen(false);
    resetForm();

    const calcBalanceNum = parseFloat(calcData.balance || '0');
    const calcRiskPctNum = parseFloat(calcData.riskPercent || '0');
    const calcEntryNum = parseFloat(calcData.entryPrice || '0');
    const calcSLNum = parseFloat(calcData.stopLoss || '0');
    const calcTPNum = parseFloat(calcData.takeProfit || '0');

    const riskedDollar = calcBalanceNum * (calcRiskPctNum / 100);
    const slDistance = Math.abs(calcEntryNum - calcSLNum);

    let rawMt5Lot = 0;
    if (calcEntryNum > 0 && calcSLNum > 0 && slDistance > 0 && riskedDollar > 0) {
      if (calcData.category === 'xauusd') {
        rawMt5Lot = riskedDollar / (slDistance * 100);
      } else if (calcData.category === 'forex' || calcData.category === 'jpy') {
        const pips = slDistance / (calcData.category === 'forex' ? 0.0001 : 0.01);
        rawMt5Lot = riskedDollar / (pips * 10);
      } else if (calcData.category === 'xagusd') {
        rawMt5Lot = riskedDollar / (slDistance * 5000);
      } else {
        rawMt5Lot = riskedDollar / slDistance;
      }
    }

    const mt5LotVal = rawMt5Lot > 0 ? Math.max(0.01, Math.round(rawMt5Lot * 100) / 100) : 0;
    const formattedMt5Lot = mt5LotVal > 0 ? mt5LotVal.toFixed(2) : '';

    let tpProfitAmount = 0;
    let calculatedTargetRR = 0;
    if (mt5LotVal > 0 && calcEntryNum > 0 && calcSLNum > 0 && slDistance > 0 && calcTPNum > 0) {
      calculatedTargetRR = Math.abs(calcTPNum - calcEntryNum) / slDistance;
      if (calcData.category === 'xauusd') tpProfitAmount = mt5LotVal * Math.abs(calcTPNum - calcEntryNum) * 100;
      else if (calcData.category === 'forex' || calcData.category === 'jpy') {
        const pipsTP = Math.abs(calcTPNum - calcEntryNum) / (calcData.category === 'forex' ? 0.0001 : 0.01);
        tpProfitAmount = mt5LotVal * pipsTP * 10;
      } else if (calcData.category === 'xagusd') tpProfitAmount = mt5LotVal * Math.abs(calcTPNum - calcEntryNum) * 5000;
      else tpProfitAmount = mt5LotVal * Math.abs(calcTPNum - calcEntryNum);
    }

    setFormData(prev => ({
      ...prev,
      symbol: calcData.symbol || 'XAU/USD',
      entryPrice: calcData.entryPrice,
      stopLoss: calcData.stopLoss,
      takeProfit: calcData.takeProfit,
      lotSize: formattedMt5Lot,
      riskPercent: calcData.riskPercent,
      targetRr: calculatedTargetRR > 0 ? calculatedTargetRR.toFixed(2) : '',
      pnl: tpProfitAmount > 0 ? tpProfitAmount.toFixed(0) : ''
    }));
    setIsDrawerOpen(true);
  };

  // Filtered Trades & General Metrics (Includes Search Query)
  const filteredTrades = trades.filter(tr => {
    if (filterAccount !== 'Tümü' && tr.account !== filterAccount) return false;
    if (filterType !== 'Tümü' && tr.type !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSymbol = tr.symbol.toLowerCase().includes(q);
      const matchSetup = (tr.setup || '').toLowerCase().includes(q);
      const matchNotes = (tr.notes || '').toLowerCase().includes(q);
      const matchAccount = tr.account.toLowerCase().includes(q);
      if (!matchSymbol && !matchSetup && !matchNotes && !matchAccount) return false;
    }
    return true;
  });

  const totalTrades = filteredTrades.length;
  const winTrades = filteredTrades.filter(tr => tr.result === 'Win').length;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  const totalRR = filteredTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? curr.rr : (curr.result === 'Loss' ? -curr.targetRr : 0)), 0);
  const totalPnL = filteredTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);

  const today = new Date().toISOString().split('T')[0];
  const todayTrades = filteredTrades.filter(tr => tr.date === today && tr.account === 'Fon (Prop)');
  const todayPnL = todayTrades.reduce((acc, curr) => acc + (curr.result === 'Win' ? Math.abs(curr.pnl) : (curr.result === 'Loss' ? -Math.abs(curr.pnl) : 0)), 0);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-bg-app text-text-main font-sans flex selection:bg-indigo-500/30 transition-colors duration-300">

      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        startTour={startTour}
        handleImport={handleImport}
        handleExportJSON={handleExportJSON}
        handleExportCSV={handleExportCSV}
      />

      {/* Main Layout */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative pb-16 md:pb-0">

        {/* Top Header */}
        <Header
          lang={lang}
          theme={theme}
          changeLang={changeLang}
          changeTheme={changeTheme}
          setIsCalcOpen={setIsCalcOpen}
          filterAccount={filterAccount}
          setFilterAccount={setFilterAccount}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          openNewTradeDrawer={openNewTradeDrawer}
        />

        {/* Mobile Bottom Navigation & Account Filter */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filterAccount={filterAccount}
          setFilterAccount={setFilterAccount}
          lang={lang}
        />

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">

          {activeTab === 'dashboard' && (
            <DashboardView
              lang={lang}
              filterAccount={filterAccount}
              filterType={filterType}
              setFilterType={setFilterType}
              filteredTrades={filteredTrades}
              todayPnL={todayPnL}
              winRate={winRate}
              totalTrades={totalTrades}
              totalRR={totalRR}
              totalPnL={totalPnL}
              quote={quote}
              activeTab={activeTab}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setSelectedImagePreview={setSelectedImagePreview}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              lang={lang}
              trades={trades}
              filteredTrades={filteredTrades}
              openNewTradeForDay={openNewTradeForDay}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              lang={lang}
              filterAccount={filterAccount}
              setFilterAccount={setFilterAccount}
              filteredTrades={filteredTrades}
              totalPnL={totalPnL}
            />
          )}

          {activeTab === 'all-trades' && (
            <TradeHistoryView
              lang={lang}
              filterType={filterType}
              setFilterType={setFilterType}
              filteredTrades={filteredTrades}
              setSelectedImagePreview={setSelectedImagePreview}
            />
          )}

        </div>
      </main>

      {/* New / Edit Trade Drawer */}
      <TradeDrawer
        isDrawerOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        editingTradeId={editingTradeId}
        formData={formData}
        setFormData={setFormData}
        selectedPsy={selectedPsy}
        togglePsy={togglePsy}
        handleSave={handleSave}
        lang={lang}
      />

      {/* MT5 Lot & Risk Calculator Modal */}
      <LotCalculatorModal
        isCalcOpen={isCalcOpen}
        setIsCalcOpen={setIsCalcOpen}
        calcData={calcData}
        setCalcData={setCalcData}
        selectCalcPreset={selectCalcPreset}
        handleApplyCalcToTrade={handleApplyCalcToTrade}
        lang={lang}
      />

      {/* Onboarding Tour Modal */}
      <TourModal
        showTour={showTour}
        tourStep={tourStep}
        lang={lang}
        closeTour={closeTour}
        nextTourStep={nextTourStep}
      />

      {/* Fullscreen Chart Image Preview Modal */}
      <ChartPreviewModal
        imageUrl={selectedImagePreview}
        closePreview={() => setSelectedImagePreview(null)}
        lang={lang}
      />

    </div>
  );
}