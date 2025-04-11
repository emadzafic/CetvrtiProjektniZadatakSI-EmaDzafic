window.addEventListener('load', function() {
    // Dugme za povratak na vrh
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", function() {
            scrollTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
        });

        scrollTopBtn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    } else {
        console.error("Dugme za povratak na vrh nije pronađeno!");
    }

    // Cookie notifikacija
    const cookieNotification = document.querySelector('.cookie-notification');
    const acceptBtn = document.querySelector('.accept-btn');
    const rejectBtn = document.querySelector('.reject-btn');

    if (cookieNotification && acceptBtn && rejectBtn) {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        cookieNotification.style.display = cookiesAccepted ? 'none' : 'block';

        acceptBtn.addEventListener('click', () => {
            cookieNotification.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
        });

        rejectBtn.addEventListener('click', () => {
            cookieNotification.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'false');
        });
    } else {
        console.error("Cookie elementi nisu pronađeni!");
    }

    // Toggle sadržaja
    const sections = [
        { imageId: "solarPanelImage", contentId: "solarPanelContent" },
        { imageId: "energySavingImage", contentId: "energySavingContent" },
        { imageId: "greenSpacesImage", contentId: "greenSpacesContent" },
        { imageId: "recyclingImage", contentId: "recyclingContent" }
    ];

    sections.forEach(({ imageId, contentId }) => {
        const imageElement = document.getElementById(imageId);
        const contentElement = document.getElementById(contentId);

        if (imageElement && contentElement) {
            imageElement.addEventListener("click", () => {
                contentElement.style.display = contentElement.style.display === "block" ? "none" : "block";
            });
        } else {
            console.error(`Element sa ID-jem "${imageId}" ili "${contentId}" nije pronađen.`);
        }
    });

    // Tooltip na video elementima
    const video = document.querySelector('.video-tooltip');
    if (video) {
        video.addEventListener('mouseover', function(event) {
            const tooltipText = event.target.getAttribute('data-tooltip');
            if (!tooltipText) return;

            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);

            const rect = video.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;

            setTimeout(() => tooltip.style.opacity = '1', 10);
            video.tooltipElement = tooltip;
        });

        video.addEventListener('mouseout', function() {
            if (video.tooltipElement) {
                video.tooltipElement.remove();
                video.tooltipElement = null;
            }
        });
    } else {
        console.error("Video element sa tooltipom nije pronađen!");
    }

    // Validacija forme
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            const ime = document.getElementById('ime')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const komentar = document.getElementById('poruka')?.value.trim();
            const datum = document.getElementById('datum')?.value.trim();

            if (!ime || !email || !komentar || !datum) {
                alert("Sva obavezna polja moraju biti popunjena!");
                event.preventDefault();
            } else if (!validateEmail(email)) {
                alert("Molimo unesite validan email!");
                event.preventDefault();
            }
        });

        function validateEmail(email) {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(email.toLowerCase());
        }
    } else {
        console.error("Forma nije pronađena!");
    }
});


//BACKEND
document.addEventListener("DOMContentLoaded", () => {
    prikaziKomentare();

    const forma = document.getElementById("kontaktForma");
    forma.addEventListener("submit", async (e) => {
        e.preventDefault();

        const podatak = {
            ime: document.getElementById("ime").value,
            email: document.getElementById("email").value,
            poruka: document.getElementById("poruka").value,
            datum: document.getElementById("datum").value,
        };

        const res = await fetch("/api/komentar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(podatak),
        });

        if (res.ok) {
            forma.reset();
            prikaziKomentare();
        } else {
            alert("Greška prilikom slanja komentara.");
        }
    });
});

async function prikaziKomentare() {
    const odgovor = await fetch("/api/komentari");
    const tekst = await odgovor.text();
    console.log("Odgovor od servera:", tekst);

    try {
        const komentari = JSON.parse(tekst);
        const kontejner = document.getElementById("listaKomentara");
        kontejner.innerHTML = "";

        komentari.forEach(k => {
            const div = document.createElement("div");
            div.classList.add("komentar");

            div.innerHTML = `
                <div class="ime-adresa">
                    <span class="ime">${k.ime}</span>
                    <span class="adresa">${k.email}</span>
                </div>
                <div class="tekst-komentara">
                    ${k.poruka}
                </div>
                <div class="datum">
                    ${k.datum}
                </div>
            `;
            kontejner.appendChild(div);
        });
    } catch (err) {
        console.error("Greška u parsiranju JSON-a:", err);
    }
}





