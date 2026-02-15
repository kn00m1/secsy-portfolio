// Animated counters via IntersectionObserver
(function () {
  'use strict';

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target) || target === 0) return;

    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function animateSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.width = width + '%';
      }
    });
  }

  // Observe stat cards
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-number[data-target]');
        counters.forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe fade-in elements
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.addEventListener('DOMContentLoaded', () => {
    // Wait for data to load then observe
    setTimeout(() => {
      const statGrid = document.querySelector('.stat-grid');
      if (statGrid) counterObserver.observe(statGrid);

      const skillsList = document.getElementById('skills-list');
      if (skillsList) skillObserver.observe(skillsList);

      document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
      });
    }, 200);

    // Re-observe dynamically added fade-in elements
    const bodyObserver = new MutationObserver(() => {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
        fadeObserver.observe(el);
      });
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  });
})();
