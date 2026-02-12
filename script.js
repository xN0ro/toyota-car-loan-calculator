/* =========================================
   Toyota Gatineau Loan Calculator - script.js
   Features:
   - Province taxes + Ontario editable safety fee (auto on ON)
   - Trade-in tax added on top (your custom rule)
   - Discount, down payment, payoff, extra fees
   - Rustproofing toggle + price
   - Warranty type autofill (FWD/AWD/Other/None) + manual override
   - Term select (12..96), payment frequency (monthly/biweekly/weekly)
   - VIN decode via NHTSA (fills vehicle title)
   - Stock# printed
   - Two print modes:
     1) Detailed quote
     2) Comparison: 3 options (Rust+Warranty, Rust only, Warranty only) with checkbox
   - EN/FR language switch, affects prints too
========================================= */

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


// ---------------------------
// i18n (EN / FR) for UI + Print
// ---------------------------
const I18N = {
  en: {
    // Top UI
    ui_language: "Language",
    ui_title: "Loan Calculator",
    ui_tax_included: "Tax Included",
    ui_values_cad: "All values CAD.",
    ui_vehicle_not_set: "Vehicle not set",

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
    label_warranty: "Warranty 3y / 60,000 km",
    label_warranty_price: "Warranty price",

    // Buttons
    btn_decode_vin: "Decode VIN",
    btn_reset: "Reset example",
    btn_print: "Print quote",
    btn_print_compare: "Print Comparison",

    // Options
    opt_include: "Include",
    opt_no: "No",
    freq_monthly: "Monthly",
    freq_biweekly: "Bi-weekly (26/yr)",
    freq_weekly: "Weekly (52/yr)",
    w_none: "None",
    w_fwd: "FWD (suggested $2795)",
    w_awd: "AWD (suggested $2995)",
    w_other: "Other (manual)",
    prov_qc: "Quebec (14.975%)",
    prov_on: "Ontario (13%)",
    prov_bc: "British Columbia (12%)",
    prov_ab: "Alberta (5%)",


    // Placeholders
    ph_vin: "17 characters",
    ph_vehicleTitle: "Example: 2021 Toyota RAV4 XLE AWD",
    ph_downNote: "Example: Cash / Debit / Transfer",
    ph_discountNote: "Example: Promo, Manager discount",

    // Hints
    hint_on_550: "Ontario adds $550 automatically.",
    hint_trade_tax: "Your rule: trade-in gets tax added on top.",
    hint_payoff: "Payoff is added to amount financed.",
    hint_safety_edit:
      "Auto-fills to $550 when Ontario is selected, but you can edit or remove it.",
    hint_discount: "This reduces the vehicle price before taxes.",
    hint_rust_default: "Default is $1398",
    hint_warranty:
      "Selecting FWD/AWD auto-fills the price, you can still change it.",

    // Results labels
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
    ui_note_rules:
      "Note: This uses your custom rules (trade-in tax added, Ontario $550, add-ons taxed).",

    // Payment label (dynamic, you already handle paymentLabel separately too)
    ui_payment_label: "Monthly payment (tax included)",

    // Print keys you already use (keep them)
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
      "Notes: Trade-in has tax added, Ontario safety fee is optional and editable, add-ons are taxed by province.",
    pay_monthly: "Monthly payment (tax included)",
    pay_biweekly: "Bi-weekly payment (tax included)",
    pay_weekly: "Weekly payment (tax included)",
    cmp_title: "Payment Options Comparison",
    opt1: "Option 1 (Rust + Warranty)",
    opt2: "Option 2 (Rust only)",
    opt3: "Option 3 (Warranty only)",
    cmp_car_before: "Car price (before add-ons & tax)",
    cmp_total_tax_addons: "Total with tax + add-ons",
    client_choice: "Client choice (X)",

    // VIN status
    vin_need_17: "VIN must be 17 characters.",
    vin_decoding: "Decoding VIN...",
    vin_ok: "VIN decoded successfully.",
    vin_missing:
      "Decoded, but basic info was missing. Enter the vehicle title manually.",
    vin_fail:
      "Could not decode VIN. Check the VIN or enter vehicle info manually.",
    vehicle_not_set: "Vehicle not set"
  },

  fr: {
    // Top UI
    ui_language: "Langue",
    ui_title: "Calculateur de financement",
    ui_tax_included: "Taxes incluses",
    ui_values_cad: "Toutes les valeurs en CAD.",
    ui_vehicle_not_set: "Véhicule non défini",

    // Sections
    sec_vehicle: "Véhicule",
    sec_vehicle_province: "Véhicule et province",
    sec_tradein: "Échange",
    sec_loan: "Financement",
    sec_addons: "Options",
    sec_results: "Résultats",

    // Labels
    label_vin: "NIV",
    label_vehicleTitle: "Véhicule (Année Marque Modèle Version)",
    label_stock: "Stock#",
    label_province: "Province",
    label_price: "Prix du véhicule (avant taxes)",
    label_tradeIn: "Valeur d’échange (saisie)",
    label_payoff: "Solde à payer de l’échange",
    label_downPayment: "Mise de fonds",
    label_downPaymentNote: "Note mise de fonds (optionnel)",
    label_rate: "Taux (APR %)",
    label_term: "Terme (mois)",
    label_paymentFreq: "Fréquence de paiement",
    label_extraFees: "Autres frais",
    label_includeSafety: "Frais d’inspection Ontario",
    label_safety_amt: "Montant des frais d’inspection",
    label_discount: "Rabais (avant taxes)",
    label_discountNote: "Note de rabais (optionnel)",
    label_rust: "Antirouille",
    label_rust_price: "Prix antirouille",
    label_warranty: "Garantie 3 ans / 60 000 km",
    label_warranty_price: "Prix de la garantie",

    // Buttons
    btn_decode_vin: "Décoder le NIV",
    btn_reset: "Réinitialiser l’exemple",
    btn_print: "Imprimer la soumission",
    btn_print_compare: "Imprimer la comparaison",

    // Options
    opt_include: "Inclure",
    opt_no: "Non",
    freq_monthly: "Mensuel",
    freq_biweekly: "Aux 2 semaines (26/an)",
    freq_weekly: "Hebdomadaire (52/an)",
    w_none: "Aucune",
    w_fwd: "FWD (suggéré 2 795$)",
    w_awd: "AWD (suggéré 2 995$)",
    w_other: "Autre (manuel)",
    prov_qc: "Québec (14,975 %)",
    prov_on: "Ontario (13 %)",
    prov_bc: "Colombie-Britannique (12 %)",
    prov_ab: "Alberta (5 %)",


    // Placeholders
    ph_vin: "17 caractères",
    ph_vehicleTitle: "Ex: 2021 Toyota RAV4 XLE AWD",
    ph_downNote: "Ex: Comptant / Débit / Virement",
    ph_discountNote: "Ex: Promo, rabais gestionnaire",

    // Hints
    hint_on_550: "Ontario ajoute 550$ automatiquement.",
    hint_trade_tax: "Votre règle: taxes ajoutées sur l’échange.",
    hint_payoff: "Le solde est ajouté au montant financé.",
    hint_safety_edit:
      "Se remplit à 550$ en Ontario, mais vous pouvez modifier ou enlever.",
    hint_discount: "Réduit le prix du véhicule avant les taxes.",
    hint_rust_default: "Par défaut: 1 398$",
    hint_warranty:
      "Choisir FWD/AWD remplit le prix automatiquement, mais vous pouvez modifier.",

    // Results labels
    r_price: "Prix du véhicule (avant taxes)",
    r_price_tax: "Prix du véhicule (avec taxes)",
    r_addons: "Options (avant taxes)",
    r_addons_tax: "Options (avec taxes)",
    r_trade_tax: "Échange (taxes ajoutées)",
    r_payoff: "Solde à payer de l’échange",
    r_fees: "Total des frais",
    r_amount_financed: "Montant financé",
    r_total_paid: "Total des paiements",
    r_interest: "Intérêts totaux",
    ui_note_rules:
      "Note: Règles personnalisées (taxes ajoutées sur l’échange, 550$ Ontario, taxes sur options).",

    ui_payment_label: "Paiement mensuel (taxes incluses)",

    // Print keys you already use (keep them)
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
      "Notes: Taxes ajoutées sur l’échange, frais Ontario optionnels et modifiables, taxes appliquées sur les options selon la province.",
    pay_monthly: "Paiement mensuel (taxes incluses)",
    pay_biweekly: "Paiement aux 2 semaines (taxes incluses)",
    pay_weekly: "Paiement hebdomadaire (taxes incluses)",
    cmp_title: "Comparatif des options de paiement",
    opt1: "Option 1 (Antirouille + Garantie)",
    opt2: "Option 2 (Antirouille seulement)",
    opt3: "Option 3 (Garantie seulement)",
    cmp_car_before: "Prix (avant options et taxes)",
    cmp_total_tax_addons: "Total (taxes + options)",
    client_choice: "Choix du client (X)",

    // VIN status
    vin_need_17: "Le NIV doit contenir 17 caractères.",
    vin_decoding: "Décodage du NIV...",
    vin_ok: "NIV décodé avec succès.",
    vin_missing:
      "Décodé, mais infos incomplètes. Entrez le véhicule manuellement.",
    vin_fail:
      "Impossible de décoder le NIV. Vérifiez le NIV ou entrez le véhicule manuellement.",
    vehicle_not_set: "Véhicule non défini"
  }
};

