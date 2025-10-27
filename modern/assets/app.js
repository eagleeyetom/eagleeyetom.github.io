const STORAGE_KEY = "masskaModernSettings";
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
