async function include(el) {
    const url = el.dataset.include;
    if (!url) return;
    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        el.innerHTML = await res.text();
    } catch (e) {
        console.error("Include failed:", url, e);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const hosts = document.querySelectorAll("[data-include]");
    await Promise.all([...hosts].map(include));
    // сигнал: усі partials підвантажені
    document.dispatchEvent(new Event("partials:loaded"));

    // ініціалізація хедера та бургера для всіх сторінок
    try {
        const header = document.querySelector("[data-header]");
        const burger = document.querySelector("[data-burger]");
        const mobile = document.querySelector("[data-mobile-nav]");
        const hasHero = !!document.querySelector('.hero');

        if (header) {
            const setHeaderState = () => {
                if (!hasHero) {
                    header.classList.add("header--solid");
                    header.classList.remove("header--transparent");
                    return;
                }
                const y = window.scrollY || document.documentElement.scrollTop;
                if (y > 10) {
                    header.classList.add("header--solid");
                    header.classList.remove("header--transparent");
                } else {
                    header.classList.add("header--transparent");
                    header.classList.remove("header--solid");
                }
            };
            setHeaderState();
            window.addEventListener("scroll", setHeaderState, { passive: true });
        }

        if (burger && mobile) {
            const toggleMenu = () => {
                const willOpen = !mobile.classList.contains("is-open");
                mobile.classList.toggle("is-open", willOpen);
                burger.classList.toggle("is-open", willOpen);
                burger.setAttribute("aria-expanded", willOpen ? "true" : "false");
                document.body.style.overflow = willOpen ? "hidden" : "";
            };
            burger.addEventListener("click", toggleMenu);
            mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", toggleMenu));
        }

        // Підсвічування активного пункту меню
        document.querySelectorAll(".header__nav a").forEach(a => {
            try {
                const href = a.getAttribute("href") || "";
                const path = location.pathname.replace(/\/+$/,'');
                const isSame = href.startsWith("http")
                    ? href === location.href
                    : href.replace(/\/+$/,'') === path || href === "/#services" || href === "/#contacts";
                if (isSame) a.classList.add("is-active");
            } catch(e){}
        });
    } catch (e) {
        console.error("Header init failed", e);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if(toggleBtn && mobileMenu){
        toggleBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
            toggleBtn.textContent = mobileMenu.classList.contains("open") ? "✖" : "☰";
        });
    }
});

(function () {
    const targets = document.querySelectorAll('.features .feature-item, .services-grid .service-card');
    targets.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    targets.forEach(el => io.observe(el));
})();

function initHeaderMenu(){
    const burger  = document.querySelector(".hamburger");
    const mobile  = document.querySelector(".mobile-nav");
    const closeBtn = document.getElementById("mobileClose");
    if(!burger || !mobile) return;

    const toggle = (force) => {
        const open = typeof force === "boolean" ? force : !mobile.classList.contains("is-open");
        mobile.classList.toggle("is-open", open);
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        mobile.setAttribute("aria-hidden", open ? "false" : "true");
        document.body.style.overflow = open ? "hidden" : "";
    };

    burger.addEventListener("click", () => toggle());
    // Кнопка закриття всередині оверлею
    if (closeBtn) closeBtn.addEventListener("click", () => toggle(false));
    // Закриваємо по кліку на пункт меню
    mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggle(false)));
    // Закриваємо по Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobile.classList.contains("is-open")) toggle(false);
    });
}

document.addEventListener("partials:loaded", initHeaderMenu);
document.addEventListener("DOMContentLoaded", initHeaderMenu);
// Debug pricing modal
document.addEventListener("partials:loaded", () => {
    console.log("Partials loaded, initializing pricing modal...");
    
    const pricingBtns = document.querySelectorAll("[data-pricing-btn]");
    const pricingModal = document.getElementById("pricingModal");
    
    console.log("Pricing buttons found:", pricingBtns.length);
    console.log("Pricing modal found:", !!pricingModal);
    
    if (!pricingModal) {
        console.error("Pricing modal not found!");
        return;
    }

    const openModal = () => {
        console.log("Opening pricing modal...");
        pricingModal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        console.log("Closing pricing modal...");
        pricingModal.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    // Open modal on button click
    pricingBtns.forEach(btn => {
        console.log("Adding click listener to button");
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal on close button click
    const closeBtn = pricingModal.querySelector(".pricing-modal__close");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close modal on backdrop click
    pricingModal.addEventListener("click", (e) => {
        if (e.target === pricingModal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && pricingModal.classList.contains("is-open")) {
            closeModal();
        }
    });
});
