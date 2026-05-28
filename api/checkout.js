// api/checkout.js — Mollie betaling aanmaken
// Omgevingsvariabelen nodig: MOLLIE_API_KEY, SITE_URL

const { createMollieClient } = require("@mollie/api-client");
const fs = require("fs");
const path = require("path");

function readPromoCodes() {
  try {
    const filePath = path.join(process.cwd(), "promocodes.data");
    if (!fs.existsSync(filePath)) return {};

    const raw = fs.readFileSync(filePath, "utf8");
    const codes = {};

    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*\[([^\]]+)\]\s*=\s*['"]?(.+?)['"]?\s*$/);
      if (!match) continue;

      const code = match[1].trim().toUpperCase();
      const value = match[2].trim();
      const percentMatch = value.match(/^(\d+(?:\.\d+)?)%$/);
      const eurMatch = value.match(/^(\d+(?:\.\d+)?)EUR$/i);

      if (percentMatch) codes[code] = { type: "percent", value: parseFloat(percentMatch[1]) };
      else if (eurMatch) codes[code] = { type: "fixed", value: parseFloat(eurMatch[1]) };
    }

    return codes;
  } catch (e) {
    console.error("Promo codes lezen mislukt:", e);
    return {};
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount, customerName, customerEmail, photos, promoCode } = req.body || {};

  if (!customerEmail) return res.status(400).json({ error: "E-mailadres ontbreekt" });
  if (!amount || isNaN(parseFloat(amount))) return res.status(400).json({ error: "Ongeldig bedrag" });

  // ── Actiecode verwerken ───────────────────────────────────────────────────
  let originalAmount = parseFloat(amount);
  let finalAmount = originalAmount;
  let discount = 0;
  let promoResult = null;

  if (promoCode) {
    const codes = readPromoCodes();
    const code = promoCode.trim().toUpperCase();
    const promo = codes[code];

    if (promo) {
      if (promo.type === "percent") discount = (finalAmount * promo.value) / 100;
      else if (promo.type === "fixed") discount = Math.min(promo.value, finalAmount);
      finalAmount = Math.max(0, finalAmount - discount);
      promoResult = { valid: true, code, discount: discount.toFixed(2), finalAmount: finalAmount.toFixed(2) };
    } else {
      promoResult = { valid: false };
    }
  }

  // ── Gratis na korting: geen Mollie nodig ──────────────────────────────────
  if (finalAmount <= 0) {
    return res.json({
      free: true,
      promoResult,
      message: "Bestelling gratis na actiekorting.",
    });
  }

  // ── Mollie betaling aanmaken ──────────────────────────────────────────────
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Betaalprovider niet geconfigureerd" });

  const siteUrl = process.env.SITE_URL || `https://${process.env.VERCEL_URL}` || "https://cp-foto.vercel.app";
  const photoCount = Array.isArray(photos) ? photos.length : 0;

  try {
    const mollie = createMollieClient({ apiKey });

    const payment = await mollie.payments.create({
      amount: { currency: "EUR", value: finalAmount.toFixed(2) },
      description: `CP Sportfotografie — ${photoCount} foto${photoCount !== 1 ? "'s" : ""} voor ${customerName || customerEmail}`,
      redirectUrl: `${siteUrl}/#betaald`,
      webhookUrl: `${siteUrl}/api/webhook`,
      metadata: {
        customerName: customerName || "",
        customerEmail,
        photoCount,
        photos: JSON.stringify((photos || []).slice(0, 50)), // Mollie metadata max ~1KB
        originalAmount: originalAmount.toFixed(2),
        discount: discount.toFixed(2),
        promoCode: promoResult?.valid ? promoCode.trim().toUpperCase() : null,
      },
    });

    res.json({
      checkoutUrl: payment._links.checkout.href,
      paymentId: payment.id,
      finalAmount: finalAmount.toFixed(2),
      promoResult,
    });
  } catch (err) {
    console.error("Mollie fout:", err);
    res.status(500).json({ error: "Betaling kon niet worden aangemaakt. Probeer het opnieuw." });
  }
};
