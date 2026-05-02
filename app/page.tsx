"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  LayoutDashboard,
  List,
  Plus,
  X,
  Trash2,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  Fingerprint,
  TrendingUp,
  Briefcase,
  DollarSign,
  Clock,
  ShieldAlert,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Moon,
  Sun,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

// --- ÇEVİRİLER (TRANSLATIONS) ---
const TRANSLATIONS = {
  tr: {
    appTitle: "TradeJournal",
    appSubtitle: "Sermayeni koru, riskini yönet, disipline uy.",
    dashboard: "Dashboard",
    allTrades: "Tüm İşlemler",
    importBackup: "Yedek Yükle (JSON)",
    exportBackup: "Yedek İndir (JSON)",
    newTrade: "Yeni İşlem",
    editTrade: "İşlemi Düzenle",
    all: "Tümü",
    personal: "Kişisel",
    propFirm: "Fon (Prop)",
    scalp: "Scalp",
    dayTrade: "Day T.",
    swing: "Swing",
    long: "Long (Alım)",
    short: "Short (Satım)",
    winRate: "Kazanma Oranı",
    netRR: "Net RR (Risk/Ödül)",
    netPnL: "Net Kâr / Zarar",
    dailyMotivation: "Günlük Motivasyon",
    recentTrades: "Son İşlemler",
    recentTradesDesc: "İşlem stiline göre filtrelenebilir.",
    allTradesHistory: "Tüm İşlem Geçmişi",
    allTradesDesc: "Sadece okunabilir arşiv.",
    notFoundTitle: "İşlem Bulunamadı",
    notFoundDesc: "Bu filtrelere uygun bir kayıt yok. Yeni işlem eklemeyi deneyin.",
    readOnly: "Salt Okunur",
    yes: "Evet",
    no: "Hayır",
    rrResult: "RR Sonucu",
    pnlAmount: "Kâr/Zarar",
    followedPlan: "Kurallara Uydu mu?",
    saveChanges: "Değişiklikleri Kaydet",
    saveTrade: "İşlemi Güvenli Bölgeye Kaydet",
    section1: "1. İşlem Temel Bilgileri",
    date: "Tarih",
    time: "Saat",
    symbol: "Varlık Adı (Sembol)",
    accountType: "Hesap & Tarz",
    section2: "2. Fiyatlar ve Risk Yönetimi",
    optionalOptions: "(Opsiyonel Seçenekler)",
    entryPrice: "Giriş Fiyatı",
    stopLoss: "Stop Loss (SL)",
    takeProfit: "Take Profit (TP)",
    lotSize: "Miktar (Lot / Kontrat)",
    riskPercent: "Riske Edilen Kasa (%)",
    section3: "3. Değerlendirme & Sonuç",
    tradeResult: "İşlem Sonucu",
    targetRR: "Hedef RR",
    achievedRR: "Elde Edilen RR",
    followedPlanQuest: "Stratejiye Sadık Kaldın Mı?",
    followedPlanDesc: "Disiplin her şeydir. Kurallarına uydun mu?",
    section4: "4. Analiz & Psikoloji",
    setupReason: "Neden Girdim? (Strateji/Kurulum)",
    emotion: "Duygu Durumu (İşlem Anı)",
    chartUrl: "TradingView Grafik Ekran Görüntüsü (URL - Opsiyonel)",
    notes: "İşlem Sonu Değerlendirme (Notlar)",
    basedOn: "işlem baz alındı",
    cumulativeRR: "Kümülatif risk ödül",
    realizedAmount: "Gerçekleşen tutar",
    noNotes: "Detaylı analiz notu eklenmedi.",
    deleteConfirm: "Bu işlemi silmek istediğinize emin misiniz?",
    importWarning: "Uyarı: Dosyada {count} adet işlem var. Mevcut kayıtlarınızın üzerine yazılmasını veya birleştirilmesini istiyor musunuz?\n\nTamam = Mevcutlarla Birleştir\nİptal = İşlemi İptal Et",
    importSuccess: "Yedek başarıyla yüklendi!",
    importError: "Geçersiz dosya formatı. Lütfen TradeJournal yedeği seçin.",
    symbolRequired: "Lütfen en azından sembol alanını doldurun!",
    ddWarningTitle: "Fon Hesabı Günlük Kayıp (Daily Drawdown) Uyarısı",
    ddWarningDesc: "Bugün fon hesabında net ${amount} zarardasın. Günlük DD limitlerine yaklaşıyorsan ekranı kapatmalısın.",
    win: "Win",
    loss: "Loss",
    be: "Break Even",
    tourStart: "Hızlı Turu Başlat",
    tourDesc: "Uygulamayı 30 saniyede öğren",
    skip: "Geç",
    next: "İleri",
    finish: "Turu Bitir"
  },
  en: {
    appTitle: "TradeJournal",
    appSubtitle: "Protect capital, manage risk, stay disciplined.",
    dashboard: "Dashboard",
    allTrades: "All Trades",
    importBackup: "Import (JSON)",
    exportBackup: "Export (JSON)",
    newTrade: "New Trade",
    editTrade: "Edit Trade",
    all: "All",
    personal: "Personal",
    propFirm: "Prop Firm",
    scalp: "Scalp",
    dayTrade: "Day T.",
    swing: "Swing",
    long: "Long (Buy)",
    short: "Short (Sell)",
    winRate: "Win Rate",
    netRR: "Net RR (Risk/Reward)",
    netPnL: "Net PnL",
    dailyMotivation: "Daily Motivation",
    recentTrades: "Recent Trades",
    recentTradesDesc: "Filterable by trading style.",
    allTradesHistory: "Trade History",
    allTradesDesc: "Read-only archive.",
    notFoundTitle: "No Trades Found",
    notFoundDesc: "No records match the current filters. Try adding a new trade.",
    readOnly: "Read Only",
    yes: "Yes",
    no: "No",
    rrResult: "RR Result",
    pnlAmount: "PnL",
    followedPlan: "Followed Plan?",
    saveChanges: "Save Changes",
    saveTrade: "Save to Vault",
    section1: "1. Trade Basics",
    date: "Date",
    time: "Time",
    symbol: "Asset (Symbol)",
    accountType: "Account & Style",
    section2: "2. Pricing & Risk",
    optionalOptions: "(Optional)",
    entryPrice: "Entry Price",
    stopLoss: "Stop Loss (SL)",
    takeProfit: "Take Profit (TP)",
    lotSize: "Position Size (Lot)",
    riskPercent: "Account Risk (%)",
    section3: "3. Evaluation & Outcome",
    tradeResult: "Trade Result",
    targetRR: "Target RR",
    achievedRR: "Achieved RR",
    followedPlanQuest: "Followed Your Plan?",
    followedPlanDesc: "Discipline is everything. Did you follow rules?",
    section4: "4. Analysis & Psychology",
    setupReason: "Setup / Strategy Reason",
    emotion: "Emotional State",
    chartUrl: "TradingView Chart URL (Optional)",
    notes: "Post-Trade Notes",
    basedOn: "trades analyzed",
    cumulativeRR: "Cumulative risk/reward",
    realizedAmount: "Realized amount",
    noNotes: "No detailed notes provided.",
    deleteConfirm: "Are you sure you want to delete this trade?",
    importWarning: "Warning: The file contains {count} trades. Do you want to merge them with your existing records?\n\nOK = Merge\nCancel = Abort",
    importSuccess: "Backup imported successfully!",
    importError: "Invalid file format. Please choose a TradeJournal backup.",
    symbolRequired: "Please enter at least the symbol!",
    ddWarningTitle: "Prop Firm Daily Drawdown Warning",
    ddWarningDesc: "You are currently down ${amount} today. If you are approaching daily drawdown limits, stop trading.",
    win: "Win",
    loss: "Loss",
    be: "Break Even",
    tourStart: "Start Quick Tour",
    tourDesc: "Learn the app in 30 seconds",
    skip: "Skip",
    next: "Next",
    finish: "Finish Tour"
  }
};

