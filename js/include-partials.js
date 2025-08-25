async function include(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(res.statusText);
        host.innerHTML = await res.text();
    } catch (e) {
        console.error("Include failed:", url, e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-include]").forEach(el => {
        include(el.tagName.toLowerCase()+"[data-include]", el.dataset.include);
    });
});