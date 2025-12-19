/**
 * Main JavaScript
 * Navigation, form handling, and utilities
 */

(function() {
  'use strict';

  // ========================================
  // Header Scroll Effect
  // ========================================

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    function onScroll() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class when page is scrolled
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Optional: Hide header on scroll down, show on scroll up
      // if (currentScroll > lastScroll && currentScroll > 200) {
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   header.style.transform = 'translateY(0)';
      // }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Check initial state
  }

  // ========================================
  // Mobile Navigation
  // ========================================

  function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', () => {
      const isActive = mobileNav.classList.contains('active');

      if (isActive) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileNav.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if just "#" or empty
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ========================================
  // FAQ Accordion
  // ========================================

  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    });
  }

  // ========================================
  // Form Handling
  // ========================================

  function initForms() {
    const forms = document.querySelectorAll('form[data-form]');

    forms.forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const successMessage = form.querySelector('.form-success');
    const errorMessage = form.querySelector('.form-error-message');

    // Get form data
    const formData = new FormData(form);

    // Basic validation
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });

    // Email validation
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
      }
    }

    if (!isValid) {
      if (errorMessage) {
        errorMessage.textContent = 'Please fill in all required fields correctly.';
        errorMessage.style.display = 'block';
      }
      return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        form.reset();
        if (successMessage) {
          form.style.display = 'none';
          successMessage.style.display = 'block';
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error
      if (errorMessage) {
        errorMessage.textContent = 'Something went wrong. Please try again or email us directly.';
        errorMessage.style.display = 'block';
      }
      console.error('Form error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  // ========================================
  // Form Field Focus Effects
  // ========================================

  function initFormFields() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
      const input = group.querySelector('.form-input, .form-textarea');
      const label = group.querySelector('.form-label');

      if (!input) return;

      // Float label on focus/fill
      input.addEventListener('focus', () => {
        group.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value) {
          group.classList.remove('focused');
        }
      });

      // Check initial state
      if (input.value) {
        group.classList.add('focused');
      }
    });
  }

  // ========================================
  // Lazy Loading Images
  // ========================================

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // ========================================
  // Current Year in Footer
  // ========================================

  function initCurrentYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(el => {
      el.textContent = currentYear;
    });
  }

  // ========================================
  // Active Navigation Link
  // ========================================

  function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (currentPath === linkPath ||
          (currentPath.endsWith('/') && linkPath === currentPath.slice(0, -1)) ||
          (linkPath.endsWith('/') && currentPath === linkPath.slice(0, -1))) {
        link.classList.add('active');
      }
    });
  }

  // ========================================
  // Scroll to Top Button
  // ========================================

  function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // Copy to Clipboard
  // ========================================

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');

    copyButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;

        try {
          await navigator.clipboard.writeText(text);

          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('copied');

          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  }

  // ========================================
  // Initialize Everything
  // ========================================

  function init() {
    initHeaderScroll();
    initMobileNav();
    initSmoothScroll();
    initFAQ();
    initForms();
    initFormFields();
    initLazyLoading();
    initCurrentYear();
    initActiveNav();
    initScrollToTop();
    initCopyButtons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