// ---------------------------
// Language plumbing
// ---------------------------
let currentLang = "en";

function t(key) {
  // Try selected language, then fallback to English, else show key
  return (I18N[currentLang] && I18N[currentLang][key]) ||
         (I18N.en && I18N.en[key]) ||
         key;
}

function applyLanguageToUI() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const k = node.getAttribute("data-i18n");
    if (!k) return;
    node.textContent = t(k);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const k = node.getAttribute("data-i18n-placeholder");
    if (!k) return;
    node.setAttribute("placeholder", t(k));
  });
}

function bindLanguagePicker() {
  const sel = document.getElementById("lang");
  if (!sel) return;

  currentLang = sel.value || "en";
  applyLanguageToUI();

  sel.addEventListener("change", () => {
    currentLang = sel.value || "en";
    applyLanguageToUI();
    if (typeof recompute === "function") recompute();
  });
}




/* ---------------------------
   Helpers
--------------------------- */
const el = (id) => document.getElementById(id);

const fmt = (n) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    Number.isFinite(n) ? n : 0
  );

function clampNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function nicePct(p) {
  const s = (p * 100).toFixed(3);
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

function calcPayment(principal, annualRatePct, paymentsPerYear, totalPayments) {
  const r = (annualRatePct / 100) / paymentsPerYear;
  if (principal <= 0) return 0;
  if (r === 0) return principal / totalPayments;
  const denom = 1 - Math.pow(1 + r, -totalPayments);
  return denom === 0 ? 0 : (principal * r) / denom;
}

/* ---------------------------
   VIN helpers + decode (NHTSA)
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
  const title = (el("vehicleTitle")?.value || "").trim();

  const titleOut = el("vehicleTitleOut");
  const vinOut = el("vinOut");

  if (titleOut) titleOut.textContent = title || t("vehicle_not_set");
  if (vinOut) vinOut.textContent = vin ? `${t("vin")}: ${vin}` : "";
}

async function decodeVin() {
  const vinInput = el("vin");
  const btn = el("decodeVinBtn");
  if (!vinInput || !btn) return;

  const vin = cleanVin(vinInput.value);
  vinInput.value = vin;

  if (vin.length !== 17) {
    setVinStatus(t("vin_need_17"));
    updateVehicleDisplay();
    return;
  }

  setVinStatus(t("vin_decoding"));
  btn.disabled = true;

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(
      vin
    )}?format=json`;

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

    const vehicleTitle = el("vehicleTitle");
    if (vehicleTitle) vehicleTitle.value = title;

    setVinStatus(t("vin_ok"));
    updateVehicleDisplay();
    recompute();
  } catch (e) {
    setVinStatus(t("vin_fail"));
    updateVehicleDisplay();
  } finally {
    btn.disabled = false;
  }
}

/* ---------------------------
   Warranty auto-fill (stops overwriting if user types)
--------------------------- */
let warrantyAutoFillEnabled = true;

function updateWarrantyPriceFromType() {
  const type = el("warrantyType")?.value || "none";
  const suggested = WARRANTY_DEFAULTS[type] ?? 0;
  const wp = el("warrantyPrice");
  if (warrantyAutoFillEnabled && wp) wp.value = suggested;
}

/* ---------------------------
   Ontario safety fee auto behavior
--------------------------- */
function syncSafetyFeeWithProvince() {
  const provinceKey = el("province")?.value || "QC";
  const includeNode = el("includeSafetyFee");
  const feeNode = el("safetyFee");
  if (!includeNode || !feeNode) return;

  if (provinceKey === "ON") {
    includeNode.value = "yes";
    const current = clampNumber(feeNode.value);
    if (current === 0) feeNode.value = 550; // default, editable
  } else {
    includeNode.value = "no";
    feeNode.value = 0;
  }
}

/* ---------------------------
   Core calculation
--------------------------- */
function getPaymentLabelKey(freq) {
  if (freq === "biweekly") return "pay_biweekly";
  if (freq === "weekly") return "pay_weekly";
  return "pay_monthly";
}

function recompute() {
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

  const discount = clampNumber(el("discount")?.value);
  const discountedPrice = Math.max(0, price - discount);

  // Add-ons
  const includeRust = (el("includeRust")?.value || "no") === "yes";
  const rust = includeRust ? clampNumber(el("rustProofing")?.value) : 0;
  const warranty = clampNumber(el("warrantyPrice")?.value);

  const addonsBeforeTax = rust + warranty;
  const addonsWithTax = addonsBeforeTax * (1 + taxRate);

  // Price with tax + add-ons
  const baseWithTax = discountedPrice * (1 + taxRate);
  const priceWithTax = baseWithTax + addonsWithTax;

  // Your rule: trade-in tax added on top
  const tradeInWithTax = tradeInEntered * (1 + taxRate);

  // Fees
  const extraFees = clampNumber(el("extraFees")?.value);
  const includeSafety = (el("includeSafetyFee")?.value || "no") === "yes";
  const safetyFee = includeSafety ? clampNumber(el("safetyFee")?.value) : 0;
  const totalFees = extraFees + safetyFee;

  // Amount financed
  let amountFinanced = priceWithTax - tradeInWithTax + payoff + totalFees - downPayment;
  if (amountFinanced < 0) amountFinanced = 0;

  // Payment frequency
  const freq = el("paymentFreq")?.value || "monthly";
  let paymentsPerYear = 12;
  let totalPayments = termMonths;

  if (freq === "biweekly") {
    paymentsPerYear = 26;
    totalPayments = Math.round((termMonths / 12) * 26);
  } else if (freq === "weekly") {
    paymentsPerYear = 52;
    totalPayments = Math.round((termMonths / 12) * 52);
  }

  const payment = calcPayment(amountFinanced, apr, paymentsPerYear, totalPayments);
  const totalPaid = payment * totalPayments;
  const totalInterest = Math.max(0, totalPaid - amountFinanced);

  const paymentLabel = t(getPaymentLabelKey(freq));

  // Outputs
  if (el("paymentOut")) el("paymentOut").textContent = fmt(payment);
  if (el("paymentLabel")) el("paymentLabel").textContent = paymentLabel;

  if (el("provinceChip")) el("provinceChip").textContent = `${t("province")}: ${provinceKey}`;
  if (el("taxChip")) el("taxChip").textContent = `${t("tax")}: ${nicePct(taxRate)}%`;
  if (el("feeChip")) el("feeChip").textContent = `${t("fees")}: ${fmt(totalFees)}`;

  if (el("priceOut")) el("priceOut").textContent = fmt(price);
  if (el("priceWithTaxOut")) el("priceWithTaxOut").textContent = fmt(priceWithTax);

  if (el("addonsOut")) el("addonsOut").textContent = fmt(addonsBeforeTax);
  if (el("addonsWithTaxOut")) el("addonsWithTaxOut").textContent = fmt(addonsWithTax);

  if (el("tradeWithTaxOut")) el("tradeWithTaxOut").textContent = "-" + fmt(tradeInWithTax);
  if (el("payoffOut")) el("payoffOut").textContent = "+" + fmt(payoff);
  if (el("feesOut")) el("feesOut").textContent = "+" + fmt(totalFees);

  if (el("amountFinancedOut")) el("amountFinancedOut").textContent = fmt(amountFinanced);
  if (el("totalPaidOut")) el("totalPaidOut").textContent = fmt(totalPaid);
  if (el("interestOut")) el("interestOut").textContent = fmt(totalInterest);

  updateVehicleDisplay();
}

/* ---------------------------
   Detailed print
--------------------------- */
function gatherSummaryForPrint() {
  const provinceKey = el("province")?.value || "QC";
  const rules = PROVINCES[provinceKey] || PROVINCES.QC;
  const taxRate = rules.taxRate;

  const vin = cleanVin(el("vin")?.value);
  const vehicleTitle = (el("vehicleTitle")?.value || "").trim();
  const stockNumber = (el("stockNumber")?.value || "").trim();

  const price = clampNumber(el("price")?.value);
  const tradeInEntered = clampNumber(el("tradeIn")?.value);
  const payoff = clampNumber(el("payoff")?.value);
  const downPayment = clampNumber(el("downPayment")?.value);

  const apr = clampNumber(el("rate")?.value);
  const termMonths = Math.max(1, Math.floor(clampNumber(el("term")?.value)));

  const discount = clampNumber(el("discount")?.value);
  const discountedPrice = Math.max(0, price - discount);

  const discountNote = (el("discountNote")?.value || "").trim();
  const downPaymentNote = (el("downPaymentNote")?.value || "").trim();

  const includeRust = (el("includeRust")?.value || "no") === "yes";
  const rust = includeRust ? clampNumber(el("rustProofing")?.value) : 0;
  const warranty = clampNumber(el("warrantyPrice")?.value);

  const addonsBeforeTax = rust + warranty;
  const addonsWithTax = addonsBeforeTax * (1 + taxRate);

  const baseWithTax = discountedPrice * (1 + taxRate);
  const priceWithTax = baseWithTax + addonsWithTax;

  const tradeInWithTax = tradeInEntered * (1 + taxRate);

  const extraFees = clampNumber(el("extraFees")?.value);
  const includeSafety = (el("includeSafetyFee")?.value || "no") === "yes";
  const safetyFee = includeSafety ? clampNumber(el("safetyFee")?.value) : 0;
  const totalFees = extraFees + safetyFee;

  let amountFinanced = priceWithTax - tradeInWithTax + payoff + totalFees - downPayment;
  if (amountFinanced < 0) amountFinanced = 0;

  const freq = el("paymentFreq")?.value || "monthly";
  const paymentLabel = t(getPaymentLabelKey(freq));

  let paymentsPerYear = 12;
  let totalPayments = termMonths;
  if (freq === "biweekly") {
    paymentsPerYear = 26;
    totalPayments = Math.round((termMonths / 12) * 26);
  } else if (freq === "weekly") {
    paymentsPerYear = 52;
    totalPayments = Math.round((termMonths / 12) * 52);
  }

  const payment = calcPayment(amountFinanced, apr, paymentsPerYear, totalPayments);
  const totalPaid = payment * totalPayments;
  const totalInterest = Math.max(0, totalPaid - amountFinanced);

  return {
    provinceKey,
    taxPct: nicePct(taxRate),

    vin,
    vehicleTitle,
    stockNumber,

    price,
    discount,
    discountedPrice,
    discountNote,

    addonsBeforeTax,
    addonsWithTax,
    priceWithTax,

    tradeInEntered,
    tradeInWithTax,
    payoff,

    extraFees,
    safetyFee,
    totalFees,

    downPayment,
    downPaymentNote,

    apr,
    termMonths,
    amountFinanced,
    payment,
    paymentLabel,
    totalPaid,
    totalInterest
  };
}

function buildPrintHtml(summary) {
  const now = new Date();
  const dateStr = now.toLocaleString("en-CA");

  return `
    <div class="printPage">
      <div class="printHeader">
        <div>
          <div class="printTitle">${t("detailed_title")}</div>
          <div class="printSub">${t("generated")}: ${dateStr}</div>
          ${summary.vehicleTitle ? `<div class="printSub">${t("vehicle")}: ${summary.vehicleTitle}</div>` : ""}
          ${summary.vin ? `<div class="printSub">${t("vin")}: ${summary.vin}</div>` : ""}
          ${summary.stockNumber ? `<div class="printSub">${t("stock")}: ${summary.stockNumber}</div>` : ""}
          <div class="printSub">${t("province")}: ${summary.provinceKey}</div>
          ${summary.discountNote ? `<div class="printSub">${summary.discountNote}</div>` : ""}
          ${summary.downPaymentNote ? `<div class="printSub">${summary.downPaymentNote}</div>` : ""}
        </div>
        <div style="text-align:right">
          <div class="printSub">${t("tax")}: ${summary.taxPct}%</div>
          <div class="printSub">${t("term")}: ${summary.termMonths} months</div>
          <div class="printSub">${t("apr")}: ${summary.apr}%</div>
        </div>
      </div>

      <div class="printGrid">
        <div class="printBox">
          <h3>${t("pricing")}</h3>
          <div class="printRow"><span>${t("car_price_before_tax")}</span><b>${fmt(summary.price)}</b></div>
          <div class="printRow"><span>${t("discount_before_tax")}</span><b>-${fmt(summary.discount)}</b></div>
          <div class="printRow"><span>${t("price_after_discount")}</span><b>${fmt(summary.discountedPrice)}</b></div>
          <div class="printRow"><span>${t("addons_before_tax")}</span><b>${fmt(summary.addonsBeforeTax)}</b></div>
          <div class="printRow"><span>${t("addons_with_tax")}</span><b>${fmt(summary.addonsWithTax)}</b></div>
          <div class="printRow"><span>${t("car_price_with_tax_addons")}</span><b>${fmt(summary.priceWithTax)}</b></div>
          <div class="printRow"><span>${t("down_payment")}</span><b>-${fmt(summary.downPayment)}</b></div>
        </div>

        <div class="printBox">
          <h3>${t("trade")}</h3>
          <div class="printRow"><span>${t("trade_entered")}</span><b>${fmt(summary.tradeInEntered)}</b></div>
          <div class="printRow"><span>${t("trade_with_tax_added")}</span><b>${fmt(summary.tradeInWithTax)}</b></div>
          <div class="printRow"><span>${t("payoff_added")}</span><b>${fmt(summary.payoff)}</b></div>
        </div>

        <div class="printBox">
          <h3>${t("fees")}</h3>
          <div class="printRow"><span>${t("other_fees")}</span><b>${fmt(summary.extraFees)}</b></div>
          <div class="printRow"><span>${t("ont_safety")}</span><b>${fmt(summary.safetyFee)}</b></div>
          <div class="printRow"><span>${t("total_fees")}</span><b>${fmt(summary.totalFees)}</b></div>
        </div>

        <div class="printBox">
          <h3>${t("financing")}</h3>
          <div class="printRow"><span><b>${t("amount_financed")}</b></span><b>${fmt(summary.amountFinanced)}</b></div>
          <div class="printRow"><span>${summary.paymentLabel}</span><b class="printBig">${fmt(summary.payment)}</b></div>
          <div class="printRow"><span>${t("total_payments")}</span><b>${fmt(summary.totalPaid)}</b></div>
          <div class="printRow"><span>${t("total_interest")}</span><b>${fmt(summary.totalInterest)}</b></div>
        </div>
      </div>

      <div class="printNote">${t("note_tradein_tax")}</div>
    </div>
  `;
}

function printQuote() {
  const summary = gatherSummaryForPrint();
  const area = el("printArea");
  if (!area) return;
  area.innerHTML = buildPrintHtml(summary);
  window.print();
}

/* ---------------------------
   Comparison print (3 options)
--------------------------- */
function computeScenarioTotals({ useRust, useWarranty }) {
  const provinceKey = el("province")?.value || "QC";
  const rules = PROVINCES[provinceKey] || PROVINCES.QC;
  const taxRate = rules.taxRate;

  const vin = cleanVin(el("vin")?.value);
  const vehicleTitle = (el("vehicleTitle")?.value || "").trim();
  const stockNumber = (el("stockNumber")?.value || "").trim();

  const price = clampNumber(el("price")?.value);
  const tradeInEntered = clampNumber(el("tradeIn")?.value);
  const payoff = clampNumber(el("payoff")?.value);
  const downPayment = clampNumber(el("downPayment")?.value);

  const apr = clampNumber(el("rate")?.value);
  const termMonths = Math.max(1, Math.floor(clampNumber(el("term")?.value)));

  const discount = clampNumber(el("discount")?.value);
  const discountedPrice = Math.max(0, price - discount);

  const extraFees = clampNumber(el("extraFees")?.value);
  const includeSafety = (el("includeSafetyFee")?.value || "no") === "yes";
  const safetyFee = includeSafety ? clampNumber(el("safetyFee")?.value) : 0;
  const totalFees = extraFees + safetyFee;

  const rust = useRust ? clampNumber(el("rustProofing")?.value) : 0;
  const warranty = useWarranty ? clampNumber(el("warrantyPrice")?.value) : 0;

  const addonsBeforeTax = rust + warranty;
  const addonsWithTax = addonsBeforeTax * (1 + taxRate);

  const baseWithTax = discountedPrice * (1 + taxRate);
  const priceWithTax = baseWithTax + addonsWithTax;

  const tradeInWithTax = tradeInEntered * (1 + taxRate);

  let amountFinanced = priceWithTax - tradeInWithTax + payoff + totalFees - downPayment;
  if (amountFinanced < 0) amountFinanced = 0;

  const freq = el("paymentFreq")?.value || "monthly";
  const paymentLabel = t(getPaymentLabelKey(freq));

  let paymentsPerYear = 12;
  let totalPayments = termMonths;

  if (freq === "biweekly") {
    paymentsPerYear = 26;
    totalPayments = Math.round((termMonths / 12) * 26);
  } else if (freq === "weekly") {
    paymentsPerYear = 52;
    totalPayments = Math.round((termMonths / 12) * 52);
  }

  const payment = calcPayment(amountFinanced, apr, paymentsPerYear, totalPayments);

  return {
    provinceKey,
    taxRate,

    vin,
    vehicleTitle,
    stockNumber,

    apr,
    termMonths,
    paymentLabel,

    discountedPrice,
    addonsBeforeTax,
    priceWithTax,

    extraFees,
    safetyFee,
    totalFees,

    amountFinanced,
    payment
  };
}

function buildComparisonPrintHtml(s1, s2, s3) {
  const now = new Date();
  const dateStr = now.toLocaleString("en-CA");

  const taxPct = nicePct(s1.taxRate);
  const showSafetyRow = s1.provinceKey === "ON" && s1.safetyFee > 0;

  function col(label, s) {
    return `
      <div class="cmpCol">
        <div class="cmpColTitle">${label}</div>

        <div class="cmpRow"><span>${t("cmp_car_before")}</span><b>${fmt(s.discountedPrice)}</b></div>
        <div class="cmpRow"><span>${t("addons_before_tax")}</span><b>${fmt(s.addonsBeforeTax)}</b></div>
        <div class="cmpRow"><span>${t("cmp_total_tax_addons")}</span><b>${fmt(s.priceWithTax)}</b></div>

        <div class="cmpDivider"></div>

        <div class="cmpRow"><span>${t("other_fees")}</span><b>${fmt(s.extraFees)}</b></div>
        ${
          showSafetyRow
            ? `<div class="cmpRow"><span>${t("ont_safety")}</span><b>${fmt(s.safetyFee)}</b></div>`
            : ""
        }
        <div class="cmpRow"><span>${t("total_fees")}</span><b>${fmt(s.totalFees)}</b></div>

        <div class="cmpDivider"></div>

        <div class="cmpRow"><span>${t("amount_financed")}</span><b>${fmt(s.amountFinanced)}</b></div>
        <div class="cmpRow big"><span>${s.paymentLabel}</span><b>${fmt(s.payment)}</b></div>

        <div class="cmpPick">
          <div class="cmpPickBox"></div>
          <div class="cmpPickText">${t("client_choice")}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="cmpPage">
      <div class="cmpHeader">
        <div class="cmpBrand">
          <img class="cmpLogo" src="./logo.jpg" alt="${t("dealer")}">
          <div>
            <div class="cmpDealer">${t("dealer")}</div>
            <div class="cmpSub">${t("generated")}: ${dateStr}</div>
            ${s1.vehicleTitle ? `<div class="cmpSub">${t("vehicle")}: ${s1.vehicleTitle}</div>` : ""}
            ${s1.vin ? `<div class="cmpSub">${t("vin")}: ${s1.vin}</div>` : ""}
            ${s1.stockNumber ? `<div class="cmpSub">${t("stock")}: ${s1.stockNumber}</div>` : ""}
            <div class="cmpSub">${t("province")}: ${s1.provinceKey} | ${t("tax")}: ${taxPct}%</div>
          </div>
        </div>

        <div class="cmpRight">
          <div class="cmpSub">${t("apr")}: ${s1.apr}%</div>
          <div class="cmpSub">${t("term")}: ${s1.termMonths} months</div>
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
  const option1 = computeScenarioTotals({ useRust: true, useWarranty: true });
  const option2 = computeScenarioTotals({ useRust: true, useWarranty: false });
  const option3 = computeScenarioTotals({ useRust: false, useWarranty: true });

  const area = el("printArea");
  if (!area) return;

  area.innerHTML = buildComparisonPrintHtml(option1, option2, option3);
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
    "rustProofing",
    "includeRust",
    "discount",
    "includeSafetyFee",
    "safetyFee",
    "downPaymentNote",
    "discountNote",
    "vin",
    "vehicleTitle",
    "stockNumber",
    "warrantyType",
    "warrantyPrice"
  ];

  ids.forEach((id) => {
    const node = el(id);
    if (!node) return;
    node.addEventListener("input", recompute);
    node.addEventListener("change", recompute);
  });

  // Language select
  const langSel = el("lang");
  if (langSel) {
    langSel.value = currentLang;
    langSel.addEventListener("change", () => setLanguage(langSel.value));
  }

  // Province: auto safety fee in ON
  const prov = el("province");
  if (prov) {
    prov.addEventListener("change", () => {
      syncSafetyFeeWithProvince();
      recompute();
    });
  }

  // Warranty type: autofill, unless user typed manually
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

  // Print buttons
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

      if (el("includeRust")) el("includeRust").value = "yes";
      if (el("rustProofing")) el("rustProofing").value = 1398;

      if (el("vin")) el("vin").value = "";
      if (el("vehicleTitle")) el("vehicleTitle").value = "";
      if (el("stockNumber")) el("stockNumber").value = "";
      setVinStatus("");

      if (el("warrantyType")) el("warrantyType").value = "none";
      warrantyAutoFillEnabled = true;
      updateWarrantyPriceFromType();

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
  applyLanguageToUI();
  updateWarrantyPriceFromType();
  bindInputs();
  syncSafetyFeeWithProvince();
  updateVehicleDisplay();
  recompute();
  bindLanguagePicker();
  applyLanguageToUI();
});
