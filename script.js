/* Mobile menu toggle */
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // close menu on internal link click (mobile)
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Reveal elements on scroll */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Stagger reveal for certificate grid items */
const certGrid = document.getElementById('certGrid');
if (certGrid) {
  const certItems = certGrid.querySelectorAll('.cert-item');
  const certObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        certItems.forEach((item, i) => {
          setTimeout(() => item.classList.add('show'), i * 110);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  certObserver.observe(certGrid);
}

/* Lightbox functionality */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxCaption = document.getElementById('lightboxCaption');

document.querySelectorAll('.cert-link').forEach(link => {
  link.addEventListener('click', (ev) => {
    ev.preventDefault();
    const src = link.getAttribute('data-src');
    const caption = link.parentElement.querySelector('figcaption')?.textContent || '';
    if (src) {
      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      // trap focus (basic)
      lightboxClose.focus();
    }
  });
});

lightboxClose.addEventListener('click', () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  }
});

/* Smooth scroll for same-page links (extra reliability) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);
    }
  });
});


/* Contact form submission feedback (Formspree) */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const nameField = document.getElementById('name'); // ?? grab the name input

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending…';
    const data = new FormData(contactForm);

    try {
      const res = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const userName = nameField.value.trim() || "there";
        formStatus.textContent =` Thank you ${userName}, we will reach you shortly!`;
        contactForm.reset();
      } else {
        const json = await res.json();
        formStatus.textContent = (json && json.error)
          ? json.error
          : '? Oops — something went wrong.';
      }
    } catch (err) {
      formStatus.textContent = '? Network error — please try again later.';
    }

    // clear message after 7 seconds
    setTimeout(() => formStatus.textContent = '', 7000);
  });
}
