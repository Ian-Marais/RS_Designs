/* ============================================
   KARATE DOJO WEBSITE - MAIN JAVASCRIPT
   ============================================ */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollButtons();
  initAllCarousels();
  initContentVideos();
  initHistoryToggles();
  initHistoryCamera();
  initWhatsappMenu();
  initLazyImages();
  initReviewCtaGlow();
  initStoreCarousels();
});

function initLazyImages() {
  document.querySelectorAll('main img:not(.social-icon):not(.site-identity img)').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
    if (!img.hasAttribute('fetchpriority')) {
      img.setAttribute('fetchpriority', 'low');
    }
  });
}

function initReviewCtaGlow() {
  const reviewCta = document.querySelector('.reviews-cta');
  const googleMapsIcon = document.querySelector('.social-google-maps');
  if (!reviewCta || !googleMapsIcon) return;

  let glowTimeout = null;

  const triggerGlow = () => {
    googleMapsIcon.classList.add('glow-google-maps');
    if (glowTimeout) clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
      googleMapsIcon.classList.remove('glow-google-maps');
      glowTimeout = null;
    }, 2000);
  };

  reviewCta.addEventListener('mouseenter', triggerGlow);
  reviewCta.addEventListener('focusin', triggerGlow);

  const isTouchOnly = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (isTouchOnly) {
    setTimeout(triggerGlow, 250);
  }
}

/* ---------- Content Videos ---------- */
function initContentVideos() {
  document.querySelectorAll('.event-player').forEach(video => {
  const footer = document.querySelector('.site-footer');
    video.controls = true;
    video.muted = false;
    video.defaultMuted = false;
    video.preload = 'metadata';

    function enableVideoAudio() {
      video.muted = false;
      video.defaultMuted = false;
      if (video.volume === 0) {
        video.volume = 1;
      }
    }

    if (window.Plyr) {
      const player = new Plyr(video, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        volume: 1,
        muted: false,
        resetOnEnd: false
      });

      player.on('ready', () => {
        player.muted = false;
        player.volume = 1;
        enableVideoAudio();
      });

      player.on('play', () => {
        player.muted = false;
        if (player.volume === 0) {
          player.volume = 1;
        }
        enableVideoAudio();
      });

      return;
    }

    video.addEventListener('play', enableVideoAudio);
  });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

function initWhatsappMenu() {
  const toggle = document.querySelector('.social-whatsapp-toggle');
  const menu = document.querySelector('.whatsapp-menu');
  const buffer = toggle ? toggle.closest('.social-sidebar').querySelector('.whatsapp-buffer') : null;
  const sidebar = toggle ? toggle.closest('.social-sidebar') : null;
  if (!toggle || !menu || !sidebar) return;

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  let touchHandled = false;
  const isTouchDevice = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

  toggle.addEventListener('touchstart', (event) => {
    const openingByTouch = !menu.classList.contains('open');
    if (openingByTouch) {
      event.stopPropagation();
      openMenu();
    }
    touchHandled = openingByTouch;
  }, { passive: true });

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (touchHandled) {
      touchHandled = false;
      return;
    }

    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  toggle.addEventListener('mouseenter', () => {
    openMenu();
  });

  if (buffer) {
    buffer.addEventListener('mouseenter', () => {
      openMenu();
    });
  }

  menu.addEventListener('mouseenter', () => {
    openMenu();
  });

  const closeOnLeave = (event) => {
    const related = event.relatedTarget;
    if (related && (toggle.contains(related) || menu.contains(related) || (buffer && buffer.contains(related)))) {
      return;
    }
    closeMenu();
  };

  toggle.addEventListener('mouseleave', closeOnLeave);
  if (buffer) buffer.addEventListener('mouseleave', closeOnLeave);
  menu.addEventListener('mouseleave', closeOnLeave);

  window.addEventListener('click', () => {
    closeMenu();
  });

  window.addEventListener('click', () => {
    closeMenu();
  });
}

window.initWhatsappMenu = initWhatsappMenu;

