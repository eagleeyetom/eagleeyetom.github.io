function acceptCookies() {
  setCookie("cookiesAccepted", "true", 365);
  var cookieInfo = document.querySelector(".cookie-info");
  cookieInfo.style.transition = "opacity 0.5s";
  cookieInfo.style.opacity = 0;
  setTimeout(function () {
    cookieInfo.style.display = "none";
  }, 500);
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  var cookieArr = document.cookie.split("; ");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0]) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

function fadeInElements() {
  const fadeElements = document.querySelectorAll(".fade-in-paragraph");
  fadeElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
}

window.addEventListener("scroll", fadeInElements);
window.addEventListener("resize", fadeInElements);

// Call the function on page load to check elements that are already in view.
fadeInElements();

function switchFontSize(size) {
  // Added this function
  var bodyElement = document.body;
  if (size === "small") {
    bodyElement.classList.remove("large-text");
    bodyElement.classList.add("small-text");
  } else if (size === "large") {
    bodyElement.classList.remove("small-text");
    bodyElement.classList.add("large-text");
  }
}

function toggleFontSize() {
  var bodyElement = document.body;
  document.body.classList.add("with-transition");
  if (bodyElement.classList.contains("small-text")) {
    switchFontSize("large");
    setCookie("fontSizeChoice", "large", 365);
  } else {
    switchFontSize("small");
    setCookie("fontSizeChoice", "small", 365);
  }
}

window.onload = function () {
  var cookiesAccepted = getCookie("cookiesAccepted");
  if (cookiesAccepted) {
    var cookieInfo = document.querySelector(".cookie-info");
    cookieInfo.style.display = "none";
  }

  var fontSizeChoice = getCookie("fontSizeChoice");
  if (
    fontSizeChoice &&
    (fontSizeChoice === "small" || fontSizeChoice === "large")
  ) {
    switchFontSize(fontSizeChoice);
  } else {
    // Default to small font size if no choice is found
    switchFontSize("small");
    setCookie("fontSizeChoice", "small", 365);
  }

  var contrastChoice = getCookie("contrastChoice");
  if (contrastChoice && contrastChoice === "high-contrast") {
    toggleContrast();
  }
};

function toggleContrast() {
  var bodyElement = document.body;
  bodyElement.classList.toggle("high-contrast");

  var contrastChoice = bodyElement.classList.contains("high-contrast")
    ? "high-contrast"
    : "default";
  setCookie("contrastChoice", contrastChoice, 365);
}
