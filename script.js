async function loadMenu() {
  const res = await fetch("./menu.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar menu.json");
  return await res.json();
}

function setTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.bg || "#0b0f14");
  root.style.setProperty("--card", theme.card || "#0f1621");
  root.style.setProperty("--text", theme.text || "#e8eef7");
  root.style.setProperty("--muted", theme.muted || "#9bb0c6");
  root.style.setProperty("--primary", theme.primary || "#21c57a");
  root.style.setProperty("--primary2", theme.primary2 || "#4aa3ff");
  root.style.setProperty("--accent", theme.accent || "#f7b267");
}

function waLink(phoneDigits, message) {
  const msg = encodeURIComponent(message || "");
  return `https://wa.me/${phoneDigits}?text=${msg}`;
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function mountText(id, text) {
  const node = document.querySelector(id);
  if (node && typeof text === "string") node.textContent = text;
}

function mountHTML(id, html) {
  const node = document.querySelector(id);
  if (node) node.innerHTML = html;
}

function renderHighlights(highlights = []) {
  const wrap = document.querySelector("#highlights");
  if (!wrap) return;
  wrap.innerHTML = "";
  highlights.slice(0, 6).forEach((h) => {
    wrap.appendChild(
      el(`
        <div class="mini-card">
          <div class="mini-title">${h.title || ""}</div>
          <div class="mini-text">${h.text || ""}</div>
        </div>
      `)
    );
  });
}

function renderDoses(doses = []) {
  const wrap = document.querySelector("#doses");
  if (!wrap) return;
  wrap.innerHTML = "";
  doses.forEach((d) => {
    wrap.appendChild(
      el(`
        <div class="card dose">
          <div class="dose-top">
            <div class="badge">${d.grams || ""}</div>
            <div class="dose-name">${d.name || ""}</div>
          </div>
          <div class="muted">${d.desc || ""}</div>
        </div>
      `)
    );
  });
}

function renderWeek(week) {
  if (!week) return;

  mountText("#weekTitle", week.title || "Ementa");
  mountText("#weekSubtitle", week.subtitle || "");

  const tabs = document.querySelector("#menuTabs");
  const panel = document.querySelector("#menuPanel");
  if (!tabs || !panel) return;

  const cats = week.categories || [];
  tabs.innerHTML = "";
  panel.innerHTML = "";

  let activeKey = cats[0]?.key;

  function draw() {
    // tabs
    tabs.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("active", b.dataset.key === activeKey)
    );

    // panel
    const cat = cats.find((c) => c.key === activeKey) || cats[0];
    if (!cat) return;

    const items = cat.items || [];
    const heroImg = cat.image ? `<img class="menu-hero-img" src="${cat.image}" alt="${cat.title || ""}">` : "";

    panel.innerHTML = `
      <div class="menu-hero">
        <div>
          <div class="kicker">Ementa</div>
          <h3 class="panel-title">${cat.title || ""}</h3>
          <div class="muted">Edite o ficheiro menu.json e o site atualiza automaticamente.</div>
        </div>
        ${heroImg}
      </div>

      <div class="grid items-grid"></div>
    `;

    const grid = panel.querySelector(".items-grid");
    items.forEach((it) => {
      const photo = it.photo
        ? `<div class="food-photo"><img src="${it.photo}" alt="${it.name || ""}"></div>`
        : `<div class="food-photo placeholder"></div>`;

      grid.appendChild(
        el(`
          <div class="card item-card">
            ${photo}
            <div class="item-body">
              <div class="item-top">
                <div class="code">${it.code || ""}</div>
                <div class="price">${it.price || ""}</div>
              </div>
              <div class="item-title">${it.name || ""}</div>
              <div class="muted">${it.desc || ""}</div>
              <a class="btn small" target="_blank" rel="noopener"
                 href="${waLink(window.__phone, `Olá Marmitadas Dadá! Quero pedir: ${it.code || ""} - ${it.name || ""}.`) }">
                Pedir no WhatsApp
              </a>
            </div>
          </div>
        `)
      );
    });
  }

  // build tabs
  cats.forEach((c) => {
    const b = el(`<button class="tab" data-key="${c.key}">${c.title || c.key}</button>`);
    b.addEventListener("click", () => {
      activeKey = c.key;
      draw();
    });
    tabs.appendChild(b);
  });

  draw();
}

