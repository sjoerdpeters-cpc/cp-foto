const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const albumsRoot = path.join(root, "Albums");
const pagesRoot = path.join(root, "album");
const manifestPath = path.join(root, "album-manifest.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readContentData(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = {};

  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*\[([^\]]+)\]\s*=\s*['"]?(.+?)['"]?\s*$/);
    if (match) data[match[1].trim().toLowerCase()] = match[2].trim();
  }

  return data;
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function parseDateValue(value) {
  const match = String(value || "").match(/(\d{1,2})[-/](\d{1,3})[-/](\d{4})/);
  if (!match) return "";

  const rawMonth = match[2];
  const month = Number(rawMonth) > 12 && rawMonth.startsWith("0") ? Number(rawMonth.slice(0, 2)) : Number(rawMonth);
  const day = Number(match[1]);
  const year = Number(match[3]);

  if (!day || !month || !year) return "";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function exifAscii(buffer, offset, count) {
  return buffer
    .subarray(offset, offset + count)
    .toString("ascii")
    .replace(/\0+$/, "")
    .trim();
}

function readExifTime(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.readUInt16BE(0) !== 0xffd8) return "";

  let offset = 2;
  while (offset + 4 < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);

    if (marker === 0xe1 && buffer.subarray(offset + 4, offset + 10).toString("ascii") === "Exif\0\0") {
      const tiff = offset + 10;
      const little = buffer.subarray(tiff, tiff + 2).toString("ascii") === "II";
      const read16 = (pos) => little ? buffer.readUInt16LE(pos) : buffer.readUInt16BE(pos);
      const read32 = (pos) => little ? buffer.readUInt32LE(pos) : buffer.readUInt32BE(pos);
      const firstIfd = tiff + read32(tiff + 4);

      const readIfd = (ifdOffset) => {
        const tags = {};
        const entries = read16(ifdOffset);
        for (let i = 0; i < entries; i += 1) {
          const entry = ifdOffset + 2 + i * 12;
          const tag = read16(entry);
          const type = read16(entry + 2);
          const count = read32(entry + 4);
          const value = read32(entry + 8);
          tags[tag] = { type, count, value, entry };
        }
        return tags;
      };

      const ifd0 = readIfd(firstIfd);
      const exifIfd = ifd0[0x8769] ? readIfd(tiff + ifd0[0x8769].value) : {};
      const timeTag = exifIfd[0x9003] || exifIfd[0x9004] || ifd0[0x0132];
      if (!timeTag || timeTag.type !== 2) return "";

      const valueOffset = timeTag.count <= 4 ? timeTag.entry + 8 : tiff + timeTag.value;
      const raw = exifAscii(buffer, valueOffset, timeTag.count);
      const match = raw.match(/\d{4}:\d{2}:\d{2}\s+(\d{2}:\d{2}:\d{2})/);
      return match ? match[1] : "";
    }

    offset += 2 + size;
  }

  return "";
}

function writeAlbumPage(slug) {
  const dir = path.join(pagesRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.html"),
    `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CP-sportfotografie · album</title>
    <base href="../../" />
    <link rel="icon" href="Logo/cp_sportfotografie_variant5_hoofdlogo.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
    <script>window.CP_ALBUM_SLUG = ${JSON.stringify(slug)};</script>
    <script defer src="script.js"></script>
  </head>
  <body class="cp">
    <div id="app"></div>
  </body>
</html>
`,
    "utf8",
  );
}

const pricingDataPath = path.join(root, "pricing.data");
const pricingJsonPath = path.join(root, "pricing.json");
const PACKAGE_IDS = ["light", "basis", "individueel", "totaal"];

function buildPricingJson(raw) {
  return {
    generatedAt: new Date().toISOString(),
    foto: {
      prijs: Number(raw["foto_prijs"]) || 5,
      korting_3: Number(raw["korting_3_stuks"]) || 12,
      korting_5: Number(raw["korting_5_stuks"]) || 25,
    },
    pakketten: PACKAGE_IDS.map((id) => ({
      id,
      naam: raw[`${id}_naam`] || id,
      tagline: raw[`${id}_tagline`] || "",
      prijs: Number(raw[`${id}_prijs`]) || 0,
      omschrijving: raw[`${id}_omschrijving`] || "",
      features: [1, 2, 3, 4].map((n) => raw[`${id}_feature_${n}`]).filter(Boolean),
      populair: String(raw[`${id}_populair`] || "").toLowerCase() === "true",
      donker: String(raw[`${id}_donker`] || "").toLowerCase() === "true",
    })),
  };
}

function main() {
  // ── Pricing ──────────────────────────────────────────────────────────────
  let photoPrice = 5;
  if (fs.existsSync(pricingDataPath)) {
    const pricingRaw = readContentData(pricingDataPath);
    photoPrice = Number(pricingRaw["foto_prijs"]) || 5;
    const pricingJson = buildPricingJson(pricingRaw);
    fs.writeFileSync(pricingJsonPath, JSON.stringify(pricingJson, null, 2), "utf8");
    console.log("pricing.json geschreven.");
  }

  // ── Albums ───────────────────────────────────────────────────────────────
  if (!fs.existsSync(albumsRoot)) {
    fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), albums: [] }, null, 2));
    return;
  }

  fs.mkdirSync(pagesRoot, { recursive: true });
  const albums = fs
    .readdirSync(albumsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const albumDir = path.join(albumsRoot, entry.name);
      const contentFile = fs
        .readdirSync(albumDir)
        .find((name) => name.toLowerCase() === "content.data");

      if (!contentFile) return null;

      const meta = readContentData(path.join(albumDir, contentFile));
      const slug = slugify(entry.name);
      const files = fs.readdirSync(albumDir).filter((name) => imageExtensions.has(path.extname(name).toLowerCase()));
      const photos = files.sort((a, b) => a.localeCompare(b, "nl")).map((name, index) => {
        const filePath = path.join(albumDir, name);
        const id = `${slug}-${path.basename(name, path.extname(name)).toLowerCase()}`;
        const fallbackTime = formatTime(fs.statSync(filePath).mtime);
        return {
          id,
          filename: name,
          src: toPosixPath(path.relative(root, filePath)),
          bib: index + 1,
          ts: readExifTime(filePath) || fallbackTime,
          team: "",
          moment: "alle",
          ratio: 3 / 2,
          price: photoPrice,
        };
      });

      writeAlbumPage(slug);

      return {
        id: slug,
        slug,
        folder: entry.name,
        title: meta.evenement || entry.name,
        date: meta.datum || "",
        sortDate: parseDateValue(meta.datum || ""),
        location: meta.locatie || "",
        sport: meta.sport || "Sport",
        region: meta.regio || meta.locatie || "",
        description: meta.omschrijving || "",
        live: String(meta.live || "").toLowerCase() === "true",
        cover: photos[0]?.src || "",
        hashtags: (meta.hashtags || "").split(",").map((t) => t.trim()).filter(Boolean),
        photos,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b.sortDate || "").localeCompare(a.sortDate || ""));

  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), albums }, null, 2),
    "utf8",
  );
}

main();
