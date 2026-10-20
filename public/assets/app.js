const STORAGE_KEY = "masskaModernSettings";
const CONSENT_KEY = "masskaConsent";
const GA_ID = "G-CKB0FYJDGK";
const FONT_MIN = 0.9;
const FONT_MAX = 1.3;
const FONT_STEP = 0.1;

// Utility: Check localStorage availability
function canUseLocalStorage() {
  try {
    const key = "__masska_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(
      "Local storage unavailable; settings will not persist.",
      error
    );
    return false;
  }
}

const storageAvailable = canUseLocalStorage();

// Utility: Load settings from localStorage
function loadSettings(defaults) {
  if (!storageAvailable) return { ...defaults };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (error) {
    console.warn("Unable to read stored settings; using defaults.", error);
    return { ...defaults };
  }
}

// Utility: Save settings to localStorage
function saveSettings(settings) {
  if (!storageAvailable) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Unable to save settings.", error);
  }
}

// Utility: Clamp number between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Utility: Update font size indicator
function updateFontIndicator(element, scale) {
  if (element) {
    element.textContent = `${Math.round(scale * 100)}%`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const defaultLanguage = document.documentElement.lang || "en";
  const defaults = {
    contrast: false,
    fontScale: 1,
    language: defaultLanguage,
  };

  const settings = loadSettings(defaults);

  const root = document.documentElement;
  const body = document.body;
  const contrastButton = document.querySelector(
    '[data-action="toggle-contrast"]'
  );
  const increaseButton = document.querySelector(
    '[data-action="font-increase"]'
  );
  const decreaseButton = document.querySelector(
    '[data-action="font-decrease"]'
  );
  const fontIndicator = document.querySelector("[data-font-indicator]");
  const languageLinks = document.querySelectorAll("[data-language]");

  // Initialize language from browser for first-time visitors
  try {
    if (storageAvailable) {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        const langs = navigator.languages || [navigator.language || defaultLanguage];
        const prefersPl = Array.isArray(langs) && langs.some((l) => String(l).toLowerCase().startsWith("pl"));
        settings.language = prefersPl ? "pl" : "en";
        saveSettings(settings);
      }
    } else {
      const langs = navigator.languages || [navigator.language || defaultLanguage];
      const prefersPl = Array.isArray(langs) && langs.some((l) => String(l).toLowerCase().startsWith("pl"));
      settings.language = prefersPl ? "pl" : "en";
    }
  } catch (_) {}

  // Consent management
  function loadConsent() {
    if (!storageAvailable) return { media: false, analytics: false };

    try {
      const raw = window.localStorage.getItem(CONSENT_KEY);
      if (!raw) return { media: false, analytics: false };
      const parsed = JSON.parse(raw);
      return {
        media: Boolean(parsed.media),
        analytics: Boolean(parsed.analytics),
      };
    } catch (e) {
      return { media: false, analytics: false };
    }
  }

  function saveConsent(consent) {
    if (!storageAvailable) return;

    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({
          media: !!consent.media,
          analytics: !!consent.analytics,
        })
      );
    } catch (e) {
      // Silently fail
    }
  }

  const consent = loadConsent();

  // --- Google Analytics lazy loader (requires consent.analytics) ---
  function loadGA() {
    if (window.__masskaGAInit || !GA_ID) return;
    window.__masskaGAInit = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      GA_ID
    )}`;
    s.onload = () => {
      gtag("js", new Date());
      gtag("config", GA_ID, { anonymize_ip: true });
    };
    document.head.appendChild(s);
  }

  function buildYTFrame(videoId, title = "YouTube video", autoplay = false) {
    const lang = (document.documentElement.lang || "en").slice(0, 2);
    const iframe = document.createElement("iframe");
    iframe.width = "560";
    iframe.height = "315";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.title = title;
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      videoId
    )}?rel=0&modestbranding=1&hl=${encodeURIComponent(lang)}${autoplay ? "&autoplay=1" : ""}`;
    return iframe;
  }

  // YouTube embeds load only with media consent. Without it each video shows a local
  // placeholder (no thumbnail, so nothing is requested from Google) and loads on click.
  function processExternalMedia() {
    const isPl = (document.documentElement.lang || "pl").startsWith("pl");
    const blocks = document.querySelectorAll(".external-media[data-yt-id]");
    blocks.forEach((block) => {
      if (block.querySelector("iframe")) return;
      const videoId = block.getAttribute("data-yt-id");
      const title = block.getAttribute("data-title") || "YouTube video";

      function mount(autoplay) {
        const frame = buildYTFrame(videoId, title, autoplay);
        block.innerHTML = "";
        block.appendChild(frame);
        if (autoplay) frame.focus();
      }

      if (consent.media) {
        mount(false);
        return;
      }

      if (block.querySelector(".media-facade")) return;
      const facade = document.createElement("button");
      facade.type = "button";
      facade.className = "media-facade";
      facade.innerHTML =
        '<span class="media-facade__play" aria-hidden="true"></span>' +
        '<span class="media-facade__title"></span>' +
        '<span class="media-facade__note"></span>';
      facade.querySelector(".media-facade__title").textContent =
        (isPl ? "Odtwórz wideo: " : "Play video: ") + title;
      facade.querySelector(".media-facade__note").textContent = isPl
        ? "Film załaduje się z YouTube po kliknięciu"
        : "The video loads from YouTube when you click";
      facade.addEventListener("click", () => mount(true));
      block.innerHTML = "";
      block.appendChild(facade);
    });
  }

  function applyContrast(isHighContrast) {
    body.classList.toggle("high-contrast", isHighContrast);
    if (contrastButton) {
      contrastButton.setAttribute("aria-pressed", String(isHighContrast));
    }
  }

  function applyFontScale(scale) {
    const clamped = clamp(scale, FONT_MIN, FONT_MAX);
    // html { font-size } is --base-font-size (CSS) times --font-scale
    root.style.setProperty("--font-scale", clamped.toFixed(2));
    updateFontIndicator(fontIndicator, clamped);
    if (increaseButton && decreaseButton) {
      increaseButton.disabled = clamped >= FONT_MAX;
      decreaseButton.disabled = clamped <= FONT_MIN;
    }
    settings.fontScale = clamped;
    saveSettings(settings);
  }

  function applyLanguage(activeLanguage) {
    languageLinks.forEach((link) => {
      const linkLanguage = link.getAttribute("data-language");
      link.classList.toggle("is-active", linkLanguage === activeLanguage);
    });
  }

  applyContrast(settings.contrast);
  applyFontScale(settings.fontScale);
  applyLanguage(settings.language);

  if (contrastButton) {
    contrastButton.addEventListener("click", () => {
      settings.contrast = !settings.contrast;
      applyContrast(settings.contrast);
      saveSettings(settings);
    });
  }

  if (increaseButton) {
    increaseButton.addEventListener("click", () => {
      applyFontScale(settings.fontScale + FONT_STEP);
    });
  }

  if (decreaseButton) {
    decreaseButton.addEventListener("click", () => {
      applyFontScale(settings.fontScale - FONT_STEP);
    });
  }

  languageLinks.forEach((link) => {
    const language = link.getAttribute("data-language");
    link.addEventListener("click", () => {
      settings.language = language;
      applyLanguage(language);
      saveSettings(settings);
    });
  });

  // --- Consent banner (analytics/media) ---
  const banner = document.querySelector("[data-consent-banner]");
  if (banner) {
    const chkAnalytics = banner.querySelector(
      '[data-consent-toggle="analytics"]'
    );
    const chkMedia = banner.querySelector('[data-consent-toggle="media"]');
    const btnAcceptAll = banner.querySelector("[data-consent-accept-all]");
    const btnReject = banner.querySelector("[data-consent-reject]");
    const btnSave = banner.querySelector("[data-consent-save]");

    if (chkAnalytics) chkAnalytics.checked = !!consent.analytics;
    if (chkMedia) chkMedia.checked = !!consent.media;

    // The bar is fixed to the bottom, so the page gets matching bottom space while it shows
    const reserveSpace = () => {
      document.body.style.paddingBottom = banner.hidden
        ? ""
        : `${banner.offsetHeight}px`;
    };
    const hideBanner = () => {
      banner.setAttribute("hidden", "");
      reserveSpace();
    };
    const showBanner = () => {
      banner.removeAttribute("hidden");
      reserveSpace();
    };
    window.addEventListener("resize", reserveSpace);

    // Show banner if no stored choice exists
    try {
      const raw = storageAvailable
        ? window.localStorage.getItem(CONSENT_KEY)
        : null;
      if (!raw) showBanner();
      else hideBanner();
    } catch (_) {
      showBanner();
    }

    if (btnAcceptAll) {
      btnAcceptAll.addEventListener("click", () => {
        consent.analytics = true;
        consent.media = true;
        saveConsent(consent);
        hideBanner();
        if (consent.analytics) loadGA();
        processExternalMedia();
      });
    }
    if (btnReject) {
      btnReject.addEventListener("click", () => {
        consent.analytics = false;
        consent.media = false;
        saveConsent(consent);
        hideBanner();
      });
    }
    if (btnSave) {
      btnSave.addEventListener("click", () => {
        consent.analytics = chkAnalytics ? !!chkAnalytics.checked : false;
        consent.media = chkMedia ? !!chkMedia.checked : false;
        saveConsent(consent);
        hideBanner();
        if (consent.analytics) loadGA();
        if (consent.media) processExternalMedia();
      });
    }

    // "Change consent settings" buttons reopen the banner with its settings expanded
    document.querySelectorAll('[data-action="open-consent"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        if (chkAnalytics) chkAnalytics.checked = !!consent.analytics;
        if (chkMedia) chkMedia.checked = !!consent.media;
        showBanner();
        const settingsPanel = banner.querySelector("details");
        if (settingsPanel) settingsPanel.open = true;
        (chkAnalytics || banner.querySelector("button"))?.focus();
      });
    });
  }

  // Privacy settings buttons (reset/enable)
  document
    .querySelectorAll('[data-action="reset-media-consent"]')
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        try {
          if (storageAvailable) window.localStorage.removeItem(CONSENT_KEY);
        } catch (e) {}
        // Show a simple message or reload to re-evaluate embeds
        window.location.reload();
      });
    });

  // Process YouTube placeholders
  processExternalMedia();

  // Load analytics if already consented
  if (consent.analytics) {
    loadGA();
  }

  // --- Initialize galleries (carousel) ---
  // The track is a native scroll-snap scroller: swiping is the browser's own smooth, inertial
  // scrolling. The script keeps the dots and arrows in sync and runs the optional autoplay.
  (function initGalleries() {
    const galleries = document.querySelectorAll("[data-gallery]");
    if (!galleries.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    galleries.forEach((gallery) => {
      const track = gallery.querySelector(".theatre-gallery__track");
      if (!track) return;
      const slides = Array.from(track.children);
      const prevBtn = gallery.querySelector("[data-gallery-prev]");
      const nextBtn = gallery.querySelector("[data-gallery-next]");
      const dotsContainer = gallery.querySelector(".theatre-gallery__dots");
      const toggleBtn = gallery.querySelector("[data-gallery-toggle]");
      let index = 0;
      let autoTimer = null;
      let lastUserAction = 0;
      let hovering = false;
      const AUTOPLAY_MS = 5000;
      const COOKIE_NAME = "galleryAutoplay";

      function setCookie(name, value, days = 30) {
        try {
          const expires = new Date(Date.now() + days * 864e5).toUTCString();
          document.cookie =
            name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
        } catch (_) {}
      }

      function getCookie(name) {
        try {
          return document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1];
        } catch (_) {
          return undefined;
        }
      }

      // 'off' disables autoplay; without a saved choice it follows prefers-reduced-motion
      const savedAutoplay = getCookie(COOKIE_NAME);
      let autoplayEnabled =
        savedAutoplay === "on" || (savedAutoplay !== "off" && !reduceMotion.matches);

      function markActive(i) {
        index = i;
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll(".gallery-dot").forEach((dot, n) => {
          dot.classList.toggle("is-active", n === i);
          if (n === i) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      }

      // Scrolls the slide to the middle of the track (the snap position)
      function goTo(newIndex) {
        const length = slides.length;
        if (!length) return;
        const i = ((newIndex % length) + length) % length;
        const slide = slides[i];
        const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
        track.scrollTo({ left, behavior: reduceMotion.matches ? "auto" : "smooth" });
        markActive(i);
      }

      // Which slide sits in the middle, while the finger or the momentum moves the track
      let ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const middle = track.scrollLeft + track.clientWidth / 2;
          let best = 0;
          let bestDistance = Infinity;
          slides.forEach((slide, n) => {
            const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
            if (distance < bestDistance) {
              bestDistance = distance;
              best = n;
            }
          });
          if (best !== index) markActive(best);
        });
      }
      track.addEventListener("scroll", onScroll, { passive: true });

      function stopAuto() {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      // Autoplay never fights the visitor: it skips a tick after any touch, key or hover/focus
      function startAuto() {
        stopAuto();
        if (!autoplayEnabled || slides.length < 2) return;
        autoTimer = setInterval(() => {
          if (hovering || gallery.contains(document.activeElement)) return;
          if (Date.now() - lastUserAction < AUTOPLAY_MS) return;
          goTo(index + 1);
        }, AUTOPLAY_MS);
      }

      function userAdvance(step) {
        lastUserAction = Date.now();
        goTo(index + step);
      }

      ["touchstart", "pointerdown", "wheel", "keydown"].forEach((type) =>
        track.addEventListener(type, () => (lastUserAction = Date.now()), { passive: true })
      );

      function updateToggle() {
        if (!toggleBtn) return;
        const iconPause = toggleBtn.dataset.iconPause || "❚❚";
        const iconPlay = toggleBtn.dataset.iconPlay || "▶";
        const labelPause = toggleBtn.dataset.labelPause || "Pause autoplay";
        const labelPlay = toggleBtn.dataset.labelPlay || "Play autoplay";
        toggleBtn.textContent = autoplayEnabled ? iconPause : iconPlay;
        toggleBtn.setAttribute("aria-label", autoplayEnabled ? labelPause : labelPlay);
        toggleBtn.setAttribute("aria-pressed", autoplayEnabled ? "false" : "true");
      }

      // Build dots
      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        const isPl = (document.documentElement.lang || "pl").startsWith("pl");
        slides.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "gallery-dot";
          dot.setAttribute(
            "aria-label",
            isPl ? `Zdjęcie ${i + 1} z ${slides.length}` : `Photo ${i + 1} of ${slides.length}`
          );
          if (i === 0) {
            dot.classList.add("is-active");
            dot.setAttribute("aria-current", "true");
          }
          dot.addEventListener("click", () => {
            lastUserAction = Date.now();
            goTo(i);
          });
          dotsContainer.appendChild(dot);
        });
      }

      if (prevBtn) prevBtn.addEventListener("click", () => userAdvance(-1));
      if (nextBtn) nextBtn.addEventListener("click", () => userAdvance(1));
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          autoplayEnabled = !autoplayEnabled;
          if (autoplayEnabled) startAuto();
          else stopAuto();
          setCookie(COOKIE_NAME, autoplayEnabled ? "on" : "off");
          updateToggle();
        });
        updateToggle();
      }

      // Arrow keys on the track scroll it natively; this keeps the dots in step
      gallery.addEventListener("keydown", (e) => {
        if (e.target !== track) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          userAdvance(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          userAdvance(1);
        }
      });

      gallery.addEventListener("mouseenter", () => (hovering = true));
      gallery.addEventListener("mouseleave", () => (hovering = false));

      markActive(0);
      startAuto();
    });
  })();

  const storedLanguage = settings.language;
  const ua = (navigator.userAgent || "").toLowerCase();
  const isBot = /bot|crawler|spider|googlebot|bingbot|duckduckbot|baiduspider|yandex|sogou|exabot|slurp|facebot|ia_archiver/.test(ua);
  if (
    !isBot &&
    storedLanguage &&
    storedLanguage !== defaultLanguage &&
    body.dataset.redirectToPreferredLanguage === "true"
  ) {
    // Slugs differ between languages (kontakt/contact, teatr-baltazar/baltazar),
    // so take the translated URL from the page's hreflang alternate
    const alternate = document.querySelector(
      `link[rel="alternate"][hreflang="${storedLanguage}"]`
    );
    if (alternate) {
      const currentPath = window.location.pathname;
      const preferredPath = new URL(alternate.href).pathname;
      if (preferredPath !== currentPath) {
        window.location.replace(preferredPath);
      }
    }
  }
});

