// Theme Toggle Functionality
const themeToggle = document.querySelector('#theme-toggle');
themeToggle.addEventListener('change', () => {
  document.documentElement.setAttribute(
    'data-theme',
    themeToggle.checked ? 'light' : 'dark'
  );
});

// Mobile Navigation Toggle
const navToggleBtn = document.querySelector('.nav-toggle-btn');
const navLinks = document.querySelector('.nav-links');
const themeControls = document.querySelector('.theme-controls');

// Move theme controls into nav-links on mobile
function handleMobileNav() {
  if (window.innerWidth <= 768) {
    navLinks.appendChild(themeControls);
  } else {
    document.querySelector('.theme-controls-wrapper').appendChild(themeControls);
  }
}

// Run on page load and window resize
window.addEventListener('load', handleMobileNav);
window.addEventListener('resize', handleMobileNav);

navToggleBtn.addEventListener('click', () => {
  const isExpanded = navLinks.classList.toggle('active');
  navToggleBtn.setAttribute('aria-expanded', isExpanded);
  navToggleBtn.innerHTML = isExpanded
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggleBtn.setAttribute('aria-expanded', 'false');
    navToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Progress Bar Animation
document.querySelectorAll('.progress-fill').forEach(bar => {
  const width = bar.getAttribute('data-width');
  bar.style.width = '0%'; // Start at 0%
  setTimeout(() => {
    bar.style.width = width; // Animate to the specified width
  }, 100); // Small delay to ensure visibility on load
});

// Section Reveal on Scroll
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  revealElements.forEach(elem => {
    const windowHeight = window.innerHeight;
    const elementTop = elem.getBoundingClientRect().top;
    if (elementTop < windowHeight - 150) {
      elem.classList.add('active');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check on page load

// View Certifications Toggle
const viewCertificationsBtn = document.querySelector('.view-certifications');
const certificationsSection = document.getElementById('certifications');
const educationSection = document.getElementById('education');

viewCertificationsBtn.addEventListener('click', () => {
  certificationsSection.setAttribute('aria-hidden', 'false');
  educationSection.setAttribute('aria-hidden', 'true');
  certificationsSection.scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('.back-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      certificationsSection.setAttribute('aria-hidden', 'true');
      educationSection.setAttribute('aria-hidden', 'false');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Read More Toggle for Blog Section
document.querySelectorAll('.read-more').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const article = document.getElementById(targetId);
    const previewCard = document.getElementById(`blog-${targetId.split('-')[1]}-preview`);
    const articlesSection = document.getElementById('articles');
    const insightsSection = document.getElementById('insights-updates');
    const allArticles = document.querySelectorAll('.article-item');

    if (article.getAttribute('aria-hidden') === 'true') {
      // Hide all articles and show only the targeted one
      allArticles.forEach(art => art.setAttribute('aria-hidden', 'true'));
      article.setAttribute('aria-hidden', 'false');
      articlesSection.setAttribute('aria-hidden', 'false');
      insightsSection.setAttribute('aria-hidden', 'true');
      previewCard.querySelector('.preview-text').classList.add('hidden');
      button.textContent = 'Read Less';
      // Scroll to the specific article
      article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Hide the article and show insights
      article.setAttribute('aria-hidden', 'true');
      articlesSection.setAttribute('aria-hidden', 'true');
      insightsSection.setAttribute('aria-hidden', 'false');
      previewCard.querySelector('.preview-text').classList.remove('hidden');
      button.textContent = 'Read More';
      insightsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Back to Insights from Articles
document.querySelectorAll('.article-item .back-link').forEach(link => {
  link.addEventListener('click', () => {
    const articlesSection = document.getElementById('articles');
    const insightsSection = document.getElementById('insights-updates');
    const articles = document.querySelectorAll('.article-item');
    const previewCards = document.querySelectorAll('.article-card');

    articlesSection.setAttribute('aria-hidden', 'true');
    insightsSection.setAttribute('aria-hidden', 'false');
    articles.forEach(article => article.setAttribute('aria-hidden', 'true'));
    previewCards.forEach(card => {
      card.querySelector('.preview-text').classList.remove('hidden');
      card.querySelector('.read-more').textContent = 'Read More';
    });
    insightsSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// Form Submission Handling
document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  const toastContainer = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Message sent successfully!';
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('active');
  }, 100);
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
  e.target.reset();
});

// Initialize progress bars on page load
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-fill').forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width;
  });
});

document.querySelectorAll('.education-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const details = document.getElementById(button.getAttribute('aria-controls'));
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    details.setAttribute('aria-hidden', isExpanded);
    details.style.display = isExpanded ? 'none' : 'block';
  });
});