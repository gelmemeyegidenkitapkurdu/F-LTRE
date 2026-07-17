# Proje Hafızası - Gelmemeyegidenkitapkurdu

## Proje Özeti

Bu proje Netlify üzerinde yayınlanacak şekilde optimize edilmiş bir React + TypeScript web uygulamasıdır. Veri katmanı Supabase ile çalışır.

## Kesin Teknoloji Kararları

- Frontend: React 18 + TypeScript + Vite
- Stil: Tailwind CSS (dark mode: 'class' stratejisi ile)
- State: Zustand (persist: localStorage ile)
- Backend servisleri: Supabase (REST/RPC/Auth)
- CI/CD: GitHub Actions
- Hosting: Netlify

## Kalıcı Geliştirme Kuralları

1. Framework değişimi yapılmaz; React + Vite korunur.
2. Veri erişimleri `src/api/client.ts` üzerinden yürütülür.
3. Supabase istemcisi tek noktadan (`src/lib/supabaseClient.ts`) yönetilir.
4. Admin oturum kontrolü store katmanında (`src/store/useStore.ts`) tutulur.
5. Netlify SPA yönlendirmesi için `public/_redirects` korunur.
6. Netlify yapılandırması `netlify.toml` üzerinden yönetilir.
7. Üretim öncesi `npm install` ardından `npm run build` sırası zorunludur.
8. Projede gereksiz template dosyaları ve artık klasörler tutulmaz.

## Dark Mode (Karanlık Mod)

- Tailwind `darkMode: 'class'` stratejisi kullanılır.
- Zustand store'da `darkMode` durumu `persist` ile localStorage'da saklanır.
- Toggle butonu Ana Sayfa'da SectionCard'ların üzerindedir.
- `document.documentElement.classList.add/remove('dark')` ile HTML root'a dark class'ı eklenir.
- Tüm sayfalarda `bg-white`, `bg-gray-800`, `text-gray-*` sınıfları dark mode ile desteklenir.
- Form inputları, modallar, kartlar ve metin renkleri dark mode'da uyumlu çalışır.
- Öneriler ve Röportajlar sayfalarında ayrı arama kutusu bulunur; arama kutusu stili sabittir (dışı pembe, açık modda içi beyaz, karanlık modda içi siyah).
- Admin girişi ve tüm CRUD işlemleri dark mode'dan etkilenmez.
- Yazılar, Dergiler, Öneriler, Röportajlar ve Anketler listeleri başlangıçta 4 içerik gösterir; "Daha fazlasını göster" butonu ile içerikler 4'erli olarak artar.
- Yazılar, Öneriler, Röportajlar, Anketler ve Dergiler sayfalarında varsayılan sıralama korunur (en yeni üstte); kullanıcı filtreye basınca sıralama yalnızca seçilen moda göre değişir (Yeniden eskiye, Eskiden yeniye, En çok görüntülenen, A'dan-Z'ye).
- Röportajlar admin formunda yerli/yabancı işaretlemesi yapılır (`interview_origin`), okuyucu kart/modaldaki içerikte görünmez; yalnızca sıralama alanındaki tür kutucukları (Tümü/Yerli/Yabancı) ile filtrelenir.
- Röportajlar sayfasında sıralama ve tür filtreleri varsayılan olarak gizlidir; üstteki "Sırala" butonuna basılınca açılır.
- Yazılar, Dergiler, Öneriler ve Anketler sayfalarında da sıralama seçenekleri varsayılan olarak gizlidir; her sayfada üstteki "Sırala" butonuna basılınca açılır.

## Supabase Bağlantı Bilgileri

- Project ID: `oxqobtlcbksfdajnvnoz`
- Project URL: `https://oxqobtlcbksfdajnvnoz.supabase.co`
- Kullanılan SQL şema dosyası: `database/supabase_init.sql`

## Veri Kalıcılığı ve Admin Kuralları

1. Admin düzenlemeden hiçbir içeriğin yeri veya değeri değişmez.
2. Admin girişi yapılmadan içerik yayınlanamaz, düzenlenemez veya silinemez.
3. Sayfa yenilendiğinde veriler kaybolmaz — tüm veri Supabase'de kalıcı olarak tutulur.
4. Admin silmeden hiçbir içerik silinmez (RLS politikaları ile korunur).
5. Görüntüleme sayıları yalnızca admin tarafından değiştirilebilir.
6. Her içerik yayınlandığı günün tarihini taşır; tarih sonradan değişmez.
7. Site arayüzü, yayınlama veya düzenleme akışı sebepsiz değiştirilmez.

