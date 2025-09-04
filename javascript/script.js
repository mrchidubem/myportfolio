(function() {
  const qs = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Smooth scroll for internal links
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', evt => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#') === false) return;
      const target = qs(href);
      if (target) {
        evt.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile nav if open
      const navToggle = qs('#nav-toggle');
      if (navToggle && navToggle.checked) navToggle.checked = false;
    });
  });

  // Active nav link on scroll
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav-links a');
  const setActive = () => {
    const scrollPos = window.scrollY + 100; // offset for fixed nav
    let currentId = sections[0]?.id;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      if (scrollPos >= top) currentId = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('load', setActive);

  // Reveal-on-scroll using IntersectionObserver
  const revealEls = qsa('.reveal');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }) : null;
  if (io) {
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show immediately
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Toasts
  const toastContainer = qs('.toast-container');
  const showToast = (message, type='success') => {
    if (!toastContainer) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    toastContainer.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(() => el.remove(), 250);
    }, 3000);
  };

  // Contact form validation and feedback
  const form = qs('.contact form');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = qs('#name');
      const email = qs('#email');
      const message = qs('#message');
      if (!name.value.trim()) return showToast('Please enter your name.', 'error');
      if (!emailRe.test(email.value.trim())) return showToast('Please enter a valid email.', 'error');
      if (!message.value.trim()) return showToast('Please enter a message.', 'error');
      // Simulate submit success
      showToast('Thanks! Your message has been sent.');
      form.reset();
    });
  }
})();
