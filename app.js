(() => {
  const { categories, regions, places } = window.LEONIDA;
  const NS = "http://www.w3.org/2000/svg";
  const W = 1000, H = 1300;
  const MIN_K = 1, MAX_K = 9;
  const PLAYER = { x: 780, y: 812 };
  const KM_PER_UNIT = 0.06; // échelle fantaisiste : 1000 unités ≈ 60 km

  const $ = (s) => document.querySelector(s);
  const svg = $("#map");
  const world = $("#world");
  const wrap = $("#map-wrap");
  const markersLayer = $("#markers");
  const wpLayer = $("#waypoint-layer");
  const labels = $("#labels");
  const labelEls = [...labels.querySelectorAll("text")].map((el) => ({ el, x: +el.getAttribute("x"), y: +el.getAttribute("y") }));

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  /* ---------------- Vue (pan / zoom) ---------------- */
  const view = { k: 1, tx: 0, ty: 0 };
  let anim = null;

  function clampView() {
    const m = 180;
    view.k = Math.min(MAX_K, Math.max(MIN_K, view.k));
    view.tx = Math.min(m, Math.max(W - W * view.k - m, view.tx));
    view.ty = Math.min(m, Math.max(H - H * view.k - m, view.ty));
  }

  function render() {
    clampView();
    world.setAttribute("transform", `translate(${view.tx} ${view.ty}) scale(${view.k})`);
    const ctm = svg.getScreenCTM();
    const upp = ctm ? 1 / ctm.a : 1; // unités SVG par pixel écran
    const s = (upp / view.k) * Math.min(1.05, Math.max(0.68, wrap.clientWidth / 900));
    for (const m of markerEls) m.g.setAttribute("transform", `translate(${m.p.x} ${m.p.y}) scale(${s})`);
    if (waypoint) drawWaypoint();
    playerG.setAttribute("transform", `translate(${PLAYER.x} ${PLAYER.y}) scale(${s})`);
    const ls = Math.pow(view.k, -0.65);
    for (const t of labelEls) t.el.setAttribute("transform", `translate(${t.x} ${t.y}) scale(${ls}) translate(${-t.x} ${-t.y})`);
    labels.style.opacity = view.k > 6 ? 0.5 : 1;
  }

  function toSvg(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  function toWorld(clientX, clientY) {
    const p = toSvg(clientX, clientY);
    return { x: (p.x - view.tx) / view.k, y: (p.y - view.ty) / view.k };
  }

  function zoomAt(p, factor) {
    cancelAnim();
    const k = Math.min(MAX_K, Math.max(MIN_K, view.k * factor));
    view.tx = p.x - (p.x - view.tx) * (k / view.k);
    view.ty = p.y - (p.y - view.ty) * (k / view.k);
    view.k = k;
    render();
  }

  function cancelAnim() { if (anim) cancelAnimationFrame(anim); anim = null; }

  function flyTo(x, y, k, ms = 750) {
    cancelAnim();
    const from = { ...view };
    k = Math.min(MAX_K, Math.max(MIN_K, k));
    const to = { k, tx: W / 2 - x * k, ty: H / 2 - y * k };
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms), e = ease(t);
      view.k = from.k + (to.k - from.k) * e;
      view.tx = from.tx + (to.tx - from.tx) * e;
      view.ty = from.ty + (to.ty - from.ty) * e;
      render();
      anim = t < 1 ? requestAnimationFrame(step) : null;
    };
    anim = requestAnimationFrame(step);
  }
  const resetView = () => flyTo(W / 2, H / 2, 1);

  // Molette
  wrap.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomAt(toSvg(e.clientX, e.clientY), Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });

  // Glisser + pincer
  const pointers = new Map();
  let moved = 0, last = null, pinch = null;

  wrap.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".map-ui, .waypoint-bar")) return;
    wrap.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    cancelAnim();
    moved = 0;
    if (pointers.size === 1) { last = { x: e.clientX, y: e.clientY }; wrap.classList.add("dragging"); }
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  });

  wrap.addEventListener("pointermove", (e) => {
    const w = toWorld(e.clientX, e.clientY);
    coordsEl.textContent = `X ${String(Math.round(w.x)).padStart(3, "0")} · Y ${String(Math.round(w.y)).padStart(3, "0")}`;
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(toSvg((a.x + b.x) / 2, (a.y + b.y) / 2), d / pinch.d);
      pinch.d = d; moved += 10;
      return;
    }
    if (pointers.size === 1 && last) {
      const p0 = toSvg(last.x, last.y), p1 = toSvg(e.clientX, e.clientY);
      view.tx += p1.x - p0.x; view.ty += p1.y - p0.y;
      moved += Math.abs(e.clientX - last.x) + Math.abs(e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      render();
    }
  });

  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 1) { const [p] = pointers.values(); last = { ...p }; }
    if (pointers.size === 0) { last = null; wrap.classList.remove("dragging"); }
  };
  wrap.addEventListener("pointerup", endPointer);
  wrap.addEventListener("pointercancel", endPointer);

  // Double-clic : waypoint
  wrap.addEventListener("dblclick", (e) => {
    if (e.target.closest(".map-ui, .waypoint-bar, .marker")) return;
    e.preventDefault();
    setWaypoint(toWorld(e.clientX, e.clientY));
  });

  $("#zoom-in").onclick = () => zoomAt({ x: W / 2, y: H / 2 }, 1.6);
  $("#zoom-out").onclick = () => zoomAt({ x: W / 2, y: H / 2 }, 1 / 1.6);
  $("#zoom-reset").onclick = resetView;
  window.addEventListener("resize", render);

  /* ---------------- Joueur ---------------- */
  const playerG = el("g", { class: "player" }, wpLayer.parentNode);
  el("circle", { r: 13, fill: "#fff", "fill-opacity": ".15" }, playerG);
  el("path", { d: "M0-9L7 8L0 4L-7 8Z", fill: "#fff", stroke: "#1b0b2a", "stroke-width": 1.5, transform: "rotate(-30)" }, playerG);

  /* ---------------- Marqueurs ---------------- */
  const markerEls = [];
  const hiddenCats = new Set();
  let activeMarker = null;

  for (const p of places) {
    const c = categories[p.cat];
    const g = el("g", { class: "marker", "data-id": p.id }, markersLayer);
    el("circle", { class: "halo", r: 18, fill: c.color }, g);
    el("circle", { class: "pin", r: 11, fill: "#1b0b2a", stroke: c.color, "stroke-width": 2.6 }, g);
    el("path", { d: c.icon, fill: c.color, transform: "scale(1.25)" }, g);
    const tip = el("g", { class: "tip", transform: "translate(0 -22)" }, g);
    const tw = p.name.length * 6.4 + 18;
    el("rect", { x: -tw / 2, y: -12, width: tw, height: 22, rx: 11, fill: "#1b0b2a", stroke: c.color, "stroke-width": 1.2 }, tip);
    const t = el("text", { y: 3, "text-anchor": "middle" }, tip);
    t.textContent = p.name;

    g.addEventListener("click", (e) => {
      e.stopPropagation();
      if (moved > 6) return;
      selectPlace(p, false);
    });
    markerEls.push({ g, p });
  }

  function selectPlace(p, fly = true) {
    if (activeMarker) activeMarker.classList.remove("active");
    const m = markerEls.find((m) => m.p === p);
    activeMarker = m.g;
    activeMarker.classList.add("active");
    markersLayer.appendChild(activeMarker); // au premier plan
    if (hiddenCats.has(p.cat)) toggleCat(p.cat, false);

    const c = categories[p.cat];
    $("#info-tag").textContent = c.label.replace(/s$/, "");
    $("#info-tag").style.background = c.color;
    $("#info-title").textContent = p.name;
    $("#info-region").textContent = p.region ? regions[p.region].name : "Centre de Leonida";
    $("#info-desc").textContent = p.desc;
    $("#info").hidden = false;
    $("#info-route").onclick = () => setWaypoint({ x: p.x, y: p.y }, p.name);
    if (fly) flyTo(p.x, p.y, Math.max(view.k, 4));
  }

  function closeInfo() {
    $("#info").hidden = true;
    if (activeMarker) activeMarker.classList.remove("active");
    activeMarker = null;
  }
  $("#info-close").onclick = closeInfo;

  /* ---------------- Filtres ---------------- */
  const filtersEl = $("#filters");
  const filterBtns = {};
  for (const [key, c] of Object.entries(categories)) {
    const n = places.filter((p) => p.cat === key).length;
    const b = document.createElement("button");
    b.className = "filter";
    b.innerHTML = `<span class="dot" style="color:${c.color};background:#1b0b2a;border:2px solid ${c.color}">
        <svg viewBox="-6 -6 12 12"><path d="${c.icon}" fill="${c.color}"/></svg></span>
      <span>${c.label}</span><span class="count">${n}</span>`;
    b.onclick = () => toggleCat(key);
    filtersEl.appendChild(b);
    filterBtns[key] = b;
  }
  const actions = document.createElement("div");
  actions.className = "filter-actions";
  actions.innerHTML = `<button data-a="all">Tout afficher</button><button data-a="none">Tout masquer</button>`;
  actions.onclick = (e) => {
    const a = e.target.dataset.a;
    if (!a) return;
    for (const k in categories) toggleCat(k, a === "none");
  };
  filtersEl.appendChild(actions);

  function toggleCat(key, hide = !hiddenCats.has(key)) {
    hide ? hiddenCats.add(key) : hiddenCats.delete(key);
    filterBtns[key].classList.toggle("off", hide);
    for (const m of markerEls) if (m.p.cat === key) m.g.classList.toggle("hidden", hide);
  }

  /* ---------------- Régions ---------------- */
  const regionPaths = [...document.querySelectorAll(".region")];
  function focusRegion(id) {
    const r = regions[id];
    regionPaths.forEach((p) => p.classList.toggle("active", p.dataset.region === id));
    flyTo(r.center[0], r.center[1], r.zoom);
  }
  regionPaths.forEach((p) => {
    p.style.color = p.getAttribute("fill");
    p.addEventListener("click", () => { if (moved <= 6) focusRegion(p.dataset.region); });
  });

  const chipBox = $("#region-list");
  const cardBox = $("#region-cards");
  for (const [id, r] of Object.entries(regions)) {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.style.setProperty("--c", r.color);
    chip.textContent = r.name;
    chip.onclick = () => focusRegion(id);
    chipBox.appendChild(chip);

    const count = places.filter((p) => p.region === id).length;
    const card = document.createElement("button");
    card.className = "rcard";
    card.style.setProperty("--c", r.color);
    card.innerHTML = `<h3>${r.name}</h3><div class="tagline">${r.tagline}</div><p>${r.desc}</p><span class="go">${count} lieux · voir sur la carte</span>`;
    card.onclick = () => {
      $("#carte").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => focusRegion(id), 450);
    };
    cardBox.appendChild(card);
  }

  /* ---------------- Waypoint ---------------- */
  let waypoint = null;
  const coordsEl = $("#coords");
  const wpBar = $("#waypoint-bar");

  function setWaypoint(pt, name) {
    waypoint = { ...pt, name };
    drawWaypoint();
    const km = (Math.hypot(pt.x - PLAYER.x, pt.y - PLAYER.y) * KM_PER_UNIT).toFixed(1);
    $("#waypoint-text").textContent = `${name ? name + " · " : "Waypoint · "}${km} km`;
    wpBar.hidden = false;
  }

  function drawWaypoint() {
    wpLayer.innerHTML = "";
    if (!waypoint) return;
    const ctm = svg.getScreenCTM();
    const s = (ctm ? 1 / ctm.a : 1) / view.k;
    el("path", {
      class: "route",
      d: `M${PLAYER.x} ${PLAYER.y}L${waypoint.x} ${waypoint.y}`,
      stroke: "#ff2e88", "stroke-width": 4 * s, fill: "none",
      "stroke-dasharray": `${10 * s} ${8 * s}`, "stroke-linecap": "round", filter: "url(#glow)"
    }, wpLayer);
    const g = el("g", { class: "waypoint", transform: `translate(${waypoint.x} ${waypoint.y}) scale(${s})` }, wpLayer);
    el("circle", { class: "ring", r: 10, fill: "none", stroke: "#ff2e88", "stroke-width": 3 }, g);
    el("path", { d: "M0 0C-8-10-12-16-12-22A12 12 0 0 1 12-22C12-16 8-10 0 0Z", fill: "#ff2e88", stroke: "#fff", "stroke-width": 2 }, g);
    el("circle", { cx: 0, cy: -22, r: 4.5, fill: "#fff" }, g);
  }

  $("#waypoint-clear").onclick = () => { waypoint = null; wpLayer.innerHTML = ""; wpBar.hidden = true; };

  /* ---------------- Recherche ---------------- */
  const search = $("#search");
  const results = $("#search-results");
  let resultItems = [], resultIdx = 0;

  function runSearch() {
    const q = norm(search.value.trim());
    results.innerHTML = "";
    if (!q) { results.hidden = true; return; }
    const regionHits = Object.entries(regions)
      .filter(([, r]) => norm(r.name).includes(q))
      .map(([id, r]) => ({ label: r.name, sub: "Région", color: r.color, go: () => focusRegion(id) }));
    const placeHits = places
      .filter((p) => norm(p.name).includes(q) || norm(p.desc).includes(q))
      .map((p) => ({ label: p.name, sub: categories[p.cat].label, color: categories[p.cat].color, go: () => selectPlace(p) }));
    resultItems = [...regionHits, ...placeHits].slice(0, 8);
    resultIdx = 0;
    if (!resultItems.length) {
      results.innerHTML = `<li style="cursor:default;color:var(--muted)">Aucun résultat</li>`;
    }
    resultItems.forEach((r, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="wp-dot" style="background:${r.color};box-shadow:0 0 8px ${r.color}"></span>${r.label}<small>${r.sub}</small>`;
      if (i === 0) li.classList.add("active");
      li.onclick = () => pick(i);
      results.appendChild(li);
    });
    results.hidden = false;
  }
  function pick(i) {
    const r = resultItems[i];
    if (!r) return;
    r.go();
    results.hidden = true;
    search.blur();
  }
  search.addEventListener("input", runSearch);
  search.addEventListener("keydown", (e) => {
    const lis = results.querySelectorAll("li");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      resultIdx = (resultIdx + (e.key === "ArrowDown" ? 1 : -1) + resultItems.length) % resultItems.length;
      lis.forEach((li, i) => li.classList.toggle("active", i === resultIdx));
    } else if (e.key === "Enter") {
      pick(resultIdx);
    } else if (e.key === "Escape") {
      search.value = ""; results.hidden = true; search.blur();
    }
  });

  /* ---------------- Clavier ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.target === search) return;
    if (e.key === "+" || e.key === "=") zoomAt({ x: W / 2, y: H / 2 }, 1.4);
    else if (e.key === "-") zoomAt({ x: W / 2, y: H / 2 }, 1 / 1.4);
    else if (e.key === "0") resetView();
    else if (e.key === "/") { e.preventDefault(); $("#carte").scrollIntoView({ behavior: "smooth" }); search.focus(); }
    else if (e.key === "Escape") closeInfo();
  });

  render();
})();