## Veritabanı Sütun Eşlemesi

| Tablo | Görüntüleme Sütunu | Tarih Sütunu |
|-------|-------------------|--------------|
| writings | views | date |
| books | views | created_at |
| suggestions | views | created_at |
| polls | view_count | date |
| interviews | view_count | created_at |
| announcements | views | date |

## Books (Dergiler) Tablosu Detayları

- Aktif dergi tablosu: `yw_magazines` (dergiler için izole ve kalıcı kaynak)
- Dergi PDF tablosu: `yw_magazine_pdfs` (PDF verisi ayrı ve kalıcı kaynak)
- `yw_magazines` alanları: id, title, issue, owner, content, description, photo, cover, pdf, pdf_name, participant1, participant2, dialogues, views, downloads, created_at
- `yw_magazine_pdfs` alanları: id, magazine_id, pdf, pdf_name, created_at, updated_at
- `owner` = Hak Sahibi, `content` = Dergi içeriği, `pdf_name` = Dergi detayındaki link metni (sabit olarak "Dergi Link"), `downloads` = indirme sayısı, `issue` = Dergi Sayısı (kapak badgesinde görünür)
- Dergiler sayfasında arayüz seviyesi kural: PDF ekleme/okuma/"PDF bulunamadı" akışı kullanılmaz; detayda yalnızca dış link kutusu gösterilir ve buton metni her zaman "Dergi Link" olur.
- Admin formunda link adı özelleştirme kutusu kullanılmaz; kayıt sırasında `pdf_name` sabit olarak "Dergi Link" yazılır.
- İlk kurulum/migrasyon SQL: `database/create_yw_magazines.sql`

## Performans Optimizasyonları (Dergiler)

- Dergi CRUD tamamen `yw_magazines` tablosuna taşındı; diğer kategori tabloları etkilenmez
- `fetchBooks()` yalnızca `yw_magazines` okur ve yanıtı normalize eder (`owner/content/photo/pdf` alanları güvenli fallback ile tamamlanır)
- `createBook()` ve `updateBook()` PDF base64 verisini önce Storage'a yükleyip tabloya URL kaydeder, kayıt başarısızsa yeni yüklenen dosya temizlenir
- `updateBook()` önce mevcut dergiyi okuyup merge/persist ettiği için içerik veya PDF alanı istemsiz boşalmaz
- `fetchBookPdf(id)` ile detay akışında PDF doğrulama/yedek yükleme yapılır
- Dergi detayında PDF sorgusu geçici hata verirse, listede zaten gelen PDF değeri korunur; kullanıcıya yanlışlıkla "PDF bulunamadı" gösterilmez
- Dergi listesi normalize edilirken `content/description` ve `owner/participant1` alanlarında boş string fallback uygulanır; sayfa yenileme sonrası içerik kaybı görünümü engellenir
- Zustand persist içinde `books` saklanır; sayfa yenileme anında liste tekrar yüklenene kadar dergi kartları ve içerik metinleri korunur
- PDF indirme butonu doğrudan dosya indirme akışını kullanır ve Storage URL üzerinde `?download=` parametresi ile tarayıcıda açmak yerine dosyayı indirmeyi zorlar
- Aynı dergi detay açılışında indirme sayacı yalnızca ilk tıklamada +1 artar; detaydan çıkıp yeniden girildiğinde sayaç tekrar bir kez artabilir
- PDF yüklemede dosya tipi (`application/pdf` + `.pdf`), imza (`%PDF-`) ve boyut (maks. 50MB) doğrulaması uygulanır
- Dergi PDF güncellemesinde önce yeni PDF yüklenir, veritabanı başarıyla güncellendikten sonra eski PDF silinir; böylece güncelleme hatasında eski PDF korunur
- Dergi silinmeden PDF silinmez; dergi admin tarafından silinirse ilişkilendirilmiş PDF dosyası da Storage’dan temizlenir
- Sunucu tarafı sıralama (`created_at` ile) kullanılır

## Performans Optimizasyonları (Yazılar & Röportajlar)

