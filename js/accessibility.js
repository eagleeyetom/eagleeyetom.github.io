window.onload;
$("#fontPlusBtn").click(function () {
  $(".textDiv > *").css("font-size", function (i, value) {
    return parseInt(value) + 5;
  });
});
$("#fontMinusBtn").click(function () {
  $(".textDiv > *").css("font-size", function (i, value) {
    return parseInt(value) - 5;
  });
});

function switchColor() {
  document.getElementById("resultDiv").classList.toggle("toggle");
  // Set the cookie to store the color choice
  document.cookie =
    "colorChoice=" + color + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

window.onload = function () {
  var colorChoice = getCookie("colorChoice");
  if (colorChoice) {
    document.body.style.backgroundColor = colorChoice;
  }
};

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
