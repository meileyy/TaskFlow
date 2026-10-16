# TaskFlow API



TaskFlow, bir yazılım ekibinin görevlerini oluşturmasını, çalışanlara atamasını, durum ve öncelik takibi yapmasını sağlayan bir REST API'sidir. Node.js ve Express.js ile yazılmıştır; veriler bellekte bir dizide tutulur.

Bu proje "Node.js ile Backend Programlama" eğitiminin bitirme projesidir.

## İçindekiler

- [Özellikler](#özellikler)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Görev modeli](#görev-modeli)
- [Endpoint'ler](#endpointler)
- [Örnek istekler ve yanıtlar](#örnek-istekler-ve-yanıtlar)
- [Hata yanıtları](#hata-yanıtları)
- [Logger çıktısı](#logger-çıktısı)
- [Proje yapısı](#proje-yapısı)
- [Postman test kontrol listesi](#postman-test-kontrol-listesi)
- [Postman test sonuçları](#postman-test-sonuçları)
- [Sık yapılan hatalar](#sık-yapılan-hatalar)
- [Kullanılan teknolojiler](#kullanılan-teknolojiler)

## Özellikler

- Görevler için tam CRUD: listeleme, detay, ekleme, güncelleme, silme
- `express.Router()` ile ayrı route dosyası
- Logger middleware'i: her isteğin zaman damgası, method'u ve URL'si konsola yazılır
- Doğrulama middleware'i: eksik veya geçersiz veride açıklayıcı mesajla 400 döner
- Tutarlı JSON yanıt biçimi ve Türkçe hata mesajları

## Gereksinimler

- Node.js 18 veya üzeri (proje Node.js 24 ile geliştirildi ve test edildi)
- npm (Node.js ile birlikte gelir)

## Kurulum

```bash
git clone https://github.com/meileyy/TaskFlow.git
cd TaskFlow
npm install
```

Proje kökünde `.env` dosyası oluşturun. Hazır örneği kopyalayabilirsiniz:

```bash
cp .env.example .env        # macOS / Linux
copy .env.example .env      # Windows
```

`.env` içeriği:

```env
PORT=3000
```

`.env` dosyası yoksa sunucu varsayılan olarak 3000 portunda açılır.

## Çalıştırma

```bash
npm start      # node ile çalıştırır
npm run dev    # nodemon ile çalıştırır; dosya değişince sunucu yeniden başlar
```

Sunucu açıldığında konsolda şu satır görünür:

```text
TaskFlow API http://localhost:3000 adresinde çalışıyor
```

Veriler bellekte tutulduğu için sunucu her yeniden başladığında liste üç örnek göreve döner.

## Görev modeli

| Alan | Tür | Açıklama |
|---|---|---|
| `id` | number | Sunucu üretir |
| `title` | string | Zorunlu, boş olamaz |
| `description` | string | İsteğe bağlı; gönderilmezse boş metin |
| `status` | string | `pending`, `in-progress`, `completed`; varsayılan `pending` |
| `priority` | string | `low`, `medium`, `high`; varsayılan `medium` |
| `assignee` | string | İsteğe bağlı; gönderilmezse boş metin |
| `createdAt` | ISO tarih | Sunucu doldurur |
| `updatedAt` | ISO tarih | Sunucu doldurur; güncellemede yenilenir |

## Endpoint'ler

| Method | URL | Açıklama | Başarılı | Hata |
|---|---|---|---|---|
| GET | `/tasks` | Tüm görevleri listeler | 200 | – |
| GET | `/tasks/:id` | Tek görevi getirir | 200 | 400, 404 |
| POST | `/tasks` | Yeni görev ekler | 201 | 400 |
| PUT | `/tasks/:id` | Görevi günceller | 200 | 400, 404 |
| DELETE | `/tasks/:id` | Görevi siler | 200 | 400, 404 |

Yanıt biçimi her zaman aynıdır:

- Başarılı: `{ "basarili": true, "data": ... }`
- Hata: `{ "basarili": false, "hata": "..." }` (doğrulama hatasında ek olarak `detaylar` dizisi)

PUT isteğinde `title` zorunludur. Gönderilmeyen diğer alanlar mevcut değerini korur.

## Örnek istekler ve yanıtlar

Aşağıdaki çıktılar çalışan sunucudan curl ile alınmıştır.

> **Windows kullanıcıları için not:** Örneklerdeki tek tırnaklı (`'...'`) curl komutları Windows Komut İstemi'nde (cmd) çalışmaz. Bu komutları Git Bash'te çalıştırın ya da aynı istekleri Postman ile gönderin.

### Görevleri listele

```bash
curl http://localhost:3000/tasks
```

`200 OK`

```json
{
  "basarili": true,
  "data": [
    {
      "id": 1760000000001,
      "title": "Giriş ekranı tasarımını tamamla",
      "description": "Kullanıcı adı ve şifre alanlarını içeren giriş ekranının arayüzü hazırlanacak.",
      "status": "completed",
      "priority": "high",
      "assignee": "Ayşe Yılmaz",
      "createdAt": "2026-10-05T09:00:00.000Z",
      "updatedAt": "2026-10-08T14:30:00.000Z"
    },
    {
      "id": 1760000000002,
      "title": "Görev listeleme servisini yaz",
      "description": "Tüm görevleri döndüren servis yazılacak ve Postman ile test edilecek.",
      "status": "in-progress",
      "priority": "medium",
      "assignee": "Mehmet Demir",
      "createdAt": "2026-10-07T10:15:00.000Z",
      "updatedAt": "2026-10-12T16:45:00.000Z"
    },
    {
      "id": 1760000000003,
      "title": "Proje dokümantasyonunu güncelle",
      "description": "README dosyasına kurulum adımları ve örnek istekler eklenecek.",
      "status": "pending",
      "priority": "low",
      "assignee": "Zeynep Kaya",
      "createdAt": "2026-10-10T08:30:00.000Z",
      "updatedAt": "2026-10-10T08:30:00.000Z"
    }
  ]
}
```

### Tek görevi getir

```bash
curl http://localhost:3000/tasks/1760000000001
```

`200 OK`

```json
{
  "basarili": true,
  "data": {
    "id": 1760000000001,
    "title": "Giriş ekranı tasarımını tamamla",
    "description": "Kullanıcı adı ve şifre alanlarını içeren giriş ekranının arayüzü hazırlanacak.",
    "status": "completed",
    "priority": "high",
    "assignee": "Ayşe Yılmaz",
    "createdAt": "2026-10-05T09:00:00.000Z",
    "updatedAt": "2026-10-08T14:30:00.000Z"
  }
}
```

### Görev ekle

```bash
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"API testlerini yaz","description":"Postman koleksiyonu hazırlanacak","priority":"high","assignee":"Can Öztürk"}'
```

`201 Created` (status gönderilmediği için varsayılan `pending` atandı)

```json
{
  "basarili": true,
  "data": {
    "id": 1791917127814,
    "title": "API testlerini yaz",
    "description": "Postman koleksiyonu hazırlanacak",
    "status": "pending",
    "priority": "high",
    "assignee": "Can Öztürk",
    "createdAt": "2026-10-13T18:45:27.814Z",
    "updatedAt": "2026-10-13T18:45:27.814Z"
  }
}
```

### Görevi güncelle

```bash
curl -X PUT http://localhost:3000/tasks/1760000000001 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Giriş ekranı tasarımını tamamla","status":"in-progress"}'
```

`200 OK` (`createdAt` aynı kaldı, `updatedAt` yenilendi, gönderilmeyen alanlar korundu)

```json
{
  "basarili": true,
  "data": {
    "id": 1760000000001,
    "title": "Giriş ekranı tasarımını tamamla",
    "description": "Kullanıcı adı ve şifre alanlarını içeren giriş ekranının arayüzü hazırlanacak.",
    "status": "in-progress",
    "priority": "high",
    "assignee": "Ayşe Yılmaz",
    "createdAt": "2026-10-05T09:00:00.000Z",
    "updatedAt": "2026-10-13T18:45:27.821Z"
  }
}
```

### Görevi sil

```bash
curl -X DELETE http://localhost:3000/tasks/1760000000003
```

`200 OK` (silinen görev yanıtta döner)

```json
{
  "basarili": true,
  "data": {
    "id": 1760000000003,
    "title": "Proje dokümantasyonunu güncelle",
    "description": "README dosyasına kurulum adımları ve örnek istekler eklenecek.",
    "status": "pending",
    "priority": "low",
    "assignee": "Zeynep Kaya",
    "createdAt": "2026-10-10T08:30:00.000Z",
    "updatedAt": "2026-10-10T08:30:00.000Z"
  }
}
```

## Hata yanıtları

| Kod | Hata mesajı | Ne zaman döner |
|---|---|---|
| 400 | Geçersiz id: sayı olmalı | URL'deki id sayı değilse (`/tasks/abc`) |
| 404 | id'si 999 olan görev bulunamadı | Verilen id ile görev yoksa |
| 400 | Doğrulama hatası + detaylar | POST veya PUT gövdesi eksik ya da geçersizse |
| 400 | Geçersiz JSON | İstek gövdesi geçerli JSON değilse |
| 400 | Geçersiz URL kodlaması | URL çözülemeyen bir kodlama içeriyorsa (`/tasks/%E0%A4%A`) |
| 404 | Bulunamadı: GET /xyz | Tanımlı olmayan bir adrese istek atılırsa |
| 500 | Sunucu hatası | Beklenmeyen bir hata oluşursa (ayrıntı yalnızca sunucu konsoluna yazılır) |

id içeren isteklerde kontrol sırası şöyledir: geçersiz id (400) → görev yok (404) → geçersiz gövde (400). Örneğin olmayan bir id'ye geçersiz gövdeyle PUT atılırsa 404 döner.

### Doğrulama mesajları

Tüm hatalar tek yanıtta, `detaylar` dizisinde toplanır.

| Alan | Mesaj |
|---|---|
| `title` | title zorunludur / title boş olamaz / title geçersiz: metin (string) olmalı |
| `description` | description geçersiz: metin (string) olmalı |
| `status` | status geçersiz: 'bitti'. Geçerli değerler: pending, in-progress, completed |
| `priority` | priority geçersiz: 'urgent'. Geçerli değerler: low, medium, high |
| `assignee` | assignee geçersiz: metin (string) olmalı |

### Hata örneği

Geçersiz status ve priority:

```bash
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test","status":"bitti","priority":"urgent"}'
```

`400 Bad Request`

```json
{
  "basarili": false,
  "hata": "Doğrulama hatası",
  "detaylar": [
    "status geçersiz: 'bitti'. Geçerli değerler: pending, in-progress, completed",
    "priority geçersiz: 'urgent'. Geçerli değerler: low, medium, high"
  ]
}
```

## Logger çıktısı

Her istek sunucu konsoluna `[zaman damgası] METHOD /url` biçiminde yazılır:

```text
[2026-10-13T18:45:27.801Z] GET /tasks
[2026-10-13T18:45:27.814Z] POST /tasks
[2026-10-13T18:45:27.821Z] PUT /tasks/1760000000001
[2026-10-13T18:45:27.828Z] DELETE /tasks/1760000000003
```

## Proje yapısı

```text
TaskFlow/
├── src/
│   ├── app.js               Express uygulamasını kurar; logger'ı, JSON okumayı,
│   │                        /tasks route'unu ve hata yanıtlarını (404, 400, 500) bağlar
│   ├── server.js            .env'den PORT'u okur ve sunucuyu dinlemeye başlatır
│   ├── routes/
│   │   └── tasks.js         Beş /tasks endpoint'ini tanımlar; id kontrolü ve
│   │                        görev araması burada tek yerde yapılır
│   ├── middleware/
│   │   ├── logger.js        Her isteğin zaman damgasını, method'unu ve URL'sini yazar
│   │   └── dogrula.js       POST ve PUT gövdesini kontrol eder; hata varsa
│   │                        400 ve detaylar dizisi döner
│   └── data/
│       └── gorevler.js      Görevlerin tutulduğu bellekteki dizi; üç örnek görevle başlar
├── docs/
│   ├── proje-tanitim.md     Proje tanıtım dokümanı
│   └── postman/             Postman ekran görüntüleri
├── .env.example
├── package.json
└── README.md
```

## Postman test kontrol listesi

Sunucu yeni başlatılmışken, yani listede üç örnek görev varken sırayla denenebilir.

| Method | URL | Beklenen |
|---|---|---|
| GET | `/tasks` | 200, görev listesi |
| GET | `/tasks/1760000000001` | 200, tek görev |
| GET | `/tasks/34` | 404, id'si 34 olan görev bulunamadı |
| POST | `/tasks` (geçerli gövde) | 201, oluşturulan görev |
| POST | `/tasks` (hatalı gövde) | 400, Doğrulama hatası ve detaylar dizisi |
| PUT | `/tasks/1760000000001` | 200, güncellenen görev |
| DELETE | `/tasks/1760000000003` | 200, silinen görev |
| GET | `/olmayan-route` | 404, Bulunamadı: GET /olmayan-route |

POST ve PUT isteklerinde Postman'da **Body → raw → JSON** seçilmelidir. Örnek geçerli gövde:

```json
{
  "title": "API testlerini yaz",
  "description": "Postman koleksiyonu hazırlanacak",
  "priority": "high",
  "assignee": "Can Öztürk"
}
```

Örnek hatalı gövde (üç hata birden döner):

```json
{
  "title": "",
  "status": "bitti",
  "priority": "urgent"
}
```

## Postman test sonuçları

API Postman ile test edilmiştir. Aşağıdaki dokuz ekran görüntüsü çalışan sunucuya atılan isteklerden alınmıştır ve `docs/postman/` klasöründedir. Proje tanıtım dokümanı: [`docs/proje-tanitim.md`](docs/proje-tanitim.md)

### 1. Görev ekleme

`POST /tasks` geçerli gövdeyle `201 Created` döner; id, status ve tarihleri sunucu doldurur.

![POST /tasks isteği ve 201 Created yanıtı](docs/posman/01_ekleme.png)

### 2. Görevleri listeleme

`GET /tasks` `200 OK` döner; üç örnek görevle birlikte az önce eklenen görev de listededir.

![GET /tasks isteği ve 200 OK yanıtı](docs/postman/02_listeleme.png)

### 3. Görev detayı

`GET /tasks/1760000000001` `200 OK` ile tek görevi döner.

![GET /tasks/:id isteği ve 200 OK yanıtı](docs/postman/03_detay.png)

### 4. Görev güncelleme

`PUT /tasks/1760000000001` `200 OK` döner; status `in-progress` olur, `updatedAt` yenilenir, `createdAt` aynı kalır.

![PUT /tasks/:id isteği ve 200 OK yanıtı](docs/postman/04_guncelleme.png)

### 5. Görev silme

`DELETE /tasks/1760000000003` `200 OK` ile silinen görevi döner.

![DELETE /tasks/:id isteği ve 200 OK yanıtı](docs/postman/05_silme.png)

### 6. Olmayan görev (404)

`GET /tasks/34` `404 Not Found` ve "id'si 34 olan görev bulunamadı" mesajını döner.

![Olmayan görev için 404 Not Found yanıtı](docs/postman/06_hata-404.png)

### 7. Geçersiz veri (400)

Boş title, geçersiz status ve priority ile `POST /tasks` `400 Bad Request` döner; üç hata `detaylar` dizisinde birlikte gelir.

![Geçersiz veri için 400 Bad Request ve detaylar dizisi](docs/postman/07_hata-400.png)

### 8. Logger konsol çıktısı

Sunucu konsolunda her isteğin zaman damgası, method'u ve URL'si görünür.

![Terminalde logger middleware çıktısı](docs/postman/08_logger_konsol.png)

### 9. Tanımsız adres (404)

`GET /olmayan-route` `404 Not Found` ve "Bulunamadı: GET /olmayan-route" mesajını döner.

![Tanımsız adres için 404 Not Found yanıtı](docs/postman/09_hata_tanimsiz_url.png)

## Sık yapılan hatalar

- **`Bulunamadı: GET /task`** (bu projede Express'in `Cannot GET /...` sayfasının yerini alır) → Adreste `/tasks` eksik ya da yanlış yazılmış; adresi `http://localhost:3000/tasks` olarak düzeltin.
- **Postman'da `title zorunludur`** → Body → raw → JSON seçilmemiş, gövde Text olarak gidiyor; gövde türünü JSON yapın.
- **`Cannot find module 'express'`** (ya da `'dotenv'`) → `npm install` yapılmamış; proje klasöründe `npm install` çalıştırın.
- **`Sunucu başlatılamadı: 3000 portu kullanımda (EADDRINUSE)`** → Önceki sunucu hâlâ açık; o terminalde Ctrl+C ile durdurun ya da `.env`'deki `PORT`'u değiştirin.
- **Windows'ta curl komutu `JSON` hatası veriyor** → cmd tek tırnakları tanımaz; komutu Git Bash'te çalıştırın ya da Postman kullanın.

## Kullanılan teknolojiler

- Node.js
- Express.js
- dotenv (ortam değişkenleri)
- nodemon (geliştirme sırasında otomatik yeniden başlatma)
- Postman (API testleri)
