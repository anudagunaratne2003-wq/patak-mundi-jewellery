export type Category = 'Rings' | 'Pendants' | 'Bracelets' | 'Earrings';

/** One piece in the portfolio. Only id, name, category, images and description are required. */
export interface Product {
  /** Unique, URL-friendly id — used in the page address, e.g. /portfolio/architrave-pendant */
  id: string;
  name: string;
  category: Category;
  /** Paths under /public, e.g. '/images/portfolio/rings/my-ring.jpg'. The first image is the cover. */
  images: string[];
  /** e.g. 'Sterling Silver', '18k Rose Gold' */
  material?: string;
  /** e.g. 'Aquamarine', 'Pink Sapphire'. Leave out for pure metalwork. */
  gemstone?: string;
  /** Optional design collection / series this piece belongs to — must match a name in COLLECTIONS. */
  collection?: string;
  description: string;
  /** Short design notes shown as bullet points on the piece's page. */
  details?: string[];
}

/** Category tiles on the home page. Covers point at portfolio photos. */
export const CATEGORIES: { name: Category; image: string; tagline: string }[] = [
  {
    name: 'Rings',
    image: '/images/portfolio/rings/ruby-pave-ring.jpg',
    tagline: 'Symbols of forever',
  },
  {
    name: 'Pendants',
    image: '/images/portfolio/pendants/aquamarine-pendant.jpg',
    tagline: 'Grace the décolletage',
  },
  {
    name: 'Bracelets',
    image: '/images/portfolio/bracelets/four-moods-gemstone-bracelet.jpg',
    tagline: 'Light meets form',
  },
  {
    name: 'Earrings',
    // TODO: replace with an earring photo once one is in public/images/portfolio/earrings/
    image: 'https://images.pexels.com/photos/5370644/pexels-photo-5370644.jpeg?auto=compress&cs=tinysrgb&w=800',
    tagline: 'Worthy elegance',
  },
];

/** Design collections / series. Each one gets its own page under /collections. */
export const COLLECTIONS: { name: string; image: string; description: string }[] = [
  {
    name: 'Architrave',
    image: '/images/portfolio/pendants/architrave-pendant-01.jpg',
    description: 'Jewellery drawn from the lines of classical architecture — beams, columns and arches rendered in silver.',
  },
  {
    name: 'Nawagraha',
    image: '/images/portfolio/rings/nawagraha-kethu-ring.jpg',
    description: 'Astrological rings, each dedicated to a planetary influence — worn to bring balance, strength, or grace.',
  },
];

/*
 * ─── YOUR PORTFOLIO ───────────────────────────────────────────────────────
 * To add a piece:
 *   1. Put its photo(s) in public/images/portfolio/<rings|pendants|bracelets|earrings>/
 *      Name files in lowercase-with-hyphens, e.g. emerald-cocktail-ring.jpg
 *      (extra angles: emerald-cocktail-ring-side.jpg, emerald-cocktail-ring-worn.jpg)
 *   2. Copy one of the entries below, give it a new unique `id`, and update the details.
 * To remove a piece, delete its { ... } block.
 * Pieces appear in the portfolio in the order they are listed here.
 */
const RINGS = '/images/portfolio/rings';
const PENDANTS = '/images/portfolio/pendants';
const BRACELETS = '/images/portfolio/bracelets';

