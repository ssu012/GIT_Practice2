/* ===========================================================
   Hamro Pasal — server-side product catalog (source of truth).
   Prices are in cents (USD) so Stripe receives exact integers.
   This file is the ONLY place checkout prices come from — the
   frontend never gets to tell the server what something costs.
   =========================================================== */

module.exports = [
  // -------- Khaja (snacks) --------
  { id: "wai-wai-mama", name: "Wai Wai Ma Ma Noodles", brand: "CG Foods", category: "khaja",
    price: 149, oldPrice: 179, emoji: "🍜", tag: "Best Seller",
    desc: "Hot & Spicy instant noodles, chicken flavoured. Crushed for convenience." },
  { id: "furandana", name: "Furandana Snack Mix", brand: "Lekali Foods", category: "khaja",
    price: 699, emoji: "🍿", tag: "Traditional",
    desc: "Premium quality puffed-rice & bhuja trail mix, made in Nepal." },
  { id: "bhuja-mix", name: "Nepali Bhuja Mix", brand: "Hamro Kitchen", category: "khaja",
    price: 549, emoji: "🥨", desc: "Crunchy spiced beaten-rice snack mix." },

  // -------- Achar (pickles) --------
  { id: "dalle-katahar", name: "Dalle & Katahar Achar", brand: "Nepali Garden", category: "achar",
    price: 899, emoji: "🫙", tag: "Spicy", desc: "Red cherry pepper & jackfruit pickle, small-batch made." },
  { id: "lapsi-achar", name: "Lapsi Achar", brand: "Hamro Kitchen", category: "achar",
    price: 749, emoji: "🫙", desc: "Tangy Nepali hog-plum pickle with timur seasoning." },

  // -------- Chiura (beaten rice) --------
  { id: "thick-chiura", name: "Thick Chiura", brand: "Kathmandu Foods", category: "chiura",
    price: 499, emoji: "🍘", desc: "Coarse beaten rice, 2 lb bag — great for dahi chiura." },
  { id: "thin-chiura", name: "Thin Chiura", brand: "Kathmandu Foods", category: "chiura",
    price: 499, emoji: "🍘", desc: "Fine beaten rice, perfect for a quick khaja." },

  // -------- Chaamal (rice) --------
  { id: "mansuli-rice", name: "Mansuli Rice 10lb", brand: "Himalayan Harvest", category: "chaamal",
    price: 1499, emoji: "🍚", tag: "Popular", desc: "Soft aromatic rice, everyday household favourite." },
  { id: "basmati-rice", name: "Basmati Rice 10lb", brand: "Himalayan Harvest", category: "chaamal",
    price: 1799, emoji: "🍚", desc: "Extra-long grain aged basmati rice." },

  // -------- Sabji (vegetables) --------
  { id: "frozen-karela", name: "Frozen Karela (Bitter Gourd)", brand: "Farm Fresh Nepal", category: "sabji",
    price: 399, emoji: "🥒", desc: "Cleaned & sliced, ready to cook, 1 lb pack." },
  { id: "frozen-saag", name: "Frozen Mustard Saag", brand: "Farm Fresh Nepal", category: "sabji",
    price: 349, emoji: "🥬", desc: "Chopped mustard greens, flash-frozen for freshness." },

  // -------- Pau (bakery) --------
  { id: "pau-roti", name: "Pau Roti (6 pack)", brand: "Hamro Bakery", category: "pau",
    price: 399, emoji: "🥖", desc: "Soft Nepali dinner rolls, baked fresh daily." },
  { id: "sel-roti-mix", name: "Sel Roti Mix", brand: "Hamro Bakery", category: "pau",
    price: 599, emoji: "🍩", tag: "New", desc: "Ready-to-fry batter mix for traditional sel roti." },

  // -------- Tel (oil) --------
  { id: "mustard-oil", name: "Kachi Ghani Mustard Oil", brand: "Himalayan Harvest", category: "tel",
    price: 999, emoji: "🛢️", desc: "Cold-pressed mustard oil, 1 litre bottle." },
  { id: "sunflower-oil", name: "Sunflower Cooking Oil", brand: "Himalayan Harvest", category: "tel",
    price: 849, emoji: "🛢️", desc: "Light refined sunflower oil, 1 litre bottle." },

  // -------- Chhop (spice mixes) --------
  { id: "chhop-masala", name: "Chhop Masala Blend", brand: "Nepali Garden", category: "chhop",
    price: 449, emoji: "🌶️", desc: "House spice blend for pickled vegetable chhop." },
  { id: "timur-powder", name: "Timur (Sichuan Pepper) Powder", brand: "Nepali Garden", category: "chhop",
    price: 599, emoji: "🌶️", desc: "Ground Nepali timur pepper, sharp & aromatic." },

  // -------- Peetho (flour) --------
  { id: "makai-peetho", name: "Makai ko Peetho (Corn Flour)", brand: "Hamro Kitchen", category: "peetho",
    price: 499, emoji: "🌽", desc: "Stone-ground corn flour, 2 lb bag." },
  { id: "gahu-peetho", name: "Gahu ko Peetho (Wheat Flour)", brand: "Hamro Kitchen", category: "peetho",
    price: 449, emoji: "🌾", desc: "Whole wheat flour for roti & dhindo, 4 lb bag." },

  // -------- Chiya (tea) --------
  { id: "ilam-tea", name: "Ilam Orthodox Tea", brand: "Himalayan Harvest", category: "chiya",
    price: 799, emoji: "🍵", tag: "Best Seller", desc: "High-altitude Ilam leaf tea, rich aroma." },
  { id: "chiya-masala", name: "Chiya Masala", brand: "Himalayan Harvest", category: "chiya",
    price: 399, emoji: "🍵", desc: "Spice blend for authentic Nepali milk tea." },

  // -------- Kitabkhana (books) --------
  { id: "nepali-novel", name: "Selected Nepali Novel", brand: "Kitabkhana", category: "kitabkhana",
    price: 1299, emoji: "📚", desc: "Popular contemporary Nepali fiction, paperback." },
  { id: "nepali-learn", name: "Learn Nepali Language Guide", brand: "Kitabkhana", category: "kitabkhana",
    price: 1599, emoji: "📖", desc: "Beginner-friendly Nepali phrasebook & grammar guide." },

  // -------- Hand Made --------
  { id: "dhaka-topi", name: "Dhaka Topi", brand: "Hamro Handmade", category: "handmade",
    price: 1999, emoji: "🎩", tag: "Handmade", desc: "Traditional hand-woven Nepali cap." },
  { id: "pashmina-shawl", name: "Pashmina Shawl", brand: "Hamro Handmade", category: "handmade",
    price: 3999, emoji: "🧣", tag: "Handmade", desc: "Soft handwoven pashmina, made in Nepal." },
  { id: "copper-jug", name: "Handcrafted Copper Jug", brand: "Hamro Handmade", category: "handmade",
    price: 3499, emoji: "🫖", desc: "Traditional embossed copper water jug." },
];
