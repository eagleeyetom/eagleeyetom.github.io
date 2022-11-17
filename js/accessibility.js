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
}

function accessCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
  document.getElementById("resultDiv").classList.toggle("toggle");
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
var readCookie_jest = readCookie("readCookie");
if (readCookie_jest == 1) {
  document.getElementById("resultDiv").classList.toggle("toggle");
}
