document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    $("#panel_left").addClass("panel_left");
    $("#panel_right").addClass("panel_right");
    $("#loader").addClass("loaded-circle");
    $("#loader-img").addClass("loaded-img");
    $("#preloader").addClass("loaded-img");
    $("body").removeClass("preload");
  }
};
