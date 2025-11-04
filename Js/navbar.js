const navbar = document.getElementById("navbar-r");
const sections = document.querySelectorAll(".fondo-b, .fondo-w");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        if (entry.target.classList.contains("fondo-b")) {
            navbar.classList.add("nav-textos-negros");
            navbar.classList.remove("nav-textos-blancos");
        } else if (entry.target.classList.contains("fondo-w")) {
            navbar.classList.add("nav-textos-blancos");
            navbar.classList.remove("nav-textos-negros");
        }
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));