/* ---------- Scroll To Top / Bottom Buttons ---------- */
function getControlIconSvg(iconName) {
  if (iconName === 'sun') {
    return '<svg class="control-icon-svg theme-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.25" fill="currentColor"></circle><path d="M12 2.75V5.25M12 18.75V21.25M21.25 12H18.75M5.25 12H2.75M18.54 5.46L16.77 7.23M7.23 16.77L5.46 18.54M18.54 18.54L16.77 16.77M7.23 7.23L5.46 5.46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"></path></svg>';
  }

  if (iconName === 'up') {
    return '<svg class="control-icon-svg arrow-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 4.25L12.75 11.75H3.25L8 4.25Z" fill="currentColor"></path></svg>';
  }

  if (iconName === 'down') {
    return '<svg class="control-icon-svg arrow-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 11.75L3.25 4.25H12.75L8 11.75Z" fill="currentColor"></path></svg>';
  }

  return '<span class="control-icon-glyph moon-icon" aria-hidden="true">&#9790;</span>';
}

function initScrollButtons() {
  window.addEventListener('resize', updateScrollButtons);
  const btnTop = document.getElementById('scrollToTop');
  const btnBottom = document.getElementById('scrollToBottom');
  const themeToggle = document.getElementById('themeToggle');
  const controls = btnBottom ? btnBottom.closest('.floating-controls') : null;
  const footer = document.querySelector('.site-footer');
  if (!btnTop || !btnBottom) return;

  const body = document.body;
  const storedTheme = window.localStorage.getItem('theme-preference');
  const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const FAVICONS = {
    light: 'Assets/logos/Light mode logo.png',
    dark: 'Assets/logos/Dark mode logo.png'
  };

  function setFavicon(theme) {
    const iconHref = theme === 'dark' ? FAVICONS.dark : FAVICONS.light;
    let themeFavicon = document.getElementById('themeFavicon');

    if (!themeFavicon) {
      themeFavicon = document.createElement('link');
      themeFavicon.id = 'themeFavicon';
      themeFavicon.rel = 'icon';
      themeFavicon.type = 'image/png';
      document.head.appendChild(themeFavicon);
    }

    themeFavicon.href = iconHref;

    document.querySelectorAll('link[rel="icon"]:not(#themeFavicon)').forEach(link => {
      link.href = iconHref;
      link.media = '';
    });
  }

  const previewImage = document.getElementById('portfolioPreviewImage');
  const testimonialsPreviewImage = document.getElementById('testimonialsPreviewImage');

  function updatePortfolioPreview(theme) {
    if (!previewImage) return;
    previewImage.src = theme === 'dark'
      ? 'Assets/Landing page content/Portfolio page preview dark mode.png'
      : 'Assets/Landing page content/Portfolio page preview light mode.png';
  }

  const servicesPreviewImage = document.getElementById('servicesPreviewImage');

  function updateTestimonialsPreview(theme) {
    if (!testimonialsPreviewImage) return;
    testimonialsPreviewImage.src = theme === 'dark'
      ? 'Assets/Landing page content/Testimonials page preview light mode.png'
      : 'Assets/Landing page content/Testimonials page preview dark mode.png';
  }

  function updateServicesPreview(theme) {
    if (!servicesPreviewImage) return;
    servicesPreviewImage.src = theme === 'dark'
      ? 'Assets/Landing page content/Services page preview dark mode.png'
      : 'Assets/Landing page content/Services page preview light mode.png';
  }

  function applyThemePreference(theme) {
    body.classList.toggle('dark-mode', theme === 'dark');
    setFavicon(theme);
    updatePortfolioPreview(theme);
    updateTestimonialsPreview(theme);
    updateServicesPreview(theme);
  }

  function syncThemeToggle() {
    if (!themeToggle) return;
    const isDarkMode = body.classList.contains('dark-mode');
    themeToggle.innerHTML = getControlIconSvg(isDarkMode ? 'sun' : 'moon');
    themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
  }

  btnTop.innerHTML = getControlIconSvg('up');
  btnBottom.innerHTML = getControlIconSvg('down');

  if (storedTheme === 'dark' || storedTheme === 'light') {
    applyThemePreference(storedTheme);
  } else {
    applyThemePreference(systemThemeQuery.matches ? 'dark' : 'light');
  }

  syncThemeToggle();

  systemThemeQuery.addEventListener('change', event => {
    if (window.localStorage.getItem('theme-preference')) return;
    applyThemePreference(event.matches ? 'dark' : 'light');
    syncThemeToggle();
  });

  function updateScrollButtons() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const bottomVisible = scrollY + windowHeight < docHeight - 100;

    // Show "go to top" when user has scrolled down
    if (scrollY > 80) {
      btnTop.classList.add('visible');
    } else {
      btnTop.classList.remove('visible');
    }

    // Show "go to bottom" when not at the bottom
    if (bottomVisible) {
      btnBottom.classList.add('visible');
    } else {
      btnBottom.classList.remove('visible');
    }

    if (controls && footer) {
      const footerRect = footer.getBoundingClientRect();
      const footerOverlap = Math.max(0, windowHeight - footerRect.top);
      controls.style.transform = footerOverlap > 0
        ? `translateY(-${footerOverlap + 16}px)`
        : 'translateY(0)';
    }

    if (controls) {
      controls.classList.toggle('top-visible', btnTop.classList.contains('visible'));
      controls.classList.toggle('bottom-hidden', btnTop.classList.contains('visible') && !bottomVisible);
    }
  }

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btnBottom.addEventListener('click', () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
      applyThemePreference(nextTheme);
      window.localStorage.setItem('theme-preference', nextTheme);
      syncThemeToggle();
    });
  }

  window.addEventListener('scroll', updateScrollButtons);
  updateScrollButtons();
}