export const PRODUCTS: Product[] = [
  // ── Rings ──────────────────────────────────────────────
  {
    id: 'pink-sapphire-ring',
    name: 'Pink Sapphire Ring',
    category: 'Rings',
    images: [`${RINGS}/pink-sapphire-ring.jpg`, `${RINGS}/pink-sapphire-ring-worn.jpg`],
    material: '18k Gold',
    gemstone: 'Pink Sapphire',
    description:
      'A cushion-cut pink stone flanked by bright white side stones in warm gold — designed for a client and first worn beneath the Eiffel Tower.',
    details: ['Cushion-cut centre stone', 'Claw-set side stones', 'Made to the client’s ring size'],
  },
  {
    id: 'ruby-pave-ring',
    name: 'Ruby Pavé Ring',
    category: 'Rings',
    images: [`${RINGS}/ruby-pave-ring.jpg`],
    material: 'White Gold',
    gemstone: 'Ruby',
    description:
      'A bold oval ruby held in a raised crown setting, with shoulders paved in white stones — a modern statement ring with sporting confidence.',
    details: ['Oval-cut ruby', 'Raised crown setting', 'Pavé-set shoulders'],
  },
  {
    id: 'cats-eye-signet-ring',
    name: 'Cat’s Eye Signet Ring',
    category: 'Rings',
    images: [`${RINGS}/cats-eye-signet-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Cat’s Eye',
    description:
      'A sculpted signet ring with four cat’s eye cabochons arranged in a cross, framed by engraved symbols and pavé shoulders.',
    details: ['Four cat’s eye cabochons', 'Engraved symbolic shoulders', 'Black and white pavé accents'],
  },
  {
    id: 'moonstone-open-ring',
    name: 'Moonstone Open Ring',
    category: 'Rings',
    images: [`${RINGS}/moonstone-open-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Moonstone',
    description:
      'An open “toi et moi” ring pairing a glowing moonstone cabochon with a small green stone — two stones, two personalities, one band.',
    details: ['Moonstone cabochon in gold claws', 'Bezel-set green accent stone', 'Open, adjustable band'],
  },
  {
    id: 'silver-cabochon-band-ring',
    name: 'Silver Cabochon Band',
    category: 'Rings',
    images: [`${RINGS}/silver-cabochon-band-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Cabochon Stone',
    description:
      'A clean, architectural silver band with a single flush-set cabochon and stepped grooves running along the shank.',
    details: ['Flush-set cabochon', 'Grooved, stepped shank', 'High-polish finish'],
  },
  {
    id: 'sculptural-silver-ring-set',
    name: 'Sculptural Silver Ring Set',
    category: 'Rings',
    images: [`${RINGS}/sculptural-silver-ring-set.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Dark Oval Stones',
    description:
      'A set of sculptural silver rings with layered, blade-like forms, granulation detail and oval-cut dark stones — designed to be worn together or apart.',
    details: ['Oval bezel- and halo-set stones', 'Hand-applied granulation', 'Stackable design'],
  },
  {
    id: 'twin-rail-two-stone-ring',
    name: 'Twin Rail Two-Stone Ring',
    category: 'Rings',
    images: [`${RINGS}/twin-rail-two-stone-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Yellow & Black Stones',
    description:
      'Two polished silver rails open up across the finger, bridged by a cushion-cut yellow stone and a round black stone — light and dark held in balance.',
    details: ['Cushion-cut yellow stone', 'Round black stone', 'Bezel settings', 'Open twin-rail band'],
  },
  {
    id: 'concentric-two-stone-ring',
    name: 'Concentric Two-Stone Ring',
    category: 'Rings',
    images: [`${RINGS}/concentric-two-stone-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Clear & Black Oval Stones',
    description:
      'A faceted clear stone and a smooth black cabochon sit side by side, each framed by stepped silver rings that ripple outward from the stone.',
    details: ['Faceted clear oval stone', 'Black oval cabochon', 'Stepped concentric bezels'],
  },
  {
    id: 'nawagraha-kethu-ring',
    name: 'Kethu Ring',
    category: 'Rings',
    collection: 'Nawagraha',
    images: [`${RINGS}/nawagraha-kethu-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Orange Pear-Cut Stone',
    description:
      'From the Nawagraha collection: a pear-cut amber stone rising from swirling silver scrolls set with small white stones.',
    details: ['Pear-cut centre stone', 'Scrolled silver setting', 'Bezel-set accent stones'],
  },
  {
    id: 'nawagraha-rahu-ring',
    name: 'Rahu Ring',
    category: 'Rings',
    collection: 'Nawagraha',
    images: [`${RINGS}/nawagraha-rahu-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Black Oval Stone',
    description:
      'From the Nawagraha collection: a deep black oval stone in a polished bezel, flanked by clusters of silver granules.',
    details: ['Oval bezel-set stone', 'Granulated silver clusters', 'Fine, comfortable band'],
  },
  {
    id: 'nawagraha-senasuru-ring',
    name: 'Senasuru Ring',
    category: 'Rings',
    collection: 'Nawagraha',
    images: [`${RINGS}/nawagraha-senasuru-ring.jpg`],
    material: 'Sterling Silver',
    description:
      'From the Nawagraha collection: a soft, sculpted silver form with a single small stone — strength expressed quietly.',
  },
  {
    id: 'nawagraha-sikuru-ring',
    name: 'Sikuru Ring',
    category: 'Rings',
    collection: 'Nawagraha',
    images: [`${RINGS}/nawagraha-sikuru-ring.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Yellow Stone',
    description:
      'From the Nawagraha collection: flowing silver curves wrap a small square-cut golden stone, associated with grace and harmony.',
  },

  // ── Pendants ───────────────────────────────────────────
  {
    id: 'aquamarine-pendant',
    name: 'Aquamarine Pendant',
    category: 'Pendants',
    images: [`${PENDANTS}/aquamarine-pendant.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Aquamarine',
    description:
      'An emerald-cut aquamarine held in a fluid, molten-silver frame that drips and flows like water around the stone.',
    details: ['Emerald-cut aquamarine', 'Bezel setting', 'Organic hand-formed silver frame', 'Double bail for a balanced drape'],
  },
  {
    id: 'tiger-head-pendant',
    name: 'Tiger Head Pendant',
    category: 'Pendants',
    images: [`${PENDANTS}/tiger-head-pendant.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Yellow Sapphire',
    description:
      'A fierce tiger’s head in polished silver, its brow paved in white stones and a golden-yellow stone clasped between its fangs.',
    details: ['Emerald-cut yellow stone', 'Pavé-set brow and eyes', 'Sculpted, open-jaw design'],
  },
  {
    id: 'crown-halo-pendant',
    name: 'Crown Halo Pendant',
    category: 'Pendants',
    images: [`${PENDANTS}/crown-halo-pendant.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Orange Oval Stone',
    description:
      'A fiery oval stone cradled by pavé-set silver wings that sweep upward like a crown.',
    details: ['Oval-cut centre stone', 'Pavé-set wing frame', 'Claw setting'],
  },
  {
    id: 'celestial-veil-pendant',
    name: 'Celestial Veil Pendant',
    category: 'Pendants',
    images: ['/images/concepts/celestial-veil-side.jpg'],
    material: 'Sterling Silver',
    gemstone: 'Aquamarine',
    description:
      'Born from our Celestial Veil concept: a single stone suspended within a frame of sculpted silver wings, set high to catch light from every angle.',
  },
  {
    id: 'winged-eyes-pendant',
    name: 'Winged Eyes Pendant',
    category: 'Pendants',
    images: [`${PENDANTS}/winged-eyes-pendant.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Golden Yellow Stones',
    description:
      'A pair of watchful eyes in polished silver, with feathered brows sweeping outward like wings and a golden-yellow stone set in each iris.',
    details: ['Two round golden-yellow stones', 'Hand-detailed feathered brows', 'Worn on a fine box chain'],
  },
  ...[1, 2, 3, 4, 5].map(
    (n): Product => ({
      id: `architrave-pendant-${n}`,
      name: `Architrave Pendant ${['I', 'II', 'III', 'IV', 'V'][n - 1]}`,
      category: 'Pendants',
      collection: 'Architrave',
      images: [`${PENDANTS}/architrave-pendant-0${n}.jpg`],
      material: 'Sterling Silver',
      description:
        'From our Architrave collection: a pendant built like a miniature façade, with beams and arches framing a single stone.',
      details: ['Architectural beam-and-arch frame', 'Oval-cut centre stone', 'Worn on a fine silver chain'],
    })
  ),

  // ── Bracelets ──────────────────────────────────────────
  {
    id: 'four-moods-gemstone-bracelet',
    name: 'Four Moods Gemstone Bracelet',
    category: 'Bracelets',
    images: [`${BRACELETS}/four-moods-gemstone-bracelet.jpg`],
    material: 'Sterling Silver',
    gemstone: 'Multi-Gemstone',
    description:
      '“Four colours… four moods… for her.” A delicate silver chain set with alternating gemstones in red, violet, blue and gold.',
    details: ['Four gemstone colours', 'Bezel-set oval stones', 'Hook clasp'],
  },

  // ── Earrings ───────────────────────────────────────────
  // (add your earring designs here)
];

export const TESTIMONIALS: { name: string; location: string; rating: number; text: string }[] = [
  {
    name: 'Chiranga Wickramasinghe',
    location: 'Colombo, Sri Lanka',
    rating: 5,
    text: "I recently purchased a promise ring from PATAK MUNDI, and I couldn't be happier with my choice. The design is elegant, unique, and carries a meaningful touch that makes it perfect for such a special occasion.The quality and craftsmanship are excellent, with great attention to detail and a beautiful finish. It's comfortable to wear every day and feels both durable and premium.What I love most is how it combines simplicity with sophistication, making it a timeless piece that complements any style.Overall, I had a wonderful experience with PATAK MUNDI. If you're looking for a beautifully crafted promise ring that represents something truly special, I would definitely recommend them.",
  },
  {
    name: 'Adheesha Munasinghe',
    location: 'Ratnapura, Sri Lanka',
    rating: 5,
    text: "I'm really happy with the beautiful ring created byPATAK Mundi. The design is elegant, unique, and the finishing is very impressive. The stone setting and overall craftsmanship look premium, and it was exactly what I expected for a special moment.Thank you PATAK Mundi for the lovely work and great service. Truly satisfied with the final result.",
  },
  {
    name: 'Hasi Waidyarathne',
    location: 'Malabe, Sri Lanka',
    rating: 5,
    text: "If you're looking for a high quality aesthetic jewelry piece crafted with an inspired design story that makes each piece truly unique, Patak Mundiw is the placeI've always loved designs that feel like art, and I recently got a ring from Patak Mundi that I'm truly impressed with. With them, you don't just wear jewelry, you wear a high end piece that makes you feel truly special What makes it even more special is the ability to choose high quality gemstones according to your own preference. So I highly recommend Patak Mundi.",
  },
  {
    name: 'Sumuditha Premachandra',
    location: 'Galle, Sri Lanka',
    rating: 5,
    text: "I'm really impressed by PÁTAK MUNDI their designer jewellery is stylish, ethically made and distinctly Sri Lankan. Their tagline \"We make 'rare' an inclusive necessity\" speaks to an inclusive luxury vision. Highly recommend following for anyone who appreciates jewellery with character and conscious values.",
  },
    {
    name: 'Dulanjith Nimnaka Premawardhana',
    location: 'Ratnapura, Sri Lanka',
    rating: 5,
    text: "I ordered a silver necklace, and it arrived right on time, exactly as promised!The moment I received it, I could tell it was a high-quality, beautifully crafted piece. It feels solid, elegant, and absolutely perfect.Highly recommended for anyone looking for a stunning and reliable product!",
  },
    {
    name: 'Anuradha Ranaweera',
    location: 'Kandy, Sri Lanka',
    rating: 5,
    text: "The designer of Patak Mundi, Rivi Gunarathna, is a multi-talented graduate architect who has chosen to follow his passion in the gem and jewellery industry.I commissioned him to design a ring that carries hidden meanings and personal secrets. Within just a few days, he delivered a design that captured everything I had in mind. Without making a single change, I accepted it and I now wear it with pride.What makes it truly special is how perfectly my own story is embedded within the design.l highly recommend Patak Mundi and wish him all the very best in his future endeavors.",
  },
];
