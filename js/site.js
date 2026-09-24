(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector("[data-nav]");
  const hero = document.querySelector(".hero");
  const media = document.querySelector(".hero-media");
  const video = document.querySelector("[data-hero-video]");
  const frames = [...document.querySelectorAll("[data-frame]")];
  const slider = document.querySelector("[data-slider]");
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  const menu = document.querySelector("[data-menu-toggle]");
  const drawer = document.querySelector("[data-drawer]");

  const showFrame = (i) => {
    frames.forEach((img, n) => img.classList.toggle("is-on", n === i));
  };

  let frameIndex = 0;
  let stillsOn = false;
  const startStills = () => {
    if (stillsOn || reduce || frames.length < 2) return;
    stillsOn = true;
    setInterval(() => {
      frameIndex = (frameIndex + 1) % frames.length;
      showFrame(frameIndex);
    }, 3200);
  };

  if (video) {
    const tryPlay = () => {
      video
        .play()
        .then(() => media?.classList.add("has-video"))
        .catch(startStills);
    };
    video.addEventListener("error", startStills);
    video.addEventListener("loadeddata", () => {
      if (video.videoWidth > 0) tryPlay();
      else startStills();
    });
    if (!video.querySelector("source")?.getAttribute("src")) startStills();
    else tryPlay();
  } else {
    startStills();
  }

  if (hero && nav) {
    const navWatch = new IntersectionObserver(
      ([entry]) => nav.classList.toggle("is-light", !entry.isIntersecting),
      { threshold: 0.12 }
    );
    navWatch.observe(hero);
  }

  const slides = [...document.querySelectorAll(".slide")];
  let index = 0;

  const slideName = (el) => el.querySelector("h3")?.textContent.trim() || "watch";

  const paintSlides = () => {
    const total = slides.length;
    if (!total) return;
    slides.forEach((el, n) => {
      el.classList.remove("is-prev", "is-current", "is-next");
      let slot = n - index;
      if (slot > total / 2) slot -= total;
      if (slot < -total / 2) slot += total;
      el.dataset.slot = String(Math.max(-2, Math.min(2, slot)));
      if (slot === 0) el.classList.add("is-current");
      else if (slot === -1) el.classList.add("is-prev");
      else if (slot === 1) el.classList.add("is-next");
      const current = slot === 0;
      const peek = slot === -1 || slot === 1;
      el.setAttribute("aria-hidden", String(!current && !peek));
      if (current) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
      if (peek) {
        el.setAttribute("role", "button");
        el.tabIndex = 0;
        el.setAttribute("aria-label", `Show ${slideName(el)}`);
      } else {
        el.removeAttribute("role");
        el.removeAttribute("tabindex");
        el.removeAttribute("aria-label");
      }
    });
  };

  const goSlide = (next) => {
    const total = slides.length;
    if (!total) return;
    const dest = (next + total) % total;
    if (dest === index) return;
    index = dest;
    paintSlides();
  };

  const stepSlider = (dir) => goSlide(index + dir);

  paintSlides();
  prev?.addEventListener("click", () => stepSlider(-1));
  next?.addEventListener("click", () => stepSlider(1));
  slider?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") stepSlider(1);
    if (event.key === "ArrowLeft") stepSlider(-1);
  });
  slides.forEach((el, n) => {
    const activatePeek = (event) => {
      if (!el.classList.contains("is-prev") && !el.classList.contains("is-next")) return;
      if (event.target.closest("a")) return;
      event.preventDefault();
      goSlide(n);
    };
    el.addEventListener("click", activatePeek);
    el.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      activatePeek(event);
    });
  });

  if (slider) {
    let dragX = 0;
    let startX = 0;
    let dragging = false;
    let dragged = false;
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      slider.classList.remove("is-dragging");
      slider.style.setProperty("--drag", "0px");
      if (dragX < -48) stepSlider(1);
      else if (dragX > 48) stepSlider(-1);
      dragX = 0;
    };
    slider.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest("a, .highlights-controls")) return;
      dragging = true;
      dragged = false;
      startX = event.clientX;
      dragX = 0;
      slider.classList.add("is-dragging");
      slider.style.setProperty("--drag", "0px");
      slider.setPointerCapture(event.pointerId);
    });
    slider.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      dragX = event.clientX - startX;
      slider.style.setProperty("--drag", `${dragX}px`);
      if (Math.abs(dragX) > 12) dragged = true;
    });
    slider.addEventListener("pointerup", endDrag);
    slider.addEventListener("pointercancel", endDrag);
    slider.addEventListener(
      "click",
      (event) => {
        if (!dragged) return;
        dragged = false;
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
  }

  const strip = document.querySelector("[data-reels]");
  const reelPrev = document.querySelector("[data-reel-prev]");
  const reelNext = document.querySelector("[data-reel-next]");

  const stepReels = (dir) => {
    if (!strip) return;
    const card = strip.querySelector(".reel");
    const w = card ? card.getBoundingClientRect().width + 16 : 240;
    strip.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
  };

  reelPrev?.addEventListener("click", () => stepReels(-1));
  reelNext?.addEventListener("click", () => stepReels(1));
  strip?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") stepReels(1);
    if (event.key === "ArrowLeft") stepReels(-1);
  });

  const setDrawer = (open) => {
    if (!drawer || !menu) return;
    drawer.toggleAttribute("hidden", !open);
    menu.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
    if (open) drawer.querySelector("a")?.focus();
    else menu.focus();
  };

  const reveal = [...document.querySelectorAll(".origin, .banner, .highlights, .premium, .reviews, .house, .reels, .signup")];
  if (reveal.length) {
    const markIn = (el) => el.classList.add("is-in");
    if (reduce) {
      reveal.forEach(markIn);
    } else {
      const watchIn = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              markIn(entry.target);
              watchIn.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      reveal.forEach((el) => watchIn.observe(el));
    }
  }

  menu?.addEventListener("click", () => setDrawer(drawer.hasAttribute("hidden")));
  drawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setDrawer(false);
    if (!drawer || drawer.hasAttribute("hidden") || event.key !== "Tab") return;
    const items = [...drawer.querySelectorAll("a")];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const faces = ["sora", "outfit", "manrope", "figtree", "jakarta"];
  const faceSelects = [...document.querySelectorAll("[data-face-select]")];
  const applyFace = window.applyBrunoFace || ((value) => {
    const face = faces.includes(value) ? value : "sora";
    document.documentElement.setAttribute("data-face", face);
    try {
      localStorage.setItem("bruno-face", face);
    } catch (e) {}
    faceSelects.forEach((el) => {
      if (el.value !== face) el.value = face;
    });
  });
  applyFace(document.documentElement.getAttribute("data-face") || "sora");
  faceSelects.forEach((el) => {
    el.addEventListener("input", () => applyFace(el.value));
    el.addEventListener("change", () => applyFace(el.value));
  });

  const form = document.querySelector(".signup-form");
  const email = document.querySelector("#signup-email");
  const hint = document.querySelector("#signup-hint");
  const showHint = (on) => {
    if (!hint || !email) return;
    hint.hidden = !on;
    email.setAttribute("aria-invalid", on ? "true" : "false");
  };
  form?.addEventListener(
    "invalid",
    (event) => {
      event.preventDefault();
      showHint(true);
      email?.focus();
    },
    true
  );
  email?.addEventListener("input", () => showHint(false));
})();
