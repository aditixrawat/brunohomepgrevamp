(() => {
  // iOS Safari only applies :active (touch press feedback) when a touch listener exists.
  document.addEventListener("touchstart", () => {}, { passive: true });
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

  const sizeCarousels = () => {
    const width = window.innerWidth;
    const skuPages = width >= 768 ? 2 : 1;
    document.querySelectorAll(".sku-rail").forEach((rail) => {
      rail.slidesPerPage = skuPages;
      rail.style.setProperty("--scroll-hint", "0px");
    });
    const reels = document.querySelector("#reels-rail");
    if (reels) {
      reels.slidesPerPage = width >= 1024 ? 5 : width >= 768 ? 3 : 1;
      reels.style.setProperty("--scroll-hint", width >= 1024 ? "0px" : "16%");
    }
    if (lineup) {
      lineup.slidesPerPage = width >= 1100 ? 3 : width >= 720 ? 2 : 1;
      lineup.style.setProperty("--scroll-hint", width >= 1100 ? "7%" : width >= 720 ? "12%" : "0px");
    }
  };

  const bootCarousels = () => {
    if (lineup) lineup.autoplay = false;
    sizeCarousels();
  };

  if (customElements.get("wa-carousel")) bootCarousels();
  else customElements.whenDefined("wa-carousel").then(bootCarousels);
  window.addEventListener("resize", sizeCarousels);

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

  const lifestyle = [
    {
      handle: "verona-amore-leopardo",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/ca3f6376-3e64-4da0-9fce-a2a2d2af808f/0-2135e514090b78e5ec19caf1092366cd88942f2e1b10949d7a382ef814f242cb.png",
      scene: "The concert",
      line: "Lights up.",
      alt: "Woman at a concert wearing Verona Amore - Leopardo",
      who: "woman",
    },
    {
      handle: "radiante-heritage-blu",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/3ab7710a-685a-4ec4-9e92-43c5c407b089/0-a505c8474bf24d6340c9d70532589f380b1c7b5bd017174469750f5dbf69a83c.png",
      scene: "The wedding",
      line: "Before the vows.",
      alt: "Man at a wedding wearing Radiante Heritage - Blu",
      who: "man",
    },
    {
      handle: "metropolis-classic-blu-rosso",
      image: "assets/boardroom.jpg?v=1",
      scene: "The boardroom",
      line: "Meeting, closed.",
      alt: "Man in a boardroom wearing Metropolis Classic - Blu-Rosso",
      who: "man",
    },
    {
      handle: "lombardy-luxe-rosa-teal",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/b4f9c947-ed6c-4a7c-8073-333958bdd163/0-a0ceb0f0b3dbe00ae3199bdcac05af757333e4482dc4872bee176e16220e596a.png",
      scene: "Dinner",
      line: "Held at the table.",
      alt: "Woman at dinner wearing Lombardy Luxe - Rosa Teal",
      who: "woman",
    },
    {
      handle: "manzoni-perla-rosa",
      image: "assets/office-hours.jpg?v=1",
      scene: "Office hours",
      line: "Across the glass.",
      alt: "Woman in a boardroom wearing Manzoni - Perla Rosa",
      who: "woman",
    },
    {
      handle: "vittorio-chrono-verde",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/5c6ae885-c415-4ac4-935e-9aa3f63e8f80/0-3aadac1831ca7c1073c92c12adc42c8e1d99e7ca244b313db103d15484c7b6bd.png",
      scene: "The party",
      line: "Last round.",
      alt: "Man at a party wearing Vittorio Chrono - Verde",
      who: "man",
    },
    {
      handle: "metropolis-transizione-arancione",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/619fff74-d45d-4b12-88b4-695a13aca6d6/0-78facf8fc170d599b4594659a55276e1dbcf0c3a87db4e9dcfc108aaf0d97ac6.png",
      scene: "Pickleball",
      line: "Between points.",
      alt: "Man on a pickleball court wearing Metropolis Transizione - Arancione",
      who: "man",
    },
    {
      handle: "bruno-milano-ring-watch-for-women-and-girls-stretchable-adjustable-band-stainless-steel-jewellery-accessories",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/268a3fd7-f4f8-4b25-be5a-c9b308c1b0f9/0-b1ce78a9a1a6058187c30e2f12a94bf2328e2ad9a61cc44e5b0c3176c66e39e9.png",
      scene: "The wedding",
      line: "On one finger.",
      alt: "Woman at a wedding wearing the Ring Watch on her finger",
      who: "woman",
    },
    {
      handle: "ambrosiana-chic-con-braccialetto-verde",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/592539af-ec0e-42e0-9d0e-2c0f2ed8170c/0-41a044782b4e6ce41b4f37f1ef89ad8de6f91972d9f647f59ff72a764abb011c.png",
      scene: "Date night",
      line: "Watch and bracelet.",
      alt: "Woman on a date wearing Ambrosiana Chic con Braccialetto - Verde",
      who: "woman",
    },
    {
      handle: "sportiva-classic-blu",
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/84b3cbbe-fd88-4ca1-99e3-6b6ed973c1a5/0-814abc565b651120dd3c585fec7a2ac7921aea48cd662b28794b095fcc659afc.png",
      scene: "The drive",
      line: "Window down.",
      alt: "Man on a weekend drive wearing Sportiva Classic - Blu",
      who: "man",
    },
  ];

  const shuffle = (list) => {
    const next = list.slice();
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const hold = next[i];
      next[i] = next[j];
      next[j] = hold;
    }
    return next;
  };

  const editCard = (item) => {
    const link = document.createElement("a");
    link.className = "edit-card";
    link.href = `${STORE}/products/${item.handle}`;
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.alt;
    img.width = 1024;
    img.height = 1024;
    img.loading = "lazy";
    img.decoding = "async";
    const copy = document.createElement("div");
    copy.className = "edit-card-copy";
    const scene = document.createElement("span");
    scene.textContent = item.scene;
    const line = document.createElement("strong");
    line.textContent = item.line;
    copy.append(scene, line);
    link.append(img, copy);
    return link;
  };

  const editGrid = document.querySelector("[data-edit]");
  if (editGrid) {
    const men = shuffle(lifestyle.filter((item) => item.who === "man")).slice(0, 2);
    const women = shuffle(lifestyle.filter((item) => item.who === "woman")).slice(0, 2);
    const lead = Math.random() < 0.5 ? men : women;
    const follow = lead === men ? women : men;
    const picks = [lead[0], follow[0], lead[1], follow[1]];
    editGrid.replaceChildren(...picks.map(editCard));

    const mobileEdit = window.matchMedia("(max-width: 767px)");
    let editTimer = 0;
    let editResume = 0;
    let editInView = false;
    let editPaused = false;

    const editStep = () => {
      const card = editGrid.querySelector(".edit-card");
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(editGrid).columnGap || getComputedStyle(editGrid).gap) || 0;
      const stride = card.getBoundingClientRect().width + gap;
      const max = editGrid.scrollWidth - editGrid.clientWidth - 4;
      if (editGrid.scrollLeft >= max) {
        editGrid.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" });
      } else {
        editGrid.scrollBy({ left: stride, behavior: reduce ? "auto" : "smooth" });
      }
    };

    const stopEditAuto = () => {
      window.clearInterval(editTimer);
      editTimer = 0;
    };

    const startEditAuto = () => {
      stopEditAuto();
      if (reduce || !mobileEdit.matches || !editInView || editPaused) return;
      editTimer = window.setInterval(editStep, 3400);
    };

    const pauseEditAuto = () => {
      editPaused = true;
      stopEditAuto();
      window.clearTimeout(editResume);
      editResume = window.setTimeout(() => {
        editPaused = false;
        startEditAuto();
      }, 4800);
    };

    new IntersectionObserver(
      ([entry]) => {
        editInView = Boolean(entry?.isIntersecting);
        if (editInView) startEditAuto();
        else stopEditAuto();
      },
      { threshold: 0.35 }
    ).observe(editGrid);

    ["pointerdown", "touchstart", "wheel"].forEach((evt) => {
      editGrid.addEventListener(evt, pauseEditAuto, { passive: true });
    });

    const editNudge = (dir) => {
      const card = editGrid.querySelector(".edit-card");
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(editGrid).columnGap || getComputedStyle(editGrid).gap) || 0;
      const stride = card.getBoundingClientRect().width + gap;
      const max = editGrid.scrollWidth - editGrid.clientWidth - 4;
      pauseEditAuto();
      if (dir > 0 && editGrid.scrollLeft >= max) {
        editGrid.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" });
      } else if (dir < 0 && editGrid.scrollLeft <= 4) {
        editGrid.scrollTo({ left: max, behavior: reduce ? "auto" : "smooth" });
      } else {
        editGrid.scrollBy({ left: stride * dir, behavior: reduce ? "auto" : "smooth" });
      }
    };
    document.querySelector("[data-edit-prev]")?.addEventListener("click", () => editNudge(-1));
    document.querySelector("[data-edit-next]")?.addEventListener("click", () => editNudge(1));
    mobileEdit.addEventListener("change", () => {
      if (mobileEdit.matches) startEditAuto();
      else stopEditAuto();
    });
  }

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
    if (/gift bag|apple band|strap|jewell?ery|ring watch|workshop/i.test(title)) return false;
    if (type === "watch strap") return false;
    return type === "watch" || type === "watch set";
  };

  // handle -> [rating, review count], a snapshot of the Judge.me ratings kept on each Shopify product.
  const ratingsPromise = fetch("assets/ratings.json")
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => ({}));

  const ratingRow = ([value, count]) => {
    const row = document.createElement("span");
    row.className = "sku-rating";
    row.setAttribute("role", "img");
    row.setAttribute("aria-label", `Rated ${value.toFixed(1)} out of 5 from ${count} ${count === 1 ? "review" : "reviews"}`);
    const stars = document.createElement("span");
    stars.className = "stars";
    stars.style.setProperty("--r", value);
    stars.setAttribute("aria-hidden", "true");
    stars.textContent = "★★★★★";
    const score = document.createElement("span");
    score.className = "sku-rating-num";
    score.setAttribute("aria-hidden", "true");
    score.textContent = `${value.toFixed(1)} (${count})`;
    row.append(stars, score);
    return row;
  };

  // Browsable product images: arrows and dots on the card, and on devices with a
  // pointer the second image fades in on hover. Extra images load on demand.
  // Listeners are delegated because the carousel clones cards (clones lose listeners).
  const canHover = window.matchMedia("(hover: hover)");
  const ARROW_PATHS = {
    prev: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z",
    next: "M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z",
  };

  const showImage = (media, to) => {
    const imgs = [...media.querySelectorAll(":scope > img")];
    const dots = [...media.querySelectorAll(".sku-dots i")];
    const index = (to + imgs.length) % imgs.length;
    imgs.forEach((el, n) => {
      if (n === index && el.dataset.src) {
        el.src = el.dataset.src;
        delete el.dataset.src;
      }
      el.classList.toggle("is-active", n === index);
      if (dots[n]) dots[n].classList.toggle("is-on", n === index);
    });
    media.dataset.index = String(index);
  };

  const buildGallery = (first, srcs, title) => {
    const list = (srcs || []).filter(Boolean).slice(0, 5);
    if (list.length < 2) return null;
    const media = document.createElement("div");
    media.className = "sku-media";
    const imgs = list.map((src, i) => {
      if (i === 0) return first;
      const el = document.createElement("img");
      el.alt = `${title}, image ${i + 1}`;
      el.width = 900;
      el.height = 900;
      el.decoding = "async";
      if (i === 1) {
        el.loading = "lazy";
        el.src = src;
      } else {
        el.dataset.src = src;
      }
      return el;
    });
    const arrow = (dir) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `sku-nav sku-nav-${dir}`;
      btn.dataset.dir = dir;
      btn.setAttribute("aria-label", dir === "prev" ? "Previous image" : "Next image");
      btn.innerHTML = `<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="${ARROW_PATHS[dir]}"/></svg>`;
      return btn;
    };
    const dots = document.createElement("div");
    dots.className = "sku-dots";
    dots.setAttribute("aria-hidden", "true");
    list.forEach(() => dots.appendChild(document.createElement("i")));
    media.append(...imgs, arrow("prev"), arrow("next"), dots);
    showImage(media, 0);
    return media;
  };

  document.addEventListener("click", (event) => {
    const btn = event.target.closest?.(".sku-nav");
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    const media = btn.closest(".sku-media");
    media.dataset.browsed = "1";
    showImage(media, Number(media.dataset.index || 0) + (btn.dataset.dir === "prev" ? -1 : 1));
  }, true);

  const hoverSwap = (event, to) => {
    if (!canHover.matches) return;
    const media = event.target.closest?.(".sku-media");
    if (!media || media.dataset.browsed || media.contains(event.relatedTarget)) return;
    showImage(media, to);
  };
  document.addEventListener("mouseover", (event) => hoverSwap(event, 1));
  document.addEventListener("mouseout", (event) => hoverSwap(event, 0));

  const skuLink = ({ href, image, images, title, meta, rating, noRow }) => {
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
    const copy = document.createElement("span");
    copy.className = "sku-copy";
    const name = document.createElement("strong");
    name.textContent = title;
    copy.append(name);
    if (rating) {
      copy.append(ratingRow(rating));
    } else if (!noRow) {
      // Keep the same row height so names and prices line up across cards.
      const spacer = document.createElement("span");
      spacer.className = "sku-rating";
      spacer.setAttribute("aria-hidden", "true");
      copy.append(spacer);
    }
    if (meta) {
      const price = document.createElement("span");
      price.className = "sku-price";
      price.textContent = meta;
      copy.append(price);
    }
    const media = buildGallery(img, images, title);
    link.append(media || img, copy);
    return link;
  };

  const carouselItem = (node) => {
    const item = document.createElement("wa-carousel-item");
    item.append(node);
    return item;
  };

  const paintLoved = async (rail, products, showRatings = true) => {
    const ratings = await ratingsPromise;
    rail.replaceChildren(
      ...products.map((product) =>
        carouselItem(
          skuLink({
            href: `${STORE}/products/${product.handle}`,
            image: sized(product.images?.[0]?.src),
            images: (product.images || []).map((im) => sized(im.src)),
            title: product.title,
            meta: rs(product.variants?.[0]?.price),
            rating: showRatings ? ratings[product.handle] : undefined,
            noRow: !showRatings,
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

  const loadArrivals = async () => {
    const rail = document.querySelector('[data-rail="arrivals"]');
    if (!rail) return;
    try {
      let products = await fetchCollectionProducts("all");
      products = products
        .filter(isWatch)
        .sort((a, b) =>
          String(b.created_at || b.published_at || "").localeCompare(String(a.created_at || a.published_at || ""))
        )
        .slice(0, 10);
      if (!products.length) throw new Error("empty");
      await paintLoved(rail, products, false);
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
      await paintLoved(rail, products);
    } catch (error) {
      failRail("sellers");
    }
  };

  loadArrivals();
  loadSellers();

  const reveal = [...document.querySelectorAll(".promises, .series, .loved, .edit, .split, .view, .highlights, .reviews, .house, .reels, .lux-footer")];
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
        { threshold: 0, rootMargin: "0px 0px -15% 0px" }
      );
      reveal.forEach((el) => {
        el.classList.add("will-reveal");
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) markIn(el);
        else watchIn.observe(el);
      });
    }
  }

  // Italic headline words: mark each one when it lands on screen so its shine plays then.
  const ems = [...document.querySelectorAll("h1 em, h2 em, h3 em")];
  if ("IntersectionObserver" in window && !reduce) {
    const emWatch = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // On entry the shine starts (a few passes); on exit it resets so it plays again next time.
          entry.target.classList.toggle("em-in", entry.isIntersecting);
        });
      },
      { threshold: 0.6, rootMargin: "0px 0px -10% 0px" }
    );
    ems.forEach((el) => emWatch.observe(el));
  } else {
    ems.forEach((el) => el.classList.add("em-in"));
  }

  // Count-up numbers: run once when they scroll into view.
  const counters = [...document.querySelectorAll("[data-count]")];
  if (counters.length && !reduce && "IntersectionObserver" in window) {
    const run = (el) => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || "0", 10);
      const start = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (end * eased).toFixed(dec);
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = (0).toFixed(dec);
      requestAnimationFrame(tick);
      // If the tab is in the background and frames are paused, still land on the real number.
      setTimeout(() => {
        el.textContent = end.toFixed(dec);
      }, dur + 250);
    };
    const countWatch = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            countWatch.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countWatch.observe(el));
  }

  const faces = ["sora", "outfit", "syne", "onest", "urbanist", "archivo", "familjen"];
  const faceSelects = [...document.querySelectorAll("[data-face-select]")];
  const applyFace = window.applyBrunoFace || ((value) => {
    const face = faces.includes(value) ? value : "onest";
    document.documentElement.setAttribute("data-face", face);
    try {
      localStorage.setItem("bruno-face-2", face);
    } catch (e) {}
    faceSelects.forEach((el) => {
      if (el.value !== face) el.value = face;
    });
  });
  applyFace(document.documentElement.getAttribute("data-face") || "onest");
  faceSelects.forEach((el) => {
    el.addEventListener("input", () => applyFace(el.value));
    el.addEventListener("change", () => applyFace(el.value));
  });

  const sequence = document.getElementById("sequence-section");
  const seqVideo = document.getElementById("sequence-video");
  if (sequence && seqVideo) {
    const buyBtn = sequence.querySelector(".sequence-buy-btn");
    const seqText = sequence.querySelector(".bmvidtext");
    let targetTime = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (reduce || !seqVideo.duration) return;
      if (Math.abs(seqVideo.currentTime - targetTime) < 0.03) return;
      seqVideo.currentTime = targetTime;
    };

    const updateSequence = () => {
      const rect = sequence.getBoundingClientRect();
      const scrollable = sequence.offsetHeight - window.innerHeight;
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      let progress = scrollable > 0 ? -rect.top / scrollable : 0;
      progress = Math.max(0, Math.min(1, progress));
      const buyHide = window.innerHeight * 0.6;
      const textHide = window.innerHeight * 0.8;
      if (onScreen && progress > 0.15 && rect.bottom > buyHide) buyBtn?.classList.add("show");
      else buyBtn?.classList.remove("show");
      if (onScreen && progress > 0.08 && rect.bottom > textHide) seqText?.classList.add("show");
      else seqText?.classList.remove("show");
      if (reduce || !onScreen) return;
      const duration = seqVideo.duration || 10;
      targetTime = Math.min(Math.max(duration - 0.05, 0), progress * duration);
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const arm = () => {
      seqVideo.pause();
      updateSequence();
    };
    seqVideo.addEventListener("loadedmetadata", arm);
    window.addEventListener("scroll", updateSequence, { passive: true });
    window.addEventListener("resize", updateSequence);

    // Picked when loading starts (not at page load), so it matches the screen the visitor has by then.
    const pickSource = () =>
      (window.matchMedia("(max-width: 767px)").matches && seqVideo.dataset.srcMobile) || seqVideo.dataset.src;
    let direct = "";

    // Scrubbing needs the whole file locally, so fetch it as a blob (a few MB), but
    // only once the section is close to the screen, with a timeout and a plain-src
    // fallback so a slow or failed fetch never leaves the section stuck on the poster.
    const useSrc = (src) => {
      // iOS (and in-app browsers like WhatsApp) ignore preload="none" and never fire
      // loadedmetadata unless the element is told to load.
      seqVideo.preload = "auto";
      seqVideo.src = src;
      seqVideo.load();
    };
    const loadVideo = (attempt = 0) => {
      const controller = "AbortController" in window ? new AbortController() : null;
      const timer = window.setTimeout(() => controller?.abort(), 25000);
      fetch(direct, controller ? { signal: controller.signal } : undefined)
        .then((res) => {
          if (!res.ok) throw new Error("video");
          return res.blob();
        })
        .then((blob) => useSrc(URL.createObjectURL(blob)))
        .catch(() => {
          if (attempt < 1) loadVideo(attempt + 1);
          else useSrc(direct);
        })
        .finally(() => window.clearTimeout(timer));
    };
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      direct = pickSource();
      loadVideo();
    };
    if ("IntersectionObserver" in window) {
      const near = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          near.disconnect();
          start();
        }
      }, { rootMargin: "200% 0px" });
      near.observe(sequence);
    } else {
      start();
    }

    // iOS only paints seeked frames of a muted video after it has been played once.
    const prime = () => {
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("scroll", prime);
      const play = seqVideo.play();
      if (play && play.then) play.then(() => seqVideo.pause()).catch(() => {});
    };
    window.addEventListener("touchstart", prime, { passive: true, once: true });
    window.addEventListener("scroll", prime, { passive: true, once: true });
  }

  // In-app browsers (WhatsApp, Instagram) often skip autoplay: nudge the reels when they scroll into view.
  const reelVideos = [...document.querySelectorAll(".reels video")];
  if (reelVideos.length && "IntersectionObserver" in window) {
    const kick = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.muted = true;
          const play = video.play();
          if (play && play.catch) play.catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });
    reelVideos.forEach((video) => kick.observe(video));
  }

  document.querySelectorAll(".lux-footer .ft-acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.innerWidth > 991) return;
      const col = btn.closest(".ft-col");
      const open = col.classList.toggle("active");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
