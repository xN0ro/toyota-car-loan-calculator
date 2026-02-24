/* =========================================================
   Toyota Gatineau Pro Desk (script.js)
   Features: Tabbed UI, Dynamic Add-ons, Strict Bank Rounding
   ========================================================= */

const I18N = {
  en: {
    ui_language: "Language",
    ui_title: "Loan Calculator",
    ui_tax_included: "Tax Included",
    ui_vehicle_not_set: "Vehicle not set",
    ui_payment_label: "Monthly payment (tax included)",
    ui_note_rules: "Bank-grade strict rounding applied. Trade-in is pre-tax savings. Add-ons taxed by province.",
    ui_values_cad: "All values CAD.",

    tab_deal: "Deal Structure",
    tab_trade: "Trade & Cash",
    tab_options: "Options & Fees",
    sec_down_discount: "Down Payment & Discount",

    sec_purchase_type: "Purchase Type",
    label_purchaseType: "Type",
    opt_finance: "Finance",
    opt_cash: "Cash Deal",
    pay_cash: "Total Cash Price (tax included)",

    label_vin: "VIN",
    label_vehicleTitle: "Vehicle (Year Make Model Trim)",
    label_stock: "Stock#",
    label_province: "Province",
    label_price: "Car price (before tax)",
    label_tradeIn: "Trade-in value (entered)",
    label_payoff: "Trade loan payoff",
    label_downPayment: "Down payment",
    label_downPaymentNote: "Down payment note (optional)",
    label_rate: "APR (interest %)",
    label_term: "Term (months)",
    label_paymentFreq: "Payment frequency",
    label_includeSafety: "Ontario safety fee",
    label_safety_amt: "Safety fee amount",
    label_discount: "Discount (before tax)",
    label_discountNote: "Discount note (optional)",

    label_rust: "Rustproofing",
    label_rust_price: "Rustproofing price",
    label_tag: "TAG system",
    label_tag_price: "TAG price",
    label_warranty: "Warranty 3y / 60,000 km",
    label_warranty_price: "Warranty price",

    btn_add_accessory: "+ Add Accessory",
    ph_custom_addon_name: "Accessory Name (e.g., Tint, Mats)",

    ph_vin: "17 characters",
    ph_vehicleTitle: "Example: 2026 Toyota RAV4 XLE AWD",
    ph_downNote: "Example: Cash / Debit / Transfer",
    ph_discountNote: "Example: Promo, Manager discount",

    prov_qc: "Quebec (14.975%)",
    prov_on: "Ontario (13%)",
    prov_bc: "British Columbia (12%)",
    prov_ab: "Alberta (5%)",

    freq_monthly: "Monthly",
    freq_biweekly: "Bi-weekly (26/yr)",
    freq_weekly: "Weekly (52/yr)",

    opt_include: "Include",
    opt_no: "No",
    w_none: "None",
    w_fwd: "FWD (suggested $2795)",
    w_awd: "AWD (suggested $2995)",
    w_other: "Other (manual)",

    hint_on_550: "Ontario enables safety fee automatically.",
    hint_trade_tax: "Your rule: trade-in gets tax added on top.",
    hint_payoff: "Payoff is added to amount financed.",
    hint_safety_edit: "Auto-fills to $549.95 when Ontario is selected.",
    
    btn_decode_vin: "Decode",
    btn_reset: "Reset",
    btn_print: "Print quote",
    btn_print_compare: "Print Comparison",

    r_price: "Car price (before tax)",
    r_price_tax: "Car price (with tax)",
    r_addons: "Add-ons (before tax)",
    r_addons_tax: "Add-ons (with tax)",
    r_trade_tax: "Trade-in (with tax added)",
    r_payoff: "Trade loan payoff",
    r_fees: "Total fees",
    r_amount_financed: "Amount financed / Balance",
    r_total_paid: "Total of payments",
    r_interest: "Total interest",

    sec_loan: "Loan Details",
    sec_addons: "Add-ons",
    sec_results: "Live Results",

    chip_province: "Province",
    dealer: "Toyota Gatineau",
    generated: "Generated",
    vehicle: "Vehicle",
    vin: "VIN",
    stock: "Stock#",
    province: "Province",
    tax: "Tax",
    apr: "APR",
    term: "Term",

    detailed_title: "Vehicle Finance Quote",
    pricing: "Pricing",
    trade: "Trade-in",
    fees: "Fees",
    financing: "Financing",
    car_price_before_tax: "Car price (before tax)",
    discount_before_tax: "Discount (before tax)",
    price_after_discount: "Price after discount",
    addons_included: "Included add-ons",
    addon_none: "None",
    addons_before_tax: "Add-ons (before tax)",
    addons_with_tax: "Add-ons (with tax)",
    car_price_with_tax_addons: "Car price (with tax + add-ons)",
    down_payment: "Down payment",
    trade_entered: "Trade-in entered",
    trade_with_tax_added: "Trade-in (with tax added)",
    payoff_added: "Payoff added",
    ont_safety: "Ontario safety fee",
    total_fees: "Total fees",
    amount_financed: "Amount financed / Balance",
    total_payments: "Total of payments",
    total_interest: "Total interest",
    note_tradein_tax: "Notes: Strict bank-grade math applied.",

    pay_monthly: "Monthly payment (tax included)",
    pay_biweekly: "Bi-weekly payment (tax included)",
    pay_weekly: "Weekly payment (tax included)",

    opt1: "SILVER",
    opt2: "GOLD",
    opt3: "PLATINUM",
    cmp_car_before: "Car price (before tax)",
    client_choice: "Client choice (X)",

    addon_rust: "Rustproofing",
    addon_tag: "TAG system",
    addon_warranty: "Warranty"
  },

  fr: {
    ui_language: "Langue",
    ui_title: "Calculatrice de financement",
    ui_tax_included: "Taxes incluses",
    ui_vehicle_not_set: "Véhicule non défini",
    ui_payment_label: "Paiement mensuel (taxes incluses)",
    ui_note_rules: "Arrondis stricts bancaires appliqués. Taxes ajoutées selon la province.",
    ui_values_cad: "Tous les montants en $ CAD.",

    tab_deal: "Structure",
    tab_trade: "Échange et Comptant",
    tab_options: "Options et Frais",
    sec_down_discount: "Mise de fonds et Rabais",

    sec_purchase_type: "Type d'achat",
    label_purchaseType: "Type",
    opt_finance: "Financement",
    opt_cash: "Achat comptant",
    pay_cash: "Prix total comptant (taxes incluses)",

    label_vin: "NIV",
    label_vehicleTitle: "Véhicule (année marque modèle version)",
    label_stock: "Stock#",
    label_province: "Province",
    label_price: "Prix du véhicule (avant taxes)",
    label_tradeIn: "Valeur d’échange (saisie)",
    label_payoff: "Solde à payer (échange)",
    label_downPayment: "Mise de fonds",
    label_downPaymentNote: "Note mise de fonds (optionnel)",
    label_rate: "Taux d’intérêt (%)",
    label_term: "Terme (mois)",
    label_paymentFreq: "Fréquence de paiement",
    label_includeSafety: "Frais d’inspection Ontario",
    label_safety_amt: "Montant des frais d’inspection",
    label_discount: "Rabais (avant taxes)",
    label_discountNote: "Note rabais (optionnel)",

    label_rust: "Antirouille",
    label_rust_price: "Prix antirouille",
    label_tag: "Système TAG",
    label_tag_price: "Prix TAG",
    label_warranty: "Garantie 3 ans / 60 000 km",
    label_warranty_price: "Prix garantie",

    btn_add_accessory: "+ Ajouter un accessoire",
    ph_custom_addon_name: "Nom (ex: Vitres teintées, Tapis)",

    ph_vin: "17 caractères",
    ph_vehicleTitle: "Exemple: 2026 Toyota RAV4 XLE AWD",
    ph_downNote: "Exemple: Argent / Débit / Virement",
    ph_discountNote: "Exemple: Promo, rabais gestionnaire",

    prov_qc: "Québec (14,975%)",
    prov_on: "Ontario (13%)",
    prov_bc: "Colombie-Britannique (12%)",
    prov_ab: "Alberta (5%)",

    freq_monthly: "Mensuel",
    freq_biweekly: "Aux 2 semaines (26/an)",
    freq_weekly: "Hebdomadaire (52/an)",

    opt_include: "Inclure",
    opt_no: "Non",
    w_none: "Aucune",
    w_fwd: "FWD (suggéré 2795$)",
    w_awd: "AWD (suggéré 2995$)",
    w_other: "Autre (manuel)",

    hint_on_550: "En Ontario, les frais s’activent automatiquement.",
    hint_trade_tax: "Votre règle: taxes ajoutées sur l’échange.",
    hint_payoff: "Le solde à payer est ajouté au montant financé.",
    hint_safety_edit: "Auto-remplit à 549,95$ en Ontario.",

    btn_decode_vin: "Décoder",
    btn_reset: "Réinitialiser",
    btn_print: "Imprimer la soumission",
    btn_print_compare: "Imprimer comparatif",

    r_price: "Prix du véhicule (avant taxes)",
    r_price_tax: "Prix (avec taxes)",
    r_addons: "Options (avant taxes)",
    r_addons_tax: "Options (avec taxes)",
    r_trade_tax: "Échange (taxes ajoutées)",
    r_payoff: "Solde à payer (échange)",
    r_fees: "Total des frais",
    r_amount_financed: "Montant financé / Solde",
    r_total_paid: "Total des paiements",
    r_interest: "Intérêts totaux",

    sec_loan: "Détails du prêt",
    sec_addons: "Options",
    sec_results: "Résultats en direct",

    chip_province: "Province",
    dealer: "Toyota Gatineau",
    generated: "Généré",
    vehicle: "Véhicule",
    vin: "NIV",
    stock: "Stock#",
    province: "Province",
    tax: "Taxes",
    apr: "Taux",
    term: "Terme",

    detailed_title: "Soumission de financement",
    pricing: "Prix",
    trade: "Échange",
    fees: "Frais",
    financing: "Financement",
    car_price_before_tax: "Prix du véhicule (avant taxes)",
    discount_before_tax: "Rabais (avant taxes)",
    price_after_discount: "Prix après rabais",
    addons_included: "Options incluses",
    addon_none: "Aucune",
    addons_before_tax: "Options (avant taxes)",
    addons_with_tax: "Options (avec taxes)",
    car_price_with_tax_addons: "Prix (avec taxes + options)",
    down_payment: "Mise de fonds",
    trade_entered: "Échange saisi",
    trade_with_tax_added: "Échange (taxes ajoutées)",
    payoff_added: "Solde à payer ajouté",
    ont_safety: "Frais d’inspection Ontario",
    total_fees: "Total des frais",
    amount_financed: "Montant financé / Solde",
    total_payments: "Total des paiements",
    total_interest: "Intérêts totaux",
    note_tradein_tax: "Notes: Arrondis stricts appliqués.",

    pay_monthly: "Paiement mensuel (taxes incluses)",
    pay_biweekly: "Paiement aux 2 semaines (taxes incluses)",
    pay_weekly: "Paiement hebdomadaire (taxes incluses)",

    opt1: "ARGENT",
    opt2: "OR",
    opt3: "PLATINE",
    cmp_car_before: "Prix du véhicule (avant taxes)",
    client_choice: "Choix du client (X)",

    addon_rust: "Antirouille",
    addon_tag: "Système TAG",
    addon_warranty: "Garantie"
  }
};

