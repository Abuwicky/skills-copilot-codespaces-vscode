/* global document, window, setTimeout, clearTimeout */

/**
 * Portfolio Script — John Abuwicky
 * Handles: navigation, typing effect, scroll animations,
 *          skill progress bars, contact form, back-to-top.
 */

(function () {
  'use strict';

  // ─── TYPING EFFECT ────────────────────────────────────────────────────────

  const typedEl = document.getElementById('typedText');
  const titles = [
    'Network Technician',
    'Cybersecurity Enthusiast',
    'Python Developer',
    'IT Problem Solver',
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimer;

  function type() {
    if (!typedEl) return;
    const current = titles[titleIndex];

    if (isDeleting) {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      delay = 400;
    }

    typingTimer = setTimeout(type, delay);
  }

  // ─── NAVIGATION ───────────────────────────────────────────────────────────

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  function toggleMenu() {
    if (!navToggle || !navMenu) return;
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // ─── SCROLL ANIMATIONS (custom AOS-like) ──────────────────────────────────

  const animatedEls = document.querySelectorAll('[data-aos]');

  function getDelay(el) {
    const d = el.getAttribute('data-aos-delay');
    return d ? parseInt(d, 10) : 0;
  }

  function observeAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      animatedEls.forEach(function (el) {
        el.classList.add('aos-animate');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = getDelay(el);
            setTimeout(function () {
              el.classList.add('aos-animate');
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── SKILL PROGRESS BARS ──────────────────────────────────────────────────

  const skillBars = document.querySelectorAll('.skill-progress');
  let barsAnimated = false;

  function animateSkillBars() {
    if (barsAnimated) return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      barsAnimated = true;
      skillBars.forEach(function (bar) {
        const targetWidth = bar.getAttribute('data-width') || '0';
        bar.style.width = targetWidth + '%';
      });
    }
  }

  // ─── BACK TO TOP ──────────────────────────────────────────────────────────

  const backToTopBtn = document.getElementById('backToTop');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── CONTACT FORM ─────────────────────────────────────────────────────────

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    setTimeout(function () {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameField    = contactForm.querySelector('[name="name"]');
      const emailField   = contactForm.querySelector('[name="email"]');
      const subjectField = contactForm.querySelector('[name="subject"]');
      const messageField = contactForm.querySelector('[name="message"]');

      const name    = nameField    ? nameField.value.trim()    : '';
      const email   = emailField   ? emailField.value.trim()   : '';
      const subject = subjectField ? subjectField.value.trim() : '';
      const message = messageField ? messageField.value.trim() : '';

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate submission (replace with real API call as needed)
      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      setTimeout(function () {
        showStatus(
          'Thank you, ' + name + '! Your message has been sent. I\'ll get back to you soon.',
          'success'
        );
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
      }, 1200);
    });
  }

  // ─── SET CURRENT YEAR IN FOOTER ───────────────────────────────────────────

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────────────────

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ─── THROTTLED SCROLL HANDLER ─────────────────────────────────────────────

  let scrollTimer;

  function onScroll() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      updateNavbar();
      highlightNavLink();
      animateSkillBars();
      handleBackToTop();
    }, 12);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────

  function init() {
    updateNavbar();
    highlightNavLink();
    handleBackToTop();
    observeAnimations();
    type();

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
