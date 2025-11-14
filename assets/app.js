const STORAGE_KEY = "masskaModernSettings";
const CONSENT_KEY = "masskaConsent";
const GA_ID = "G-CKB0FYJDGK";
const FONT_MIN = 0.9;
const FONT_MAX = 1.3;
const FONT_STEP = 0.1;
const DEFAULT_FONT_SIZE = 16;

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

// Utility: Update contrast button label
function updateContrastLabel(element, isHighContrast) {
  if (element) {
    element.setAttribute(
      "aria-label",
      isHighContrast
        ? element.dataset.labelOn ?? "High contrast on"
        : element.dataset.labelOff ?? "High contrast off"
    );
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
  const contrastLabel = document.querySelector("[data-contrast-label]");
  const languageLinks = document.querySelectorAll("[data-language]");
  const cookieNotice = document.querySelector("[data-cookie-notice]");
  const acceptCookiesButton = document.querySelector("[data-cookie-accept]");

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

  function buildYTFrame(videoId, title = "YouTube video") {
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
    )}?rel=0&modestbranding=1&hl=${encodeURIComponent(lang)}`;
    return iframe;
  }

  function processExternalMedia() {
    const blocks = document.querySelectorAll(".external-media[data-yt-id]");
    blocks.forEach((block) => {
      const videoId = block.getAttribute("data-yt-id");
      const title = block.getAttribute("data-title") || "YouTube video";
      const placeholder = block.querySelector(".external-media__placeholder");
      const loadBtn = block.querySelector(
        '[data-action="load-external-media"]'
      );
      const enableBtn = block.querySelector(
        '[data-action="enable-media-consent"]'
      );

      function mount() {
        const frame = buildYTFrame(videoId, title);
        block.innerHTML = "";
        block.appendChild(frame);
      }

      if (consent.media === true) {
        mount();
      } else {
        if (loadBtn) {
          loadBtn.addEventListener("click", () => {
            mount();
          });
        }
        if (enableBtn) {
          enableBtn.addEventListener("click", () => {
            consent.media = true;
            saveConsent(consent);
            mount();
          });
        }
      }
    });
  }

  function applyContrast(isHighContrast) {
    body.classList.toggle("high-contrast", isHighContrast);
    if (contrastButton) {
      contrastButton.setAttribute("aria-pressed", String(isHighContrast));
    }
    updateContrastLabel(contrastLabel, isHighContrast);
  }

  function applyFontScale(scale) {
    const clamped = clamp(scale, FONT_MIN, FONT_MAX);
    root.style.setProperty("--font-scale", clamped.toFixed(2));
    root.style.setProperty(
      "--base-font-size",
      `${DEFAULT_FONT_SIZE * clamped}px`
    );
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

  if (cookieNotice && acceptCookiesButton) {
    const cookieKey = "masskaModernCookies";

    try {
      const consent = storageAvailable
        ? window.localStorage.getItem(cookieKey)
        : null;
      if (consent === "accepted") {
        cookieNotice.setAttribute("hidden", "");
      }
    } catch (error) {
      console.warn("Unable to read cookie consent.", error);
    }

    acceptCookiesButton.addEventListener("click", () => {
      cookieNotice.setAttribute("hidden", "");
      if (storageAvailable) {
        try {
          window.localStorage.setItem(cookieKey, "accepted");
        } catch (error) {
          console.warn("Unable to persist cookie consent.", error);
        }
      }
    });
  }

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

    const hideBanner = () => banner.setAttribute("hidden", "");
    const showBanner = () => banner.removeAttribute("hidden");

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
  (function initGalleries() {
    const galleries = document.querySelectorAll("[data-gallery]");
    if (!galleries.length) return;
    galleries.forEach((gallery) => {
      const track = gallery.querySelector(".theatre-gallery__track");
      if (!track) return;
      const slides = Array.from(track.children);
      const prevBtn = gallery.querySelector("[data-gallery-prev]");
      const nextBtn = gallery.querySelector("[data-gallery-next]");
      const dotsContainer = gallery.querySelector(".theatre-gallery__dots");
      const toggleBtn = gallery.querySelector("[data-gallery-toggle]");
      let index = 0;
      let touchStartX = null;
      let pointerStartX = null;
      let isPointerDown = false;
      let autoTimer = null;
      const AUTOPLAY_MS = 5000;
      const COOKIE_NAME = "galleryAutoplay";

      function setCookie(name, value, days = 30) {
        try {
          const expires = new Date(Date.now() + days * 864e5).toUTCString();
          document.cookie =
            name +
            "=" +
            encodeURIComponent(value) +
            "; expires=" +
            expires +
            "; path=/";
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

      let autoplayEnabled = getCookie(COOKIE_NAME) !== "off"; // 'off' disables autoplay

      function goTo(newIndex, { loop = true } = {}) {
        if (!slides.length) return;
        const length = slides.length;
        if (loop) {
          index = ((newIndex % length) + length) % length;
        } else {
          index = Math.max(0, Math.min(length - 1, newIndex));
        }
        track.style.transform = `translateX(-${index * 100}%)`;
        if (prevBtn) prevBtn.disabled = !loop && index === 0;
        if (nextBtn) nextBtn.disabled = !loop && index === slides.length - 1;
        if (dotsContainer) {
          dotsContainer.querySelectorAll(".gallery-dot").forEach((dot, i) => {
            dot.classList.toggle("is-active", i === index);
          });
        }
      }

      function stopAuto() {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }

      function startAuto() {
        if (!autoplayEnabled || slides.length < 2) return;
        stopAuto();
        autoTimer = setInterval(() => {
          goTo(index + 1, { loop: true });
        }, AUTOPLAY_MS);
      }

      function userAdvance(step) {
        goTo(index + step, { loop: true });
        startAuto();
      }

      function updateToggle() {
        if (!toggleBtn) return;
        const iconPause = toggleBtn.dataset.iconPause || "❚❚";
        const iconPlay = toggleBtn.dataset.iconPlay || "▶";
        const labelPause = toggleBtn.dataset.labelPause || "Pause autoplay";
        const labelPlay = toggleBtn.dataset.labelPlay || "Play autoplay";
        if (autoplayEnabled) {
          toggleBtn.textContent = iconPause;
          toggleBtn.setAttribute("aria-label", labelPause);
          toggleBtn.setAttribute("aria-pressed", "false");
        } else {
          toggleBtn.textContent = iconPlay;
          toggleBtn.setAttribute("aria-label", labelPlay);
          toggleBtn.setAttribute("aria-pressed", "true");
        }
      }

      // Build dots
      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        slides.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "gallery-dot";
          dot.setAttribute("aria-label", `Slide ${i + 1}`);
          if (i === 0) dot.classList.add("is-active");
          dot.addEventListener("click", () => {
            goTo(i, { loop: true });
            startAuto();
          });
          dotsContainer.appendChild(dot);
        });
      }

      // Buttons
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

      // Keyboard
      gallery.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          userAdvance(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          userAdvance(1);
        }
      });

      // Touch swipe
      track.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            stopAuto();
          }
        },
        { passive: true }
      );
      track.addEventListener("touchend", (e) => {
        if (touchStartX == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) userAdvance(dx < 0 ? 1 : -1);
        touchStartX = null;
      });

      // Pointer (mouse) drag – płynne przeciąganie
      let dragDX = 0;
      const DRAG_THRESHOLD = 60; // px minimalny ruch do zmiany slajdu

      function endDrag(e) {
        if (!isPointerDown) return;
        const dx = dragDX;
        // Przywróć animację
        track.style.transition = "transform .6s cubic-bezier(.22,.61,.36,1)";
        track.style.cursor = "grab";
        if (Math.abs(dx) > DRAG_THRESHOLD) {
          userAdvance(dx < 0 ? 1 : -1);
        } else {
          // Powrót do aktualnego slajdu
          goTo(index, { loop: true });
          startAuto();
        }
        isPointerDown = false;
        pointerStartX = null;
        dragDX = 0;
      }

      track.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        if (e.button !== 0) return;
        e.preventDefault();
        isPointerDown = true;
        pointerStartX = e.clientX;
        dragDX = 0;
        stopAuto();
        // Wyłącz przejścia na czas przeciągania
        track.style.transition = "none";
        track.style.cursor = "grabbing";
      });

      track.addEventListener("pointermove", (e) => {
        if (!isPointerDown) return;
        e.preventDefault();
        dragDX = e.clientX - pointerStartX;
        // Podgląd przesunięcia – przesuwamy o dx w pikselach względem bieżącego slajdu
        track.style.transform = `translateX(calc(-${index * 100}% + ${dragDX}px))`;
      });

      track.addEventListener("pointerup", (e) => {
        endDrag(e);
      });
      
      track.addEventListener("pointercancel", (e) => {
        endDrag(e);
      });

      gallery.addEventListener("mouseenter", stopAuto);
      gallery.addEventListener("mouseleave", startAuto);

      goTo(0);
      startAuto();
    });
  })();

  const storedLanguage = settings.language;
  if (
    storedLanguage &&
    storedLanguage !== defaultLanguage &&
    body.dataset.redirectToPreferredLanguage === "true"
  ) {
    const currentPath = window.location.pathname;
    const preferredPath = currentPath.replace(
      /\/(en|pl)\//,
      `/${storedLanguage}/`
    );
    if (preferredPath !== currentPath) {
      window.location.replace(preferredPath);
    }
  }
});

// Block "Watch Online" link until November 21, 2025
(function blockOnlineLinks() {
  const unlockDate = new Date("2025-11-21T00:00:00+01:00");
  if (new Date() >= unlockDate) return;

  const lang = document.documentElement.lang || "pl";
  const message =
    lang === "en"
      ? "MASSKA Online will be available from November 21, 2025 at midnight."
      : "MASSKA Online będzie dostępna od 21 listopada 2025 o północy.";
  const titleText =
    lang === "en"
      ? "Available from November 21, 2025"
      : "Dostępne od 21 listopada 2025";

  document.querySelectorAll('a[href*="online.html"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      alert(message);
    });
    link.style.opacity = "0.6";
    link.style.cursor = "not-allowed";
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("title", titleText);
  });
})();

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
