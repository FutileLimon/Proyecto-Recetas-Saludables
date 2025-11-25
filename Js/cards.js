document.addEventListener("DOMContentLoaded", () => {
    console.log("cards.js cargado");
});

document.addEventListener("DOMContentLoaded", () => {

    const img_1 = document.getElementById('perfume-img-1');
    const body_1 = document.getElementById('perfume-body-1');

    img_1.addEventListener('dblclick', () => {
        if (body_1.style.display === 'none') {
            body_1.style.display = 'block';
        } else {
            body_1.style.display = 'none';
        }
    });

    const img_2 = document.getElementById('perfume-img-2');
    const body_2 = document.getElementById('perfume-body-2');

    img_2.addEventListener('dblclick', () => {
        if (body_2.style.display === 'none') {
            body_2.style.display = 'block';
        } else {
            body_2.style.display = 'none';
        }
    });

    const img_3 = document.getElementById('perfume-img-3');
    const body_3 = document.getElementById('perfume-body-3');

    img_3.addEventListener('dblclick', () => {
        if (body_3.style.display === 'none') {
            body_3.style.display = 'block';
        } else {
            body_3.style.display = 'none';
        }
    });

    const img_4 = document.getElementById('perfume-img-4');
    const body_4 = document.getElementById('perfume-body-4');

    img_4.addEventListener('dblclick', () => {
        if (body_4.style.display === 'none') {
            body_4.style.display = 'block';
        } else {
            body_4.style.display = 'none';
        }
    });

    const img_5 = document.getElementById('perfume-img-5');
    const body_5 = document.getElementById('perfume-body-5');

    img_5.addEventListener('dblclick', () => {
        if (body_5.style.display === 'none') {
            body_5.style.display = 'block';
        } else {
            body_5.style.display = 'none';
        }
    });
});
