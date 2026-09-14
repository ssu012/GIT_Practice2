# Hamro Pasal

A responsive, static e-commerce homepage for **Hamro Pasal** ("Our Store") — a
Nepali grocery, snacks, spices, tea, books, and handmade-goods store, modeled
on the layout and product taxonomy of [baakostore.com](https://www.baakostore.com/).

## Structure

- `index.html` — homepage markup (header, hero, category nav, product shop, promo strip, footer)
- `assets/css/style.css` — styling (warm Nepali-inspired palette: saffron orange, deep green, cream)
- `assets/js/main.js` — product catalog data and interactivity (category filtering, cart counter, mobile nav, dismissible announcement bar)

## Categories

All in One · Pau · Chaamal · Sabji · Chiura · Khaja · Tel · Chhop · Peetho ·
Achar · Chiya · Kitabkhana · Hand Made

## Running locally

No build step required — open `index.html` directly in a browser, or serve
the folder with any static file server, e.g.:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Notes

Product imagery uses emoji placeholders rather than copyrighted brand
photography; swap in real product photos/logos in `assets/js/main.js` and the
`.product-media` styling as needed.