function renderPacks(packs = []) {
  const wrap = document.querySelector("#packs");
  if (!wrap) return;
  wrap.innerHTML = "";

  packs.forEach((p) => {
    const img = p.image
      ? `<div class="pack-img"><img src="${p.image}" alt="${p.title || ""}"></div>`
      : `<div class="pack-img placeholder"></div>`;

    wrap.appendChild(
      el(`
        <div class="card pack">
          ${img}
          <div class="pack-body">
            <div class="pack-title">${p.title || ""}</div>
            <div class="muted">${p.note || ""}</div>
            <div class="pack-row">
              <div class="qty">${p.qty ? `${p.qty} refeições` : ""}</div>
              <div class="price">${p.price || ""}</div>
            </div>
            <a class="btn" target="_blank" rel="noopener"
               href="${waLink(window.__phone, `Olá Marmitadas Dadá! Quero o ${p.title || "pack"}.`)}">
              Encomendar
            </a>
          </div>
        </div>
      `)
    );
  });
}

function renderDelivery(delivery) {
  if (!delivery) return;
  mountText("#deliveryTitle", delivery.title || "Entregas");

  const wrap = document.querySelector("#deliveryCards");
  if (!wrap) return;
  wrap.innerHTML = "";
  (delivery.cards || []).forEach((c) => {
    wrap.appendChild(
      el(`
        <div class="card">
          <div class="card-title">${c.title || ""}</div>
          <div class="muted">${c.text || ""}</div>
        </div>
      `)
    );
  });
}

function renderPrep(prep) {
  if (!prep) return;
  mountText("#prepTitle", prep.title || "Como preparar");

  const ul = document.querySelector("#prepSteps");
  if (!ul) return;
  ul.innerHTML = "";
  (prep.steps || []).forEach((s) => ul.appendChild(el(`<li>${s}</li>`)));
}

function renderContact(contact, brand) {
  if (!contact) return;

  mountText("#contactTitle", contact.title || "Contacto");

  const w = document.querySelector("#contactWhatsapp");
  if (w) {
    w.textContent = contact.phoneLabel || "";
    w.href = waLink(window.__phone, brand?.whatsappMessage || "Olá! Quero fazer uma encomenda.");
  }

  mountText("#contactEmail", contact.email || "");
  mountText("#contactAddress", contact.address || "");
}

function setupTopCTA(brand) {
  const btn = document.querySelector("#ctaOrder");
  const btn2 = document.querySelector("#ctaOrder2");
  const msg = brand?.whatsappMessage || "Olá! Quero fazer uma encomenda.";
  const link = waLink(window.__phone, msg);

  if (btn) btn.href = link;
  if (btn2) btn2.href = link;
}

function setupNav() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

(async function init() {
  try {
    const data = await loadMenu();

    // global phone digits
    window.__phone = (data.brand?.whatsapp || "").replace(/\D/g, "") || "351928494074";

    setTheme(data.theme);

    mountText("#brandName", data.brand?.name || "Marmitadas Dadá");
    mountText("#brandTagline", data.brand?.tagline || "");
    mountText("#deliveryNote", data.brand?.deliveryNote || "");

    setupTopCTA(data.brand);
    setupNav();

    renderHighlights(data.highlights);
    renderDoses(data.doses);
    renderWeek(data.week);
    renderPacks(data.packs);

    mountText("#aboutTitle", data.sections?.about?.title || "Sobre");
    mountText("#aboutText", data.sections?.about?.text || "");

    renderDelivery(data.sections?.delivery);
    renderPrep(data.sections?.prep);
    renderContact(data.sections?.contact, data.brand);
  } catch (err) {
    console.error(err);
    const fallback = document.querySelector("#appError");
    if (fallback) fallback.style.display = "block";
  }
})();
