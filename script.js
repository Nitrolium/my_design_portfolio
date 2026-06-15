// ─── State ────────────────────────────────────────────────────────────────────
let galleryImages = [];   // array of image paths for the current gallery
let galleryIndex  = 0;    // current index within the gallery
let galleryTitle  = '';   // name of the current project

// ─── DOM ready ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Navigation active state highlight on click
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Highlight active nav item depending on scroll position
  const sections = document.querySelectorAll('.portfolio-section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (pageYOffset >= section.offsetTop - 250) {
        current = section.getAttribute('id');
      }
    });
    if (current) {
      navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('href') === `#${current}`) btn.classList.add('active');
      });
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  galleryNav(1);
    if (e.key === 'ArrowLeft')   galleryNav(-1);
  });
});

// ─── Single-image lightbox (existing portfolio items) ────────────────────────
function openLightbox(imageSrc) {
  galleryImages = [imageSrc];
  galleryIndex  = 0;
  galleryTitle  = '';

  // Try to read the caption from the clicked card
  const clickedItem = event.currentTarget;
  const heading  = clickedItem.querySelector('h3')            ? clickedItem.querySelector('h3').textContent            : 'Project View';
  const category = clickedItem.querySelector('.item-category') ? clickedItem.querySelector('.item-category').textContent : '';
  galleryTitle = category ? `${category} — ${heading}` : heading;

  _showLightbox();
}

// ─── Multi-image gallery (Applications section) ───────────────────────────────
function openGallery(name, description, images) {
  galleryImages = images;
  galleryIndex  = 0;
  galleryTitle  = name;
  _showLightbox();
}

// ─── Navigate prev / next within a gallery ───────────────────────────────────
function galleryNav(direction) {
  if (galleryImages.length <= 1) return;
  galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;
  _updateLightboxImage();
}

// ─── Internal helpers ────────────────────────────────────────────────────────
function _showLightbox() {
  const lightbox = document.getElementById('lightbox');
  _updateLightboxImage();

  lightbox.style.display = 'flex';
  void lightbox.offsetWidth;           // force reflow for CSS transition
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Show / hide nav arrows
  const showNav = galleryImages.length > 1;
  document.getElementById('lightbox-prev').style.display = showNav ? 'flex' : 'none';
  document.getElementById('lightbox-next').style.display = showNav ? 'flex' : 'none';
}

function _updateLightboxImage() {
  const img     = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  // Fade swap
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = galleryImages[galleryIndex];
    img.style.opacity = '1';
  }, 150);

  caption.textContent = galleryTitle;

  if (galleryImages.length > 1) {
    counter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
    counter.style.display = 'block';
  } else {
    counter.style.display = 'none';
  }
}

// ─── Close lightbox ──────────────────────────────────────────────────────────
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  setTimeout(() => {
    if (!lightbox.classList.contains('active')) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  }, 300);
}