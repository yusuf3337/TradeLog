<div align="center">
  <img src="https://lucide.dev/icons/trending-up.svg" alt="TradeJournal Logo" width="80" height="80" />

  # TradeJournal 🚀

  **Sermayeni koru, riskini yönet, disipline uy.**
  
  Profesyonel ve gelişmekte olan traderlar için tasarlanmış; tamamen tarayıcı üzerinde çalışan, güvenli ve modern bir işlem günlüğü (trade journal) web uygulaması.

  [Canlı Site](https://www.tradejournal.com.tr/)
</div>

---

## 📖 Proje Hakkında

Trade Journal, işlemlerinizi (trade) detaylı bir şekilde kayıt altına alıp performans metriklerinizi analiz edebileceğiniz kapsamlı bir araçtır. İster kişisel fonlarınızı, ister Prop Firm hesaplarınızı yönetin, ihtiyacınız olan tüm analitik veriler elinizin altındadır. Üstelik uygulamanın bir backend'i yoktur, verileriniz tamamen yerel cihazınızda saklanır.

### 🌟 Öne Çıkan Özellikler

*   **📊 Gelişmiş Analitik Dashboard:** Kazanma Oranı (Win Rate), Net RR (Risk/Ödül) ve Net Kâr/Zarar (PnL) durumunuzu gerçek zamanlı takip edin.
*   **📝 Kapsamlı İşlem Kaydı:** Giriş/Çıkış fiyatları, Stop Loss (SL), Take Profit (TP), Lot miktarı ve risk yüzdesi gibi detayları kaydedin.
*   **📂 Hesap ve Strateji Yönetimi:** İşlemlerinizi hesap tipine (Kişisel, Fon/Prop) ve trade stiline (Scalp, Day Trade, Swing) göre etiketleyip filtreleyin.
*   **🔒 %100 Veri Gizliliği:** Uygulama herhangi bir veritabanı (backend) kullanmaz. Tüm verileriniz tarayıcınızın `localStorage` alanında tutulur.
*   **💾 İçe/Dışa Aktarma (JSON):** İşlem geçmişinizi JSON dosyası olarak kolayca yedekleyin ve dilediğiniz zaman geri yükleyin.
*   **🌗 Modern Arayüz (UI/UX):** Aydınlık (Light) ve Karanlık (Dark) mod desteği ile göz yormayan, şık tasarım.

---

## 📸 Ekran Görüntüleri

*(Projenize ait ekran görüntülerini GitHub'da göstermek için görsellerinizi projedeki bir klasöre (örn. `public/screenshots/`) yükleyip aşağıdaki yolları güncelleyebilirsiniz)*

### İlk Tur
<details>
<summary>Görüntülemek için tıklayın</summary>

![İlk Tur](./public/screenshots/tour.png)
</details>


### Dashboard (Karanlık Tema)
<details>
  <summary>Görüntülemek için tıklayın</summary>
  
  ![Karanlık Tema](./public/screenshots/dashboard-dark.png)
</details>

### Dashboard (Aydınlık Tema)
<details>
  <summary>Görüntülemek için tıklayın</summary>
  
  ![Aydınlık Tema](./public/screenshots/dashboard-light.png)
</details>


### Prop Firm Drawdown Uyarısı
<details>
  <summary>Görüntülemek için tıklayın</summary>

![Prop Firm Drawdown Uyarısı](./public/screenshots/prop-alert.png)
</details>

### Yeni İşlem Modalı
<details>
  <summary>Görüntülemek için tıklayın</summary>
  
  ![Yeni İşlem](./public/screenshots/new-trade.png)
</details>


### İşlemi Düzenleme
<details>
  <summary>Görüntülemek için tıklayın</summary>
  
  ![İşlemi Düzenle](./public/screenshots/edit-trade.png)
</details>

### Veri Güvenliği ve Onboarding
<details>
  <summary>Görüntülemek için tıklayın</summary>
  
  ![Veri Güvenliği](./public/screenshots/data-security.png)
</details>

### Salt Okunur
<details>
  <summary>Görüntülemek için tıklayın</summary>
  
  ![Salt Okunur](./public/screenshots/readonly-mode.png)
</details>

---

## 🛠️ Kullanılan Teknolojiler

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Kütüphane:** [React 19](https://react.dev/)
*   **Stil:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **İkonlar:** [Lucide React](https://lucide.dev/)
*   **Dil:** [TypeScript](https://www.typescriptlang.org/)
*   **Hosting:** [Vercel](https://vercel.com/)
*   **Veritabanı:** Yok (Local Storage tabanlı)

---

## 🔒 Veri Güvenliği ve Gizlilik

TradeJournal, gizliliğinizi ön planda tutan bir mimariyle geliştirilmiştir. **Sistemde hiçbir backend (sunucu) veritabanı bulunmamaktadır.**

Tüm trade geçmişiniz, ayarlarınız ve analizleriniz yalnızca sizin bilgisayarınızda, tarayıcınızın `localStorage` belleğinde tutulur. Bu sayede:
- Verilerinize sizden başka hiç kimse (geliştirici dahil) erişemez.
- Üye girişi veya hesap oluşturma gibi adımlara gerek yoktur.
- Verilerinizi güvende tutmak için dilediğiniz an tek tıkla JSON formatında yedeğini alabilirsiniz.

---

<div align="center">
  <i>"Zarar kesmek, profesyonelliğin ilk adımıdır."</i>
</div>
