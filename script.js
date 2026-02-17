/* =========================================================
   Toyota Gatineau Loan Calculator (script.js)

   Keep everything like before:
   - Full detailed print sheet (Pricing / Trade-in / Fees / Financing)
   - Full comparison sheet (3 columns) with Fees + Amount Financed + Payment
   - VIN decode, warranty auto-fill, i18n EN/FR, etc.

   NEW (your requests):
   1) Ontario safety fee:
      - Input shows 549.95 (before tax)
      - In the calculation, it is financed as (549.95 + tax)
      - On BOTH sheets, it displays 549.95 (no tax shown on that line)
   2) Comparison options order:
      - Option 1: Rust only
      - Option 2: Warranty only
      - Option 3: Rust + Warranty
   3) Comparison sheet is landscape
   4) Add-ons list on BOTH sheets:
      - Under “car price before taxes” area, list included add-ons (names only)
      - One per line (stacked)
      - No prices in that list
      - Keep the “Add-ons (before tax)” total row like before
   5) Clean add-on system + TAG system (695 + tax). Easy to add more later.

   ========================================================= */

/* ---------------------------
   i18n
--------------------------- */
const I18N = {
  en: {
    // UI
    ui_language: "Language",
    ui_title: "Loan Calculator",
    ui_tax_included: "Tax Included",
    ui_vehicle_not_set: "Vehicle not set",
    ui_payment_label: "Monthly payment (tax included)",
    ui_note_rules:
      "Note: Trade-in has tax added. Ontario safety fee is financed with tax added (but displayed before tax). Add-ons are taxed by province.",
    ui_values_cad: "All values CAD.",

    // Sections
    sec_vehicle: "Vehicle",
    sec_vehicle_province: "Vehicle & Province",
    sec_tradein: "Trade-in",
    sec_loan: "Loan",
    sec_addons: "Add-ons",
    sec_results: "Results",

    // Labels
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
    label_extraFees: "Other fees",
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

    // Placeholders
    ph_vin: "17 characters",
    ph_vehicleTitle: "Example: 2021 Toyota RAV4 XLE AWD",
    ph_downNote: "Example: Cash / Debit / Transfer",
    ph_discountNote: "Example: Promo, Manager discount",

    // Province options
    prov_qc: "Quebec (14.975%)",
    prov_on: "Ontario (13%)",
    prov_bc: "British Columbia (12%)",
    prov_ab: "Alberta (5%)",

    // Payment frequency
    freq_monthly: "Monthly",
    freq_biweekly: "Bi-weekly (26/yr)",
    freq_weekly: "Weekly (52/yr)",

    // Common options
    opt_include: "Include",
    opt_no: "No",

    // Warranty options
    w_none: "None",
    w_fwd: "FWD (suggested $2795)",
    w_awd: "AWD (suggested $2995)",
    w_other: "Other (manual)",

    // Hints
    hint_on_550: "Ontario enables safety fee automatically.",
    hint_trade_tax: "Your rule: trade-in gets tax added on top.",
    hint_payoff: "Payoff is added to amount financed.",
    hint_safety_edit:
      "Auto-fills to $549.95 when Ontario is selected (displayed before tax). It is financed with tax added.",
    hint_discount: "This reduces the vehicle price before taxes.",
    hint_rust_default: "Default is $1398",
    hint_tag_default: "Default is $695 (plus tax)",
    hint_warranty: "Selecting FWD/AWD auto-fills the price, you can still change it.",

    // Buttons
    btn_decode_vin: "Decode VIN",
    btn_reset: "Reset example",
    btn_print: "Print quote",
    btn_print_compare: "Print Comparison",

    // Results list
    r_price: "Car price (before tax)",
    r_price_tax: "Car price (with tax)",
    r_addons: "Add-ons (before tax)",
    r_addons_tax: "Add-ons (with tax)",
    r_trade_tax: "Trade-in (with tax added)",
    r_payoff: "Trade loan payoff",
    r_fees: "Total fees",
    r_amount_financed: "Amount financed",
    r_total_paid: "Total of payments",
    r_interest: "Total interest",

    chip_province: "Province",
    chip_tax: "Tax",
    chip_fees: "Fees",

    // Print common
    dealer: "Toyota Gatineau",
    generated: "Generated",
    vehicle: "Vehicle",
    vin: "VIN",
    stock: "Stock#",
    province: "Province",
    tax: "Tax",
    apr: "APR",
    term: "Term",

    // Detailed print
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
    other_fees: "Other fees",
    ont_safety: "Ontario safety fee",
    total_fees: "Total fees",
    amount_financed: "Amount financed",
    total_payments: "Total of payments",
    total_interest: "Total interest",
    note_tradein_tax:
      "Notes: Trade-in has tax added. Ontario safety fee is financed with tax added (but displayed before tax). Add-ons are taxed by province.",

    pay_monthly: "Monthly payment (tax included)",
    pay_biweekly: "Bi-weekly payment (tax included)",
    pay_weekly: "Weekly payment (tax included)",

    // Comparison print
    opt1: "SILVER",
    opt2: "GOLD",
    opt3: "PLATINUM",
    cmp_car_before: "Car price (before add-ons & tax)",
    cmp_total_tax_addons: "Total with tax + add-ons",
    client_choice: "Client choice (X)",

    // Add-on names
    addon_rust: "Rustproofing",
    addon_tag: "TAG system",
    addon_warranty: "Warranty",

    // VIN status
    vin_need_17: "VIN must be 17 characters.",
    vin_decoding: "Decoding VIN...",
    vin_ok: "VIN decoded successfully.",
    vin_missing: "Decoded, but basic info was missing. Enter the vehicle title manually.",
    vin_fail: "Could not decode VIN. Check the VIN or enter vehicle info manually."
  },

  fr: {
    // UI
    ui_language: "Langue",
    ui_title: "Calculatrice de financement",
    ui_tax_included: "Taxes incluses",
    ui_vehicle_not_set: "Véhicule non défini",
    ui_payment_label: "Paiement mensuel (taxes incluses)",
    ui_note_rules:
      "Note: Taxes ajoutées sur l’échange. Les frais d’inspection Ontario sont financés avec taxes ajoutées (affichés avant taxes). Les options sont taxées selon la province.",
    ui_values_cad: "Tous les montants en $ CAD.",

    // Sections
    sec_vehicle: "Véhicule",
    sec_vehicle_province: "Véhicule et province",
    sec_tradein: "Échange",
    sec_loan: "Financement",
    sec_addons: "Options",
    sec_results: "Résultats",

    // Labels
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
    label_extraFees: "Autres frais",
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

    // Placeholders
    ph_vin: "17 caractères",
    ph_vehicleTitle: "Exemple: 2021 Toyota RAV4 XLE AWD",
    ph_downNote: "Exemple: Argent / Débit / Virement",
    ph_discountNote: "Exemple: Promo, rabais gestionnaire",

    // Province options
    prov_qc: "Québec (14,975%)",
    prov_on: "Ontario (13%)",
    prov_bc: "Colombie-Britannique (12%)",
    prov_ab: "Alberta (5%)",

    // Payment frequency
    freq_monthly: "Mensuel",
    freq_biweekly: "Aux 2 semaines (26/an)",
    freq_weekly: "Hebdomadaire (52/an)",

    // Common options
    opt_include: "Inclure",
    opt_no: "Non",

    // Warranty options
    w_none: "Aucune",
    w_fwd: "FWD (suggéré 2795$)",
    w_awd: "AWD (suggéré 2995$)",
    w_other: "Autre (manuel)",

    // Hints
    hint_on_550: "En Ontario, les frais d’inspection s’activent automatiquement.",
    hint_trade_tax: "Votre règle: taxes ajoutées sur l’échange.",
    hint_payoff: "Le solde à payer est ajouté au montant financé.",
    hint_safety_edit:
      "Auto-remplit à 549,95$ en Ontario (affiché avant taxes). Financé avec taxes ajoutées.",
    hint_discount: "Réduit le prix du véhicule avant taxes.",
    hint_rust_default: "Par défaut: 1398$",
    hint_tag_default: "Par défaut: 695$ (plus taxes)",
    hint_warranty: "FWD/AWD remplit automatiquement le prix, vous pouvez modifier.",

    // Buttons
    btn_decode_vin: "Décoder le NIV",
    btn_reset: "Réinitialiser l’exemple",
    btn_print: "Imprimer la soumission",
    btn_print_compare: "Imprimer comparatif",

    // Results list
    r_price: "Prix du véhicule (avant taxes)",
    r_price_tax: "Prix (avec taxes)",
    r_addons: "Options (avant taxes)",
    r_addons_tax: "Options (avec taxes)",
    r_trade_tax: "Échange (taxes ajoutées)",
    r_payoff: "Solde à payer (échange)",
    r_fees: "Total des frais",
    r_amount_financed: "Montant financé",
    r_total_paid: "Total des paiements",
    r_interest: "Intérêts totaux",

    chip_province: "Province",
    chip_tax: "Taxes",
    chip_fees: "Frais",

    // Print common
    dealer: "Toyota Gatineau",
    generated: "Généré",
    vehicle: "Véhicule",
    vin: "NIV",
    stock: "Stock#",
    province: "Province",
    tax: "Taxes",
    apr: "Taux",
    term: "Terme",

    // Detailed print
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
    other_fees: "Autres frais",
    ont_safety: "Frais d’inspection Ontario",
    total_fees: "Total des frais",
    amount_financed: "Montant financé",
    total_payments: "Total des paiements",
    total_interest: "Intérêts totaux",
    note_tradein_tax:
      "Notes: Taxes ajoutées sur l’échange. Frais Ontario financés avec taxes ajoutées (affichés avant taxes). Options taxées selon la province.",

    pay_monthly: "Paiement mensuel (taxes incluses)",
    pay_biweekly: "Paiement aux 2 semaines (taxes incluses)",
    pay_weekly: "Paiement hebdomadaire (taxes incluses)",

    // Comparison print
    opt1: "ARGENT",
    opt2: "OR",
    opt3: "PLATINE",
    cmp_car_before: "Prix (avant options et taxes)",
    cmp_total_tax_addons: "Total (taxes + options)",
    client_choice: "Choix du client (X)",

    // Add-on names
    addon_rust: "Antirouille",
    addon_tag: "Système TAG",
    addon_warranty: "Garantie",

    // VIN status
    vin_need_17: "Le NIV doit contenir 17 caractères.",
    vin_decoding: "Décodage du NIV...",
    vin_ok: "NIV décodé avec succès.",
    vin_missing: "Décodé, mais infos incomplètes. Entrez le véhicule manuellement.",
    vin_fail: "Impossible de décoder le NIV. Vérifiez le NIV ou entrez le véhicule manuellement."
  }
};

