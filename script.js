/**
 * ELANOVA STUDIO — OFFICIAL SCRIPT
 * Vanilla JavaScript implementation for navigation, interactions, modal showcases, and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Element Selectors ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const copyEmailAction = document.getElementById('copy-email-action');
  const studioEmail = document.getElementById('studio-email');

  // --- Gallery Carousel Controls ---
  const galleryTrack = document.getElementById('gallery-track');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');

  // --- Project Modal Elements ---
  const gameModal = document.getElementById('game-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalImage = document.getElementById('modal-image');
  const modalDescription = document.getElementById('modal-description');
  const modalMechanics = document.getElementById('modal-mechanics');
  const exploreButtons = document.querySelectorAll('[data-game-modal]');

  // Game details dictionary for exploration modal
  const gamesData = {
    'car-blast': {
      title: 'Car Blast',
      category: 'Mobile Arcade / Puzzle Game',
      image: 'assets/car-blast-artwork/car-blast-banner.svg',
      badge: 'IN DEVELOPMENT',
      description: 'Car Blast is an upcoming mobile game featuring vehicle-based gameplay, strategic placement, and satisfying block-clearing mechanics. Players place and navigate diverse vehicle units on dynamic roadway grids to orchestrate chain-reaction clearing maneuvers.',
      mechanics: [
        'Tactical vehicle placement on multi-lane isometric grid boards',
        'Satisfying cascade combo clearing reactions and boost multipliers',
        'Dynamic vehicle types with unique directional clearance properties',
        'Designed for low battery drain and rapid, bite-sized mobile play sessions'
      ]
    },
    'it-empire': {
      title: 'IT-Empire',
      category: 'Technology / Management Simulation',
      image: 'assets/it-empire-artwork/it-empire-banner.svg',
      badge: 'IN DEVELOPMENT',
      description: 'IT-Empire is an upcoming management simulation project focused on building, expanding, and managing a technology-driven empire. Players scale datacenter architectures, manage fiber-optic telemetry, deploy cutting-edge infrastructure, and balance corporate revenue systems.',
      mechanics: [
        'Infrastructure management: blade servers, cloud clustering, and cooling systems',
        'Economic balancing: venture contracts, tech acquisitions, and revenue pipelines',
        'Real-time simulation telemetry with uptime reliability management',
        'Clean executive dashboard aesthetics and strategic enterprise decision-making'
      ]
    }
  };

  // --- Mobile Drawer Navigation Logic ---
  const toggleMobileMenu = (forceClose = false) => {
    if (!mobileToggle || !mobileDrawer) return;

    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isExpanded;

    mobileToggle.setAttribute('aria-expanded', String(shouldOpen));
    mobileDrawer.setAttribute('aria-hidden', String(!shouldOpen));

    if (shouldOpen) {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(true);
      }
      if (gameModal && gameModal.classList.contains('open')) {
        closeModal();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (
      mobileDrawer &&
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      toggleMobileMenu(true);
    }
  });

  // --- Header Elevation & Back to Top on Scroll ---
  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Active Nav Link Tracking with IntersectionObserver ---
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');

            desktopNavLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            mobileNavLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  // --- Screenshot Gallery Scrolling ---
  if (galleryTrack && galleryPrev && galleryNext) {
    const scrollStep = 240;
    galleryPrev.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    galleryNext.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  // --- Copy Email to Clipboard ---
  if (copyEmailAction && studioEmail) {
    copyEmailAction.addEventListener('click', async () => {
      const email = studioEmail.textContent.trim();
      const labelSpan = copyEmailAction.querySelector('.copy-label');

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyEmailAction.classList.add('copied');
        if (labelSpan) labelSpan.textContent = 'Copied!';

        setTimeout(() => {
          copyEmailAction.classList.remove('copied');
          if (labelSpan) labelSpan.textContent = 'Copy';
        }, 2500);
      } catch (err) {
        console.warn('Could not copy email', err);
      }
    });
  }

  // --- Project Details Modal Logic ---
  const openModal = (gameKey) => {
    const data = gamesData[gameKey];
    if (!data || !gameModal) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalImage.src = data.image;
    modalImage.alt = `${data.title} Project Concept Artwork`;
    modalDescription.textContent = data.description;

    modalMechanics.innerHTML = '';
    data.mechanics.forEach((mech) => {
      const item = document.createElement('div');
      item.className = 'modal-mechanic-item';
      item.textContent = mech;
      modalMechanics.appendChild(item);
    });

    gameModal.classList.add('open');
    gameModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!gameModal) return;
    gameModal.classList.remove('open');
    gameModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  exploreButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const gameKey = btn.getAttribute('data-game-modal');
      openModal(gameKey);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (gameModal) {
    gameModal.addEventListener('click', (e) => {
      if (e.target === gameModal) {
        closeModal();
      }
    });
  }
});
