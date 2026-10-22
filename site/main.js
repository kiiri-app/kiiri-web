// Kiiri site — small, dependency-free progressive enhancements.
(() => {
  // Source repos stay private until launch (their links would 404), so the site
  // points at the org page; switch back to kiiri-app/kiiri when it goes public.
  const REPO = "kiiri-app/kiiri";
  // Builds live in a public releases-only repo; REPO (source) is only used for the star count.
  const RELEASES = "https://github.com/kiiri-app/kiiri-releases/releases/latest";
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

  // GitHub stars. Off while the source repo is private (the API answers 404,
  // which shows up as a console error); flip on launch day with the links.
  const SOURCE_PUBLIC = false;
  if (SOURCE_PUBLIC) fetch(`https://api.github.com/repos/${REPO}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d || typeof d.stargazers_count !== "number") return;
      const n = d.stargazers_count;
      $$("[data-stars]").forEach((el) => (el.textContent = n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n)));
    })
    .catch(() => {});

  // Clips (hero + features): play only while on screen. The hero autoplays from
  // the HTML; the rest load lazily (preload="none") the first time they show up.
  // Reduced motion: nothing autoplays; posters stay, with controls to opt in.
  const clips = $$("[data-hero-video], [data-autoplay]");
  if (reduced) {
    clips.forEach((v) => { v.removeAttribute("autoplay"); v.pause(); v.controls = true; });
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.35 });
    clips.forEach((v) => io.observe(v));
  } else {
    clips.forEach((v) => v.play().catch(() => {}));
  }

  // 🔊 on clips that talk: unmute this one (from the start), mute any other.
  $$("[data-sound]").forEach((btn) => {
    const v = btn.parentElement.querySelector("video");
    if (!v) return;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      const on = v.muted;
      $$("[data-sound]").forEach((b) => {
        const o = b.parentElement.querySelector("video");
        if (o && o !== v) { o.muted = true; b.setAttribute("aria-pressed", "false"); b.textContent = "🔊 Sound"; }
      });
      v.muted = !on;
      if (on) { v.currentTime = 0; v.play().catch(() => {}); }
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "🔇 Mute" : "🔊 Sound";
    });
  });

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
