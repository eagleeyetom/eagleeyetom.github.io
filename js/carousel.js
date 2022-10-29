var myIndex = 0;
        var x = document.getElementsByClassName("mySlides");
        var auto;
        carousel();

        function carousel() {
            var i;

            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            myIndex++;
            if (myIndex > x.length) {
                myIndex = 1
            }
            x[myIndex - 1].style.display = "block";
            t = setTimeout(function () {
                carousel();
            }, 5000); // Change image every 5 seconds
            console.log(myIndex);
        }

        function plusSlides(n) {
            showSlides(myIndex += n);
        }

        function currentSlide(n) {
            showSlides(myIndex = n);
        }

        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            if (n > slides.length) {
                myIndex = 1
            }
            if (n < 1) {
                myIndex = slides.length
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[myIndex - 1].style.display = "block";
            clearTimeout(t);
            t = setTimeout(function () {
                carousel();
            }, 5000); // Change image every 5 seconds
            console.log(myIndex);
        }