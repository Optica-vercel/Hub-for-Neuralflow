document.addEventListener('DOMContentLoaded', () => {
  /* ═══════════════════════════════════════════════════════════
     CUSTOM CURSOR
  ═══════════════════════════════════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  // Check if device is touch capable (disable custom cursor on mobile)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update main cursor instantly
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    // Animate cursor trail with slight delay for smooth effect
    const animateTrail = () => {
      const dx = mouseX - trailX;
      const dy = mouseY - trailY;
      
      trailX += dx * 0.2;
      trailY += dy * 0.2;
      
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
      
      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    // Hover effect on interactive elements
    const interactables = document.querySelectorAll('a, button, .project-card');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  } else {
    // Hide cursors on touch devices
    cursor.style.display = 'none';
    cursorTrail.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
  }

  /* ═══════════════════════════════════════════════════════════
     NAVIGATION SCROLL & MOBILE MENU
  ═══════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isExpanded = mobileMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isExpanded);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     SCROLL ANIMATIONS (INTERSECTION OBSERVER)
  ═══════════════════════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════
     STATS COUNTER ANIMATION
  ═══════════════════════════════════════════════════════════ */
  const statElements = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const animateStats = () => {
    statElements.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const isDecimal = stat.getAttribute('data-decimal') === 'true';
      const duration = 2000; // ms
      const steps = 60;
      const stepValue = target / steps;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
        stat.textContent = `${displayValue}${suffix}`;
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      animateStats();
      statsAnimated = true;
    }
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ═══════════════════════════════════════════════════════════
     PARALLAX EFFECT FOR HERO BLOBS & PROJECT IMAGES
  ═══════════════════════════════════════════════════════════ */
  const heroBlobs = document.querySelectorAll('.blob');
  const projectCards = document.querySelectorAll('.project-card');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Subtle parallax on hero blobs
    heroBlobs.forEach((blob, index) => {
      const speed = (index + 1) * 0.05;
      blob.style.transform = `translateY(${scrollY * speed}px)`;
    });

    // Parallax on project images
    projectCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      // Check if card is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const img = card.querySelector('.card-img');
        if (img) {
          // Calculate percentage visible
          const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          // Move image slightly based on scroll
          const yPos = (scrollPercent * 20) - 10; // -10% to +10%
          img.style.transform = `translateY(${yPos}%) scale(1.1)`;
        }
      }
    });
  });
});
