// ================================================================
// ATRIANO MAKE UP STUDIO — portfolio.js
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. SCROLL REVEAL ANIMATION (Memunculkan foto bergantian)
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Hanya animasi 1x
      }
    });
  }, {
    root: null,
    threshold: 0.1, // Muncul ketika 10% elemen terlihat di layar
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // 2. LIGHTBOX GALLERY
  const galleryItems = document.querySelectorAll('.gallery-item:not(.ig-card)');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  // Buka Lightbox saat foto diklik
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Ambil tag img di dalam elemen yang diklik
      const img = item.querySelector('.gallery-img');
      if (img) {
        const src = img.getAttribute('src');
        lightboxImg.setAttribute('src', src);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Kunci scroll background
      }
    });
  });

  // Tutup Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Kembalikan scroll
    // Kosongkan src setelah animasi selesai agar tidak glitch
    setTimeout(() => { lightboxImg.setAttribute('src', ''); }, 300);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  
  // Tutup jika mengklik area gelap di luar gambar
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Tutup dengan tombol Escape di keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

});