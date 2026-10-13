const GECERLI_DURUMLAR = ['pending', 'in-progress', 'completed'];
const GECERLI_ONCELIKLER = ['low', 'medium', 'high'];

const gonderildiMi = (deger) => deger !== undefined;

// Mesajda gelen değer ve izin verilenler birlikte yazılır: istemci neyi yanlış gönderdiğini
// ve yerine ne göndermesi gerektiğini tek bakışta görsün.
const gecersizSecimMesaji = (alanAdi, gelenDeger, gecerliDegerler) =>
  `${alanAdi} geçersiz: '${gelenDeger}'. Geçerli değerler: ${gecerliDegerler.join(', ')}`;

const gorevDogrula = (req, res, next) => {
  // Gövdesiz istekte express.json() req.body'yi tanımsız bırakır; boş nesne sayarak çökmeyi önleriz.
  const { title, description, status, priority, assignee } = req.body || {};

  // İstemci tüm eksiklerini tek yanıtta görsün diye ilk hatada durmak yerine hatalar biriktirilir.
  const detaylar = [];

  if (!gonderildiMi(title)) {
    detaylar.push('title zorunludur');
  } else if (typeof title !== 'string') {
    detaylar.push('title geçersiz: metin (string) olmalı');
  } else if (title.trim() === '') {
    // trim: yalnızca boşluktan oluşan başlık da kullanıcı açısından boş başlıktır.
    detaylar.push('title boş olamaz');
  }

  if (gonderildiMi(description) && typeof description !== 'string') {
    detaylar.push('description geçersiz: metin (string) olmalı');
  }

  if (gonderildiMi(status) && !GECERLI_DURUMLAR.includes(status)) {
    detaylar.push(gecersizSecimMesaji('status', status, GECERLI_DURUMLAR));
  }

  if (gonderildiMi(priority) && !GECERLI_ONCELIKLER.includes(priority)) {
    detaylar.push(gecersizSecimMesaji('priority', priority, GECERLI_ONCELIKLER));
  }

  if (gonderildiMi(assignee) && typeof assignee !== 'string') {
    detaylar.push('assignee geçersiz: metin (string) olmalı');
  }

  if (detaylar.length > 0) {
    return res.status(400).json({ basarili: false, hata: 'Doğrulama hatası', detaylar });
  }

  next();
};

module.exports = gorevDogrula;
