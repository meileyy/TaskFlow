// Veriler bellekte tutulur: sunucu yeniden başlatıldığında dizi bu örnek görevlere döner.
// Örnekler, GET /tasks ilk istekte boş dizi yerine anlamlı veri döndürsün diye var.
const gorevler = [
  {
    id: 1760000000001,
    title: 'Giriş ekranı tasarımını tamamla',
    description: 'Kullanıcı adı ve şifre alanlarını içeren giriş ekranının arayüzü hazırlanacak.',
    status: 'completed',
    priority: 'high',
    assignee: 'Ayşe Yılmaz',
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-08T14:30:00.000Z',
  },
  {
    id: 1760000000002,
    title: 'Görev listeleme servisini yaz',
    description: 'Tüm görevleri döndüren servis yazılacak ve Postman ile test edilecek.',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Mehmet Demir',
    createdAt: '2026-10-07T10:15:00.000Z',
    updatedAt: '2026-10-12T16:45:00.000Z',
  },
  {
    id: 1760000000003,
    title: 'Proje dokümantasyonunu güncelle',
    description: 'README dosyasına kurulum adımları ve örnek istekler eklenecek.',
    status: 'pending',
    priority: 'low',
    assignee: 'Zeynep Kaya',
    createdAt: '2026-10-10T08:30:00.000Z',
    updatedAt: '2026-10-10T08:30:00.000Z',
  },
];

module.exports = gorevler;
