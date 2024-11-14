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
  const fontSizeImage = document.querySelector(
    ".wcag-menu-item.accessability.font-toggle img"
  );

  if (size === "small") {
    bodyElement.classList.remove("large-text");
    bodyElement.classList.add("small-text");
    // Delay the rotation effect slightly for the transition
    setTimeout(() => {
      fontSizeImage.style.transform = "rotateY(0deg)";
    }, 100);
  } else if (size === "large") {
    bodyElement.classList.remove("small-text");
    bodyElement.classList.add("large-text");
    // Delay the rotation effect slightly for the transition
    setTimeout(() => {
      fontSizeImage.style.transform = "rotateY(180deg)";
    }, 100);
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

// Flipdown & button

let countdownStarted = false;
let countdownEnded = false;

function checkTimeAndVisibility() {
  const countdownDate = new Date("2024-10-25T00:00:00"); // The target countdown date
  const now = new Date();
  const textElement = document.getElementById("flipdown-text");
  const timerElement = document.getElementById("flipdown");
  const buttonElement = document.getElementById("button");

  if (now >= countdownDate) {
    if (timerElement) {
      timerElement.style.display = "none";
      textElement.style.display = "none"; // Hide the timer
    }
    if (buttonElement) {
      buttonElement.style.display = "block"; // Show the button
    }
    countdownEnded = true;
  } else {
    if (timerElement) {
      timerElement.style.display = "block";
      textElement.style.display = "block"; // Show the timer
    }
    if (buttonElement) {
      buttonElement.style.display = "none"; // Hide the button
    }

    if (!countdownStarted && !countdownEnded) {
      // Set up FlipDown
      var timestamp = countdownDate.getTime() / 1000;
      var flipdown = new FlipDown(timestamp)

        // Start the countdown
        .start()

        // Do something when the countdown ends
        .ifEnded(() => {
          console.log("The countdown has ended!");
          if (timerElement) {
            timerElement.style.display = "none";
            textElement.style.display = "none"; // Hide the timer when the countdown ends
          }
          if (buttonElement) {
            buttonElement.style.display = "block"; // Show the button when the countdown ends
          }
          countdownEnded = true;
        });

      // Show version number
      var ver = document.getElementById("ver");
      ver.innerHTML = flipdown.version;

      countdownStarted = true;
    }
  }
}

// Check if the specified time is reached when the page loads
window.addEventListener("load", checkTimeAndVisibility);

// Initialize the page when it loads

window.onload = initializePage;
