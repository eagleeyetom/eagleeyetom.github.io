function acceptCookies() {
  setCookie("cookiesAccepted", "true", 365);
  var cookieInfo = document.querySelector(".cookie-info");
  cookieInfo.style.display = "none";
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
  }

  var contrastChoice = getCookie("contrastChoice");
  if (contrastChoice && contrastChoice === "high-contrast") {
    toggleContrast();
  }
};

function switchFontSize(size) {
  var bodyElement = document.body;
  bodyElement.classList.remove("small-text", "large-text");

  if (size === "small") {
    bodyElement.classList.add("small-text");
  } else if (size === "large") {
    bodyElement.classList.add("large-text");
  }

  setCookie("fontSizeChoice", size, 365);
}

function toggleContrast() {
  var bodyElement = document.body;
  bodyElement.classList.toggle("high-contrast");

  var contrastChoice = bodyElement.classList.contains("high-contrast")
    ? "high-contrast"
    : "default";
  setCookie("contrastChoice", contrastChoice, 365);
}