let LANG = "en";
function t(key) {
  const pack = I18N[LANG] || I18N.en;
  return pack[key] ?? I18N.en[key] ?? key;
}

/* ---------------------------
   Helpers & Math
--------------------------- */
const el = (id) => document.getElementById(id);
function escapeHtml(str) { return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
function clampNumber(v) { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; }
function round2(v) { return Math.round((v + Number.EPSILON) * 100) / 100; }
function nicePct(p) { const s = (p * 100).toFixed(3); return s.replace(/0+$/, "").replace(/\.$/, ""); }
function fmt(n) { return new Intl.NumberFormat(LANG === "fr" ? "fr-CA" : "en-CA", { style: "currency", currency: "CAD" }).format(n); }
function calcPayment(principal, annualRatePct, paymentsPerYear, totalPayments) {
  const r = annualRatePct / 100 / paymentsPerYear;
  if (principal <= 0) return 0;
  if (r === 0) return principal / Math.max(1, totalPayments);
  const denom = 1 - Math.pow(1 + r, -totalPayments);
  return denom === 0 ? 0 : (principal * r) / denom;
}

/* ---------------------------
   Data
--------------------------- */
const PROVINCES = { QC: { taxRate: 0.14975 }, ON: { taxRate: 0.13 }, BC: { taxRate: 0.12 }, AB: { taxRate: 0.05 } };
const WARRANTY_DEFAULTS = { none: 0, fwd: 2795, awd: 2995, other: 0 };
const ON_SAFETY_BASE = 549.95;
const ADDONS = [
  { key: "rust", labelKey: "addon_rust", includeId: "includeRust", priceId: "rustProofing", defaultPrice: 1398 },
  { key: "tag", labelKey: "addon_tag", includeId: "includeTag", priceId: "tagPrice", defaultPrice: 695 }
];

/* ---------------------------
   Dynamic Add-ons System
--------------------------- */
let dynamicAddonCount = 0;

function addDynamicAddon() {
  dynamicAddonCount++;
  const id = dynamicAddonCount;
  const container = el("dynamicAddonsContainer");
  
  const div = document.createElement("div");
  div.className = "row dynamic-row";
  div.id = `dynamic-addon-${id}`;
  
  div.innerHTML = `
    <div class="field">
      <input type="text" class="dyn-name" placeholder="${escapeHtml(t("ph_custom_addon_name"))}" />
    </div>
    <div class="field price-field">
      <input type="number" class="dyn-price" min="0" step="0.01" value="0" />
    </div>
    <button type="button" class="remove-btn" onclick="removeDynamicAddon(${id})">✕</button>
  `;
  
  container.appendChild(div);
  
  div.querySelector('.dyn-name').addEventListener('input', recompute);
  div.querySelector('.dyn-price').addEventListener('input', recompute);
}

function removeDynamicAddon(id) {
  const row = el(`dynamic-addon-${id}`);
  if (row) row.remove();
  recompute();
}

/* ---------------------------
   Tabs Logic
--------------------------- */
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      el(btn.dataset.target).classList.add("active");
    });
  });
}

