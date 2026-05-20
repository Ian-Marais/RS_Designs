/* ============================================
   KARATE DOJO WEBSITE - MAIN JAVASCRIPT
   ============================================ */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollButtons();
  initAllCarousels();
  initContentVideos();
  initHistoryToggles();
  initStoreCarousels();
});

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

  function applyThemePreference(theme) {
    body.classList.toggle('dark-mode', theme === 'dark');
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
  let hoverResumeTimeout = null;
  let resumeCountdownInterval = null;
  const RESUME_DELAY_MS = 5000;
  const RESUME_SECONDS = 5;
  let intervalId = null;
  const INTERVAL_MS = 3000;

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
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, INTERVAL_MS);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  const track = carousel.querySelector('.carousel-track');
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
      if (manualPause) return;

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
        if (!manualPause) {
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
