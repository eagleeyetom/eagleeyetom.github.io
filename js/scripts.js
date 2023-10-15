// Cookie Functions
function acceptCookies() {
  setCookie("cookiesAccepted", "true", 365);
  const cookieInfo = document.querySelector(".cookie-info");
  cookieInfo.style.transition = "opacity 0.5s, transform 0.5s";
  cookieInfo.style.opacity = 0;
  setTimeout(() => {
    cookieInfo.style.display = "none";
  }, 500);
}

function showCookieInfo() {
  const cookieInfo = document.querySelector(".cookie-info");
  cookieInfo.style.transition = "opacity 0.5s, transform 0.5s";
  cookieInfo.style.opacity = 1;
  setTimeout(() => {
    cookieInfo.style.display = "block";
  }, 500);
}

function setCookie(name, value, days) {
  const expires = days
    ? `; expires=${new Date(
        Date.now() + days * 24 * 60 * 60 * 1000
      ).toUTCString()}`
    : "";
  document.cookie = `${name}=${value}${expires}; path=/`;
}

function getCookie(name) {
  const cookieArr = document.cookie.split("; ");
  for (let i = 0; i < cookieArr.length; i++) {
    const [cookieName, cookieValue] = cookieArr[i].split("=");
    if (name === cookieName) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Page Initialization
function initializePage() {
  const cookiesAccepted = getCookie("cookiesAccepted");
  if (!cookiesAccepted) {
    showCookieInfo(); // Show the cookie prompt
  }

  const fontSizeChoice = getCookie("fontSizeChoice");
  if (fontSizeChoice === "small" || fontSizeChoice === "large") {
    switchFontSize(fontSizeChoice);
  } else {
    // Default to small font size if no choice is found
    switchFontSize("small");
    setCookie("fontSizeChoice", "small", 365);
  }

  const contrastChoice = getCookie("contrastChoice");
  if (contrastChoice === "high-contrast") {
    toggleContrast();
  }
}

// Element Fade-In
const paragraphs = document.querySelectorAll(".fade-in-paragraph");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fade-in 1.5s ease forwards";
      } else {
        entry.target.style.animation = "fade-out 1.5s ease forwards";
      }
    });
  },
  { threshold: 0.5 }
);

paragraphs.forEach((paragraph) => {
  observer.observe(paragraph);
});

// Font Size Switching
function switchFontSize(size) {
  const bodyElement = document.body;
  bodyElement.classList.add("with-transition");

  if (size === "small") {
    bodyElement.classList.remove("large-text");
    bodyElement.classList.add("small-text");
  } else if (size === "large") {
    bodyElement.classList.remove("small-text");
    bodyElement.classList.add("large-text");
  }
}

function toggleFontSize() {
  const bodyElement = document.body;
  if (bodyElement.classList.contains("small-text")) {
    switchFontSize("large");
    setCookie("fontSizeChoice", "large", 365);
  } else {
    switchFontSize("small");
    setCookie("fontSizeChoice", "small", 365);
  }
}

// Contrast Toggle
function toggleContrast() {
  const bodyElement = document.body;
  bodyElement.classList.toggle("high-contrast");

  const contrastChoice = bodyElement.classList.contains("high-contrast")
    ? "high-contrast"
    : "default";
  setCookie("contrastChoice", contrastChoice, 365);
}

function checkTimeAndVisibility() {
  const countdownDate = new Date("2023-10-16T21:43:00");
  const now = new Date();
  const timerElement = document.getElementById("timer");
  const buttonElement = document.getElementById("button");

  if (now >= countdownDate) {
    if (timerElement) {
      timerElement.style.display = "none"; // Hide the timer
    }
    if (buttonElement) {
      buttonElement.style.display = "block"; // Show the button
    }
  }
}

// Check if the specified time is reached when the page loads
window.addEventListener("load", checkTimeAndVisibility);

// Check periodically (e.g., every minute) if the time is reached
setInterval(checkTimeAndVisibility, 1000); // Check every second
// Initialize the page when it loads
window.onload = initializePage;
