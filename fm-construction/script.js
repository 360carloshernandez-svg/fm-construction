// ============================================================
// F&M CONSTRUCTION — interactions
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 500);
  });
  // Fallback in case 'load' is slow/blocked
  setTimeout(() => loader && loader.classList.add('hide'), 2200);

  /* ---------- Sticky nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Graceful image fallback ----------
     If a placeholder image (images/.../n.jpg) hasn't been
     replaced yet, show an elegant gradient tile instead of
     a broken-image icon, so the layout still looks finished. */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      const wrap = img.parentElement;
      wrap.style.background = 'linear-gradient(145deg, #242424 0%, #161616 100%)';
      wrap.style.display = 'flex';
      wrap.style.alignItems = 'center';
      wrap.style.justifyContent = 'center';
      img.style.display = 'none';
      const label = document.createElement('span');
      label.textContent = img.alt || 'Photo coming soon';
      label.style.color = 'rgba(255,255,255,.35)';
      label.style.fontFamily = "'Space Grotesk', sans-serif";
      label.style.fontSize = '.85rem';
      label.style.letterSpacing = '.04em';
      label.style.textAlign = 'center';
      label.style.padding = '0 16px';
      wrap.appendChild(label);
    }, { once: true });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(galleryItems, index) {
    currentGallery = galleryItems;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxImage() {
    const img = currentGallery[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNext(dir) {
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  }

  document.querySelectorAll('.gallery').forEach(gallery => {
    const imgs = Array.from(gallery.querySelectorAll('img'));
    imgs.forEach((img, idx) => {
      img.parentElement.addEventListener('click', () => {
        if (img.style.display === 'none') return; // no real image yet
        openLightbox(imgs, idx);
      });
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', () => showNext(1));
  lightboxPrev.addEventListener('click', () => showNext(-1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
