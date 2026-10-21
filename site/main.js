// Kiiri site — small, dependency-free progressive enhancements.
(() => {
  const REPO = "kiiri-app/kiiri";
  const RELEASES = `https://github.com/${REPO}/releases/latest`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nav: border on scroll + mobile menu
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const menuBtn = $("[data-menu]");
  menuBtn?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  // Platform-aware download label
  const ua = navigator.userAgent;
  const platform = /Win/i.test(ua) ? "windows" : /Linux|X11/i.test(ua) && !/Android/i.test(ua) ? "linux" : "mac";
  const labels = { mac: "Download for macOS", windows: "Download for Windows", linux: "Download for Linux" };
  $$("[data-dl-label]").forEach((el) => (el.textContent = labels[platform]));
  $$("[data-dl-primary]").forEach((a) => {
    a.href = RELEASES;
    if (platform !== "mac") a.querySelector("svg")?.remove();
  });
  const other = $("[data-other]");
  if (other) other.textContent = platform === "mac" ? "Windows & Linux" : "Other platforms";
  $$("[data-other]").forEach((a) => (a.href = RELEASES));

  // GitHub stars (silently skipped if the repo is private / rate-limited)
  fetch(`https://api.github.com/repos/${REPO}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d || typeof d.stargazers_count !== "number") return;
      const n = d.stargazers_count;
      $$("[data-stars]").forEach((el) => (el.textContent = n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n)));
    })
    .catch(() => {});

  // Hero video: no autoplay for reduced motion, pause while off screen
  const heroVideo = $("[data-hero-video]");
  if (heroVideo) {
    if (reduced) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => (en.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause()))
        .observe(heroVideo);
    }
  }

  // Billing toggle
  const billBtns = $$("[data-bill]");
  const setBill = (mode) => {
    billBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.bill === mode)));
    $$("[data-price-m]").forEach((el) => {
      const v = mode === "yearly" ? el.dataset.priceY : el.dataset.priceM;
      el.textContent = "$" + v;
    });
    $$("[data-note-y]").forEach((el) => (el.textContent = mode === "yearly" ? el.dataset.noteY : el.dataset.noteM));
  };
  billBtns.forEach((b) => b.addEventListener("click", () => setBill(b.dataset.bill)));

  // Copy buttons
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", async () => {
    const src = document.getElementById(btn.dataset.copy);
    try { await navigator.clipboard.writeText(src.innerText); btn.textContent = "Copied"; }
    catch { btn.textContent = "Select & copy"; }
    setTimeout(() => (btn.textContent = "Copy"), 1600);
  }));

  // Waitlist → POST /api/waitlist (server/waitlist.js, or the Cloudflare Pages Function)
  const form = $("[data-waitlist]"), msg = $("[data-wl-msg]");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    msg.classList.remove("err");
    msg.textContent = "Saving…";
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, plan: "plus", source: location.pathname }),
      });
      if (!r.ok) throw new Error(String(r.status));
      msg.textContent = "You're on the list. Kiiri will say hi when it's ready ✨";
      form.reset();
    } catch {
      msg.classList.add("err");
      msg.innerHTML = 'That didn\'t work. Email <a href="mailto:hello@kiiri.app">hello@kiiri.app</a> and we\'ll add you.';
    }
  });

  // Reveal on scroll
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -10% 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }
})();
