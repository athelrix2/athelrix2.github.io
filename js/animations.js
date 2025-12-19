/**
 * Scroll-Triggered Animations
 * Uses Intersection Observer API for performant scroll animations
 */

(function() {
  'use strict';

  // Animation configuration
  const config = {
    // How much of the element needs to be visible before triggering
    threshold: 0.1,
    // Trigger slightly before element enters viewport
    rootMargin: '0px 0px -50px 0px',
    // Animation classes to observe
    animationClasses: [
      'animate',
      'fade-in',
      'fade-in-up',
      'fade-in-down',
      'fade-in-left',
      'fade-in-right',
      'scale-in',
      'zoom-in',
      'blur-in',
      'stagger-children'
    ]
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Initialize the Intersection Observer for scroll animations
   */
  function initScrollAnimations() {
    // If user prefers reduced motion, show all elements immediately
    if (prefersReducedMotion) {
      document.querySelectorAll('[class*="fade-"], [class*="scale-"], [class*="zoom-"], .animate, .blur-in, .stagger-children')
        .forEach(el => el.classList.add('animated'));
      return;
    }

    // Create the observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animated class to trigger the animation
          entry.target.classList.add('animated');

          // Stop observing this element (animation only happens once)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });

    // Find all elements with animation classes
    const selector = config.animationClasses
      .map(cls => `.${cls}:not(.animated)`)
      .join(', ');

    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Initialize parallax effects
   */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0 || prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Initialize counter animations
   */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter, 10);
          const duration = parseInt(el.dataset.duration, 10) || 2000;
          const suffix = el.dataset.suffix || '';

          animateCounter(el, target, duration, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /**
   * Animate a counter from 0 to target value
   */
  function animateCounter(element, target, duration, suffix) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Initialize typing effect
   */
  function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(el => {
      const text = el.dataset.typing;
      const speed = parseInt(el.dataset.speed, 10) || 50;
      const delay = parseInt(el.dataset.delay, 10) || 0;

      el.textContent = '';
      el.style.visibility = 'visible';

      setTimeout(() => {
        typeText(el, text, speed);
      }, delay);
    });
  }

  /**
   * Type text character by character
   */
  function typeText(element, text, speed) {
    let index = 0;

    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  /**
   * Initialize smooth reveal for hero elements on page load
   */
  function initHeroReveal() {
    const heroElements = document.querySelectorAll('.hero [class*="fade-"], .hero .animate');

    if (prefersReducedMotion) {
      heroElements.forEach(el => el.classList.add('animated'));
      return;
    }

    // Stagger hero element animations
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animated');
      }, 100 + (index * 100));
    });
  }

  /**
   * Initialize tilt effect on cards
   */
  function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    if (tiltElements.length === 0 || prefersReducedMotion) return;

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  /**
   * Initialize magnetic effect on buttons
   */
  function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    if (magneticElements.length === 0 || prefersReducedMotion) return;

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /**
   * Refresh animations (useful for dynamically added content)
   */
  function refreshAnimations() {
    initScrollAnimations();
  }

  // Expose refresh function globally
  window.refreshAnimations = refreshAnimations;

  // Initialize all animations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollAnimations();
    initParallax();
    initCounters();
    initHeroReveal();
    initTiltEffect();
    initMagneticEffect();

    // Typing effect initializes separately (needs visible elements)
    setTimeout(initTypingEffect, 500);
  }

})();
