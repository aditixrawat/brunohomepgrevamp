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
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/8a390908-f64d-4423-ad3c-a6a4f52d6ba3/0-064df79eeed7677a8daa5e5b02341c19d3c2222f40dade996881143026ea4dc0.png",
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
      image:
        "https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/3f7a6ea5-554e-44d8-a160-8e6ca0bac1c2/0-4e80dfc263a9f4c51bbd92ceb245c547e763861ede211207f7f5a25268f92823.png",
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
    const copy = document.createElement("span");
    copy.className = "sku-copy";
    const name = document.createElement("strong");
    name.textContent = title;
    copy.append(name);
    if (meta) {
      const price = document.createElement("span");
      price.className = "sku-price";
      price.textContent = meta;
      copy.append(price);
    }
    link.append(img, copy);
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

  const reveal = [...document.querySelectorAll(".promises, .loved, .edit, .split, .view, .highlights, .reviews, .house, .reels, .lux-footer")];
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
        { threshold: 0.15, rootMargin: "0px 0px 12% 0px" }
      );
      reveal.forEach((el) => {
        el.classList.add("will-reveal");
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) markIn(el);
        else watchIn.observe(el);
      });
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

    const mobileCut = window.matchMedia("(max-width: 767px)").matches;
    const direct = (mobileCut && seqVideo.dataset.srcMobile) || seqVideo.dataset.src;
    fetch(direct)
      .then((res) => {
        if (!res.ok) throw new Error("video");
        return res.blob();
      })
      .then((blob) => {
        seqVideo.src = URL.createObjectURL(blob);
      })
      .catch(arm);
  }

  const reviews = document.querySelector(".reviews");
  const reviewSwitch = reviews?.querySelector(".reviews-switch");
  if (reviews && reviewSwitch) {
    reviewSwitch.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !reviewSwitch.contains(button)) return;
      const panel = button.dataset.reviews === "panel";
      reviews.classList.toggle("is-panel", panel);
      reviewSwitch.querySelectorAll("button").forEach((item) => {
        const on = item === button;
        item.classList.toggle("is-on", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
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
