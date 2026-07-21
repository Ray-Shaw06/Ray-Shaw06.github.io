(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");

  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    for (const element of [main, footer]) {
      if (!element) continue;
      if (open) element.setAttribute("inert", "");
      else element.removeAttribute("inert");
    }
    if (open) menu.querySelector("a")?.focus();
  };

  toggle?.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 48rem)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 80);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const controls = document.querySelector(".collection-controls");
  const liveRegion = controls?.nextElementSibling;
  const cards = Array.from(document.querySelectorAll("[data-product-card]"));
  controls?.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.textContent.trim();
      controls.querySelectorAll("button").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let visible = 0;
      for (const card of cards) {
        const type = card.querySelector("p")?.textContent.split(",")[0].trim();
        const show = filter === "All" || type === filter;
        card.hidden = !show;
        if (show) visible += 1;
      }
      if (liveRegion) liveRegion.textContent = "Showing " + visible + " " + (visible === 1 ? "piece" : "pieces");
    });
  });

  document.querySelector(".inquiry-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const piece = String(data.get("piece") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent("Woven Hymns inquiry" + (piece ? ": " + piece : ""));
    const body = encodeURIComponent([
      "Name: " + name,
      "Email: " + email,
      piece ? "Piece: " + piece : "",
      "",
      message,
    ].filter(Boolean).join("\n"));
    window.location.href = "mailto:hello@example.com?subject=" + subject + "&body=" + body;
  });
})();