const TOUR_STEPS = {
  tr: [
    { title: "Hoş Geldiniz!", desc: "TradeJournal'a hoş geldiniz. Profesyonel trade günlüğünüz ile tanışın. Uygulamayı 30 saniyede öğrenin." },
    { title: "Dashboard & Metrikler", desc: "Kazanma oranınızı, risk/ödül rasyosunu ve toplam kâr/zararınızı anlık olarak takip edin. Fon hesabınız varsa günlük kayıp uyarılarını buradan alırsınız." },
    { title: "İşlem Yönetimi", desc: "Sağ üstteki 'Yeni İşlem' butonuyla işlemlerinizi detaylı olarak kayıt altına alın. Kalem ikonuna tıklayarak eski işlemleri sonradan düzenleyebilirsiniz." },
    { title: "Filtreleme & Arşiv", desc: "İşlemlerinizi Scalp/Swing veya Kişisel/Fon olarak filtreleyin. Sol menüdeki 'Tüm İşlemler' sekmesinden işlemlerinizi salt okunur arşiv modunda inceleyin." },
    { title: "Veri Güvenliği", desc: "Sol alt köşedeki menüden verilerinizi JSON olarak yedekleyin veya geri yükleyin. Verileriniz sadece sizin tarayıcınızda kalır, %100 güvendedir!" }
  ],
  en: [
    { title: "Welcome!", desc: "Welcome to TradeJournal. Meet your professional trade diary. Learn the app in 30 seconds." },
    { title: "Dashboard & Metrics", desc: "Track your win rate, risk/reward ratio, and total PnL in real time. If you have a Prop Firm account, you'll receive daily drawdown warnings here." },
    { title: "Trade Management", desc: "Use the 'New Trade' button to record your trades in detail. Click the pencil icon to edit old trades." },
    { title: "Filtering & Archive", desc: "Filter your trades by Scalp/Swing or Personal/Prop. View your trades in read-only archive mode from the 'All Trades' tab." },
    { title: "Data Security", desc: "Use the menu in the bottom left to backup your data as JSON or restore previous backups. Your data stays in your browser and is 100% safe!" }
  ]
};

