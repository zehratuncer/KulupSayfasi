// Filtreleme işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filtre-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif buton sınıfını kaldır
            filterButtons.forEach(btn => btn.classList.remove('aktif'));
            // Tıklanan butona aktif sınıfını ekle
            this.classList.add('aktif');
            
            // Filtreleme işlemini yap
            const filter = this.textContent.toLowerCase();
            filtreleEtkinlikler(filter);
        });
    });
    
    // Sayfa ilk yüklendiğinde "Tümü" filtresini uygula
    filtreleEtkinlikler('Tümü');
});

// Etkinlikleri filtreleme fonksiyonu
function filtreleEtkinlikler(filtre) {
    const events = document.querySelectorAll('.etkinlik-karti');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Saat bilgisini sıfırla
    
    events.forEach(event => {
        const dateText = event.querySelector('.etkinlik-bilgi p:first-child').textContent;
        const eventDate = tarihAyir(dateText);
        eventDate.setHours(0, 0, 0, 0); // Saat bilgisini sıfırla
        
        if (filtre === 'Tümü') {
            event.style.display = 'flex';
        } else if (filtre === 'Yaklaşan') {
            if (eventDate >= today) {
                event.style.display = 'flex';
            } else {
                event.style.display = 'none';
            }
        } else if (filtre === 'Geçmiş') {
            if (eventDate < today) {
                event.style.display = 'flex';
            } else {
                event.style.display = 'none';
            }
        }
    });
}

// Tarih ayrıştırma fonksiyonu
function tarihAyir(tarihMetni) {
    // Tarih metninden gereksiz karakterleri temizle
    tarihMetni = tarihMetni.replace('Tarih:', '').trim();
    
    // Tarih ve saat bilgilerini ayır
    const [tarih, saat] = tarihMetni.split(',');
    
    // Tarih parçalarını ayır
    const [gun, ay, yil] = tarih.trim().split(' ');
    
    // Ay ismini sayıya çevir
    const aySayisi = {
        'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
        'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
    }[ay];
    
    // Saat bilgisini ayır
    const [saatDegeri, dakika] = saat.trim().split(':');
    
    // Yeni Date nesnesi oluştur
    return new Date(
        parseInt(yil),
        aySayisi,
        parseInt(gun),
        parseInt(saatDegeri),
        parseInt(dakika)
    );
}

// Arama işlevselliği
const searchInput = document.querySelector('.arama-kutusu input');
searchInput.addEventListener('input', aramaYap);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        ilkEslesenEtkinligeGit();
    }
});

// Arama fonksiyonu
function aramaYap(e) {
    const aramaMetni = e.target.value.toLowerCase();
    const events = document.querySelectorAll('.etkinlik-karti');
    let eslesmeVar = false;
    
    events.forEach(event => {
        const title = event.querySelector('h3').textContent.toLowerCase();
        const description = event.querySelector('.etkinlik-aciklama').textContent.toLowerCase();
        const location = event.querySelector('.etkinlik-bilgi p:last-child').textContent.toLowerCase();
        const date = event.querySelector('.etkinlik-bilgi p:first-child').textContent.toLowerCase();
        
        if (title.includes(aramaMetni) || 
            description.includes(aramaMetni) || 
            location.includes(aramaMetni) || 
            date.includes(aramaMetni)) {
            event.style.display = 'flex';
            eslesmeVar = true;
            
            // Arama terimini vurgula
            if (aramaMetni) {
                vurgulaMetin(event, aramaMetni);
            } else {
                vurgulamayiKaldir(event);
            }
        } else {
            event.style.display = 'none';
        }
    });
    
    // Sonuç bulunamadı mesajını göster/gizle
    sonucMesajiGoster(eslesmeVar, aramaMetni);
}

// Metin vurgulama fonksiyonu
function vurgulaMetin(element, searchTerm) {
    const title = element.querySelector('h3');
    const description = element.querySelector('.etkinlik-aciklama');
    
    if (title.textContent.toLowerCase().includes(searchTerm)) {
        const regex = new RegExp(searchTerm, 'gi');
        title.innerHTML = title.textContent.replace(regex, match => `<span class="vurgulanan">${match}</span>`);
    }
    
    if (description.textContent.toLowerCase().includes(searchTerm)) {
        const regex = new RegExp(searchTerm, 'gi');
        description.innerHTML = description.textContent.replace(regex, match => `<span class="vurgulanan">${match}</span>`);
    }
}

// Vurgulamayı kaldırma fonksiyonu
function vurgulamayiKaldir(element) {
    const title = element.querySelector('h3');
    const description = element.querySelector('.etkinlik-aciklama');
    
    title.innerHTML = title.textContent;
    description.innerHTML = description.textContent;
}

// Sonuç mesajı gösterme fonksiyonu
function sonucMesajiGoster(eslesmeVar, aramaMetni) {
    let sonucMesaji = document.querySelector('.arama-sonuc');
    
    if (!sonucMesaji) {
        sonucMesaji = document.createElement('div');
        sonucMesaji.className = 'arama-sonuc';
        document.querySelector('.arama-kutusu').appendChild(sonucMesaji);
    }

    if (!eslesmeVar && aramaMetni) {
        sonucMesaji.textContent = `"${aramaMetni}" için sonuç bulunamadı.`;
        sonucMesaji.style.display = 'block';
    } else {
        sonucMesaji.style.display = 'none';
    }
}

// İlk eşleşen etkinliğe gitme fonksiyonu
function ilkEslesenEtkinligeGit() {
    const gorunurEtkinlikler = Array.from(document.querySelectorAll('.etkinlik-karti'))
        .filter(etkinlik => etkinlik.style.display !== 'none');

    if (gorunurEtkinlikler.length > 0) {
        gorunurEtkinlikler[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Detay butonları için event listener
const detailButtons = document.querySelectorAll('.detay-btn');
detailButtons.forEach(button => {
    button.addEventListener('click', function() {
        const eventCard = this.closest('.etkinlik-karti');
        const eventTitle = eventCard.querySelector('h3').textContent;
        
        // Örnek modal gösterimi
        alert(`${eventTitle} etkinliğinin detayları gösterilecek`);
        // Gerçek uygulamada burada modal açılabilir veya detay sayfasına yönlendirilebilir
    });
});

// Bildirim ikonu için event listener
const notificationIcon = document.querySelector('.bildirimler i');
notificationIcon.addEventListener('click', function() {
    // Örnek bildirim gösterimi
    alert('Bildirimler burada gösterilecek');
    // Gerçek uygulamada burada bildirim paneli açılabilir
});

// Giriş/Kayıt butonları için event listener
const loginBtn = document.querySelector('.giris-btn');
const registerBtn = document.querySelector('.kayit-btn');

loginBtn.addEventListener('click', function() {
    // Örnek giriş işlemi
    alert('Giriş sayfası açılacak');
    // Gerçek uygulamada burada giriş modalı açılabilir
});

registerBtn.addEventListener('click', function() {
    // Örnek kayıt işlemi
    alert('Kayıt sayfası açılacak');
    // Gerçek uygulamada burada kayıt modalı açılabilir
}); 