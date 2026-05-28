# CP Sportfotografie

Statische client-side website voor CP-sportfotografie, klaar voor deployment via GitHub Pages.
Het design uit `design_handoff_cp_sportfotografie` is toegepast op de kernflow:

- homepage met live startnummerzoeker
- evenementenoverzicht
- eventgalerij met startnummer-, kleur- en momentfilters
- fotodetail met aankoopkaart
- persistent mandje via `localStorage`

## Lokaal bekijken

Genereer eerst het albummanifest en start daarna een lokale server:

```powershell
node scripts/generate-albums.js
python -m http.server 8000
```

Daarna staat de site op `http://localhost:8000`.

## Albums toevoegen

Maak per album een submap in `Albums/` met foto's en een `Content.data` bestand:

```text
Albums/
  20260525 NL - DE/
    Content.data
    IMG_0778.JPG
    IMG_0798.JPG
```

`Content.data` gebruikt dit formaat:

```text
[Datum] = '25-05-2026'
[Locatie] = 'Dusseldorf'
[Evenement] = 'Jeugdinternland Nederland Onder 16 - Duitsland Onder 16'
```

`node scripts/generate-albums.js` scant alle albumfolders, schrijft `album-manifest.json` en maakt per album een pagina onder `album/<slug>/`.

## Deployment naar GitHub Pages

1. Maak een GitHub repository aan.
2. Push deze map naar de repository.
3. Ga in GitHub naar `Settings` -> `Pages`.
4. Zet `Source` op `GitHub Actions`.
5. Push naar `main`; de workflow publiceert automatisch.

## Structuur

- `index.html` - pagina-inhoud en SEO-meta.
- `styles.css` - responsive styling.
- `script.js` - schermnavigatie, filters, detailweergave en mandje.
- `scripts/generate-albums.js` - scant `Albums/` en genereert albumdata en albumpagina's.
- `album-manifest.json` - gegenereerde albumindex voor de frontend.
- `album/` - gegenereerde publieke albumpagina's.
- `Logo/` - bestaande merkassets.
- `design_handoff_cp_sportfotografie/` - designreferentie.
- `.github/workflows/deploy.yml` - GitHub Pages deployment.
