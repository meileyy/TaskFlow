const express = require('express');
const logger = require('./middleware/logger');
const gorevRoute = require('./routes/tasks');

const app = express();

// Logger en başta: express.json() bozuk gövdede hata fırlatır ve sonraki middleware'leri atlar;
// logger ondan sonra gelseydi bu istekler kayda hiç geçmezdi.
app.use(logger);
app.use(express.json());

app.use('/tasks', gorevRoute);

// Hiçbir route yanıt vermediyse istek buraya düşer; Express'in varsayılan HTML sayfası yerine
// diğer hatalarla aynı JSON biçimi dönülür.
app.use((req, res) => {
  res.status(404).json({ basarili: false, hata: `Bulunamadı: ${req.method} ${req.originalUrl}` });
});

// Express hata middleware'ini dört parametresinden tanır; next kullanılmasa da imzada durmalıdır.
app.use((hata, req, res, next) => {
  if (hata.type === 'entity.parse.failed') {
    return res.status(400).json({ basarili: false, hata: 'Geçersiz JSON' });
  }

  // Express, istemciden kaynaklanan hataları 4xx status ile işaretler (ör. çözülemeyen %E0%A4%A).
  // Bunlar sunucunun değil isteğin kusurudur; 500 dönmek istemciyi yanlış yönlendirir.
  if (hata.status >= 400 && hata.status < 500) {
    const mesaj = hata instanceof URIError ? 'Geçersiz URL kodlaması' : 'Geçersiz istek';
    return res.status(hata.status).json({ basarili: false, hata: mesaj });
  }

  // Ayrıntı yalnızca konsola yazılır: stack trace dosya yollarını ve iç yapıyı istemciye sızdırır.
  console.error(hata);
  res.status(500).json({ basarili: false, hata: 'Sunucu hatası' });
});

module.exports = app;