const MOTIVATIONAL_QUOTES = {
  tr: [
    "Başarılı traderlar sıkıcı olanı mükemmel yapanlardır.",
    "Zarar kesmek, profesyonelliğin ilk adımıdır.",
    "İntikam trade'i piyasaya bağış yapmaktır.",
    "Kasanın %2'sinden fazlasını tek işlemde riske atma.",
    "Piyasa her zaman haklıdır, senin egondan büyüktür.",
    "Sabır, en kârlı stratejidir.",
    "Eğer planda yoksa, işlemde de olmamalı.",
    "Duygularını değil, sadece fiyat hareketini trade et.",
    "Planını yap, planını trade et.",
    "En iyi işlemler, genellikle hiçbir şey yapmayıp beklemekten doğar.",
    "Fırsat kaçtı diye üzülme, piyasa yarın da burada olacak.",
    "Amacın haklı çıkmak değil, para kazanmak olmalı.",
    "Risk yönetimi olmayan bir strateji, sadece bir kumardır.",
    "Her stop-loss, gelecekteki daha büyük bir kârın sigortasıdır.",
    "Büyük kârlar büyük cesaretten değil, sarsılmaz bir disiplinden gelir.",
    "Amatörler ne kadar kazanacağına, profesyoneller ne kadar kaybedeceğine odaklanır.",
    "Zararda ümitlenmek, kârda korkmak en büyük trader tuzağıdır."
  ],
  en: [
    "Successful traders do the boring things perfectly.",
    "Cutting losses is the first step to professionalism.",
    "Revenge trading is donating to the market.",
    "Never risk more than 2% of your account on a single trade.",
    "The market is always right, it's bigger than your ego.",
    "Patience is the most profitable strategy.",
    "If it's not in the plan, it shouldn't be in your trades.",
    "Trade the price action, not your emotions.",
    "Plan your trade, and trade your plan.",
    "The best trades often come from doing nothing and waiting.",
    "Don't cry over a missed opportunity, the market will be here tomorrow.",
    "Your goal should be to make money, not to be right.",
    "A strategy without risk management is just gambling.",
    "Every stop-loss is an insurance premium for future profits.",
    "Big profits come from great discipline, not great courage.",
    "Amateurs focus on how much they can make; professionals focus on how much they can lose.",
    "Hoping in losses and fearing in profits is the biggest trader trap."
  ]
};

