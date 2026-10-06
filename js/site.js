(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector("[data-nav]");
  const hero = document.querySelector(".hero");
  const media = document.querySelector(".hero-media");
  const video = document.querySelector("[data-hero-video]");
  const frames = [...document.querySelectorAll("[data-frame]")];
  const lineup = document.querySelector("#lineup");
  const menu = document.querySelector(".nav-menu");
  const drawer = document.querySelector("#site-menu");

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

  const slideEls = () => [...(lineup?.querySelectorAll("wa-carousel-item") || [])];
  let index = 0;

  const goSlide = (dest) => {
    const total = slideEls().length;
    if (!total || !lineup?.goToSlide) return;
    index = (dest + total) % total;
    lineup.goToSlide(index, reduce ? "auto" : "smooth");
    paintHighlightPager(Boolean(lineup.autoplay));
  };

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
    const pages = slides.length;
    if (!pages) {
      pips.replaceChildren();
      return;
    }
    const current = index;
    pips.replaceChildren(
      ...Array.from({ length: pages }, (_, i) => {
        const pip = document.createElement("button");
        pip.type = "button";
        pip.className = "rail-pager-pip";
        pip.setAttribute("aria-label", `Go to watch ${i + 1}`);
        if (i === index) {
          pip.classList.add("is-on");
          if (playing) pip.classList.add("is-playing");
          pip.append(document.createElement("i"));
        }
        pip.addEventListener("click", () => goSlide(i));
        return pip;
      })
    );
  };

  const sizeCarousels = () => {
    const width = window.innerWidth;
    const skuPages = width >= 768 ? 2 : 1;
    document.querySelectorAll(".sku-rail").forEach((rail) => {
      rail.slidesPerPage = skuPages;
      rail.style.setProperty("--scroll-hint", width >= 768 ? "0px" : "14%");
    });
    const reels = document.querySelector("#reels-rail");
    if (reels) {
      reels.slidesPerPage = width >= 1024 ? 5 : width >= 768 ? 3 : 1;
      reels.style.setProperty("--scroll-hint", width >= 1024 ? "0px" : "16%");
    }
    if (lineup) lineup.style.setProperty("--scroll-hint", width >= 768 ? "30%" : "0px");
  };

  const bootCarousels = () => {
    if (reduce && lineup) lineup.autoplay = false;
    sizeCarousels();
    setPagerPlaying(!reduce && Boolean(lineup?.autoplay));
    paintHighlightPager(!reduce && Boolean(lineup?.autoplay));
  };

  if (customElements.get("wa-carousel")) bootCarousels();
  else customElements.whenDefined("wa-carousel").then(bootCarousels);
  window.addEventListener("resize", sizeCarousels);

  lineup?.addEventListener("wa-slide-change", (event) => {
    const nextIndex = Number(event.detail?.index);
    if (Number.isInteger(nextIndex)) index = nextIndex;
    paintHighlightPager(Boolean(lineup.autoplay));
  });

  document.querySelectorAll("[data-carousel-prev], [data-carousel-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-carousel-prev") || button.getAttribute("data-carousel-next");
      const carousel = document.getElementById(id);
      if (!carousel) return;
      const behavior = reduce ? "auto" : "smooth";
      if (button.hasAttribute("data-carousel-prev")) carousel.previous?.(behavior);
      else carousel.next?.(behavior);
    });
  });

  drawer?.addEventListener("wa-show", () => menu?.setAttribute("aria-expanded", "true"));
  drawer?.addEventListener("wa-after-hide", () => menu?.setAttribute("aria-expanded", "false"));
  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      drawer.open = false;
    });
  });

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

  const carouselItem = (node) => {
    const item = document.createElement("wa-carousel-item");
    item.append(node);
    return item;
  };

  const paintLoved = (rail, products) => {
    rail.replaceChildren(
      ...products.map((product) =>
        carouselItem(
          skuLink({
            href: `${STORE}/products/${product.handle}`,
            image: sized(product.images?.[0]?.src),
            title: product.title,
            meta: rs(product.variants?.[0]?.price),
          })
        )
      )
    );
    rail.setAttribute("aria-busy", "false");
  };

  const failRail = (name) => {
    const rail = document.querySelector(`[data-rail="${name}"]`);
    const note = document.querySelector(`[data-${name}-note]`);
    if (rail) {
      rail.replaceChildren();
      rail.setAttribute("aria-busy", "false");
    }
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
    if (!lineup) return;
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
      if (!families.length) return;
      lineup.replaceChildren(...families.map((entry) => carouselItem(makeHighlightSlide(entry))));
      index = 0;
      lineup.goToSlide?.(0, "auto");
      paintHighlightPager(Boolean(lineup.autoplay));
    } catch (error) {
      paintHighlightPager(Boolean(lineup.autoplay));
    }
  };

  const loadArrivals = async () => {
    const rail = document.querySelector('[data-rail="arrivals"]');
    if (!rail) return;
    try {
      let products = await fetchCollectionProducts("all");
      products = products
        .filter(isWatch)
        .sort((a, b) =>
          String(b.published_at || b.created_at || "").localeCompare(String(a.published_at || a.created_at || ""))
        )
        .slice(0, 10);
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
      const products = (await getSellers()).slice(0, 10);
      if (!products.length) throw new Error("empty");
      paintLoved(rail, products);
    } catch (error) {
      failRail("sellers");
    }
  };

  loadArrivals();
  loadSellers();
  loadHighlights();

  document.querySelector('[data-pager-toggle="highlights"]')?.addEventListener("click", () => {
    if (!lineup) return;
    lineup.autoplay = !lineup.autoplay;
    setPagerPlaying(Boolean(lineup.autoplay));
    paintHighlightPager(Boolean(lineup.autoplay));
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
})();
