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
    const agp      = document.getElementById('app-gallery-panel');

    if (e.key === 'Escape') {
      if (agp.classList.contains('active'))      closeAppGallery();
      else if (lightbox.classList.contains('active')) closeLightbox();
    }
    if (lightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') galleryNav(1);
      if (e.key === 'ArrowLeft')  galleryNav(-1);
    }
    if (agp.classList.contains('active')) {
      if (e.key === 'ArrowRight') agpNav(1);
      if (e.key === 'ArrowLeft')  agpNav(-1);
    }
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

// ─── App Gallery Panel (Google Images style) ─────────────────────────────────
let agpImages = [];
let agpIndex  = 0;
let agpName   = '';

function openGallery(name, description, images) {
  agpImages = images;
  agpIndex  = 0;
  agpName   = name;

  // Build thumbnails
  const thumbsPane = document.getElementById('agp-thumbs');
  thumbsPane.innerHTML = '';
  images.forEach((src, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'agp-thumb' + (i === 0 ? ' agp-thumb-active' : '');
    thumb.innerHTML = `<img src="${src}" alt="Screenshot ${i + 1}" loading="lazy">`;
    thumb.addEventListener('click', () => agpSelectImage(i));
    thumbsPane.appendChild(thumb);
  });

  // Set main image
  document.getElementById('agp-main-img').src = images[0];
  document.getElementById('agp-app-name').textContent = name;
  document.getElementById('agp-counter').textContent = `1 / ${images.length}`;

  // Open panel
  const panel = document.getElementById('app-gallery-panel');
  panel.style.display = 'flex';
  void panel.offsetWidth;
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Scroll active thumb into view
  thumbsPane.scrollTop = 0;
}

function agpSelectImage(index) {
  agpIndex = index;
  const mainImg = document.getElementById('agp-main-img');
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = agpImages[index];
    mainImg.style.opacity = '1';
  }, 120);

  document.getElementById('agp-counter').textContent = `${index + 1} / ${agpImages.length}`;

  // Update active thumb
  document.querySelectorAll('.agp-thumb').forEach((t, i) => {
    t.classList.toggle('agp-thumb-active', i === index);
  });

  // Scroll active thumb into view in the side panel
  const activeThumb = document.querySelectorAll('.agp-thumb')[index];
  if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function agpNav(direction) {
  const next = (agpIndex + direction + agpImages.length) % agpImages.length;
  agpSelectImage(next);
}

function closeAppGallery() {
  const panel = document.getElementById('app-gallery-panel');
  panel.classList.remove('active');
  setTimeout(() => {
    if (!panel.classList.contains('active')) {
      panel.style.display = 'none';
      document.body.style.overflow = '';
    }
  }, 300);
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

// ─── Video modal ─────────────────────────────────────────────────────────────
function openVideo(src, title) {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  const titleEl = document.getElementById('video-modal-title');

  video.src = src;
  titleEl.textContent = title;

  modal.style.display = 'flex';
  void modal.offsetWidth;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  modal.classList.remove('active');
  setTimeout(() => {
    if (!modal.classList.contains('active')) {
      modal.style.display = 'none';
      video.pause();
      video.src = '';
      document.body.style.overflow = '';
    }
  }, 300);
}

// ─── Video card hover — scrub to middle frame for preview ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.vid-preview').forEach(vid => {
    vid.addEventListener('loadedmetadata', () => {
      vid.currentTime = vid.duration * 0.25;
    });

    const card = vid.closest('.vid-card');
    if (card) {
      card.addEventListener('mouseenter', () => {
        vid.play().catch(() => {}); // silent autoplay on hover
      });
      card.addEventListener('mouseleave', () => {
        vid.pause();
        vid.currentTime = vid.duration * 0.25;
      });
    }
  });
});

// ─── Minimal Canvas Particle Background ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const numParticles = Math.min(Math.floor((width * height) / 15000), 80);
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5
      });
    }
  }

  function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  initCanvas();
  animateCanvas();
  window.addEventListener('resize', () => {
    initCanvas();
  });
});

// ─── Dynamic Category Filtering (Isotope) ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('main-grid');
  if (!grid) return;

  // Initialize Isotope after all images have loaded
  imagesLoaded(grid, function() {
    const iso = new Isotope(grid, {
      itemSelector: '.filter-item',
      layoutMode: 'masonry',
      masonry: {
        columnWidth: '.filter-item',
        gutter: 24
      },
      transitionDuration: '0.6s',
      hiddenStyle: {
        opacity: 0,
        transform: 'scale(0.8)'
      },
      visibleStyle: {
        opacity: 1,
        transform: 'scale(1)'
      }
    });

    // Bind filter button click
    const filtersElem = document.getElementById('filter-nav');
    if (filtersElem) {
      filtersElem.addEventListener('click', function(event) {
        if (!event.target.matches('.nav-btn')) return;
        
        const filterValue = event.target.getAttribute('data-filter');
        iso.arrange({ filter: filterValue });
        
        // Change active class
        const currentActive = filtersElem.querySelector('.active');
        if (currentActive) currentActive.classList.remove('active');
        event.target.classList.add('active');
      });
    }
  });
});