/* ---------------------------
   General UI functions
--------------------------- */
function applyLanguageToUI() {
  document.querySelectorAll("[data-i18n]").forEach(n => { const k = n.getAttribute("data-i18n"); if (k) n.textContent = t(k); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(n => { const k = n.getAttribute("data-i18n-placeholder"); if (k) n.setAttribute("placeholder", t(k)); });
  updateVehicleDisplay();
  recompute();
}

function setLanguage(lang) {
  LANG = lang === "fr" ? "fr" : "en";
  try { localStorage.setItem("tg_lang", LANG); } catch (_) {}
  applyLanguageToUI();
}

function togglePurchaseType() {
  const type = el("purchaseType")?.value || "finance";
  const wrap = el("financeFieldsWrap");
  if (wrap) wrap.style.display = type === "cash" ? "none" : "block";
  recompute();
}

function updateVehicleDisplay() {
  const vin = cleanVin(el("vin")?.value);
  const vehicleTitle = (el("vehicleTitle")?.value || "").trim();
  if (el("vehicleTitleOut")) el("vehicleTitleOut").textContent = vehicleTitle || t("ui_vehicle_not_set");
  if (el("vinOut")) el("vinOut").textContent = vin ? `${t("vin")}: ${vin}` : "";
}

function cleanVin(raw) { return (raw || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, ""); }
function setVinStatus(msg) { const node = el("vinStatus"); if (node) node.textContent = msg || ""; }

async function decodeVin() {
  const vinInput = el("vin"); const btn = el("decodeVinBtn");
  if (!vinInput) return;
  const vin = cleanVin(vinInput.value); vinInput.value = vin;
  if (vin.length !== 17) { setVinStatus(t("vin_need_17")); updateVehicleDisplay(); return; }
  setVinStatus(t("vin_decoding")); if (btn) btn.disabled = true;
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`);
    if (!res.ok) throw new Error("HTTP error");
    const data = await res.json();
    const row = data?.Results?.[0]; if (!row) throw new Error("No results");
    const title = [row.ModelYear, row.Make, row.Model, row.Trim || row.Series || row.BodyClass].filter(Boolean).join(" ").replace(/\s+/g, " ");
    if (el("vehicleTitle")) el("vehicleTitle").value = title;
    setVinStatus(t("vin_ok"));
  } catch (e) { setVinStatus(t("vin_fail")); } finally {
    if (btn) btn.disabled = false; updateVehicleDisplay(); recompute();
  }
}

let warrantyAutoFillEnabled = true;
function updateWarrantyPriceFromType() {
  const type = el("warrantyType")?.value || "none";
  if (warrantyAutoFillEnabled && el("warrantyPrice")) el("warrantyPrice").value = WARRANTY_DEFAULTS[type] ?? 0;
}

function syncSafetyFeeWithProvince() {
  const p = el("province")?.value || "QC";
  const inc = el("includeSafetyFee"); const fee = el("safetyFee");
  if (p === "ON") { inc.value = "yes"; if (clampNumber(fee.value) === 0 || Math.abs(clampNumber(fee.value) - 550) < 0.2) fee.value = ON_SAFETY_BASE; }
  else { inc.value = "no"; fee.value = 0; }
}

/* ---------------------------
   Core Logic & Strict Math
--------------------------- */
function getAddonsForScenario({ useRust = null, useWarranty = null } = {}) {
  const items = [];
  for (const a of ADDONS) {
    let include = (el(a.includeId)?.value || "no") === "yes";
    if (a.key === "rust" && useRust !== null) include = !!useRust;
    const price = clampNumber(el(a.priceId)?.value);
    if (include && price > 0) items.push({ key: a.key, label: t(a.labelKey), price });
  }

  const wPrice = clampNumber(el("warrantyPrice")?.value);
  let includeWarranty = (el("warrantyType")?.value !== "none" && wPrice > 0);
  if (useWarranty !== null) includeWarranty = !!useWarranty;
  if (includeWarranty && wPrice > 0) items.push({ key: "warranty", label: t("addon_warranty"), price: wPrice });

  document.querySelectorAll(".dynamic-row").forEach(row => {
    const name = row.querySelector(".dyn-name").value.trim();
    const price = clampNumber(row.querySelector(".dyn-price").value);
    if (name && price > 0) items.push({ key: "custom", label: name, price });
  });

  return { items, totalBeforeTax: items.reduce((s, x) => s + (x.price || 0), 0) };
}

function getPaymentMeta(term, freq) {
  if (freq === "biweekly") return { perYear: 26, totalPayments: Math.round((term / 12) * 26), labelKey: "pay_biweekly" };
  if (freq === "weekly") return { perYear: 52, totalPayments: Math.round((term / 12) * 52), labelKey: "pay_weekly" };
  return { perYear: 12, totalPayments: term, labelKey: "pay_monthly" };
}

function computeTotals({ useRust = null, useWarranty = null } = {}) {
  const rules = PROVINCES[el("province")?.value || "QC"] || PROVINCES.QC;
  const taxRate = rules.taxRate;
  const discount = clampNumber(el("discount")?.value);
  const discountedPrice = Math.max(0, clampNumber(el("price")?.value) - discount);
  
  const addons = getAddonsForScenario({ useRust, useWarranty });
  const addonsBeforeTax = round2(addons.totalBeforeTax);
  const safetyFeeBase = (el("includeSafetyFee")?.value || "no") === "yes" ? clampNumber(el("safetyFee")?.value) : 0;

  const baseWithTax = round2(discountedPrice + round2(discountedPrice * taxRate));
  const addonsWithTax = round2(addonsBeforeTax + round2(addonsBeforeTax * taxRate));
  const tradeInEntered = clampNumber(el("tradeIn")?.value);
  const tradeInWithTax = round2(tradeInEntered + round2(tradeInEntered * taxRate));
  const safetyFeeFinanced = round2(safetyFeeBase + round2(safetyFeeBase * taxRate));
  const payoff = clampNumber(el("payoff")?.value);
  const downPayment = clampNumber(el("downPayment")?.value);

  let amountFinanced = round2(baseWithTax + addonsWithTax + safetyFeeFinanced - tradeInWithTax + payoff - downPayment);
  if (amountFinanced < 0) amountFinanced = 0;

  const purchaseType = el("purchaseType")?.value || "finance";
  const pm = getPaymentMeta(Math.max(1, Math.floor(clampNumber(el("term")?.value))), el("paymentFreq")?.value || "monthly");
  
  let payment, totalPaid, totalInterest, paymentLabelKey;
  if (purchaseType === "cash") {
    payment = round2(amountFinanced + downPayment); 
    totalPaid = payment; totalInterest = 0; paymentLabelKey = "pay_cash";
  } else {
    payment = round2(calcPayment(amountFinanced, clampNumber(el("rate")?.value), pm.perYear, pm.totalPayments));
    totalPaid = round2(payment * pm.totalPayments);
    totalInterest = Math.max(0, round2(totalPaid - amountFinanced));
    paymentLabelKey = pm.labelKey;
  }

  return {
    purchaseType, provinceKey: el("province")?.value || "QC", taxRate,
    vin: cleanVin(el("vin")?.value), vehicleTitle: (el("vehicleTitle")?.value || "").trim(), stockNumber: (el("stockNumber")?.value || "").trim(),
    price: clampNumber(el("price")?.value), discount, discountedPrice,
    addonsItems: addons.items, addonsBeforeTax, addonsWithTax, priceWithTax: baseWithTax, 
    tradeInEntered, tradeInWithTax, payoff, safetyFeeBase, totalFeesDisplay: round2(safetyFeeBase), downPayment,
    apr: clampNumber(el("rate")?.value), termMonths: Math.max(1, Math.floor(clampNumber(el("term")?.value))),
    amountFinanced, payment, paymentLabelKey, totalPaid, totalInterest
  };
}

function recompute() {
  const s = computeTotals();
  if (el("paymentOut")) el("paymentOut").textContent = fmt(s.payment);
  if (el("paymentLabel")) el("paymentLabel").textContent = t(s.paymentLabelKey);
  if (el("provinceChip")) el("provinceChip").textContent = s.provinceKey;
  if (el("priceOut")) el("priceOut").textContent = fmt(s.price);
  if (el("priceWithTaxOut")) el("priceWithTaxOut").textContent = fmt(s.priceWithTax);
  if (el("addonsOut")) el("addonsOut").textContent = fmt(s.addonsBeforeTax);
  if (el("addonsWithTaxOut")) el("addonsWithTaxOut").textContent = fmt(s.addonsWithTax);
  if (el("tradeWithTaxOut")) el("tradeWithTaxOut").textContent = "-" + fmt(s.tradeInWithTax);
  if (el("payoffOut")) el("payoffOut").textContent = "+" + fmt(s.payoff);
  if (el("feesOut")) el("feesOut").textContent = "+" + fmt(s.totalFeesDisplay);
  if (el("amountFinancedOut")) el("amountFinancedOut").textContent = fmt(s.amountFinanced);
  if (el("totalPaidOut")) el("totalPaidOut").textContent = fmt(s.totalPaid);
  if (el("interestOut")) el("interestOut").textContent = fmt(s.totalInterest);
  
  if (el("interestRow")) el("interestRow").style.display = s.purchaseType === "cash" ? "none" : "flex";
  if (el("totalPaidRow")) el("totalPaidRow").style.display = s.purchaseType === "cash" ? "none" : "flex";
  updateVehicleDisplay();
}

/* ---------------------------
   Print Layouts (Fully Inline & Protected)
--------------------------- */
function setPrintMode(orientation) {
  const id = "tg_print_style"; let style = el(id);
  if (!style) { style = document.createElement("style"); style.id = id; document.head.appendChild(style); }
  const isLand = orientation === "landscape";
  
  style.textContent = `
    #printArea { display: none; }
    @media print {
      @page { size: ${isLand ? "landscape" : "portrait"}; margin: 8mm; }
      body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body > *:not(#printArea) { display: none !important; }
      #printArea { display: block !important; position: static !important; width: 100% !important; }
      * { box-sizing: border-box !important; }
    }
  `;
}

function row(label, value) {
  return `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dotted #888; font-size:13px;"><span>${escapeHtml(label)}</span><b style="white-space:nowrap;">${escapeHtml(value)}</b></div>`;
}

function buildAddonListWithPricesHtml(items, minLines = 0) {
  const rows = (items || []).map(x => ({ name: escapeHtml(x.label) }));
  if (!rows.length) rows.push({ name: escapeHtml(t("addon_none")) });
  while (rows.length < minLines) rows.push({ name: `<span style="visibility:hidden">.</span>` });
  return `<div style="margin: 12px 0;"><div style="font-weight:800; font-size:12px; margin-bottom:6px;">${escapeHtml(t("addons_included"))}</div>${rows.map((r) => `<div style="padding: 3px 0; font-size:13px; font-weight:700;">${r.name}</div>`).join("")}</div>`;
}

function col(title, s) {
  const showSafetyRow = s.provinceKey === "ON" && s.safetyFeeBase > 0;
  return `
    <div style="padding:16px; border:2px solid #000; border-radius:10px; display:flex; flex-direction:column; justify-content:space-between; background:#fff; height: 100%;">
      <div>
        <div style="font-size:18px; font-weight:900; text-align:center; margin-bottom:12px;">${escapeHtml(title)}</div>
        ${row(t("cmp_car_before"), fmt(s.discountedPrice))}
        ${buildAddonListWithPricesHtml(s.addonsItems, 0)}
        <div style="height:2px; background:#000; margin:12px 0 8px;"></div>
        ${showSafetyRow ? row(t("ont_safety"), fmt(s.safetyFeeBase)) : ""}
        ${row(t("trade_with_tax_added"), "-" + fmt(s.tradeInWithTax))}
        ${row(t("payoff_added"), "+" + fmt(s.payoff))}
        ${row(t("down_payment"), "-" + fmt(s.downPayment))}
      </div>
      <div style="margin-top:auto; border-top: 2px solid #000; padding-top: 12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px;">
          <div style="font-size:13px; line-height:1.2; font-weight:600; max-width:60%;">${escapeHtml(t(s.paymentLabelKey))}<div style="font-size:11px; opacity:0.8; margin-top:2px;">${escapeHtml(t("ui_tax_included"))}</div></div>
          <b style="font-size:24px; line-height:1; white-space:nowrap;">${escapeHtml(fmt(s.payment))}</b>
        </div>
        <div style="display:flex; align-items:center; gap:10px;"><div style="width:24px; height:24px; border:2px solid #000; border-radius:4px;"></div><div style="font-size:14px; font-weight:800;">${escapeHtml(t("client_choice"))}</div></div>
      </div>
    </div>
  `;
}

// Fixed Single Quote Print Function
function buildPrintHtml(s) {
  const dateStr = new Date().toLocaleString(LANG === "fr" ? "fr-CA" : "en-CA");
  const showSafetyRow = s.provinceKey === "ON" && s.safetyFeeBase > 0;

  return `
    <div style="font-family: sans-serif; background: #fff; color: #000; padding: 10px;">
      
      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <img src="./logo.jpg" style="height: 85px; width: auto; max-width: 250px; object-fit: contain; display: block;" alt="${escapeHtml(t("dealer"))}">
          <div>
            <div style="font-size: 24px; font-weight: 900; text-transform: uppercase;">${escapeHtml(t("dealer"))}</div>
            <div style="font-size: 14px; color: #444; margin-top: 4px;">${escapeHtml(t("detailed_title"))}</div>
            <div style="font-size: 12px; color: #666; margin-top: 2px;">${escapeHtml(t("generated"))}: ${escapeHtml(dateStr)}</div>
          </div>
        </div>
        
        <div style="text-align: right; font-size: 13px; line-height: 1.5;">
          ${s.vehicleTitle ? `<div><b>${escapeHtml(t("vehicle"))}:</b> ${escapeHtml(s.vehicleTitle)}</div>` : ""}
          ${s.vin ? `<div><b>${escapeHtml(t("vin"))}:</b> ${escapeHtml(s.vin)}</div>` : ""}
          ${s.stockNumber ? `<div><b>${escapeHtml(t("stock"))}:</b> ${escapeHtml(s.stockNumber)}</div>` : ""}
          <div><b>${escapeHtml(t("province"))}:</b> ${escapeHtml(s.provinceKey)} (Tax: ${escapeHtml(nicePct(s.taxRate))}%)</div>
          ${s.purchaseType === 'finance' ? `
          <div><b>${escapeHtml(t("apr"))}:</b> ${escapeHtml(String(s.apr))}% &nbsp;|&nbsp; <b>${escapeHtml(t("term"))}:</b> ${escapeHtml(String(s.termMonths))}</div>` : ''}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        
        <div style="border: 2px solid #000; border-radius: 10px; padding: 16px;">
          <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid #000; padding-bottom: 6px;">${escapeHtml(t("pricing"))}</div>
          
          ${row(t("car_price_before_tax"), fmt(s.price))}
          ${s.discount > 0 ? row(t("discount_before_tax"), "-" + fmt(s.discount)) : ""}
          ${s.discount > 0 ? row(t("price_after_discount"), fmt(s.discountedPrice)) : ""}
          
          ${buildAddonListWithPricesHtml(s.addonsItems)}
          
          ${row(t("addons_before_tax"), fmt(s.addonsBeforeTax))}
          ${row(t("car_price_with_tax_addons"), fmt(s.priceWithTax + s.addonsWithTax))}
          ${row(t("down_payment"), "-" + fmt(s.downPayment))}
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <div style="border: 2px solid #000; border-radius: 10px; padding: 16px;">
            <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid #000; padding-bottom: 6px;">${escapeHtml(t("trade"))} & ${escapeHtml(t("fees"))}</div>
            ${row(t("trade_entered"), fmt(s.tradeInEntered))}
            ${row(t("trade_with_tax_added"), "-" + fmt(s.tradeInWithTax))}
            ${row(t("payoff_added"), "+" + fmt(s.payoff))}
            <div style="height: 6px;"></div>
            ${showSafetyRow ? row(t("ont_safety"), fmt(s.safetyFeeBase)) : ""}
            ${row(t("total_fees"), "+" + fmt(s.totalFeesDisplay))}
          </div>

          <div style="border: 2px solid #000; border-radius: 10px; padding: 16px; background: #fafafa; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid #000; padding-bottom: 6px;">${s.purchaseType === 'finance' ? escapeHtml(t("financing")) : escapeHtml(t("opt_cash"))}</div>
              ${row(`<b>${escapeHtml(t("amount_financed"))}</b>`, `<b>${fmt(s.amountFinanced)}</b>`)}
              ${s.purchaseType === 'finance' ? `
              ${row(t("total_payments"), fmt(s.totalPaid))}
              ${row(t("total_interest"), fmt(s.totalInterest))}` : ''}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 16px; padding-top: 16px; border-top: 2px solid #000;">
              <div style="font-size: 14px; font-weight: bold; max-width: 60%;">
                ${escapeHtml(t(s.paymentLabelKey))}
                <div style="font-size: 11px; font-weight: normal; margin-top: 2px; opacity: 0.8;">${escapeHtml(t("ui_tax_included"))}</div>
              </div>
              <b style="font-size: 26px; line-height: 1;">${fmt(s.payment)}</b>
            </div>
          </div>

        </div>
      </div>

      <div style="margin-top: 20px; font-size: 11px; color: #555; text-align: center;">
        ${escapeHtml(t("note_tradein_tax"))}
      </div>
    </div>
  `;
}

// Fixed Comparison Print Function
function buildComparisonPrintHtml(s1, s2, s3) {
  const dateStr = new Date().toLocaleString(LANG === "fr" ? "fr-CA" : "en-CA");
  return `
    <div style="font-family: sans-serif; background: #fff; color: #000; height: 95vh; display: flex; flex-direction: column; overflow: hidden; page-break-inside: avoid;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 15px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <img src="./logo.jpg" alt="${escapeHtml(t("dealer"))}" style="height: 90px; width: auto; max-width: 250px; object-fit: contain; display: block;">
          <div>
            <div style="font-size: 20px; font-weight: 900; text-transform: uppercase;">${escapeHtml(t("dealer"))}</div>
            <div style="font-size: 12px; color: #555; margin-top: 4px;">${escapeHtml(t("generated"))}: ${escapeHtml(dateStr)}</div>
          </div>
        </div>
        
        <div style="text-align: right; font-size: 13px; line-height: 1.5;">
          ${s1.vehicleTitle ? `<div><b>${escapeHtml(t("vehicle"))}:</b> ${escapeHtml(s1.vehicleTitle)}</div>` : ""}
          ${s1.vin ? `<div><b>${escapeHtml(t("vin"))}:</b> ${escapeHtml(s1.vin)}</div>` : ""}
          ${s1.stockNumber ? `<div><b>${escapeHtml(t("stock"))}:</b> ${escapeHtml(s1.stockNumber)}</div>` : ""}
          <div><b>${escapeHtml(t("province"))}:</b> ${escapeHtml(s1.provinceKey)} (Tax: ${escapeHtml(nicePct(s1.taxRate))}%)</div>
          ${s1.purchaseType === 'finance' ? `
          <div><b>${escapeHtml(t("apr"))}:</b> ${escapeHtml(String(s1.apr))}% &nbsp;|&nbsp; <b>${escapeHtml(t("term"))}:</b> ${escapeHtml(String(s1.termMonths))}</div>` : ''}
        </div>
      </div>

      <div style="flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch;">
        ${col(t("opt1"), s1)}
        ${col(t("opt2"), s2)}
        ${col(t("opt3"), s3)}
      </div>
    </div>
  `;
}

function printQuote() {
  const area = el("printArea"); if (!area) return;
  setPrintMode("portrait"); area.innerHTML = buildPrintHtml(computeTotals());
  const c = () => { area.innerHTML = ""; window.removeEventListener("afterprint", c); };
  window.addEventListener("afterprint", c); window.print();
}

function printComparisonQuote() {
  const area = el("printArea"); if (!area) return;
  setPrintMode("landscape");
  area.innerHTML = buildComparisonPrintHtml(computeTotals({ useRust: true, useWarranty: false }), computeTotals({ useRust: false, useWarranty: true }), computeTotals({ useRust: true, useWarranty: true }));
  const c = () => { area.innerHTML = ""; window.removeEventListener("afterprint", c); };
  window.addEventListener("afterprint", c); window.print();
}

/* ---------------------------
   Init & Binds
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  try { const saved = localStorage.getItem("tg_lang"); if (saved === "fr" || saved === "en") LANG = saved; } catch (_) {}
  if (el("lang")) el("lang").value = LANG;

  initTabs();

  // Bind Standard Inputs
  ["lang", "purchaseType", "province", "price", "tradeIn", "payoff", "downPayment", "rate", "term", "paymentFreq", "discount", "includeSafetyFee", "safetyFee", "includeRust", "rustProofing", "includeTag", "tagPrice", "warrantyType", "warrantyPrice", "vin", "vehicleTitle", "stockNumber"]
    .forEach(id => { const n = el(id); if (n) { n.addEventListener("input", recompute); n.addEventListener("change", recompute); } });

  el("lang")?.addEventListener("change", () => setLanguage(el("lang").value));
  el("purchaseType")?.addEventListener("change", togglePurchaseType);
  el("province")?.addEventListener("change", () => { syncSafetyFeeWithProvince(); recompute(); });
  el("warrantyType")?.addEventListener("change", () => { warrantyAutoFillEnabled = true; updateWarrantyPriceFromType(); recompute(); });
  el("warrantyPrice")?.addEventListener("input", () => { warrantyAutoFillEnabled = false; recompute(); });
  
  el("decodeVinBtn")?.addEventListener("click", decodeVin);
  el("printBtn")?.addEventListener("click", printQuote);
  el("printCompareBtn")?.addEventListener("click", printComparisonQuote);
  el("addDynamicAddonBtn")?.addEventListener("click", addDynamicAddon);
  
  el("resetBtn")?.addEventListener("click", () => {
    if (el("purchaseType")) { el("purchaseType").value = "finance"; togglePurchaseType(); }
    if (el("province")) el("province").value = "QC";
    if (el("price")) el("price").value = 25000;
    if (el("tradeIn")) el("tradeIn").value = 5000;
    ["payoff", "downPayment", "discount"].forEach(id => { if (el(id)) el(id).value = 0; });
    if (el("rate")) el("rate").value = 8.99;
    if (el("term")) el("term").value = "72";
    if (el("paymentFreq")) el("paymentFreq").value = "monthly";
    if (el("includeRust")) el("includeRust").value = "yes";
    if (el("rustProofing")) el("rustProofing").value = 1398;
    if (el("includeTag")) el("includeTag").value = "no";
    if (el("tagPrice")) el("tagPrice").value = 695;
    if (el("warrantyType")) el("warrantyType").value = "none";
    ["vin", "vehicleTitle", "stockNumber", "discountNote", "downPaymentNote"].forEach(id => { if (el(id)) el(id).value = ""; });
    
    // Clear dynamic addons
    el("dynamicAddonsContainer").innerHTML = "";
    dynamicAddonCount = 0;

    warrantyAutoFillEnabled = true;
    updateWarrantyPriceFromType();
    syncSafetyFeeWithProvince();
    setVinStatus(""); updateVehicleDisplay(); recompute();
  });

  // Setup defaults
  for (const a of ADDONS) { const n = el(a.priceId); if (n && clampNumber(n.value) === 0) n.value = a.defaultPrice; }
  updateWarrantyPriceFromType();
  syncSafetyFeeWithProvince();
  applyLanguageToUI();
  togglePurchaseType();
});