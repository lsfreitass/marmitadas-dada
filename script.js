const $ = (s) => document.querySelector(s);

function makeWhatsAppLink(phoneE164, message) {
  const phone = phoneE164.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

async function init() {
  const res = await fetch("menu.json", { cache: "no-store" });
  const data = await res.json();

  document.title = data.brand;
  $("#year").textContent = new Date().getFullYear();

  $("#weekLabel").textContent = data.weekLabel;

  $("#phoneText").textContent = data.whatsappPhoneE164;
  $("#emailText").textContent = data.email;

  const msg = `Olá! Quero encomendar pela ${data.brand}. Pode enviar opções e valores?`;
  const wa = makeWhatsAppLink(data.whatsappPhoneE164, msg);

  ["#btn-whatsapp-top", "#btn-whatsapp-hero", "#btn-whatsapp-mobile"].forEach((id) => {
    const el = $(id);
    if (el) el.href = wa;
  });

  // Lists
  $("#fitList").innerHTML = data.menus.fit.map(i => `<li>${i}</li>`).join("");
  $("#vegList").innerHTML = data.menus.veg.map(i => `<li>${i}</li>`).join("");

  $("#deliveryAreas").innerHTML = data.deliveryAreas.map(i => `<li>${i}</li>`).join("");
  $("#deliveryRules").innerHTML = data.deliveryRules.map(i => `<li>${i}</li>`).join("");
  $("#prepSteps").innerHTML = data.prepSteps.map(i => `<li>${i}</li>`).join("");

  // Packs
  const grid = $("#packsGrid");
  grid.innerHTML = data.packs.map(p => {
    const packMsg = `Olá! Quero o ${p.name} (${p.meals} refeições). Pode confirmar preço e datas de entrega?`;
    const link = makeWhatsAppLink(data.whatsappPhoneE164, packMsg);

    return `
      <div class="pack">
        <div class="pack__title">${p.name}</div>
        <div class="pack__meta">
          <span>${p.meals} refeições</span>
          <span>${p.price}</span>
        </div>
        <div class="muted">${p.tag || ""}</div>
        <a class="cta pack__btn" href="${link}" target="_blank" rel="noreferrer">Comprar / Reservar</a>
      </div>
    `;
  }).join("");

  // Mobile menu
  const hamb = document.querySelector(".hamb");
  const mobile = document.querySelector(".mobilemenu");
  hamb.addEventListener("click", () => {
    const open = !mobile.hasAttribute("hidden");
    if (open) mobile.setAttribute("hidden", "");
    else mobile.removeAttribute("hidden");
    hamb.setAttribute("aria-expanded", String(!open));
  });

  // Close mobile menu on click
  mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobile.setAttribute("hidden", "");
    hamb.setAttribute("aria-expanded", "false");
  }));
}

init().catch(console.error);