const PSY_OPTIONS = {
  tr: ['Korku', 'Açgözlülük', 'Heyecanlı', 'Odaklı', 'FOMO', 'İntikam', 'Sakin', 'Erken Çıkış'],
  en: ['Fear', 'Greed', 'Excited', 'Focused', 'FOMO', 'Revenge', 'Calm', 'Early Exit']
};

export type Trade = {
  id: string;
  date: string;
  time: string;
  symbol: string;
  direction: 'Long' | 'Short';
  type: 'Scalp' | 'Day Trade' | 'Swing';
  account: 'Kişisel' | 'Fon (Prop)';
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  riskPercent?: number;
  result: 'Win' | 'Loss' | 'BE';
  rr: number;
  targetRr: number;
  pnl: number;
  setup: string;
  imageUrl?: string;
  psychology: string[];
  followedPlan: boolean;
  notes: string;
};

export default function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);

  // Theme & Language
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES['tr'][0]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'all-trades'>('dashboard');
  const [filterAccount, setFilterAccount] = useState<'Tümü' | 'Kişisel' | 'Fon (Prop)'>('Tümü');

  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [filterType, setFilterType] = useState<'Tümü' | 'Scalp' | 'Day Trade' | 'Swing'>('Tümü');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    symbol: '',
    direction: 'Long' as 'Long' | 'Short',
    type: 'Day Trade' as 'Scalp' | 'Day Trade' | 'Swing',
    account: 'Kişisel' as 'Kişisel' | 'Fon (Prop)',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    lotSize: '',
    riskPercent: '',
    result: 'Win' as 'Win' | 'Loss' | 'BE',
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

    // Load preferences
    const savedTheme = localStorage.getItem('@tradevault_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem('@tradevault_lang');
    if (savedLang === 'tr' || savedLang === 'en') {
      setLang(savedLang);
      setQuote(MOTIVATIONAL_QUOTES[savedLang][Math.floor(Math.random() * MOTIVATIONAL_QUOTES[savedLang].length)]);
    } else {
      setQuote(MOTIVATIONAL_QUOTES['tr'][Math.floor(Math.random() * MOTIVATIONAL_QUOTES['tr'].length)]);
    }

    // Load data
    const hasSeenTour = localStorage.getItem('@tradevault_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 800);
    }

    const saved = localStorage.getItem('@tradevault_trades_v3');
    if (saved) {
      try {
        setTrades(JSON.parse(saved));
      } catch (e) {
        console.error("Veri yüklenemedi", e);
      }
    } else {
      const demoTrade: Trade = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        time: '09:30',
        symbol: 'XAU/USD',
        direction: 'Long',
        type: 'Day Trade',
        account: 'Fon (Prop)',
        entryPrice: 2024.50,
        stopLoss: 2020.00,
        takeProfit: 2038.00,
        lotSize: 2.5,
        riskPercent: 1.0,
        result: 'Win',
        rr: 3.0,
        targetRr: 3.0,
        pnl: 1540,
        setup: 'Likidite Avı + 15m Kırılım',
        imageUrl: '',
        psychology: ['Odaklı'],
        followedPlan: true,
        notes: 'Plana sadık kalındı.'
      };
      setTrades([demoTrade]);
      localStorage.setItem('@tradevault_trades_v3', JSON.stringify([demoTrade]));
    }
  }, []);

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

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trades, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tradejournal_yedek_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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

  const filteredTrades = trades.filter(tr => {
    if (filterAccount !== 'Tümü' && tr.account !== filterAccount) return false;
    if (filterType !== 'Tümü' && tr.type !== filterType) return false;
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

      {/* SOL MENÜ */}
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
            onClick={() => setActiveTab('all-trades')}
            className={`p-3 rounded-xl group relative transition-all ${activeTab === 'all-trades' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-bg-hover text-text-muted hover:text-text-main hover:bg-border-hover'}`}
          >
            <List className="w-6 h-6" />
            <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.allTrades}</span>
          </button>
        </nav>

        {/* VERİ İÇE/DIŞA AKTARMA & YARDIM */}
        <div className="mt-auto flex flex-col gap-4">
          <button onClick={startTour} className="p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover group relative transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {t.tourStart}
            </span>
          </button>
          <label className="p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover group relative transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.importBackup}</span>
          </label>
          <button onClick={handleExport} className="p-3 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover group relative transition-colors">
            <Download className="w-5 h-5" />
            <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{t.exportBackup}</span>
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* Üst Bar */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-bg-panel/80 backdrop-blur-md border-b border-border-main shrink-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg overflow-hidden border border-border-main bg-black flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-medium text-text-main tracking-wide">{t.appTitle}</h1>
              <p className="text-[10px] md:text-xs text-text-muted mt-0.5">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">

            {/* Dil ve Tema Seçimi */}
            <div className="flex items-center gap-1 md:gap-2 mr-2 border-r border-border-main pr-2 md:pr-4">
              <button onClick={() => changeLang(lang === 'tr' ? 'en' : 'tr')} className="text-xs font-bold bg-bg-input border border-border-main px-2 py-1.5 rounded-lg text-text-main hover:bg-border-hover transition-colors">
                {lang === 'tr' ? 'EN' : 'TR'}
              </button>
              <button onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 bg-bg-input border border-border-main rounded-lg text-text-main hover:bg-border-hover transition-colors">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className="hidden md:flex bg-bg-app border border-border-main rounded-full p-1">
              {[t.all, t.personal, t.propFirm].map((acc, idx) => {
                const accVal = idx === 0 ? 'Tümü' : idx === 1 ? 'Kişisel' : 'Fon (Prop)';
                return (
                  <button
                    key={acc}
                    onClick={() => setFilterAccount(accVal as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filterAccount === accVal ? 'bg-indigo-500/20 text-indigo-500' : 'text-text-muted hover:text-text-main'}`}
                  >
                    {acc}
                  </button>
                )
              })}
            </div>

            {activeTab === 'dashboard' && (
              <button
                onClick={openNewTradeDrawer}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t.newTrade}</span>
              </button>
            )}
          </div>
        </header>

        {/* Kaydırılabilir İçerik */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">

          {activeTab === 'dashboard' && (
            <>
              {/* Prop Firm DD Uyarı Kartı */}
              {filterAccount === 'Fon (Prop)' && todayPnL < 0 && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
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
                  <p className="text-xs text-indigo-500/80 max-w-[200px] italic">"{quote}"</p>
                </div>
              </div>
            </>
          )}

          {/* İşlem Günlüğü (Timeline) */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-text-main">{activeTab === 'dashboard' ? t.recentTrades : t.allTradesHistory}</h3>
              <div className="text-xs text-text-muted mt-1">{activeTab === 'dashboard' ? t.recentTradesDesc : t.allTradesDesc}</div>
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
                )
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
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${trade.result === 'Win' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      trade.result === 'Loss' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                        'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                      }`}>
                      {trade.direction === 'Long' ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownRight className="w-7 h-7" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-text-main font-medium text-lg tracking-tight">{trade.symbol}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${trade.result === 'Win' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                          trade.result === 'Loss' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                            'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400'
                          }`}>
                          {trade.result === 'Win' ? t.win : trade.result === 'Loss' ? t.loss : t.be}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-bg-hover text-text-muted border border-border-main flex items-center gap-1">
                          {trade.account === 'Fon (Prop)' ? <Briefcase className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
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
                        {trade.result === 'Loss' ? `-${trade.targetRr}R` : trade.result === 'Win' ? `+${trade.rr}R` : '0R'}
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
                          <a href={trade.imageUrl} target="_blank" rel="noreferrer" className="text-text-muted hover:text-indigo-500 transition-colors p-2 bg-bg-hover rounded-lg hover:bg-border-hover">
                            <ImageIcon className="w-4 h-4" />
                          </a>
                        )}

                        {activeTab === 'dashboard' && (
                          <>
                            <button onClick={() => handleEdit(trade)} className="text-text-muted hover:text-indigo-500 transition-colors p-2 bg-bg-hover rounded-lg hover:bg-border-hover">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(trade.id)} className="text-text-muted hover:text-rose-500 transition-colors p-2 bg-bg-hover rounded-lg hover:bg-rose-500/10">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* YENİ İŞLEM ÇEKMECESİ */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-bg-panel border-l border-border-main z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

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
                <input type="text" placeholder="BTC/USDT, AAPL..." value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50 placeholder:text-text-muted/50 font-medium" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.accountType}</label>
                <div className="flex gap-2">
                  <select value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value as any })} className="w-1/2 bg-bg-input border border-border-main rounded-xl px-2 py-3 text-xs text-text-main focus:outline-none focus:border-indigo-500/50 appearance-none text-center">
                    <option value="Kişisel">{t.personal}</option>
                    <option value="Fon (Prop)">{t.propFirm}</option>
                  </select>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-1/2 bg-bg-input border border-border-main rounded-xl px-2 py-3 text-xs text-text-main focus:outline-none focus:border-indigo-500/50 appearance-none text-center">
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
                <input type="number" step="any" placeholder="Örn: 2.5" value={formData.lotSize} onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.riskPercent}</label>
                <div className="relative">
                  <input type="number" step="0.1" placeholder="Örn: 2.0" value={formData.riskPercent} onChange={(e) => setFormData({ ...formData, riskPercent: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-indigo-500/50" />
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
                <input type="number" step="0.1" placeholder="3.0R" value={formData.targetRr} onChange={(e) => setFormData({ ...formData, targetRr: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2.5 text-sm text-center text-text-main" />
              </div>
              <div>
                <label className="block text-[11px] text-text-muted mb-1.5">{t.achievedRR}</label>
                <input type="number" step="0.1" placeholder="3.0R" value={formData.rr} onChange={(e) => setFormData({ ...formData, rr: e.target.value })} className="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2.5 text-sm text-center text-text-main" />
              </div>
              <div>
                <label className="block text-[11px] text-cyan-500/80 mb-1.5">{t.pnlAmount} ($)</label>
                <input type="number" placeholder="500" value={formData.pnl} onChange={(e) => setFormData({ ...formData, pnl: e.target.value })} className="w-full bg-bg-input border border-cyan-500/20 rounded-xl px-3 py-2.5 text-sm text-center text-cyan-500" />
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

      {/* TOUR MODAL */}
      {showTour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-bg-panel border border-border-main p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-border-main">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((tourStep + 1) / TOUR_STEPS[lang].length) * 100}%` }}></div>
            </div>

            <div className="flex justify-between items-center mb-6 mt-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-bg-input text-text-muted">
                {tourStep + 1} / {TOUR_STEPS[lang].length}
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-text-main mb-3">{TOUR_STEPS[lang][tourStep].title}</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              {TOUR_STEPS[lang][tourStep].desc}
            </p>

            <div className="flex items-center justify-between">
              <button onClick={closeTour} className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
                {t.skip}
              </button>

              <button onClick={nextTourStep} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                {tourStep === TOUR_STEPS[lang].length - 1 ? t.finish : t.next}
                {tourStep !== TOUR_STEPS[lang].length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}