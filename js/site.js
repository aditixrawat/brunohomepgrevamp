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

  const slideEls = () => [...(slider?.querySelectorAll(".slide") || [])];
  let index = 0;
  let highlightAuto = null;
  const AUTO_MS = 3400;

  const slideName = (el) => el.querySelector("h3")?.textContent.trim() || "watch";

  const paintSlides = () => {
    const slides = slideEls();
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
    paintHighlightPager(Boolean(highlightAuto?.timer));
  };

  const goSlide = (next) => {
    const total = slideEls().length;
    if (!total) return;
    const dest = (next + total) % total;
    if (dest === index) return;
    index = dest;
    paintSlides();
  };

  const stepSlider = (dir) => goSlide(index + dir);

  const setPagerPlaying = (playing) => {
    const toggle = document.querySelector('[data-pager-toggle="highlights"]');
    if (!toggle) return;
    toggle.classList.toggle("is-paused", !playing);
    toggle.setAttribute("aria-pressed", String(!playing));
    toggle.setAttribute("aria-label", playing ? "Pause auto-scroll" : "Play auto-scroll");
  };

  const paintHighlightPager = (playing) => {
    const pips = document.querySelector('[data-pager-pips="highlights"]');
    if (!pips) return;
    const slides = slideEls();
    const pages = Math.min(8, slides.length);
    if (!pages) {
      pips.replaceChildren();
      return;
    }
    const current = pages <= 1 ? 0 : Math.round((index / Math.max(1, slides.length - 1)) * (pages - 1));
    pips.replaceChildren(
      ...Array.from({ length: pages }, (_, i) => {
        const pip = document.createElement("button");
        pip.type = "button";
        pip.className = "rail-pager-pip";
        pip.setAttribute("aria-label", `Go to watch ${i + 1}`);
        if (i === current) {
          pip.classList.add("is-on");
          if (playing) pip.classList.add("is-playing");
          pip.append(document.createElement("i"));
        }
        pip.addEventListener("click", () => {
          const dest = pages <= 1 ? 0 : Math.round((i / (pages - 1)) * (slides.length - 1));
          goSlide(dest);
          if (highlightAuto?.playing) highlightAuto.restart?.();
          else paintHighlightPager(false);
        });
        return pip;
      })
    );
  };

  const stopHighlightAuto = () => {
    if (!highlightAuto) return;
    if (highlightAuto.timer) window.clearInterval(highlightAuto.timer);
    if (highlightAuto.resume) window.clearTimeout(highlightAuto.resume);
    highlightAuto.timer = 0;
    highlightAuto.resume = 0;
  };

  const desktopView = window.matchMedia("(min-width: 768px)");

  const attachHighlightAuto = () => {
    if (!slider) return;
    stopHighlightAuto();
    highlightAuto?.io?.disconnect();

    const tick = () => {
      if (document.hidden) return;
      stepSlider(1);
    };

    const play = () => {
      if (!highlightAuto || highlightAuto.timer || !highlightAuto.playing || reduce) return;
      paintHighlightPager(true);
      highlightAuto.timer = window.setInterval(tick, AUTO_MS);
    };

    const pause = (hold) => {
      stopHighlightAuto();
      paintHighlightPager(false);
      if (hold && highlightAuto?.playing) highlightAuto.resume = window.setTimeout(play, 7000);
    };

    const restart = () => {
      stopHighlightAuto();
      play();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!highlightAuto) return;
        if (entry.isIntersecting && highlightAuto.playing) play();
        else stopHighlightAuto();
      },
      { threshold: 0.2 }
    );
    io.observe(slider);

    if (!slider.dataset.autoBound) {
      slider.dataset.autoBound = "1";
      const hold = () => highlightAuto?.pause?.(true);
      slider.addEventListener("pointerdown", hold);
      slider.addEventListener("focusin", hold);
    }

    highlightAuto = { timer: 0, resume: 0, io, pause, play, restart, playing: !reduce };
    setPagerPlaying(!reduce);
    paintHighlightPager(!reduce);
    play();
  };

  paintSlides();
  attachHighlightAuto();
  const nudgeHighlight = (dir) => {
    stepSlider(dir);
    highlightAuto?.pause?.(true);
  };
  prev?.addEventListener("click", () => nudgeHighlight(-1));
  next?.addEventListener("click", () => nudgeHighlight(1));
  slider?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") stepSlider(1);
    if (event.key === "ArrowLeft") stepSlider(-1);
  });
  slider?.addEventListener("click", (event) => {
    const el = event.target.closest(".slide");
    if (!el || !slider.contains(el)) return;
    if (!el.classList.contains("is-prev") && !el.classList.contains("is-next")) return;
    if (event.target.closest("a")) return;
    event.preventDefault();
    goSlide(slideEls().indexOf(el));
  });
  slider?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const el = event.target.closest(".slide");
    if (!el || !slider.contains(el)) return;
    if (!el.classList.contains("is-prev") && !el.classList.contains("is-next")) return;
    event.preventDefault();
    goSlide(slideEls().indexOf(el));
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

  const STORE = "https://www.brunomilano.com";

  const rs = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "";
    return `Rs ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
  };

  const sized = (src) => {
    if (!src) return "";
    const url = src.startsWith("//") ? `https:${src}` : src;
    return `${url}${url.includes("?") ? "&" : "?"}width=900`;
  };

  const isWatch = (product) => {
    const title = product.title || "";
    const type = (product.product_type || "").toLowerCase();
    if (/gift bag|apple band|strap|jewell?ery|ring watch/i.test(title)) return false;
    return !type || type === "watch";
  };

  const skuLink = ({ href, image, title, meta }) => {
    const link = document.createElement("a");
    link.className = "sku";
    link.href = href;
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    img.width = 900;
    img.height = 900;
    img.loading = "lazy";
    img.decoding = "async";
    const name = document.createElement("strong");
    name.textContent = title;
    link.append(img, name);
    if (meta) {
      const price = document.createElement("span");
      price.className = "sku-price";
      price.textContent = meta;
      link.append(price);
    }
    return link;
  };

  const paintLoved = (rail, products) => {
    const grid = rail.querySelector(".loved-grid") || rail;
    grid.replaceChildren(
      ...products.map((product) =>
        skuLink({
          href: `${STORE}/products/${product.handle}`,
          image: sized(product.images?.[0]?.src),
          title: product.title,
          meta: rs(product.variants?.[0]?.price),
        })
      )
    );
    rail.setAttribute("aria-busy", "false");
  };

  const failRail = (name) => {
    const rail = document.querySelector(`[data-rail="${name}"]`);
    const note = document.querySelector(`[data-${name}-note]`);
    const grid = rail?.querySelector(".loved-grid") || rail;
    if (grid) {
      grid.replaceChildren();
    }
    if (rail) rail.setAttribute("aria-busy", "false");
    if (note) note.hidden = false;
  };

  const fetchCollectionProducts = async (handle) => {
    const products = [];
    for (let page = 1; page <= 20; page += 1) {
      const response = await fetch(`${STORE}/collections/${handle}/products.json?limit=250&page=${page}`);
      if (!response.ok) throw new Error(handle);
      const batch = (await response.json()).products || [];
      products.push(...batch);
      if (batch.length < 250) break;
    }
    return products;
  };

  let sellersPromise = null;
  const getSellers = () => {
    if (!sellersPromise) {
      sellersPromise = fetchCollectionProducts("best-sellers").then((list) => list.filter(isWatch));
    }
    return sellersPromise;
  };

  const familyOf = (title) => String(title || "").split(" - ")[0].trim();

  const makeHighlightSlide = ({ family, product }) => {
    const article = document.createElement("article");
    article.className = "slide";
    const copy = document.createElement("div");
    copy.className = "slide-copy";
    const heading = document.createElement("h3");
    heading.textContent = family;
    const link = document.createElement("a");
    link.href = `${STORE}/products/${product.handle}`;
    link.textContent = `Shop ${family.split(/\s+/)[0]}`;
    copy.append(heading, link);
    const img = document.createElement("img");
    img.className = "slide-watch";
    img.src = sized(product.images?.[0]?.src);
    img.alt = family;
    img.width = 800;
    img.height = 800;
    img.loading = "lazy";
    img.decoding = "async";
    article.append(copy, img);
    return article;
  };

  const loadHighlights = async () => {
    if (!slider) return;
    try {
      const products = await getSellers();
      const families = [];
      const seen = new Set();
      products.forEach((product) => {
        const family = familyOf(product.title);
        const key = family.toLowerCase();
        if (!family || seen.has(key)) return;
        seen.add(key);
        families.push({ family, product });
      });
      if (!families.length) {
        attachHighlightAuto();
        return;
      }
      slider.replaceChildren(...families.map(makeHighlightSlide));
      index = 0;
      paintSlides();
      attachHighlightAuto();
    } catch (error) {
      attachHighlightAuto();
    }
  };

  const loadArrivals = async () => {
    const rail = document.querySelector('[data-rail="arrivals"]');
    if (!rail) return;
    try {
      let fromCollection = "new-arrivals";
      let products = [];
      try {
        products = await fetchCollectionProducts("new-arrivals");
      } catch (error) {
        products = [];
      }
      if (!products.length) {
        fromCollection = "all";
        products = await fetchCollectionProducts("all");
      }
      products = products.filter(isWatch);
      if (fromCollection === "all") {
        products.sort((a, b) =>
          String(b.published_at || b.created_at || "").localeCompare(String(a.published_at || a.created_at || ""))
        );
      }
      if (!products.length) throw new Error("empty");
      paintLoved(rail, products);
    } catch (error) {
      failRail("arrivals");
    }
  };

  const loadSellers = async () => {
    const rail = document.querySelector('[data-rail="sellers"]');
    if (!rail) return;
    try {
      const products = await getSellers();
      if (!products.length) throw new Error("empty");
      paintLoved(rail, products);
    } catch (error) {
      failRail("sellers");
    }
  };

  const railScroller = (rail) => {
    if (!rail) return null;
    return rail.querySelector(".loved-grid") || rail;
  };

  const cardStep = (scroller) => {
    const card = scroller.querySelector(".sku, .sku-wait, .col-card");
    const styles = getComputedStyle(scroller);
    const gap = parseFloat(styles.columnGap || styles.gap) || 8;
    return card ? card.getBoundingClientRect().width + gap : scroller.clientWidth * 0.72;
  };

  const stepRail = (name, dir) => {
    const rail = document.querySelector(`[data-rail="${name}"]`);
    const scroller = railScroller(rail);
    if (!scroller) return;
    scroller.scrollBy({ left: dir * cardStep(scroller), behavior: reduce ? "auto" : "smooth" });
  };

  loadArrivals();
  loadSellers();
  loadHighlights();
  desktopView.addEventListener("change", attachHighlightAuto);

  document.querySelector('[data-pager-toggle="highlights"]')?.addEventListener("click", () => {
    if (!highlightAuto) return;
    highlightAuto.playing = !highlightAuto.playing;
    setPagerPlaying(highlightAuto.playing);
    if (highlightAuto.playing) highlightAuto.restart?.();
    else highlightAuto.pause?.(false);
  });

  document.querySelectorAll("[data-rail-prev], [data-rail-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const prev = button.getAttribute("data-rail-prev");
      const next = button.getAttribute("data-rail-next");
      stepRail(prev || next, prev ? -1 : 1);
    });
  });

  document.querySelectorAll("[data-rail]").forEach((rail) => {
    rail.addEventListener("keydown", (event) => {
      const name = rail.getAttribute("data-rail");
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      stepRail(name, event.key === "ArrowRight" ? 1 : -1);
    });
  });

  const reveal = [...document.querySelectorAll(".origin, .promises, .loved, .edit, .split, .view, .highlights, .reviews, .house, .reels, .signup")];
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

  const faces = ["sora", "outfit", "syne", "onest", "urbanist", "archivo", "familjen"];
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

  const sequence = document.getElementById("sequence-section");
  const seqCanvas = document.getElementById("sequence-canvas");
  if (sequence && seqCanvas) {
    const ctx = seqCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const mobile = window.innerWidth <= 900;
    const frameCount = mobile ? 192 : 238;
    const imageCache = {};
    let currentFrame = 0;
    let targetFrame = 0;
    let animationRunning = false;
    const buyBtn = sequence.querySelector(".sequence-buy-btn");
    const seqText = sequence.querySelector(".bmvidtext");

    const getFrameUrl = (index) =>
      mobile
        ? `https://cdn.shopify.com/s/files/1/0888/8929/5134/files/Sequence_${String(1000 + index).padStart(5, "0")}.jpg`
        : `https://cdn.shopify.com/s/files/1/0888/8929/5134/files/Sequence_03_${1000 + index}.jpg`;

    const drawImage = (index) => {
      const img = imageCache[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      ctx.clearRect(0, 0, viewWidth, viewHeight);
      const scale = Math.max(viewWidth / img.width, viewHeight / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      ctx.drawImage(img, (viewWidth - width) / 2, (viewHeight - height) / 2, width, height);
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      seqCanvas.width = window.innerWidth * dpr;
      seqCanvas.height = window.innerHeight * dpr;
      seqCanvas.style.width = `${window.innerWidth}px`;
      seqCanvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawImage(Math.round(currentFrame));
    };

    const preloadImages = () => {
      for (let i = 0; i < frameCount; i += 1) {
        const img = new Image();
        img.onload = () => {
          if (i === 0) resizeCanvas();
        };
        img.src = getFrameUrl(i);
        imageCache[i] = img;
      }
    };

    const animateFrames = () => {
      currentFrame += (targetFrame - currentFrame) * 0.08;
      if (Math.abs(targetFrame - currentFrame) < 0.1) {
        currentFrame = targetFrame;
        animationRunning = false;
      } else {
        requestAnimationFrame(animateFrames);
      }
      drawImage(Math.round(currentFrame));
    };

    const updateSequence = () => {
      const rect = sequence.getBoundingClientRect();
      const scrollable = sequence.offsetHeight - window.innerHeight;
      let progress = -rect.top / scrollable;
      progress = Math.max(0, Math.min(1, progress));
      const buyBtnHidePoint = window.innerHeight * 0.6;
      const textHidePoint = window.innerHeight * 0.8;
      if (progress > 0.15 && rect.bottom > buyBtnHidePoint) buyBtn?.classList.add("show");
      else buyBtn?.classList.remove("show");
      if (progress > 0.08 && rect.bottom > textHidePoint) seqText?.classList.add("show");
      else seqText?.classList.remove("show");
      if (reduce) {
        currentFrame = 0;
        drawImage(0);
        return;
      }
      targetFrame = progress * (frameCount - 1);
      if (!animationRunning) {
        animationRunning = true;
        requestAnimationFrame(animateFrames);
      }
    };

    preloadImages();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", updateSequence, { passive: true });
    window.addEventListener("load", resizeCanvas);
    updateSequence();

    if (nav) {
      const seqWatch = new IntersectionObserver(
        ([entry]) => nav.classList.toggle("is-seq", entry.isIntersecting),
        { threshold: 0.12 }
      );
      seqWatch.observe(sequence);
    }
  }
})();