/* ---------- Image Carousel ---------- */
function initAllCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    initCarousel(carousel);
  });
}

function initCarousel(carousel) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dotsContainer = carousel.querySelector('.carousel-indicators');
  const prevBtn = carousel.querySelector('.carousel-arrow.prev');
  const nextBtn = carousel.querySelector('.carousel-arrow.next');
  const pauseBadge = carousel.querySelector('.carousel-pause-badge');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let isPaused = false;
  let manualPause = false;
  let videoPlaying = false;
  let hoverResumeTimeout = null;
  let resumeCountdownInterval = null;
  const RESUME_DELAY_MS = 5000;
  const RESUME_SECONDS = 5;
  let intervalId = null;
  const INTERVAL_MS = 3000;
  const videos = carousel.querySelectorAll('video');

  // Create dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    carousel.querySelectorAll('video').forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });

    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    if (videoPlaying || manualPause) return;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, INTERVAL_MS);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function handleVideoPlay() {
    videoPlaying = true;
    clearResumeCountdown();
    stopAutoPlay();
    carousel.classList.add('paused');
  }

  function handleVideoStop() {
    videoPlaying = false;
    if (!manualPause) {
      isPaused = false;
      startAutoPlay();
      carousel.classList.remove('paused');
    }
  }

  const track = carousel.querySelector('.carousel-track');

  videos.forEach(video => {
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoStop);
    video.addEventListener('ended', handleVideoStop);
  });

  const statusTray = document.createElement('div');
  statusTray.className = 'carousel-status-tray';
  statusTray.style.position = 'absolute';
  statusTray.style.top = '12px';
  statusTray.style.right = '12px';
  statusTray.style.display = 'flex';
  statusTray.style.alignItems = 'center';
  statusTray.style.gap = '8px';
  statusTray.style.zIndex = '20';
  statusTray.style.pointerEvents = 'none';

  const resumeTimer = document.createElement('div');
  resumeTimer.className = 'resume-timer';
  resumeTimer.style.display = 'none';
  resumeTimer.style.position = 'static';
  resumeTimer.style.background = 'rgba(0, 0, 0, 0.35)';
  resumeTimer.style.color = '#fff';
  resumeTimer.style.padding = '6px 10px';
  resumeTimer.style.borderRadius = '14px';
  resumeTimer.style.fontSize = '0.85rem';
  resumeTimer.style.minWidth = '46px';
  resumeTimer.style.textAlign = 'center';
  resumeTimer.style.backdropFilter = 'blur(4px)';

  if (pauseBadge) {
    carousel.removeChild(pauseBadge);
    pauseBadge.style.position = 'static';
    pauseBadge.style.background = 'rgba(0, 0, 0, 0.6)';
    pauseBadge.style.color = '#fff';
    pauseBadge.style.padding = '5px 12px';
    pauseBadge.style.borderRadius = '4px';
    pauseBadge.style.fontSize = '0.8rem';
    statusTray.appendChild(pauseBadge);
  }
  statusTray.appendChild(resumeTimer);
  carousel.appendChild(statusTray);

  function clearResumeCountdown() {
    if (hoverResumeTimeout) {
      clearTimeout(hoverResumeTimeout);
      hoverResumeTimeout = null;
    }
    if (resumeCountdownInterval) {
      clearInterval(resumeCountdownInterval);
      resumeCountdownInterval = null;
    }
    resumeTimer.style.display = 'none';
    resumeTimer.textContent = '';
  }

  // Click on image to pause/resume
  if (track) {
    track.addEventListener('click', (e) => {
      if (e.target.closest('.carousel-arrow') || e.target.closest('.carousel-dot')) return;

      isPaused = !isPaused;
      manualPause = isPaused;
      if (isPaused) {
        clearResumeCountdown();
        stopAutoPlay();
        carousel.classList.add('paused');
      } else {
        clearResumeCountdown();
        startAutoPlay();
        carousel.classList.remove('paused');
      }
    });

    track.addEventListener('mouseenter', () => {
      clearResumeCountdown();

      if (!manualPause && !isPaused) {
        isPaused = true;
        stopAutoPlay();
        carousel.classList.add('paused');
      }
    });

    track.addEventListener('mouseleave', () => {
      if (manualPause || videoPlaying) return;

      let secondsLeft = RESUME_SECONDS;
      resumeTimer.textContent = `${secondsLeft}s`;
      resumeTimer.style.display = 'block';

      if (resumeCountdownInterval) clearInterval(resumeCountdownInterval);
      resumeCountdownInterval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft <= 0) {
          clearInterval(resumeCountdownInterval);
          resumeCountdownInterval = null;
          resumeTimer.style.display = 'none';
          resumeTimer.textContent = '';
          return;
        }

        resumeTimer.textContent = `${secondsLeft}s`;
      }, 1000);

      if (hoverResumeTimeout) clearTimeout(hoverResumeTimeout);
      hoverResumeTimeout = setTimeout(() => {
        if (!manualPause && !videoPlaying) {
          nextSlide();
          isPaused = false;
          startAutoPlay();
          carousel.classList.remove('paused');
        }

        clearResumeCountdown();
      }, RESUME_DELAY_MS);
    });
  }

  // Arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // Start autoplay
  startAutoPlay();
}

