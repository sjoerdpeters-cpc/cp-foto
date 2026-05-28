// api/webhook.js — Mollie betaalstatus ontvangen
// Mollie POST hiernaartoe met { id: "tr_xxx" } bij statuswijziging

const { createMollieClient } = require("@mollie/api-client");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.body || {};
  if (!id) return res.status(400).end();

  try {
    const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
    const payment = await mollie.payments.get(id);

    console.log(`[webhook] Betaling ${id}: ${payment.status}`);

    if (payment.status === "paid") {
      const meta = payment.metadata || {};
      console.log("[webhook] Betaling gelukt:", {
        id: payment.id,
        amount: `${payment.amount.currency} ${payment.amount.value}`,
        klant: meta.customerName,
        email: meta.customerEmail,
        fotos: meta.photoCount,
        korting: meta.discount !== "0.00" ? `€${meta.discount}` : null,
        actiecode: meta.promoCode || null,
      });

      // TODO: stuur downloadlink naar meta.customerEmail
      // Koppel hier je e-mailprovider (bijv. Nodemailer + SMTP of Resend/SendGrid)
    }

    // Mollie verwacht HTTP 200 — anders herprobeert het
    res.status(200).end();
  } catch (err) {
    console.error("[webhook] Fout:", err);
    // Geef toch 200 terug zodat Mollie niet blijft herproberen bij een tijdelijke fout
    res.status(200).end();
  }
};
