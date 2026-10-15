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

  // Hero pet: eyes follow the cursor
  const eyes = $("[data-eyes]");
  const pet = $("[data-pet]");
  if (eyes && pet && !reduced) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      eyes.setAttribute("transform", `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    addEventListener("pointermove", (e) => {
      const r = pet.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.42);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      tx = (dx / d) * 14 * k; ty = (dy / d) * 10 * k;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  // Hero story loop: agent works → finishes → Kiiri points at the fixed line
  const bubble = $("[data-bubble]"), bText = $("[data-bubble-text]"), bTag = $("[data-bubble-tag]");
  const term = $("[data-term]"), term2 = $("[data-term2]");
  const arrow = $("[data-arrow]"), flagLine = $("[data-flag]"), stage = $(".stage");
  const say = (tag, text) => { bTag.textContent = tag; bText.textContent = text; bubble.classList.remove("hide"); };
  const hush = () => bubble.classList.add("hide");
  const setPet = (state) => { pet.classList.remove("working", "happy"); if (state) pet.classList.add(state); };
  const placeArrow = () => {
    const s = stage.getBoundingClientRect(), l = flagLine.getBoundingClientRect();
    arrow.style.left = `${l.left - s.left + Math.min(150, l.width * 0.4)}px`;
    arrow.style.top = `${l.top - s.top + l.height / 2 - 4}px`;
  };
  const steps = [
    [0, () => { setPet("working"); term.textContent = "● Reading auth.ts…"; term2.innerHTML = '<span class="cursor-blink"></span>'; say("Claude Code", "Working on it…"); }],
    [1800, () => { term.textContent = "● Editing auth.ts (1 change)"; }],
    [3400, () => { term.innerHTML = '<span class="ok">✓ Done</span> <span class="dim">· 1 file changed · 41s</span>'; term2.textContent = ""; setPet("happy"); say("Claude Code", "All done! Want me to show you what changed?"); }],
    [6200, () => { setPet(null); placeArrow(); arrow.classList.add("show"); flagLine.classList.add("flag"); say("Kiiri", "Here: it now sends the token as JSON."); }],
    [9800, () => { arrow.classList.remove("show"); flagLine.classList.remove("flag"); hush(); }],
  ];
  const CYCLE = 11500;
  if (bubble && term && arrow && flagLine && stage) {
    const run = () => steps.forEach(([t, fn]) => setTimeout(fn, t));
    if (reduced) steps[3][1]();
    else { run(); setInterval(run, CYCLE); }
    addEventListener("resize", () => arrow.classList.contains("show") && placeArrow());
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

  // Waitlist → Cloudflare Pages Function (/api/waitlist)
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