- `fetchWritings()` list sorgusunda `content` sütununu dahil ederek sayfa yenilemesi sonrası yazı içeriğinin boş görünmesi engellenir
- `fetchWritingContent(id)` okuma ve düzenleme akışında gerektiğinde içerik eşitlemesi için kullanılmaya devam eder
- `fetchInterviews()` dialogues hariç listeleme yapar; listeleme hızlanır
- `fetchInterviewDialogues(id)` ile diyaloglar yalnızca okuma modunda isteğe bağlı yüklenir
- Tüm listeleme sorgularında sunucu tarafı sıralama (`.order()`) kullanılır
- Okuma modunda yükleme göstergesi (spinner) gösterilir
- Admin düzenleme akışında da lazy loading desteklenir

## Şema Dayanıklılığı (Tüm Sayfalar)

- `src/api/client.ts` içinde books dışında kalan sayfalara da kolon-drift dayanıklılığı eklendi
- `writings`, `suggestions`, `polls`, `interviews`, `dialogues`, `announcements` akışlarında modern sorgu başarısız olup eksik kolon hatası dönerse legacy sütun setiyle otomatik fallback uygulanır
- Legacy fallback yalnızca eksik kolon durumunda devreye girer; diğer hatalar doğrudan hata olarak yükseltilir
- Listeleme verileri fallback yolunda da UI kırılmaması için güvenli varsayılan değerlerle normalize edilir
- Create/Update akışlarında yeni kolonları içeren payload önce denenir, eksik kolon hatasında eski payload ile tekrar yazılır

## Notlar

- Güvenlik uyarılarının bir bölümü geçmişten gelen `yw_*` tablolarından kaynaklanır.
- Uygulamanın aktif akışı `admin_profile`, `writings`, `books`, `suggestions`, `polls`, `poll_options`, `interviews`, `dialogues`, `announcements` tablolarını kullanır.

## Anket Oy Güvenliği Kuralı

- Anketlerde normal ziyaretçi aynı ankete yalnızca bir kez oy verebilir ve bu kural sayfa yenileme/siteye geri dönüşte de korunur.
- Admin kullanıcı için çoklu oy verme izni korunur.
- Oy sayım mantığına (vote_poll_option ve toplam oy hesaplaması) dokunulmaz.

## Yayın Öncesi Doğrulama Notu

- Netlify ile uyum kontrolü için `npm ci && npm run build` komutu başarılı şekilde doğrulandı.
- Tip güvenliği doğrulaması için `npx tsc --noEmit` komutu başarılı şekilde doğrulandı.

## Admin Giriş Güvenliği

- Admin giriş akışı iki adımlıdır: önce e-posta + şifre kontrolü, ardından e-postaya gönderilen 6 haneli onay kodu doğrulaması.
- Onay kodu doğrulanmadan admin oturumu aktif edilmez.
- Giriş ekranındaki şifre alanında nokta (`••••`) placeholder kullanılmaz.
- Admin şifre e-posta adresi (`gelmemeyegidenkitapkurdu@gmail.com`) değiştirilmez.

## Admin Güvenlik Kodu Akışı

- E-posta kodu yerine ikinci adımda sabit 6 haneli güvenlik kodu doğrulanır.
- Şifre doğrulaması başarılı olduktan sonra kullanıcıdan `286628` güvenlik kodu istenir.
- Giriş ekranındaki bilgilendirme metinlerinde mail üzerinden kod gönderimi ifadesi kullanılmaz.


## 2026-06 Giriş Ekranı Güvenlik Sertleştirmesi

- Kullanıcı talebine uygun olarak admin giriş akışı, mevcut içerikler ve içerik yayınlama/yayın sonrası davranışlar korunur; bu alanlara güvenlik işi dışında müdahale edilmez.
- `src/api/client.ts` içinde admin giriş doğrulamasına katmanlı kaba kuvvet koruması uygulanır:
  - başarısız deneme sayacı,
  - adaptif gecikme,
  - belirli eşik sonrası zamanlı kilit,
  - başarılı girişte güvenlik durumunun temizlenmesi.
