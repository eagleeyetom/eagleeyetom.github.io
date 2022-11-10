// Set the date we're counting down to
var countDownDate = new Date("Nov 14, 2022 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var za = "Startujemy za";
    var starting = "We are starting in";
    // Display the result in the element with id="timer"

    if (document.documentElement.lang === "pl") {
        if (days == 1) {
            document.getElementById("timer").innerHTML = `${za} ${days} dzień ${hours} godz. ${minutes} min. ${seconds} sek. `;
        } else {
            document.getElementById("timer").innerHTML = `${za} ${days} dni ${hours} godz. ${minutes} min. ${seconds} sek. `;
        }
        if (days == 0) {
            document.getElementById("timer").innerHTML = `${za} ${hours} godz. ${minutes} min. ${seconds} sek. `;
        }
        if (days == 0 && hours == 0) {
            document.getElementById("timer").innerHTML = `${za} ${minutes} min. ${seconds} sek. `;
        }
        if (days == 0 && hours == 0 && minutes == 0) {
            document.getElementById("timer").innerHTML = `${za} ${seconds} sek. `;
        }

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").style.display = "none";
            var tag_id = document.getElementById('button');
            tag_id.innerHTML = '<div class="button"><form action="online.html" method="get" class="textDiv"><button tabindex="7">Oglądaj on-line<br><i class="fa-solid fa-play"></i></button></form></div>';
        }
    }

    if (document.documentElement.lang === "en") {
        if (days == 1) {
            document.getElementById("timer").innerHTML = `${starting} ${days}d ${hours}h ${minutes}m ${seconds}s `;
        } else {
            document.getElementById("timer").innerHTML = `${starting} ${days}d ${hours}h ${minutes}m ${seconds}s `;
        }
        if (days == 0) {
            document.getElementById("timer").innerHTML = `${starting} ${hours}h ${minutes}m ${seconds}s `;
        }
        if (days == 0 && hours == 0) {
            document.getElementById("timer").innerHTML = `${starting} ${minutes}min. ${seconds}sec. `;
        }
        if (days == 0 && hours == 0 && minutes == 0) {
            document.getElementById("timer").innerHTML = `${starting} ${seconds}seconds `;
        }

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").style.display = "none";
            var tag_id = document.getElementById('button');
            tag_id.innerHTML = '<div class="button"><form action="online.html" method="get" class="textDiv"><button tabindex="7">Watch on-line<br><i class="fa-solid fa-play"></i></button></form></div>';
        }
    }
}, 1000);