/* ═══════════════════════════════════════════════════
   PearlSmile Dental — script.js
═══════════════════════════════════════════════════ */

// ══════════════════════════ NAVBAR ══════════════════════════

const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ══════════════════════════ SCROLL REVEAL ══════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ══════════════════════════ COUNTER ANIMATION ══════════════════════════
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ══════════════════════════ TESTIMONIAL SLIDER ══════════════════════════
(function initSlider() {
  const track    = document.getElementById('testiTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');
  const cards    = track.querySelectorAll('.testi-card');

  let cardsPerView = getCardsPerView();
  let current      = 0;
  let maxIndex     = Math.ceil(cards.length / cardsPerView) - 1;

  function getCardsPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth     = cards[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${current * cardsPerView * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play
  let autoPlay = setInterval(() => goTo(current === maxIndex ? 0 : current + 1), 5000);
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => { clearInterval(autoPlay); autoPlay = setInterval(() => goTo(current === maxIndex ? 0 : current + 1), 5000); });
  });

  buildDots();

  window.addEventListener('resize', () => {
    const prev = cardsPerView;
    cardsPerView = getCardsPerView();
    if (prev !== cardsPerView) { current = 0; buildDots(); goTo(0); }
  });
})();

// ══════════════════════════ GALLERY FILTER ══════════════════════════
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.cat;
      const show = filter === 'all' || cat === filter;

      item.style.transition = 'opacity 0.3s, transform 0.3s';
      if (show) {
        item.style.opacity   = '1';
        item.style.transform = 'scale(1)';
        item.style.display   = '';
      } else {
        item.style.opacity   = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (btn.dataset.filter !== 'all' && item.dataset.cat !== btn.dataset.filter) {
            item.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

// ══════════════════════════ FAQ ACCORDION ══════════════════════════
document.querySelectorAll('.faq-item').forEach(item => {
  const btn    = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');

  btn.addEventListener('click', () => {
    const isOpen = item.dataset.open === 'true';

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.dataset.open          = 'false';
      i.querySelector('.faq-a').style.maxHeight = '0';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.dataset.open       = 'true';
      answer.style.maxHeight  = answer.scrollHeight + 'px';
    }
  });
});

// ══════════════════════════ CONTACT FORM ══════════════════════════
const bookingForm  = document.getElementById('bookingForm');
const formSuccess  = document.getElementById('formSuccess');

// Set min date for date picker
const dateInput = bookingForm.querySelector('input[type="date"]');
const today     = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const required = bookingForm.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e05252';
      valid = false;
      field.focus();
    }
  });

  if (!valid) {
    shakeForm();
    return;
  }

  // Simulate submission
  const btn = bookingForm.querySelector('.btn-primary');
  btn.textContent = 'Submitting…';
  btn.style.opacity = '.7';

  setTimeout(() => {
    bookingForm.style.display     = 'none';
    formSuccess.style.display     = 'block';
  }, 1400);
});

function shakeForm() {
  const form = bookingForm;
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => form.style.animation = '', 400);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ══════════════════════════ SMOOTH ACTIVE NAV ══════════════════════════
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchorLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--green-deep)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ══════════════════════════ HERO PARALLAX ══════════════════════════
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBlob = document.querySelector('.hero-blob');
  if (heroBlob && scrollY < 800) {
    heroBlob.style.transform = `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.02}deg)`;
  }
});

// ══════════════════════════ CURSOR GLOW (desktop) ══════════════════════════
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,186,110,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    left: -500px; top: -500px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

console.log('✦ PearlSmile Dental — script loaded');