// app'ten önce çağrılır: .env'deki değerler, onları okuyan modüller yüklenmeden hazır olmalı.
// quiet: dotenv'in kendi bilgi satırı, logger çıktısının arasına karışmasın.
require('dotenv').config({ quiet: true });

const app = require('./app');

const PORT = process.env.PORT || 3000;

// Express 5, dinleme hatasını (ör. port doluysa) fırlatmak yerine bu callback'e parametre olarak verir.
// Kontrol edilmezse sunucu açılamadığı halde "çalışıyor" yazıp sessizce kapanır.
app.listen(PORT, (hata) => {
  if (hata) {
    const neden = hata.code === 'EADDRINUSE' ? `${PORT} portu kullanımda (EADDRINUSE)` : hata.message;
    console.error(`Sunucu başlatılamadı: ${neden}`);
    process.exit(1);
  }

  console.log(`TaskFlow API http://localhost:${PORT} adresinde çalışıyor`);
});
