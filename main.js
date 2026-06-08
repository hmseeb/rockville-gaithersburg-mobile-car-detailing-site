/**
 * RG Mobile Car Detailing — Main JavaScript
 * Handles: navigation, scroll effects, mobile menu, form validation, animations
 */

(function () {
  'use strict';

  /* ============================================================
     NAVIGATION: sticky scroll effect
     ============================================================ */
  const header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    overlay.style.display = 'block';
    // Force reflow for transition
    requestAnimationFrame(() => overlay.classList.add('active'));
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Hide overlay after transition
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
      }
    }, 300);
  }

  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close menu if window resizes to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  }, { passive: true });

  /* ============================================================
     SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ============================================================
     ACTIVE NAV LINK on scroll (Intersection Observer)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ============================================================
     SCROLL ANIMATIONS (Intersection Observer)
     ============================================================ */
  const fadeEls = document.querySelectorAll(
    '.service-card, .pricing-card, .testimonial-card, .why-item, .contact-item, .area-tag'
  );

  fadeEls.forEach((el, i) => {
    el.classList.add('fade-in');
    // Stagger delay within groups
    const delay = (i % 4) * 0.1;
    el.style.transitionDelay = `${delay}s`;
  });

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ============================================================
     CONTACT FORM VALIDATION
     ============================================================ */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  function getField(id) {
    return document.getElementById(id);
  }

  function showError(inputId, errorId, message) {
    const input = getField(inputId);
    const errorEl = getField(errorId);
    if (input && errorEl) {
      errorEl.textContent = message;
      input.closest('.form-group').classList.add('has-error');
    }
  }

  function clearError(inputId, errorId) {
    const input = getField(inputId);
    const errorEl = getField(errorId);
    if (input && errorEl) {
      errorEl.textContent = '';
      input.closest('.form-group').classList.remove('has-error');
    }
  }

  function validatePhone(phone) {
    return /^[\d\s\(\)\-\+\.]{7,20}$/.test(phone.trim());
  }

  function validateForm() {
    let isValid = true;

    const name = getField('name');
    const phone = getField('phone');
    const service = getField('service');

    // Clear previous errors
    clearError('name', 'name-error');
    clearError('phone', 'phone-error');
    clearError('service', 'service-error');

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('name', 'name-error', 'Please enter your full name.');
      isValid = false;
    }

    if (!phone.value.trim()) {
      showError('phone', 'phone-error', 'Please enter your phone number.');
      isValid = false;
    } else if (!validatePhone(phone.value)) {
      showError('phone', 'phone-error', 'Please enter a valid phone number.');
      isValid = false;
    }

    if (!service.value) {
      showError('service', 'service-error', 'Please select a service.');
      isValid = false;
    }

    return isValid;
  }

  // Real-time validation on blur
  ['name', 'phone', 'service'].forEach(fieldId => {
    const el = getField(fieldId);
    if (!el) return;
    el.addEventListener('blur', () => {
      const errorId = `${fieldId}-error`;
      clearError(fieldId, errorId);
      if (fieldId === 'name' && (!el.value.trim() || el.value.trim().length < 2)) {
        showError(fieldId, errorId, 'Please enter your full name.');
      }
      if (fieldId === 'phone' && el.value.trim() && !validatePhone(el.value)) {
        showError(fieldId, errorId, 'Please enter a valid phone number.');
      }
      if (fieldId === 'service' && !el.value) {
        showError(fieldId, errorId, 'Please select a service.');
      }
    });
    el.addEventListener('input', () => {
      clearError(fieldId, `${fieldId}-error`);
    });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) {
        // Focus first error field
        const firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate form submission (no backend)
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Send Quote Request
        `;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Hide success message after 8 seconds
        setTimeout(() => {
          formSuccess.hidden = true;
        }, 8000);
      }, 1200);
    });
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================================
     ACTIVE NAV LINK style (CSS enhancement)
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--color-white) !important;
      background: rgba(232,93,4,.15) !important;
    }
  `;
  document.head.appendChild(style);

})();
