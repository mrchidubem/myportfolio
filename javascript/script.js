(function() {
  const qs = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Navigation toggle for mobile
  const navToggleBtn = qs('.nav-toggle-btn');
  const navLinks = qs('.nav-links');
  if (navToggleBtn && navLinks) {
    navToggleBtn.addEventListener('click', () => {
      const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      navToggleBtn.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });
  }

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
      if (navToggleBtn && navToggleBtn.getAttribute('aria-expanded') === 'true') {
        navToggleBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
      }
    });
  });

  // Active nav link on scroll
  const sections = qsa('section[id]');
  const navLinksItems = qsa('.nav-links a');
  const setActive = () => {
    const scrollPos = window.scrollY + 100; // offset for fixed nav
    let currentId = sections[0]?.id;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      if (scrollPos >= top) currentId = sec.id;
    });
    navLinksItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('load', setActive);

  // Theme toggle
  const themeToggle = qs('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-theme', themeToggle.checked ? 'light' : 'dark');
    });
  }

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

  // Skills section functionality
  const skillCards = qsa('.skill-card');
  const skillButtons = qsa('.skill-btn');
  
  // Animate progress bars when skills section comes into view
  const skillsSection = qs('#skills');
  if (skillsSection && skillCards.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillCards.forEach((card, index) => {
            setTimeout(() => {
              const progressFill = card.querySelector('.progress-fill');
              const dataWidth = progressFill?.getAttribute('data-width');
              if (progressFill && dataWidth) {
                progressFill.style.width = dataWidth;
              }
            }, index * 150); // Staggered animation
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
  }

  // Skill button functionality
  skillButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const skill = btn.closest('.skill-card').getAttribute('data-skill');
      if (skill) {
        window.location.href = `#projects?skill=${skill}`;
      }
    });
  });

  // Create particle elements for hero section
  const hero = qs('.hero');
  if (hero) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hero-particles';
    for (let i = 0; i < 4; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particleContainer.appendChild(particle);
    }
    hero.appendChild(particleContainer);
  }

  // Add smooth scroll for back-to-top button
  const backToTop = qs('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();