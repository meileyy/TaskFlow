const express = require('express');
const gorevler = require('../data/gorevler');
const gorevDogrula = require('../middleware/dogrula');

const router = express.Router();

const gorevBul = (arananId) => gorevler.find((gorev) => gorev.id === arananId);

// id'li tüm route'lar (GET, PUT, DELETE) buradan geçer; böylece id kontrolü ve görev araması
// tek yerde kalır. router.param, route'a takılan gorevDogrula'dan önce çalıştığı için hata
// önceliği de burada belirlenir: geçersiz id (400) → görev yok (404) → geçersiz gövde (400).
router.param('id', (req, res, next, id) => {
  // URL parametresi string gelir, id'ler number olduğundan önce sayıya çevrilir.
  const arananId = Number(id);

  if (!Number.isInteger(arananId)) {
    return res.status(400).json({ basarili: false, hata: 'Geçersiz id: sayı olmalı' });
  }

  const bulunanGorev = gorevBul(arananId);

  if (!bulunanGorev) {
    return res.status(404).json({ basarili: false, hata: `id'si ${id} olan görev bulunamadı` });
  }

  req.gorev = bulunanGorev;
  next();
});

router.get('/', (req, res) => {
  res.status(200).json({ basarili: true, data: gorevler });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ basarili: true, data: req.gorev });
});

router.post('/', gorevDogrula, (req, res) => {
  const { title, description, status, priority, assignee } = req.body;
  const simdi = new Date().toISOString();

  // id ve tarihler gövdeden alınmaz: istemci başka bir görevin id'sini veya geçmiş bir tarihi dayatamasın.
  const yeniGorev = {
    id: Date.now(),
    title: title.trim(),
    description: description ?? '',
    status: status ?? 'pending',
    priority: priority ?? 'medium',
    assignee: assignee ?? '',
    createdAt: simdi,
    updatedAt: simdi,
  };

  gorevler.push(yeniGorev);

  res.status(201).json({ basarili: true, data: yeniGorev });
});

router.put('/:id', gorevDogrula, (req, res) => {
  const guncellenenGorev = req.gorev;
  const { title, description, status, priority, assignee } = req.body;

  // Gönderilmeyen isteğe bağlı alanlar eski değerini korur; aksi halde yalnızca başlığı
  // düzelten bir istek görevin durumunu ve atanan kişiyi sessizce sıfırlardı.
  guncellenenGorev.title = title.trim();
  guncellenenGorev.description = description ?? guncellenenGorev.description;
  guncellenenGorev.status = status ?? guncellenenGorev.status;
  guncellenenGorev.priority = priority ?? guncellenenGorev.priority;
  guncellenenGorev.assignee = assignee ?? guncellenenGorev.assignee;
  guncellenenGorev.updatedAt = new Date().toISOString();

  res.status(200).json({ basarili: true, data: guncellenenGorev });
});

router.delete('/:id', (req, res) => {
  const silinenGorev = req.gorev;

  // splice diziyi yerinde değiştirir; filter ile yeni dizi atansaydı require ile
  // paylaşılan referans kopar, diğer modüller eski listeyi görmeye devam ederdi.
  gorevler.splice(gorevler.indexOf(silinenGorev), 1);

  res.status(200).json({ basarili: true, data: silinenGorev });
});

module.exports = router;