let LANG = "en";
function t(key) {
  const pack = I18N[LANG] || I18N.en;
  return pack[key] ?? I18N.en[key] ?? key;
}

/* ---------------------------
   Helpers
--------------------------- */
const el = (id) => document.getElementById(id);

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clampNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function nicePct(p) {
  const s = (p * 100).toFixed(3);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

function fmt(n) {
  const locale = LANG === "fr" ? "fr-CA" : "en-CA";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CAD" }).format(n);
}

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
const PROVINCES = {
  QC: { name: "Quebec", taxRate: 0.14975 },
  ON: { name: "Ontario", taxRate: 0.13 },
  BC: { name: "British Columbia", taxRate: 0.12 },
  AB: { name: "Alberta", taxRate: 0.05 }
};

const WARRANTY_DEFAULTS = {
  none: 0,
  fwd: 2795,
  awd: 2995,
  other: 0
};

// Ontario safety fee base shown in input and on sheets (NO tax shown there)
const ON_SAFETY_BASE = 549.95;

// Clean add-on config (easy to add more)
const ADDONS = [
  {
    key: "rust",
    labelKey: "addon_rust",
    includeId: "includeRust",
    priceId: "rustProofing",
    defaultPrice: 1398
  },
  {
    key: "tag",
    labelKey: "addon_tag",
    includeId: "includeTag",
    priceId: "tagPrice",
    defaultPrice: 695
  }
  // warranty is special (type + price)
];

/* ---------------------------
   Language apply
--------------------------- */
function applyLanguageToUI() {
  // Translate text nodes
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (!key) return;
    node.textContent = t(key);
  });

  // Translate placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (!key) return;
    node.setAttribute("placeholder", t(key));
  });

  // TAG section (in case you did not put data-i18n on those)
  const tagLabel = document.querySelector('label[for="includeTag"]');
  if (tagLabel) tagLabel.textContent = t("label_tag");

  const tagPriceLabel = document.querySelector('label[for="tagPrice"]');
  if (tagPriceLabel) tagPriceLabel.textContent = t("label_tag_price");

  const tagSel = el("includeTag");
  if (tagSel && tagSel.options && tagSel.options.length >= 2) {
    const cur = tagSel.value;
    tagSel.options[0].textContent = t("opt_no");
    tagSel.options[1].textContent = t("opt_include");
    tagSel.value = cur;
  }

  const tagHint = tagSel?.closest(".field")?.querySelector(".hint");
  if (tagHint) tagHint.textContent = t("hint_tag_default");

  updateVehicleDisplay();
  recompute();
}