/* ---------- Store Mini-Carousels ---------- */
function initStoreCarousels() {
  document.querySelectorAll('.store-carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.store-slide');
    const counter = carousel.querySelector('.store-carousel-counter');
    const prevBtn = carousel.querySelector('.store-carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.store-carousel-arrow.next');
    if (slides.length <= 1) return;

    let current = 0;

    function showSlide(idx) {
      slides[current].classList.remove('active');
      current = idx;
      if (current >= slides.length) current = 0;
      if (current < 0) current = slides.length - 1;
      slides[current].classList.add('active');
      if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
    if (counter) counter.textContent = '1 / ' + slides.length;
  });
}

/* ---------- History Event Toggles ---------- */
function initHistoryToggles() {
  document.querySelectorAll('.history-event .event-header').forEach(header => {
    header.addEventListener('click', () => {
      const event = header.closest('.history-event');
      event.classList.toggle('expanded');
    });
  });
}

/* ---------- History Camera Overlay ---------- */
function initHistoryCamera() {
  const overlay = document.getElementById('imageCameraOverlay');
  const backdrop = overlay ? overlay.querySelector('[data-close-camera]') : null;
  const closeBtn = overlay ? overlay.querySelector('.camera-close') : null;
  const preview = document.getElementById('cameraPreview');
  const image = document.getElementById('cameraImage');
  const zoomLabel = document.getElementById('cameraZoomLabel');
  const items = document.querySelectorAll('.history-main .store-item-image');

  if (!overlay || !preview || !image || !zoomLabel) return;

  let zoom = 1.0;
  let baseSize = { width: 0, height: 0 };
  let translate = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  const pointers = new Map();
  let initialPinchDistance = 0;
  let initialPinchZoom = 1.0;
  const MIN_ZOOM = 1.0;
  const MAX_ZOOM = 4.0;
  const ZOOM_STEP = 0.15;

  function updateZoomLabel() {
    zoomLabel.textContent = `${zoom.toFixed(1)}x`;
  }

  function getScaledSize() {
    return {
      width: baseSize.width * zoom,
      height: baseSize.height * zoom
    };
  }

  function getTranslateBounds() {
    const previewRect = preview.getBoundingClientRect();
    const scaled = getScaledSize();
    const bounds = {
      minX: previewRect.width - scaled.width,
      maxX: 0,
      minY: previewRect.height - scaled.height,
      maxY: 0
    };

    if (scaled.width <= previewRect.width) {
      bounds.minX = bounds.maxX = (previewRect.width - scaled.width) / 2;
    }

    if (scaled.height <= previewRect.height) {
      bounds.minY = bounds.maxY = (previewRect.height - scaled.height) / 2;
    }

    return bounds;
  }

  function clampTranslate() {
    const bounds = getTranslateBounds();
    translate.x = Math.min(Math.max(translate.x, bounds.minX), bounds.maxX);
    translate.y = Math.min(Math.max(translate.y, bounds.minY), bounds.maxY);
  }

  function updateImageTransform() {
    clampTranslate();
    image.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`;
  }

  function openCamera(src, alt) {
    image.src = src;
    image.alt = alt || 'Portfolio preview';
    zoom = 1.0;
    translate = { x: 0, y: 0 };
    overlay.setAttribute('aria-hidden', 'false');
    updateZoomLabel();
    image.style.transform = 'translate(0px, 0px) scale(1)';
    initialPinchDistance = 0;
    initialPinchZoom = zoom;

    overlay.classList.add('active');
    document.body.classList.add('lightbox-open');

    image.onload = () => {
      const previewRect = preview.getBoundingClientRect();
      const imgRect = image.getBoundingClientRect();
      baseSize.width = imgRect.width;
      baseSize.height = imgRect.height;

      if (baseSize.width < previewRect.width) {
        translate.x = (previewRect.width - baseSize.width) / 2;
      }
      if (baseSize.height < previewRect.height) {
        translate.y = (previewRect.height - baseSize.height) / 2;
      }
      updateImageTransform();
    };
  }

  function closeCamera() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    zoom = 1.0;
    translate = { x: 0, y: 0 };
  }

  function getDistance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function getCenter(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }

  function changeZoom(delta, centerX, centerY) {
    changeZoomTo(zoom + delta, centerX, centerY);
  }

  function changeZoomTo(targetZoom, centerX, centerY) {
    const prevZoom = zoom;
    zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, targetZoom));
    if (zoom === prevZoom) return;

    const imageRect = image.getBoundingClientRect();
    const offsetX = (centerX - imageRect.left) / imageRect.width;
    const offsetY = (centerY - imageRect.top) / imageRect.height;

    const newWidth = baseSize.width * zoom;
    const newHeight = baseSize.height * zoom;
    const deltaX = (newWidth - imageRect.width) * offsetX;
    const deltaY = (newHeight - imageRect.height) * offsetY;

    translate.x -= deltaX;
    translate.y -= deltaY;
    updateZoomLabel();
    updateImageTransform();
  }

  image.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      if (zoom <= 1) return;
      isDragging = true;
      dragStart = { x: event.clientX, y: event.clientY };
      image.classList.add('dragging');
      image.setPointerCapture(event.pointerId);
    } else if (pointers.size === 2) {
      isDragging = false;
      image.classList.remove('dragging');
      const pts = Array.from(pointers.values());
      initialPinchDistance = getDistance(pts[0], pts[1]);
      initialPinchZoom = zoom;
    }
  });

  window.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2) {
      event.preventDefault();
      const pts = Array.from(pointers.values());
      const currentDistance = getDistance(pts[0], pts[1]);
      if (!initialPinchDistance) return;
      const center = getCenter(pts[0], pts[1]);
      const zoomRatio = currentDistance / initialPinchDistance;
      changeZoomTo(initialPinchZoom * zoomRatio, center.x, center.y);
      return;
    }

    if (!isDragging) return;
    event.preventDefault();
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    dragStart = { x: event.clientX, y: event.clientY };
    translate.x += deltaX;
    translate.y += deltaY;
    updateImageTransform();
  });

  function endPointer(event) {
    if (pointers.has(event.pointerId)) {
      pointers.delete(event.pointerId);
    }
    if (pointers.size < 2) {
      initialPinchDistance = 0;
      initialPinchZoom = zoom;
    }
    if (!isDragging) return;
    isDragging = false;
    image.classList.remove('dragging');
  }

  window.addEventListener('pointerup', endPointer);
  window.addEventListener('pointercancel', endPointer);

  preview.addEventListener('wheel', (event) => {
    if (!overlay.classList.contains('active')) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    changeZoom(delta, event.clientX, event.clientY);
  }, { passive: false });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCamera);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeCamera);
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('active')) {
      closeCamera();
    }
  });

  items.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.addEventListener('click', () => openCamera(img.src, img.alt));
  });
}
