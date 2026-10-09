# Eliaa Hut (كوخ إيلياء) website
React + Vite + TypeScript, static, no backend.

## Run
`npm install` · `npm run dev` · `npm run build` (output in `dist/`) · `npm run preview`

## Edit content (all in `src/data/`)
- `menu.json` – categories and items (id, category, ar, en, price, image path)
- `hours.json` – opening hours · `brand.json` – phone, address, Instagram URL, hero image, featured item ids
- `gallery.json` – image paths + captions · `translations.json` – UI/page text (AR + EN)
Put images in `public/images/` and reference them as `/images/name.jpg`; empty paths show a placeholder.
Deploy `dist/` to Vercel/Netlify (`vercel.json` handles SPA routes).