- Kimlik doğrulama hataları keşif yüzeyini azaltmak için genelleştirilmiş mesajla gösterilir; yalnızca kilitlenme durumu kullanıcıya net süre bilgisiyle verilir.
- `src/pages/Login.tsx` içinde bot/suistimal azaltımı için honeypot alanı, çok hızlı gönderim engeli, tekrar submit guard ve giriş alanı kısıtları korunur.
- `netlify.toml` üzerinden güvenlik başlıkları zorunlu tutulur (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) ve `/login` için no-store/no-cache/noindex politikası korunur.
- Bu sertleştirmelerde temel ilke: admin giriş deneyimini bozmadan saldırı yüzeyini daraltmak ve tahmin/deneme saldırılarını zorlaştırmaktır.


## 2026-06 Yazılar Tıklama Takılma Düzeltmesi

- Yazılar ekranında kart tıklamasında görülen kısa donma giderildi.
- Okuma modalı anında açılacak şekilde akış düzenlendi; içerik eksikse arka planda yüklenip kullanıcıya bekleme mesajı gösterilir.
- Modal içeriğinde aynı yazıyı tekrar tekrar arayan işlemler azaltıldı; seçili yazı tek referanstan kullanılır.
- Düzeltme admin giriş akışına veya yayınlanmış içerik davranışlarına dokunmadan uygulanmıştır.


## 2026-06 Yazılar Açılış Davranışı

- Kullanıcı isteği doğrultusunda yazı detayında "Yazı yükleniyor..." metni kaldırıldı.
- Kart tıklamasında içerik önce arka planda tamamlanır, ardından modal açılır; kullanıcıya doğrudan içerik gösterilir.
- Liste kartlarında mouse-enter ile içerik önceden ısıtılır (prefetch) ve açılış gecikmesi azaltılır.

## 2026-06 Admin Başlık Arka Planı Yönetimi

- Kullanıcı isteğiyle admin panelindeki Profil Düzenle ekranına, sadece başlıktaki GELMEMEYEGİDENKİTAPKURDU yazısının arkasındaki görseli değiştiren ayrı bir alan eklendi.
- Değişiklik yalnızca başlık arka plan görselini etkiler; yayınlanmış içeriklere, içerik sıralarına, yayın tarihlerine ve yayın sonrası davranışlara dokunulmaz.
- Veri uyumluluğu için `admin_profile.header_image` alanı kullanılır; alan yoksa uygulama otomatik olarak varsayılan başlık görseliyle çalışmaya devam eder.

## 2026-06 Yazı ve Duyuru Yayınlama Anlık Yansıma Düzeltmesi

- Kullanıcı isteğiyle yazı ve duyuru ekleme/düzenleme/silme akışında görülen geç yansıma sorunu, mevcut arayüz ve işleyiş korunarak giderildi.
- `src/store/useStore.ts` içinde yazılar ve duyurular için optimistic güncelleme modeli uygulandı: kullanıcı işlemi sonrası liste anında güncellenir, arka planda uzak kayıt tamamlanır.
- Uzak kayıt hatasında otomatik rollback uygulanır; başarısız işlem kalıcı görünmez ve mevcut veri bütünlüğü korunur.
- Değişiklik mevcut teknoloji yığınına ve admin/publish davranışlarına dokunmadan yapıldı.

## 2026-06 Başlık Metni Mikro Boyut Düzeltmesi

- Kullanıcı isteğine göre üst başlıktaki `GELMEMEYEGİDENKİTAPKURDU` metni çok az küçültüldü.
- Sondaki `U` harfinin alt satıra kayma problemi için başlık satırı tek satıra sabitlendi ve satır yüksekliği optimize edildi.
- Değişiklik yalnızca başlık tipografisine uygulandı; diğer sayfa yapıları ve içerik akışları korunmuştur.

## 2026-06 Mobil Başlık Bulanıklık İyileştirmesi

- Kullanıcı geri bildirimi doğrultusunda mobil ekranda ana sayfa başlık görseli ve `GELMEMEYEGİDENKİTAPKURDU` metnindeki bulanıklık azaltıldı.
- Başlık görselinde keskinlik odaklı render ayarları eklendi (`header-hero-image`) ve mobilde algılanan blur etkisini artıran katmanlar sadeleştirildi.
- Mobil görünümde başlık metninin parıltı animasyonu kapatıldı; böylece harfler daha net ve stabil görünür.
- Değişiklik yalnızca başlık alanı görsel netliğine odaklanır; içerik yapısı ve diğer akışlar korunur.

## 2026-06 Başlık Artistik Giriş + Sık Işık Geçişi

