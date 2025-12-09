// ====== CONFIG: change these ======
const CONFIG = {
  brand: "Photobylorna",
  location: "Tacoma, Washington",
  bookingUrl: "https://calendar.app.google/rSUH5YjP529eWbVS6",
};

document.addEventListener("DOMContentLoaded", () => {
  // Fill brand/location text
  document.querySelectorAll("[data-brand]").forEach(el => el.textContent = CONFIG.brand);
  document.querySelectorAll("[data-location]").forEach(el => el.textContent = CONFIG.location);

  // Fill booking links
  document.querySelectorAll("[data-booking]").forEach(a => {
    a.href = CONFIG.bookingUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Highlight active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".links a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
});

// ====== Portfolio filter + lightbox ======
(() => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const tiles = Array.from(gallery.querySelectorAll(".tile"));
  const chips = Array.from(document.querySelectorAll("[data-filter]"));

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const tag = chip.getAttribute("data-filter");
      tiles.forEach(t => {
        const tags = (t.getAttribute("data-tags") || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);

        const show = (tag === "all") || tags.includes(tag);
        t.style.display = show ? "" : "none";
      });
    });
  });

  // Lightbox wiring
  const lb = document.querySelector("#lightbox");
  const lbImg = lb?.querySelector("img");
  const lbCap = lb?.querySelector(".lbCap");
  const btnClose = lb?.querySelector("[data-lb-close]");
  const btnPrev  = lb?.querySelector("[data-lb-prev]");
  const btnNext  = lb?.querySelector("[data-lb-next]");

  let current = 0;

  function visibleTiles() {
    return tiles.filter(t => t.style.display !== "none");
  }

  function openAt(i){
    const vis = visibleTiles();
    const tile = vis[i];
    if (!tile) return;
    current = i;

    const full = tile.getAttribute("data-full") || tile.querySelector("img")?.src;
    const cap  = tile.getAttribute("data-caption") || "";

    lbImg.src = full;
    lbImg.alt = cap || "Photo";
    lbCap.textContent = cap;

    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close(){
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function step(dir){
    const vis = visibleTiles();
    if (!vis.length) return;
    current = (current + dir + vis.length) % vis.length;
    openAt(current);
  }

  tiles.forEach(t => {
    t.addEventListener("click", () => {
      const vis = visibleTiles();
      const idx = vis.indexOf(t);
      openAt(Math.max(0, idx));
    });
  });

  btnClose?.addEventListener("click", close);
  lb?.addEventListener("click", (e) => { if (e.target === lb) close(); });
  btnPrev?.addEventListener("click", () => step(-1));
  btnNext?.addEventListener("click", () => step(1));

  window.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
