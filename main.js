/* ============================================================
   Aroosha Sarrafi — AI Portfolio · motion & interaction
   Vanilla JS, no dependencies.
   ============================================================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = window.matchMedia("(min-width: 900px) and (pointer: fine)").matches;

/* ---------- PRELOADER ---------- */
(function preloader() {
  const el = document.getElementById("preloader");
  const count = document.getElementById("count");
  const bar = document.getElementById("bar");
  let n = 0;

  const finish = () => {
    el.classList.add("done");
    revealHero();
    document.body.style.overflow = "";
  };

  if (reduceMotion) {
    count.textContent = "100";
    bar.style.width = "100%";
    setTimeout(finish, 200);
    return;
  }

  document.body.style.overflow = "hidden";
  const tick = () => {
    n += Math.floor(Math.random() * 8) + 3;
    if (n >= 100) n = 100;
    count.textContent = n;
    bar.style.width = n + "%";
    if (n < 100) setTimeout(tick, 80 + Math.random() * 90);
    else setTimeout(finish, 400);
  };
  tick();
})();

/* ---------- HERO TITLE REVEAL ---------- */
function revealHero() {
  const lines = document.querySelectorAll(".hero__title .line > span");
  lines.forEach((s, i) => {
    if (reduceMotion) { s.style.transform = "none"; return; }
    s.style.transition = "transform 1s cubic-bezier(0.16,1,0.3,1)";
    s.style.transitionDelay = 0.08 * i + "s";
    requestAnimationFrame(() => { s.style.transform = "translateY(0)"; });
  });
  document.querySelectorAll(".hero .reveal").forEach((r, i) => {
    setTimeout(() => r.classList.add("in"), 250 + i * 120);
  });
}

/* ---------- SCROLL REVEAL ---------- */
(function scrollReveal() {
  const els = document.querySelectorAll(".reveal:not(.hero .reveal)");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();

/* ---------- CUSTOM CURSOR + MAGNETIC ---------- */
(function cursor() {
  if (!isDesktop) return;
  const ring = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function loop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });

  // magnetic pull on tagged elements
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      el.style.transition = "transform 0.1s linear";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0,0)";
      el.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
    });
  });
})();

/* ---------- PROJECT IMAGE PREVIEW (follows cursor) ---------- */
(function projectPreview() {
  if (!isDesktop) return;
  const items = document.querySelectorAll(".project[data-img]");
  if (!items.length) return;

  const preview = document.createElement("div");
  preview.className = "project-preview";
  const img = document.createElement("img");
  preview.appendChild(img);
  document.body.appendChild(preview);

  let tx = 0, ty = 0, cx = 0, cy = 0, active = false;

  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    preview.style.left = cx + "px";
    preview.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      img.src = item.dataset.img;
      preview.classList.add("active");
      active = true;
    });
    item.addEventListener("mouseleave", () => {
      preview.classList.remove("active");
      active = false;
    });
  });
})();

/* ---------- HERO PARTICLE FIELD (neural network vibe) ---------- */
(function field() {
  const canvas = document.getElementById("field");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr, nodes = [];
  const COUNT = 64;
  const LINK = 150;

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7b61ff";

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < COUNT; i++) {
    nodes.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    });
  }

  const mouse = { x: -999, y: -999 };
  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      // gentle attraction toward cursor
      const dxm = mouse.x - n.x, dym = mouse.y - n.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 180) { n.x += dxm * 0.0016; n.y += dym * 0.0016; }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244,243,239,0.55)";
      ctx.fill();
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const o = (1 - d / LINK) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(123,97,255,${o})`; // accent-tinted links
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- HERO PARALLAX ON SCROLL ---------- */
(function heroParallax() {
  if (reduceMotion) return;
  const content = document.querySelector(".hero__content");
  const canvas = document.getElementById("field");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      content.style.transform = `translateY(${y * 0.15}px)`;
      content.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      if (canvas) canvas.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
})();
