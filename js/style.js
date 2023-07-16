window.onload = function () {
  var styleChoice = getCookie("styleChoice");
  if (styleChoice) {
    applyStyle(styleChoice);
  }
};

function switchStyle(style) {
  applyStyle(style);
  setCookie("styleChoice", style, 365);
}

function applyStyle(style) {
  var boxes = document.getElementsByClassName("box");
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].style.backgroundColor = style;
  }
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
