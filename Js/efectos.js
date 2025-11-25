document.addEventListener("DOMContentLoaded", () => {

    // SCROLL REVEAL (fade)

    const revealElements = document.querySelectorAll(".scroll-reveal");

    function revelar() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add("visible");
            }
        });
    }
    window.addEventListener("scroll", revelar);
    revelar();

    // SLIDE-IN LATERAL

    const slideElements = document.querySelectorAll(".slide-left, .slide-right");

    function revelarSlides() {
        slideElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add("slide-visible");
            }
        });
    }

    window.addEventListener("scroll", revelarSlides);
    revelarSlides();

});

