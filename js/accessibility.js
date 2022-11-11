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
//$.cookie("switchColor", "true", { expires: 7 });
