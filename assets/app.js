const STORAGE_KEY = "masskaModernSettings";
const CONSENT_KEY = "masskaConsent";
const GA_ID = "G-CKB0FYJDGK";
const FONT_MIN = 0.9;
const FONT_MAX = 1.3;
const FONT_STEP = 0.1;
const DEFAULT_FONT_SIZE = 16;

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

function loadSettings(defaults) {
  if (!storageAvailable) {
    return { ...defaults };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaults };
    }
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (error) {
    console.warn("Unable to read stored settings; using defaults.", error);
    return { ...defaults };
  }
}

function saveSettings(settings) {
  if (!storageAvailable) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Unable to save settings.", error);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateFontIndicator(element, scale) {
  if (element) {
    element.textContent = `${Math.round(scale * 100)}%`;
  }
}

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

  // --- Consent management (media: YouTube) ---
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
      // ignore
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

// --- Block "Watch Online" link until November 21, 2025 00:00 CET ---
(function blockOnlineLinks() {
  const unlockDate = new Date("2025-11-21T00:00:00+01:00"); // CET timezone
  const now = new Date();

  if (now < unlockDate) {
    // Find all links to online.html
    const onlineLinks = document.querySelectorAll('a[href*="online.html"]');

    onlineLinks.forEach((link) => {
      // Prevent default click behavior
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Show message
        const lang = document.documentElement.lang || "pl";
        const message =
          lang === "en"
            ? "MASSKA Online will be available from November 21, 2025 at midnight."
            : "MASSKA Online będzie dostępna od 21 listopada 2025 o północy.";

        alert(message);
      });

      // Add visual indication
      link.style.opacity = "0.6";
      link.style.cursor = "not-allowed";
      link.setAttribute("aria-disabled", "true");

      // Add title/tooltip
      const lang = document.documentElement.lang || "pl";
      const titleText =
        lang === "en"
          ? "Available from November 21, 2025"
          : "Dostępne od 21 listopada 2025";
      link.setAttribute("title", titleText);
    });
  }
})();
