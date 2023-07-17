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
};
