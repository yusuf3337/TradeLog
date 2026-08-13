<div align="center">
  <img src="./public/logo.png" alt="TradeJournal Logo" width="380" height="380" />

  # TradeJournal 🚀

  **Sermayeni koru, riskini yönet, disipline uy.**
  
  Profesyonel ve gelişmekte olan traderlar için tasarlanmış; tamamen tarayıcı üzerinde çalışan, güvenli, modüler ve modern bir işlem günlüğü (trade journal) web uygulaması.

  [Canlı Site](https://www.tradejournal.com.tr/)
</div>

---

## 📖 Proje Hakkında

TradeJournal, işlemlerinizi (trade) detaylı bir şekilde kayıt altına alıp performans metriklerinizi ve psikolojinizi analiz edebileceğiniz kapsamlı bir alım-satım günlüğüdür. İster kişisel sermayenizi, ister Prop Firm (Fon) hesaplarınızı veya Demo hesaplarınızı yönetin; ihtiyacınız olan tüm analitik veriler ve QNB Invest standartlarındaki MT5 lot hesaplama motoru elinizin altındadır.

Üstelik uygulamanın bir backend'i (sunucusu) yoktur, verileriniz %100 gizlilikle tamamen kendi cihazınızda saklanır.

---

## 🌟 Öne Çıkan Özellikler

- 📊 **Gelişmiş Analitik Dashboard:** Kazanma Oranı (Win Rate), Net RR (Risk/Ödül) ve Net Kâr/Zarar (PnL) durumunuzu anlık takip edin.
- 🧮 **MT5 & QNB Invest Lot Hesaplayıcı:** QNB Invest kurumsal Forex standartlarına uygun (0.01 Lot Altın $1.00 hareket = $1.00 Kâr/Zarar) tam lot ve risk hesaplaması yapın.
- 📅 **İnteraktif İşlem Takvimi:** Ay bazlı kârlı (yeşil), zararlı (kırmızı) ve nötr günlerinizi takvim üzerinde görün; tıklayarak o günün işlemlerine ulaşın.
- 📈 **Sermaye Büyüme Grafiği (Equity Curve):** Kümülatif performans eğrinizi hesabınıza göre (Kişisel, Fon, Demo) filtreleyip görselleştirin.
- ⚡ **Disiplin & Psikoloji Analizleri:** Kurallara uyulan vs. uyulmayan işlemlerin kazanma oranını ve duygu durumlarına göre PnL kırılımını görün.
- 🔍 **Canlı Sembol & Strateji Arama:** Üst arama çubuğuyla sembol (örn. `XAU/USD`), strateji (`FVG`, `Likidite Avı`) veya notlarınız içinde saniyeler içinde arama yapın.
- 🖼️ **Tam Ekran Grafik Ön İzleme:** İşlemlere eklenen TradingView ekran görüntüsü linklerini uygulama içinde karanlık modal ile inceleyin.
- 📊 **Excel (.CSV) & JSON İçe/Dışa Aktarma:** Verilerinizi ister JSON olarak yedekleyin, ister Excel'de açmak üzere UTF-8 formatlı `.CSV` dosyası olarak indirin.
- 📱 **Mobil Tam Uyumluluk (Bottom Navigation):** Mobil cihazlarda alt sabit gezinti barı ve hesap filtreleme pills yapısı ile akıcı kullanım.
- 🚨 **Prop Firm Daily Drawdown Uyarısı:** Fon hesabında gün içindeki zararı otomatik tespit edip risk limiti uyarısı verir.
- 🌗 **Karanlık & Aydınlık Tema (Dark/Light Mode):** Şık, modern ve göz yormayan arayüz tasarımı.

---

## 🏗️ Proje Mimarisi

```
tradelog-app/
├── types/
│   └── trade.ts                    # Trade, AccountType, Direction vb. TypeScript tipleri
├── constants/
│   └── translations.ts             # TR/EN Çeviriler, Motivasyon Sözleri & Sabitler
├── components/
│   ├── Sidebar.tsx                 # Masaüstü Sol Menü & İçe/Dışa Aktarma
│   ├── Header.tsx                  # Üst Bar, Arama Barı, Tema/Dil Seçici & Hesap Filtreleri
│   ├── MobileBottomNav.tsx         # Mobil Alt Navigasyon Barı & Mobil Hesap Filtreleri
│   ├── DashboardView.tsx           # Ana Sayfa Metrik Vitrini & Son İşlemler
│   ├── CalendarView.tsx            # İşlem Takvimi & Günlük Detay Modalı
│   ├── AnalyticsView.tsx           # Equity Curve Grafiği & Disiplin Analizleri
│   ├── TradeHistoryView.tsx        # Tüm İşlem Geçmişi (Salt Okunur Liste)
│   ├── TradeDrawer.tsx             # İşlem Ekleme / Düzenleme Form Çekmecesi
│   ├── LotCalculatorModal.tsx      # QNB Invest Standartlarında MT5 Lot Hesaplayıcı
│   ├── ChartPreviewModal.tsx       # Tam Ekran Grafik Ön İzleme Modalı
│   └── TourModal.tsx               # 30 Saniyelik Hızlı Başlangıç Rehberi Modalı
└── app/
    └── page.tsx                    # Ana Orkestratör Sayfası
```

---

## 🛠️ Kullanılan Teknolojiler

- **Framework:** [Next.js 16 (Turbopack)](https://nextjs.org/) (App Router)
- **Kütüphane:** [React 19](https://react.dev/)
- **Stil & Tasarım:** [Tailwind CSS v4](https://tailwindcss.com/)
- **İkonlar:** [Lucide React](https://lucide.dev/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Veritabanı:** Yok (%100 Local Storage tabanlı yerel önbellek)

---

## 🔒 Veri Güvenliği ve Gizlilik

TradeJournal, gizliliğinizi ön planda tutan bir mimariyle geliştirilmiştir. **Sistemde hiçbir backend (sunucu) veritabanı bulunmamaktadır.**

Tüm trade geçmişiniz, ayarlarınız ve analizleriniz yalnızca sizin bilgisayarınızda, tarayıcınızın `localStorage` belleğinde tutulur. Bu sayede:
- Verilerinize sizden başka hiç kimse (geliştirici dahil) erişemez.
- Üye girişi veya hesap oluşturma gibi adımlara gerek yoktur.
- Verilerinizi güvende tutmak için dilediğiniz an tek tıkla **JSON** veya **Excel (.CSV)** formatında yedeğini alabilirsiniz.

---

<div align="center">
  <i>"Zarar kesmek, profesyonelliğin ilk adımıdır."</i>
</div>