// Mobile hamburger menu
(function initMobileMenu() {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (!menuToggle || !navMenu) return;

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  };

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("is-open");
  };

  menuToggle.addEventListener("click", toggleMenu);

  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });
})();

// Expand / collapse a shortened intro ("Czytaj całość" / "Read the full text")
(function initIntroToggles() {
  document.querySelectorAll("[data-intro-toggle]").forEach((button) => {
    const target = document.getElementById(button.getAttribute("aria-controls"));
    if (!target) return;

    button.addEventListener("click", () => {
      const expanded = target.classList.toggle("is-expanded");
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded
        ? button.dataset.labelLess
        : button.dataset.labelMore;
    });
  });
})();

// Header shadow once the page scrolls under it
(function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Jubilee confetti: a short burst from the title plate, once per visit (and again on a click on
// the plate). Purely decorative; skipped with reduced motion and in high-contrast mode.
(function initConfetti() {
  const origin = document.querySelector("[data-confetti-origin]");
  if (!origin) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const COLORS = ["#b38691", "#b7cfd2", "#fbdcc5", "#1f1d1b", "#854a5c", "#f5f2ee"];
  let running = false;

  function burst() {
    if (running || reduce.matches || document.body.classList.contains("high-contrast")) return;
    const rect = origin.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    running = true;

    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    const ox = rect.left + rect.width * 0.5;
    const oy = rect.top + rect.height * 0.3;
    const count = window.innerWidth < 600 ? 30 : 48;
    const spread = Math.min(window.innerWidth, 900);
    const rand = (min, max) => min + Math.random() * (max - min);

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("i");
      const size = rand(6, 12);
      const flat = Math.random() < 0.5;
      const set = (name, value) => piece.style.setProperty(name, value);
      set("--x", `${ox}px`);
      set("--y", `${oy}px`);
      set("--w", `${size}px`);
      set("--h", `${flat ? size * 0.5 : size}px`);
      set("--r", Math.random() < 0.3 ? "50%" : "1px");
      set("--c", COLORS[Math.floor(Math.random() * COLORS.length)]);
      set("--dx", `${rand(-spread / 2, spread / 2)}px`);
      set("--up", `${rand(90, 260)}px`);
      set("--fall", `${window.innerHeight - oy + rand(40, 160)}px`);
      set("--rot", `${rand(260, 900) * (Math.random() < 0.5 ? -1 : 1)}deg`);
      set("--d", `${rand(0, 0.2).toFixed(2)}s`);
      set("--t", `${rand(1.9, 2.9).toFixed(2)}s`);
      layer.appendChild(piece);
    }

    document.body.appendChild(layer);
    setTimeout(() => {
      layer.remove();
      running = false;
    }, 3400);
  }

  origin.addEventListener("click", burst);

  let seen = false;
  try {
    seen = window.sessionStorage.getItem("masskaConfetti") === "1";
    window.sessionStorage.setItem("masskaConfetti", "1");
  } catch (_) {}
  if (!seen) window.addEventListener("load", () => setTimeout(burst, 700));
})();
