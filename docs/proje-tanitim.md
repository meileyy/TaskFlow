# TaskFlow API — Proje Tanıtım Dokümanı

## Amaç

TaskFlow, bir yazılım ekibinin işlerini tek bir yerden takip edebilmesi için geliştirilmiş bir görev yönetimi API'sidir. Amaç; görevlerin oluşturulmasını, bir çalışana atanmasını, durumunun ve önceliğinin izlenmesini sağlayan, REST kurallarına uygun, sade ve anlaşılır bir backend servisi sunmaktır.

Proje, "Node.js ile Backend Programlama" eğitiminin bitirme projesi olarak hazırlanmıştır.

## Senaryo

Bir yazılım ekibinde işler çoğu zaman mesajlarda ve toplantı notlarında dağılır; kimin hangi iş üzerinde çalıştığı ve hangi işin öncelikli olduğu belirsizleşir. TaskFlow bu soruna şöyle yanıt verir:

1. Ekip lideri yeni bir görev oluşturur; başlığını, açıklamasını ve önceliğini (`low`, `medium`, `high`) belirler, görevi bir çalışana atar.
2. Görev `pending` (bekliyor) durumunda başlar.
3. Çalışan işe başladığında görev `in-progress` (devam ediyor), bitirdiğinde `completed` (tamamlandı) olarak güncellenir.
4. Ekip, görev listesine bakarak tüm işlerin son durumunu görür.
5. İptal edilen ya da yanlış açılan görevler silinir.

## Sistem özeti

TaskFlow yalnızca bir backend API'sidir; arayüzü yoktur. İstemciler (Postman, `curl` ya da ileride yazılacak bir arayüz) HTTP istekleri gönderir ve JSON yanıt alır.

Bir isteğin sunucudaki yolu:

1. **Logger:** isteğin zaman damgasını, method'unu ve URL'sini konsola yazar.
2. **JSON okuma:** istek gövdesi JavaScript nesnesine çevrilir.
3. **Route:** `/tasks` ile başlayan istekler görev route'una yönlendirilir. URL'de id varsa önce id kontrol edilir ve görev aranır.
4. **Doğrulama:** ekleme ve güncellemede gövde kontrol edilir; eksik ya da geçersiz veri varsa işlem yapılmadan hata dönülür.
5. **İşlem ve yanıt:** görev dizisi okunur ya da değiştirilir, sonuç JSON olarak dönülür.

Görevler bellekte bir dizide tutulur. Sunucu yeniden başlatıldığında liste, başlangıçtaki üç örnek göreve döner.

Her görev şu alanlardan oluşur: `id`, `title`, `description`, `status`, `priority`, `assignee`, `createdAt`, `updatedAt`. `id` ve tarih alanlarını sunucu üretir; yalnızca `title` zorunludur.

Tüm yanıtlar aynı biçimdedir: başarılı yanıtlarda `{ "basarili": true, "data": ... }`, hatalarda `{ "basarili": false, "hata": "..." }`. Hata mesajları Türkçedir ve sorunun ne olduğunu açıkça söyler; örneğin `priority geçersiz: 'urgent'. Geçerli değerler: low, medium, high`.

## Kullanılan teknolojiler

| Teknoloji | Kullanım amacı |
| --- | --- |
| Node.js | JavaScript çalışma ortamı |
| Express.js | Sunucu, routing ve middleware yapısı |
| dotenv | `PORT` değerinin `.env` dosyasından okunması |
| nodemon | Geliştirme sırasında sunucunun otomatik yeniden başlatılması |
| Postman | Endpoint'lerin test edilmesi |

Kod; route (`src/routes`), middleware (`src/middleware`) ve veri (`src/data`) olarak ayrı klasörlere bölünmüştür. Böylece her dosya tek bir işten sorumludur.

## Endpoint listesi

| Method | URL | İşlev | Başarılı kod | Hata kodları |
| --- | --- | --- | --- | --- |
| GET | `/tasks` | Tüm görevleri listeler | 200 | - |
| GET | `/tasks/:id` | Tek bir görevin detayını getirir | 200 | 400, 404 |
| POST | `/tasks` | Yeni görev oluşturur | 201 | 400 |
| PUT | `/tasks/:id` | Mevcut görevi günceller | 200 | 400, 404 |
| DELETE | `/tasks/:id` | Görevi siler | 200 | 400, 404 |

Hata durumları: geçersiz id (400), bulunamayan görev (404), eksik ya da geçersiz veri (400), bozuk JSON (400), tanımsız adres (404) ve beklenmeyen sunucu hatası (500).

## Kapsam

**Yapılanlar**

- Express.js ile kurulmuş sunucu
- Görevler için tam CRUD (beş endpoint)
- `express.Router()` ile ayrı route dosyası
- Logger middleware'i
- Doğrulama middleware'i (ekleme ve güncellemede ortak)
- Doğru HTTP durum kodları ve açıklayıcı hata mesajları
- Verilerin bellekte tutulması
- README ve Postman testleri

**Yapılmayanlar (isteğe bağlı bırakılanlar)**

- `fs` ile kalıcı JSON depolama: veriler sunucu kapanınca sıfırlanır
- Filtreleme, arama, sayfalama ve sıralama
- Raporlama endpoint'i
- Veritabanı, kullanıcı girişi ve arayüz

Bu özellikler projenin zorunlu kapsamında olmadığı için eklenmemiştir; mevcut klasör yapısı ileride eklenmelerine uygundur.
