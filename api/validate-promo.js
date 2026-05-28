// api/validate-promo.js — actiecode valideren zonder betaling aan te maken
// Wordt aangeroepen zodra de gebruiker op "Toepassen" klikt

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
    return {};
  }
}

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code, amount } = req.body || {};
  if (!code) return res.status(400).json({ valid: false, message: "Geen code opgegeven" });

  const codes = readPromoCodes();
  const key = code.trim().toUpperCase();
  const promo = codes[key];

  if (!promo) {
    return res.json({ valid: false, message: "Ongeldige actiecode" });
  }

  const baseAmount = parseFloat(amount) || 0;
  let discount = 0;
  let label = "";

  if (promo.type === "percent") {
    discount = (baseAmount * promo.value) / 100;
    label = `${promo.value}% korting`;
  } else if (promo.type === "fixed") {
    discount = Math.min(promo.value, baseAmount);
    label = `€${promo.value.toFixed(2).replace(".", ",")} korting`;
  }

  const finalAmount = Math.max(0, baseAmount - discount);

  res.json({
    valid: true,
    code: key,
    discount: discount.toFixed(2),
    finalAmount: finalAmount.toFixed(2),
    label,
    message: `Actiecode toegepast: ${label}`,
  });
};