- Kullanıcı isteği doğrultusunda `GELMEMEYEGİDENKİTAPKURDU` başlığı için siteye ilk girişte artistik bir giriş animasyonu eklendi (yumuşak yükselme + netleşme etkisi).
- Başlık üzerindeki beyaz ışık geçişinin frekansı artırıldı; daha sık ve belirgin parıltı akışı sağlandı.
- Başlık harflerinde hafif gri-gümüş ton korunarak parlama etkisi daha canlı hale getirildi.
- Görsel kimlik korunurken sadece başlık animasyon deneyimi güçlendirilmiştir.


## 2026-06 Güvenlik ve Mobil/Tarayıcı Uyumluluk Sertleştirmesi

- Kullanıcı isteği doğrultusunda repo içi güvenlik taraması + bağımlılık denetimi yapıldı; bilinen açıklar kapatıldı ve üretim derlemesi temiz geçti.
- `react-router-dom` sürümü `6.30.4` seviyesine yükseltilerek open-redirect açığına karşı güncel güvenlik yaması uygulandı.
- `@supabase/supabase-js` güncellenerek `ws` zincirindeki bilinen güvenlik açıkları giderildi; `pnpm audit --prod` sonucu temizlendi.
- Dergiler (Books) PDF indirme akışı mobil ve tarayıcı farklılıklarına dayanıklı çoklu fallback ile güçlendirildi:
  - data URL doğrudan indirme,
  - güvenli dış URL doğrulaması,
  - blob üzerinden indirme,
  - iOS ve popup engelleme senaryoları için yeni sekmede açma fallback.
- Home ve Suggestions sayfalarında kullanıcı kaynaklı dış bağlantılar için güvenli URL sanitize katmanı eklendi; `javascript:` benzeri zararlı şemalar engellenir.
- Geçersiz dış bağlantı durumunda kullanıcıya kırık link yerine güvenli pasif durum (devre dışı buton/metin) gösterilir.

## 2026-07 Stabilite ve Yayınlama Güncellemeleri

- Yazılar, Öneriler, Röportajlar, Duyurular ve Dergilerde adminin galeriden seçtiği base64 görseller artık önce Supabase Storage `books` bucket'ına (`images/<kategori>/...`) yüklenir; tabloya kalıcı URL yazılır. Böylece sayfa yenilemede içerik/görsel kaybolma sorunu önlenir.
- Dergi PDF akışı korunur: PDF Storage URL saklanır, güncellemede eski dosya yalnızca yeni kayıt başarıyla tamamlandıktan sonra temizlenir.
- Röportaj diyalog kimlikleri sıralı zaman damgalı üretilir ve okuma sırasında `sort_order` + `id` ile çekilir; düzenleme sonrası satırların karışması riski azaltılır.
- Anketler için `created_at` destekli sıralama eklendi; eski şema ile uyumlu fallback korunur.
- Yazılar/Öneriler/Röportajlar/Dergiler listelerinde "Daha Fazla Göster" kademeli render kaldırıldı; kategoriye girildiğinde tüm içerikler tek seferde listelenir (mevcut tasarım korunarak).
- Store katmanında anket ve röportaj işlemleri de tam optimistic + rollback mantığına alındı; yayınla/güncelle/sil sonrası durum anında yansırken hata halinde veri tutarlılığı korunur.


## 2026-07 Mobil ve Tarayıcı Açılış Uyumluluğu

- Kullanıcı isteği doğrultusunda mevcut içeriklere ve admin giriş akışına dokunmadan, site açılışının telefon tipleri ve tarayıcılar arasında daha stabil olması için uyumluluk güçlendirildi.
- `index.html` mobil meta etiketleri genişletildi (viewport-fit, ölçek kilidi, mobil web-app başlıkları, tema rengi, telefon algılama kapatma) ve dil etiketi Türkçe olarak netleştirildi.
- Ana iskelette güvenli alan (safe-area) boşlukları uygulanarak çentik/dynamic island ve alt sistem çubuklarında içerik taşma riski azaltıldı.
- Uygulama kökünde viewport yüksekliği uyumluluğu (`svh`/`dvh`) ve yatay taşma kontrolü eklenerek farklı mobil tarayıcılarda ilk açılış deneyimi dengelendi.
- Üretim derlemesi başarıyla doğrulandı.
