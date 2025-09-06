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

  // Modern Skills Section Functionality
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
                progressFill.style.setProperty('--progress-width', dataWidth);
                card.classList.add('in-view');
              }
            }, index * 150); // Staggered animation
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
  }

  // Skill card interactions
  skillCards.forEach(card => {
    // Add click functionality to skill cards
    card.addEventListener('click', (e) => {
      if (e.target.closest('.skill-btn')) return; // Don't trigger if button was clicked
      
      const skillName = card.querySelector('.skill-name')?.textContent;
      const skillLevel = card.querySelector('.level-text')?.textContent;
      const skillDesc = card.querySelector('.skill-description')?.textContent;
      
      showToast(`${skillName} - ${skillLevel}: ${skillDesc}`, 'success');
      
      // Add a subtle pulse effect
      card.style.animation = 'pulse 0.6s ease';
      setTimeout(() => {
        card.style.animation = '';
      }, 600);
    });

    // Enhanced hover effects
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.skill-icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });

    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.skill-icon');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // Skill button functionality
  skillButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click
      
      const card = btn.closest('.skill-card');
      const skillName = card?.querySelector('.skill-name')?.textContent;
      const skillData = card?.getAttribute('data-skill');
      
      // Create a more detailed interaction
      const skillInfo = {
        python: 'Check out my Python projects on GitHub!',
        django: 'Explore my Django web applications!',
        nodejs: 'See my Node.js backend projects!',
        javascript: 'View my interactive JavaScript applications!',
        react: 'Discover my React component libraries!',
        'html-css': 'Browse my responsive web designs!',
        aws: 'Learn about my cloud architecture projects!',
        docker: 'See my containerized applications!',
        cicd: 'Explore my automated deployment pipelines!',
        mongodb: 'Check out my NoSQL database projects!',
        mysql: 'View my relational database designs!'
      };
      
      const message = skillInfo[skillData] || `Learn more about my ${skillName} expertise!`;
      showToast(message, 'success');
      
      // Add button animation
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Add keyboard navigation for skill cards
  skillCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Add floating animation to skill icons
  const skillIcons = qsa('.skill-icon');
  skillIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.2}s`;
    icon.style.animation = 'float 3s ease-in-out infinite';
  });

})();
