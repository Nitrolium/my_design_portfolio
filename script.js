document.addEventListener('DOMContentLoaded', () => {
  // Navigation active state highlight on click
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Highlight active nav item depending on scroll position
  const sections = document.querySelectorAll('.portfolio-section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('href') === `#${current}`) {
          btn.classList.add('active');
        }
      });
    }
  });

  // ESC key to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
});

function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  // Find the calling element to extract its heading for caption
  const clickedItem = event.currentTarget;
  const headingText = clickedItem.querySelector('h3') ? clickedItem.querySelector('h3').textContent : 'Project View';
  const categoryText = clickedItem.querySelector('.item-category') ? clickedItem.querySelector('.item-category').textContent : '';

  lightboxImg.src = imageSrc;
  lightboxCaption.textContent = categoryText ? `${categoryText} — ${headingText}` : headingText;

  lightbox.style.display = 'flex';
  // Force a reflow for transition
  void lightbox.offsetWidth;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  
  // Wait for the CSS transition to finish before hiding the element completely
  setTimeout(() => {
    if (!lightbox.classList.contains('active')) {
      lightbox.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  }, 300);
}