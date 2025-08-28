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