function setLanguage(lang) {
  LANG = lang === "fr" ? "fr" : "en";
  try {
    localStorage.setItem("tg_lang", LANG);
  } catch (_) {}
  applyLanguageToUI();
}

/* ---------------------------
   VIN decode (NHTSA)
--------------------------- */
function cleanVin(raw) {
  return (raw || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function setVinStatus(msg) {
  const node = el("vinStatus");
  if (node) node.textContent = msg || "";
}

function updateVehicleDisplay() {
  const vin = cleanVin(el("vin")?.value);
  const vehicleTitle = (el("vehicleTitle")?.value || "").trim();

  if (el("vehicleTitleOut")) el("vehicleTitleOut").textContent = vehicleTitle || t("ui_vehicle_not_set");
  if (el("vinOut")) el("vinOut").textContent = vin ? `${t("vin")}: ${vin}` : "";
}

async function decodeVin() {
  const vinInput = el("vin");
  const btn = el("decodeVinBtn");
  if (!vinInput) return;

  const vin = cleanVin(vinInput.value);
  vinInput.value = vin;

  if (vin.length !== 17) {
    setVinStatus(t("vin_need_17"));
    updateVehicleDisplay();
    return;
  }

  setVinStatus(t("vin_decoding"));
  if (btn) btn.disabled = true;

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const row = data?.Results?.[0];
    if (!row) throw new Error("No results");

    const year = (row.ModelYear || "").trim();
    const make = (row.Make || "").trim();
    const model = (row.Model || "").trim();
    const trim = (row.Trim || "").trim();
    const series = (row.Series || "").trim();
    const body = (row.BodyClass || "").trim();

    if (!year || !make || !model) {
      setVinStatus(t("vin_missing"));
      updateVehicleDisplay();
      return;
    }

    const extras = [trim, series].filter(Boolean).join(" ").trim();
    const title = [year, make, model, extras || body]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ");

    if (el("vehicleTitle")) el("vehicleTitle").value = title;

    setVinStatus(t("vin_ok"));
    updateVehicleDisplay();
    recompute();
  } catch (e) {
    setVinStatus(t("vin_fail"));
    updateVehicleDisplay();
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ---------------------------
   Warranty auto-fill
--------------------------- */
let warrantyAutoFillEnabled = true;

function updateWarrantyPriceFromType() {
  const type = el("warrantyType")?.value || "none";
  const suggested = WARRANTY_DEFAULTS[type] ?? 0;
  if (warrantyAutoFillEnabled && el("warrantyPrice")) el("warrantyPrice").value = suggested;
}

/* ---------------------------
   Ontario safety fee behavior
--------------------------- */
function syncSafetyFeeWithProvince() {
  const provinceKey = el("province")?.value || "QC";
  const includeNode = el("includeSafetyFee");
  const feeNode = el("safetyFee");
  if (!includeNode || !feeNode) return;

  if (provinceKey === "ON") {
    includeNode.value = "yes";
    const cur = clampNumber(feeNode.value);

    // Force to 549.95 if it was 0 or old 550-ish
    if (cur === 0 || Math.abs(cur - 550) < 0.2) {
      feeNode.value = ON_SAFETY_BASE;
    }
  } else {
    includeNode.value = "no";
    feeNode.value = 0;
  }
}

/* ---------------------------
   Add-ons (clean system)
--------------------------- */
function getAddonsForScenario({ useRust = null, useWarranty = null } = {}) {
  // Rust + TAG from config
  const items = [];

  for (const a of ADDONS) {
    const includeUI = (el(a.includeId)?.value || "no") === "yes";
    const price = clampNumber(el(a.priceId)?.value);

    let include = includeUI;

    // Only rust is scenario-controlled
    if (a.key === "rust" && useRust !== null) include = !!useRust;

    if (include && price > 0) {
      items.push({
        key: a.key,
        label: t(a.labelKey),
        price
      });
    }
  }

  // Warranty is special (scenario-controlled)
  const warrantyPrice = clampNumber(el("warrantyPrice")?.value);
  const warrantyType = el("warrantyType")?.value || "none";
  const warrantyUIIncluded = warrantyType !== "none" && warrantyPrice > 0;

  let includeWarranty = warrantyUIIncluded;
  if (useWarranty !== null) includeWarranty = !!useWarranty;

  if (includeWarranty && warrantyPrice > 0) {
    items.push({
      key: "warranty",
      label: t("addon_warranty"),
      price: warrantyPrice
    });
  }

  const totalBeforeTax = items.reduce((s, x) => s + (x.price || 0), 0);
  return { items, totalBeforeTax };
}

function buildAddonListHtml(items, maxLines = 0) {
  const names = (items || []).map((x) => escapeHtml(x.label));

  const lines = names.length ? names : [escapeHtml(t("addon_none"))];

  // Pad with invisible lines to keep columns aligned (comparison sheet)
  if (maxLines > 0) {
    while (lines.length < maxLines) lines.push(`<span style="visibility:hidden">.</span>`);
  }

  const lineHtml = lines
    .map(
      (name) =>
        `<div style="margin:2px 0; font-size:12px; line-height:1.15;">${name}</div>`
    )
    .join("");

  return `
    <div style="margin-top:6px;">
      <div style="font-weight:700; margin-bottom:4px;">${escapeHtml(t("addons_included"))}</div>
      ${lineHtml}
    </div>
  `;
}

/* ---------------------------
   Core calculations
--------------------------- */
function getPaymentMeta(termMonths, freq) {
  if (freq === "biweekly") return { perYear: 26, totalPayments: Math.round((termMonths / 12) * 26), labelKey: "pay_biweekly" };
  if (freq === "weekly") return { perYear: 52, totalPayments: Math.round((termMonths / 12) * 52), labelKey: "pay_weekly" };
  return { perYear: 12, totalPayments: termMonths, labelKey: "pay_monthly" };
}

function computeTotals({ useRust = null, useWarranty = null } = {}) {
  const provinceKey = el("province")?.value || "QC";
  const rules = PROVINCES[provinceKey] || PROVINCES.QC;
  const taxRate = rules.taxRate;

  // Inputs
  const price = clampNumber(el("price")?.value);
  const tradeInEntered = clampNumber(el("tradeIn")?.value);
  const payoff = clampNumber(el("payoff")?.value);
  const downPayment = clampNumber(el("downPayment")?.value);

  const apr = clampNumber(el("rate")?.value);
  const termMonths = Math.max(1, Math.floor(clampNumber(el("term")?.value)));

  // Discount (before tax)
  const discount = clampNumber(el("discount")?.value);
  const discountedPrice = Math.max(0, price - discount);

  // Add-ons
  const addons = getAddonsForScenario({ useRust, useWarranty });
  const addonsBeforeTax = addons.totalBeforeTax;
  const addonsWithTax = addonsBeforeTax * (1 + taxRate);

  // Vehicle total with tax + add-ons
  const baseWithTax = discountedPrice * (1 + taxRate);
  const priceWithTax = baseWithTax + addonsWithTax;

  // Trade-in with tax added on top (your rule)
  const tradeInWithTax = tradeInEntered * (1 + taxRate);

  // Fees
  const extraFees = clampNumber(el("extraFees")?.value);

  const includeSafety = (el("includeSafetyFee")?.value || "no") === "yes";
  const safetyFeeBase = includeSafety ? clampNumber(el("safetyFee")?.value) : 0;

  // IMPORTANT:
  // safety fee is FINANCED with tax added, but displayed as base on sheet
  const safetyFeeFinanced = safetyFeeBase * (1 + taxRate);

  const totalFeesDisplay = extraFees + safetyFeeBase;
  const totalFeesFinanced = extraFees + safetyFeeFinanced;

  // Amount financed
  let amountFinanced = priceWithTax - tradeInWithTax + payoff + totalFeesFinanced - downPayment;
  if (amountFinanced < 0) amountFinanced = 0;

  // Payment frequency
  const freq = el("paymentFreq")?.value || "monthly";
  const pm = getPaymentMeta(termMonths, freq);

  const payment = calcPayment(amountFinanced, apr, pm.perYear, pm.totalPayments);
  const totalPaid = payment * pm.totalPayments;
  const totalInterest = Math.max(0, totalPaid - amountFinanced);

  return {
    provinceKey,
    taxRate,

    vin: cleanVin(el("vin")?.value),
    vehicleTitle: (el("vehicleTitle")?.value || "").trim(),
    stockNumber: (el("stockNumber")?.value || "").trim(),

    // Notes (kept like before)
    discountNote: (el("discountNote")?.value || "").trim(),
    downPaymentNote: (el("downPaymentNote")?.value || "").trim(),

    // Pricing
    price,
    discount,
    discountedPrice,
    addonsItems: addons.items,
    addonsBeforeTax,
    addonsWithTax,
    priceWithTax,

    // Trade-in
    tradeInEntered,
    tradeInWithTax,
    payoff,

    // Fees
    extraFees,
    safetyFeeBase,
    safetyFeeFinanced,
    totalFeesDisplay,

    // Financing
    downPayment,
    apr,
    termMonths,
    amountFinanced,
    payment,
    paymentLabelKey: pm.labelKey,
    totalPaid,
    totalInterest
  };
}

/* ---------------------------
   Recompute UI outputs
--------------------------- */
function recompute() {
  const s = computeTotals();

  if (el("paymentOut")) el("paymentOut").textContent = fmt(s.payment);
  if (el("paymentLabel")) el("paymentLabel").textContent = t(s.paymentLabelKey);

  if (el("provinceChip")) el("provinceChip").textContent = `${t("chip_province")}: ${s.provinceKey}`;
  if (el("taxChip")) el("taxChip").textContent = `${t("chip_tax")}: ${nicePct(s.taxRate)}%`;
  if (el("feeChip")) el("feeChip").textContent = `${t("chip_fees")}: ${fmt(s.totalFeesDisplay)}`;

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

  updateVehicleDisplay();
}

/* ---------------------------
   Print mode (avoid blank page + set orientation)
--------------------------- */
function setPrintMode(orientation) {
  const id = "tg_print_style";
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }

  const pageSize = orientation === "landscape" ? "landscape" : "portrait";

  style.textContent = `
    #printArea { display: none; }

    @media print {
      @page { size: ${pageSize}; margin: 10mm; }

      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body > *:not(#printArea) { display: none !important; }

      #printArea { display: block !important; }
      #printArea .printPage,
      #printArea .cmpPage { page-break-after: avoid !important; break-after: avoid !important; }

      /* Prevent stray extra page */
      #printArea { height: auto !important; overflow: visible !important; }
    }
  `;
}

/* ---------------------------
   Detailed print HTML (like before + add-on list)
--------------------------- */
function buildPrintHtml(summary) {
  const locale = LANG === "fr" ? "fr-CA" : "en-CA";
  const dateStr = new Date().toLocaleString(locale);

  return `
    <div class="printPage">
      <div class="printHeader">
        <div>
          <div class="printTitle">${escapeHtml(t("detailed_title"))}</div>
          <div class="printSub">${escapeHtml(t("generated"))}: ${escapeHtml(dateStr)}</div>

          ${summary.vehicleTitle ? `<div class="printSub">${escapeHtml(t("vehicle"))}: ${escapeHtml(summary.vehicleTitle)}</div>` : ""}
          ${summary.vin ? `<div class="printSub">${escapeHtml(t("vin"))}: ${escapeHtml(summary.vin)}</div>` : ""}
          ${summary.stockNumber ? `<div class="printSub">${escapeHtml(t("stock"))}: ${escapeHtml(summary.stockNumber)}</div>` : ""}

          <div class="printSub">${escapeHtml(t("province"))}: ${escapeHtml(summary.provinceKey)}</div>
          ${summary.discountNote ? `<div class="printSub">Discount note: ${escapeHtml(summary.discountNote)}</div>` : ""}
          ${summary.downPaymentNote ? `<div class="printSub">Down payment note: ${escapeHtml(summary.downPaymentNote)}</div>` : ""}
        </div>

        <div style="text-align:right">
          <div class="printSub">${escapeHtml(t("tax"))}: ${escapeHtml(nicePct(summary.taxRate))}%</div>
          <div class="printSub">${escapeHtml(t("term"))}: ${escapeHtml(String(summary.termMonths))}</div>
          <div class="printSub">${escapeHtml(t("apr"))}: ${escapeHtml(String(summary.apr))}%</div>
        </div>
      </div>

      <div class="printGrid">
        <div class="printBox">
          <h3>${escapeHtml(t("pricing"))}</h3>

          <div class="printRow"><span>${escapeHtml(t("car_price_before_tax"))}</span><b>${fmt(summary.price)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("discount_before_tax"))}</span><b>-${fmt(summary.discount)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("price_after_discount"))}</span><b>${fmt(summary.discountedPrice)}</b></div>

          <!-- NEW: add-ons list (names only, stacked) -->
          ${buildAddonListHtml(summary.addonsItems, 0)}

          <!-- Keep totals like before -->
          <div class="printRow"><span>${escapeHtml(t("addons_before_tax"))}</span><b>${fmt(summary.addonsBeforeTax)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("addons_with_tax"))}</span><b>${fmt(summary.addonsWithTax)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("car_price_with_tax_addons"))}</span><b>${fmt(summary.priceWithTax)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("down_payment"))}</span><b>-${fmt(summary.downPayment)}</b></div>
        </div>

        <div class="printBox">
          <h3>${escapeHtml(t("trade"))}</h3>
          <div class="printRow"><span>${escapeHtml(t("trade_entered"))}</span><b>${fmt(summary.tradeInEntered)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("trade_with_tax_added"))}</span><b>${fmt(summary.tradeInWithTax)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("payoff_added"))}</span><b>${fmt(summary.payoff)}</b></div>
        </div>

        <div class="printBox">
          <h3>${escapeHtml(t("fees"))}</h3>
          

          <!-- Ontario safety fee displayed BEFORE tax -->
          ${
            summary.provinceKey === "ON" && summary.safetyFeeBase > 0
              ? `<div class="printRow"><span>${escapeHtml(t("ont_safety"))}</span><b>${fmt(summary.safetyFeeBase)}</b></div>`
              : ""
          }

          <div class="printRow"><span>${escapeHtml(t("total_fees"))}</span><b>${fmt(summary.totalFeesDisplay)}</b></div>
        </div>

        <div class="printBox">
          <h3>${escapeHtml(t("financing"))}</h3>
          <div class="printRow"><span><b>${escapeHtml(t("amount_financed"))}</b></span><b>${fmt(summary.amountFinanced)}</b></div>
          <div class="printRow"><span>${escapeHtml(t(summary.paymentLabelKey))}</span><b class="printBig">${fmt(summary.payment)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("total_payments"))}</span><b>${fmt(summary.totalPaid)}</b></div>
          <div class="printRow"><span>${escapeHtml(t("total_interest"))}</span><b>${fmt(summary.totalInterest)}</b></div>
        </div>
      </div>

      <div class="printNote">${escapeHtml(t("note_tradein_tax"))}</div>
    </div>
  `;
}

function printQuote() {
  const summary = computeTotals();
  const area = el("printArea");
  if (!area) return;

  setPrintMode("portrait");
  area.innerHTML = buildPrintHtml(summary);

  const cleanup = () => {
    area.innerHTML = "";
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}

/* ---------------------------
   Comparison print HTML (like before + add-on list + landscape)
   Order:
   1) Rust only
   2) Warranty only
   3) Rust + Warranty
--------------------------- */
function buildComparisonPrintHtml(s1, s2, s3) {
  const locale = LANG === "fr" ? "fr-CA" : "en-CA";
  const dateStr = new Date().toLocaleString(locale);

  const taxPct = nicePct(s1.taxRate);
  const showSafetyRow = s1.provinceKey === "ON" && s1.safetyFeeBase > 0;

  // Determine max lines for addon list to keep alignment
  // (Rust, TAG, Warranty) => max 3 lines usually
  const maxLines = 3;

  function col(label, s) {
    return `
      <div class="cmpCol">
        <div class="cmpColTitle">${escapeHtml(label)}</div>

        <div class="cmpRow"><span>${escapeHtml(t("cmp_car_before"))}</span><b>${fmt(s.discountedPrice)}</b></div>

        <!-- NEW: add-ons list (names only, stacked). Padded to keep alignment -->
        ${buildAddonListHtml(s.addonsItems, maxLines)}

        <!-- Keep totals like before -->
        <div class="cmpRow"><span>${escapeHtml(t("addons_before_tax"))}</span><b>${fmt(s.addonsBeforeTax)}</b></div>
        <div class="cmpRow"><span>${escapeHtml(t("cmp_total_tax_addons"))}</span><b>${fmt(s.priceWithTax)}</b></div>

        <div class="cmpDivider"></div>

        
        ${showSafetyRow ? `<div class="cmpRow"><span>${escapeHtml(t("ont_safety"))}</span><b>${fmt(s.safetyFeeBase)}</b></div>` : ""}
        <div class="cmpRow"><span>${escapeHtml(t("total_fees"))}</span><b>${fmt(s.totalFeesDisplay)}</b></div>

        <!-- Trade & down payment shown on the sheet (same for all options) -->
        <div class="cmpRow"><span>${escapeHtml(t("trade_with_tax_added"))}</span><b>${fmt(s.tradeInWithTax)}</b></div>
        <div class="cmpRow"><span>${escapeHtml(t("down_payment"))}</span><b>-${fmt(s.downPayment)}</b></div>

        <div class="cmpDivider"></div>

        <div class="cmpRow"><span>${escapeHtml(t("amount_financed"))}</span><b>${fmt(s.amountFinanced)}</b></div>
        <div class="cmpRow big"><span>${escapeHtml(t(s.paymentLabelKey))}</span><b>${fmt(s.payment)}</b></div>

        <div class="cmpPick">
          <div class="cmpPickBox"></div>
          <div class="cmpPickText">${escapeHtml(t("client_choice"))}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="cmpPage">
      <div class="cmpHeader">
        <div class="cmpBrand">
          <img class="cmpLogo" src="./logo.jpg" alt="${escapeHtml(t("dealer"))}">
          <div>
            <div class="cmpDealer">${escapeHtml(t("dealer"))}</div>
            <div class="cmpSub">${escapeHtml(t("generated"))}: ${escapeHtml(dateStr)}</div>

            ${s1.vehicleTitle ? `<div class="cmpSub">${escapeHtml(t("vehicle"))}: ${escapeHtml(s1.vehicleTitle)}</div>` : ""}
            ${s1.vin ? `<div class="cmpSub">${escapeHtml(t("vin"))}: ${escapeHtml(s1.vin)}</div>` : ""}
            ${s1.stockNumber ? `<div class="cmpSub">${escapeHtml(t("stock"))}: ${escapeHtml(s1.stockNumber)}</div>` : ""}

            <div class="cmpSub">${escapeHtml(t("province"))}: ${escapeHtml(s1.provinceKey)} | ${escapeHtml(t("tax"))}: ${escapeHtml(taxPct)}%</div>
          </div>
        </div>

        <div class="cmpRight">
          <div class="cmpSub">${escapeHtml(t("apr"))}: ${escapeHtml(String(s1.apr))}%</div>
          <div class="cmpSub">${escapeHtml(t("term"))}: ${escapeHtml(String(s1.termMonths))}</div>
        </div>
      </div>

      <div class="cmpGrid">
        ${col(t("opt1"), s1)}
        ${col(t("opt2"), s2)}
        ${col(t("opt3"), s3)}
      </div>
    </div>
  `;
}

function printComparisonQuote() {
  // Order requested:
  // 1 rust only
  // 2 warranty only
  // 3 both
  const option1 = computeTotals({ useRust: true, useWarranty: false });
  const option2 = computeTotals({ useRust: false, useWarranty: true });
  const option3 = computeTotals({ useRust: true, useWarranty: true });

  const area = el("printArea");
  if (!area) return;

  setPrintMode("landscape");
  area.innerHTML = buildComparisonPrintHtml(option1, option2, option3);

  const cleanup = () => {
    area.innerHTML = "";
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}

/* ---------------------------
   Bind events
--------------------------- */
function bindInputs() {
  const ids = [
    "lang",
    "province",
    "price",
    "tradeIn",
    "payoff",
    "downPayment",
    "rate",
    "term",
    "extraFees",
    "paymentFreq",
    "discount",
    "includeSafetyFee",
    "safetyFee",
    "downPaymentNote",
    "discountNote",
    "vin",
    "vehicleTitle",
    "stockNumber",
    "includeRust",
    "rustProofing",
    "includeTag",
    "tagPrice",
    "warrantyType",
    "warrantyPrice"
  ];

  ids.forEach((id) => {
    const node = el(id);
    if (!node) return;
    node.addEventListener("input", recompute);
    node.addEventListener("change", recompute);
  });

  // Language
  const langSel = el("lang");
  if (langSel) {
    langSel.addEventListener("change", () => setLanguage(langSel.value));
  }

  // Province change
  const prov = el("province");
  if (prov) {
    prov.addEventListener("change", () => {
      syncSafetyFeeWithProvince();
      recompute();
    });
  }

  // Warranty type auto-fill
  const wt = el("warrantyType");
  if (wt) {
    wt.addEventListener("change", () => {
      warrantyAutoFillEnabled = true;
      updateWarrantyPriceFromType();
      recompute();
    });
  }

  const wp = el("warrantyPrice");
  if (wp) {
    wp.addEventListener("input", () => {
      warrantyAutoFillEnabled = false;
      recompute();
    });
  }

  // VIN decode
  const vinBtn = el("decodeVinBtn");
  if (vinBtn) vinBtn.addEventListener("click", decodeVin);

  // Print
  const pb = el("printBtn");
  if (pb) pb.addEventListener("click", printQuote);

  const pcb = el("printCompareBtn");
  if (pcb) pcb.addEventListener("click", printComparisonQuote);

  // Reset
  const rb = el("resetBtn");
  if (rb) {
    rb.addEventListener("click", () => {
      if (el("province")) el("province").value = "QC";
      if (el("price")) el("price").value = 25000;
      if (el("tradeIn")) el("tradeIn").value = 5000;
      if (el("payoff")) el("payoff").value = 0;
      if (el("downPayment")) el("downPayment").value = 0;

      if (el("rate")) el("rate").value = 8.99;
      if (el("term")) el("term").value = "72";

      if (el("paymentFreq")) el("paymentFreq").value = "monthly";
      if (el("extraFees")) el("extraFees").value = 0;

      if (el("discount")) el("discount").value = 0;
      if (el("discountNote")) el("discountNote").value = "";
      if (el("downPaymentNote")) el("downPaymentNote").value = "";

      // Add-ons
      if (el("includeRust")) el("includeRust").value = "yes";
      if (el("rustProofing")) el("rustProofing").value = 1398;

      if (el("includeTag")) el("includeTag").value = "no";
      if (el("tagPrice")) el("tagPrice").value = 695;

      // VIN + vehicle
      if (el("vin")) el("vin").value = "";
      if (el("vehicleTitle")) el("vehicleTitle").value = "";
      if (el("stockNumber")) el("stockNumber").value = "";
      setVinStatus("");

      // Warranty
      if (el("warrantyType")) el("warrantyType").value = "none";
      warrantyAutoFillEnabled = true;
      updateWarrantyPriceFromType();

      // Safety fee
      syncSafetyFeeWithProvince();

      updateVehicleDisplay();
      recompute();
    });
  }
}

/* ---------------------------
   Init
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Load saved language
  try {
    const saved = localStorage.getItem("tg_lang");
    if (saved === "fr" || saved === "en") LANG = saved;
  } catch (_) {}

  if (el("lang")) el("lang").value = LANG;

  // Set default add-on prices if empty
  for (const a of ADDONS) {
    const priceNode = el(a.priceId);
    if (priceNode && clampNumber(priceNode.value) === 0) priceNode.value = a.defaultPrice;
  }

  // Warranty default
  updateWarrantyPriceFromType();

  // Ontario safety fee behavior (force 549.95 for ON, otherwise 0)
  syncSafetyFeeWithProvince();

  // Apply translations + placeholders
  applyLanguageToUI();

  // Bind and compute
  bindInputs();
  updateVehicleDisplay();
  recompute();
});
