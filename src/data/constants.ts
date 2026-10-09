import { Product, DesignStyleInfo, AspectRatioInfo, WarungSettings } from '../types';

export const DEFAULT_WARUNG_SETTINGS: WarungSettings = {
  warungName: 'WARUNG BANG KOBRA',
  tagline: 'Segar Alami, Nikmat Hakiki & Ramah di Kantong',
  phone: '0812-9876-5432',
  address: 'Jl. Pemuda No. 45 (Depan Lapangan)',
  instagram: '@warung.bangkobra',
  logoUrl: '',
  primaryColor: '#f97316',
  accentColor: '#eab308',
};

export const ASPECT_RATIOS: AspectRatioInfo[] = [
  {
    id: 'whatsapp-status',
    label: 'WhatsApp Status',
    width: 1080,
    height: 1920,
    ratioText: '9:16',
    platform: 'WhatsApp',
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    width: 1080,
    height: 1920,
    ratioText: '9:16',
    platform: 'Instagram',
  },
  {
    id: 'facebook-story',
    label: 'Facebook Story',
    width: 1080,
    height: 1920,
    ratioText: '9:16',
    platform: 'Facebook',
  },
  {
    id: 'instagram-post',
    label: 'Postingan Instagram',
    width: 1080,
    height: 1080,
    ratioText: '1:1',
    platform: 'Instagram / Feed',
  },
  {
    id: 'portrait-post',
    label: 'Postingan Potret',
    width: 1080,
    height: 1350,
    ratioText: '4:5',
    platform: 'Feed Vertikal',
  },
  {
    id: 'custom-poster',
    label: 'Poster Produk',
    width: 1080,
    height: 1440,
    ratioText: '3:4',
    platform: 'Cetak / Brosur',
  },
];

export const DESIGN_STYLES: DesignStyleInfo[] = [
  {
    id: 'premium-luxury',
    name: '1. Premium Luxury',
    tagline: 'Emas & Hitam Elegan',
    description: 'Aksen garis emas mewah, latar belakang obsidian, tipografi klasik berwibawa.',
    previewBg: '#09090b',
    previewAccent: '#fbbf24',
    primaryFont: 'serif',
    badgeStyle: 'gold-badge',
  },
  {
    id: 'modern-minimalis',
    name: '2. Modern Minimalis',
    tagline: 'Bersih & Berkelas',
    description: 'Ruang lapang, layout kontemporer, kontras tipografi berani dan rapi.',
    previewBg: '#0f172a',
    previewAccent: '#38bdf8',
    primaryFont: 'sans-serif',
    badgeStyle: 'minimal-tag',
  },
  {
    id: 'cafe-genz',
    name: '3. Cafe Gen-Z',
    tagline: 'Vibrant & Chill',
    description: 'Warna ceria pastel-punch, stiker pop ekspresif, font playful kekinian.',
    previewBg: '#1e1b4b',
    previewAccent: '#f43f5e',
    primaryFont: 'sans-serif',
    badgeStyle: 'sticker-pop',
  },
  {
    id: 'promo-viral',
    name: '4. Promo Viral',
    tagline: 'High Impact & Eye Catching',
    description: 'Oranye menyala & kuning kontras tinggi, stempel heboh langsung memikat mata.',
    previewBg: '#431407',
    previewAccent: '#f97316',
    primaryFont: 'impact',
    badgeStyle: 'burst-star',
  },
  {
    id: 'colorful-fresh',
    name: '5. Colorful Fresh',
    tagline: 'Buah Tropis Segar',
    description: 'Latar gradien buah segar, aksen daun tropis, aksen hijau limau & oranye jus.',
    previewBg: '#064e3b',
    previewAccent: '#10b981',
    primaryFont: 'sans-serif',
    badgeStyle: 'leaf-badge',
  },
  {
    id: 'dark-elegant',
    name: '6. Dark Elegant',
    tagline: 'Deep Charcoal & Bronze',
    description: 'Nuansa lounge kafe malam, pencahayaan rim-light dramatis dan mewah.',
    previewBg: '#18181b',
    previewAccent: '#d97706',
    primaryFont: 'sans-serif',
    badgeStyle: 'bronze-glow',
  },
  {
    id: 'neon-glow',
    name: '7. Neon Glow',
    tagline: 'Cyber & Electric Lights',
    description: 'Latar gelap pekat dengan pendaran neon cyan dan magenta futuristik.',
    previewBg: '#030712',
    previewAccent: '#06b6d4',
    primaryFont: 'sans-serif',
    badgeStyle: 'neon-border',
  },
  {
    id: 'korean-cafe',
    name: '8. Korean Cafe',
    tagline: 'Hangul Warm & Cozy',
    description: 'Krem hangat, sudut membulat lembut, nuansa kafe estetik Seoul.',
    previewBg: '#292524',
    previewAccent: '#fde047',
    primaryFont: 'sans-serif',
    badgeStyle: 'warm-pill',
  },
  {
    id: 'street-food',
    name: '9. Street Food',
    tagline: 'Khas Warung Nusantara',
    description: 'Sentuhan papan tulis retro, bendera warung, nuansa autentik dan merakyat.',
    previewBg: '#2a1215',
    previewAccent: '#ef4444',
    primaryFont: 'impact',
    badgeStyle: 'warung-ribbon',
  },
  {
    id: 'diskon-besar',
    name: '10. Diskon Besar',
    tagline: 'Sale Fantastis',
    description: 'Stiker pita coret harga, warna merah-kuning menyala, fokus hemat dahsyat.',
    previewBg: '#450a0a',
    previewAccent: '#eab308',
    primaryFont: 'impact',
    badgeStyle: 'tape-badge',
  },
  {
    id: 'estetik-instagram',
    name: '11. Estetik Instagram',
    tagline: 'Editorial & Polaroid Mood',
    description: 'Gaya majalah modern, bingkai foto artistik, tipografi serif anggun.',
    previewBg: '#1c1917',
    previewAccent: '#a8a29e',
    primaryFont: 'serif',
    badgeStyle: 'editorial-tag',
  },
  {
    id: 'premium-product-photo',
    name: '12. Premium Product Photography',
    tagline: 'Studio Pedestal Spotlight',
    description: 'Fokus penuh pada foto produk dengan efek spotlight sorot panggung megah.',
    previewBg: '#0c0a09',
    previewAccent: '#f59e0b',
    primaryFont: 'sans-serif',
    badgeStyle: 'studio-glow',
  },
];

// Helper SVG images for drinks with appetizing color themes
function makeSvgDrinkUrl(color: string, fruitText: string, iceColor: string = '#bae6fd'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="${color}"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <circle cx="200" cy="200" r="190" fill="url(#bgGlow)"/>
    <!-- Shadow beneath glass -->
    <ellipse cx="200" cy="350" rx="90" ry="16" fill="#000000" opacity="0.45"/>
    <!-- Glass Cup -->
    <g filter="url(#shadow)">
      <!-- Straw -->
      <path d="M215 60 L240 180" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
      <path d="M215 60 L185 30" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
      <!-- Main Cup Body -->
      <path d="M125 120 L145 325 C147 338, 160 345, 175 345 L225 345 C240 345, 253 338, 255 325 L275 120 Z" fill="url(#cupGrad)"/>
      <!-- Glass Rim Highlights -->
      <ellipse cx="200" cy="120" rx="75" ry="16" fill="#ffffff" fill-opacity="0.45"/>
      <ellipse cx="200" cy="120" rx="68" ry="12" fill="${color}" fill-opacity="0.8"/>
      <!-- Ice Cubes -->
      <rect x="165" y="145" width="34" height="34" rx="6" fill="${iceColor}" fill-opacity="0.6" transform="rotate(12 182 162)"/>
      <rect x="205" y="170" width="38" height="38" rx="6" fill="${iceColor}" fill-opacity="0.6" transform="rotate(-15 224 189)"/>
      <rect x="155" y="210" width="36" height="36" rx="6" fill="${iceColor}" fill-opacity="0.5" transform="rotate(8 173 228)"/>
      <!-- Splash droplets -->
      <circle cx="110" cy="150" r="6" fill="${color}" opacity="0.9"/>
      <circle cx="290" cy="170" r="8" fill="${color}" opacity="0.9"/>
      <circle cx="130" cy="95" r="5" fill="#facc15" opacity="0.95"/>
      <circle cx="275" cy="105" r="7" fill="${color}" opacity="0.85"/>
      <!-- Glass reflection highlight -->
      <path d="M142 140 L156 315" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-opacity="0.4"/>
    </g>
    <!-- Fruit Label / Icon Badge -->
    <g transform="translate(200, 260)">
      <circle cx="0" cy="0" r="32" fill="#18181b" stroke="#ffffff" stroke-width="3" stroke-opacity="0.8"/>
      <text x="0" y="8" font-family="sans-serif" font-weight="900" font-size="24" text-anchor="middle" fill="#ffffff">${fruitText}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-jus-mangga',
    name: 'Jus Mangga',
    category: 'Jus Buah Segar',
    price: 10000,
    description: 'Dibuat dari mangga harum manis pilihan, kental, legit, dingin menyegarkan.',
    imageUrl: makeSvgDrinkUrl('#f59e0b', '🥭'),
    isPopular: true,
  },
  {
    id: 'prod-jus-alpukat',
    name: 'Jus Alpukat',
    category: 'Jus Buah Segar',
    price: 10000,
    description: 'Alpukat mentega super creamy dengan lelehan susu kental manis cokelat.',
    imageUrl: makeSvgDrinkUrl('#65a30d', '🥑'),
    isPopular: true,
  },
  {
    id: 'prod-jus-jambu',
    name: 'Jus Jambu',
    category: 'Jus Buah Segar',
    price: 10000,
    description: 'Jambu biji merah segar kaya vitamin C, manis segar kaya manfaat.',
    imageUrl: makeSvgDrinkUrl('#f43f5e', '🍈'),
    isPopular: false,
  },
  {
    id: 'prod-jus-stroberi',
    name: 'Jus Stroberi',
    category: 'Jus Buah Segar',
    price: 10000,
    description: 'Stroberi segar dengan rasa asam-manis pas, bikin melek dan bersemangat.',
    imageUrl: makeSvgDrinkUrl('#e11d48', '🍓'),
    isPopular: true,
  },
  {
    id: 'prod-jus-sirsak',
    name: 'Jus Sirsak',
    category: 'Jus Buah Segar',
    price: 10000,
    description: 'Daging sirsak asli bertekstur lembut, asam segar pelepas dahaga.',
    imageUrl: makeSvgDrinkUrl('#10b981', '🍈'),
    isPopular: false,
  },
  {
    id: 'prod-lemon-peras',
    name: 'Lemon Peras',
    category: 'Jus Buah Segar',
    price: 10000,
    description: 'Perasan lemon murni dingin, segar alami penambah daya tahan tubuh.',
    imageUrl: makeSvgDrinkUrl('#eab308', '🍋'),
    isPopular: false,
  },
  {
    id: 'prod-jeruk-peras',
    name: 'Jeruk Peras',
    category: 'Jus Buah Segar',
    price: 7000,
    description: 'Jeruk peras manis alami lokal, bisa dingin segar atau hangat nikmat.',
    imageUrl: makeSvgDrinkUrl('#f97316', '🍊'),
    isPopular: true,
  },
  {
    id: 'prod-lemon-yakult',
    name: 'Lemon Yakult',
    category: 'Minuman Segar',
    price: 10000,
    description: 'Kombinasi unik asam lemon segar dipadukan dengan manis probiotik Yakult.',
    imageUrl: makeSvgDrinkUrl('#facc15', '🍋'),
    isPopular: true,
  },
  {
    id: 'prod-jeruk-yakult',
    name: 'Jeruk Yakult',
    category: 'Minuman Segar',
    price: 10000,
    description: 'Sensasi manis jeruk peras dengan sentuhan creamy asam segar Yakult.',
    imageUrl: makeSvgDrinkUrl('#fb923c', '🍹'),
    isPopular: false,
  },
  {
    id: 'prod-dalgona-coffee',
    name: 'Dalgona Coffee',
    category: 'Kopi & Latte',
    price: 10000,
    description: 'Busa kopi kental pekat di atas susu dingin segar, rasa cafe bintang lima.',
    imageUrl: makeSvgDrinkUrl('#78350f', '☕'),
    isPopular: true,
  },
  {
    id: 'prod-kopi-gula-aren',
    name: 'Kopi Gula Aren',
    category: 'Kopi & Latte',
    price: 10000,
    description: 'Espresso mantap berpadu susu gurih dan gula aren asli yang legit wangi.',
    imageUrl: makeSvgDrinkUrl('#92400e', '☕'),
    isPopular: true,
  },
  {
    id: 'prod-green-tea-latte',
    name: 'Green Tea Latte',
    category: 'Latte & Teh',
    price: 10000,
    description: 'Bubuk matcha hijau autentik wangi dipadukan dengan susu creamy nikmat.',
    imageUrl: makeSvgDrinkUrl('#15803d', '🍵'),
    isPopular: true,
  },
  {
    id: 'prod-thai-tea-latte',
    name: 'Thai Tea Latte',
    category: 'Latte & Teh',
    price: 10000,
    description: 'Teh Thailand oranye aroma rempah khas dipadukan dengan susu kental manis gurih.',
    imageUrl: makeSvgDrinkUrl('#c2410c', '🧋'),
    isPopular: true,
  },
  {
    id: 'prod-milo-latte',
    name: 'Milo Latte',
    category: 'Latte & Cokelat',
    price: 10000,
    description: 'Cokelat malt Milo pekat ekstra taburan bubuk di atasnya, manis berenergi.',
    imageUrl: makeSvgDrinkUrl('#451a03', '🍫'),
    isPopular: true,
  },
  {
    id: 'prod-teh-tarik-latte',
    name: 'Teh Tarik Latte',
    category: 'Latte & Teh',
    price: 10000,
    description: 'Teh wangi berbuih lembut ditarik khas warung, rasa gurih pas di lidah.',
    imageUrl: makeSvgDrinkUrl('#b45309', '🫖'),
    isPopular: false,
  },
  {
    id: 'prod-cappuccino-latte',
    name: 'Cappuccino Latte',
    category: 'Kopi & Latte',
    price: 10000,
    description: 'Kopi cappuccino berbusa lembut dengan taburan bubuk cokelat nikmat.',
    imageUrl: makeSvgDrinkUrl('#713f12', '☕'),
    isPopular: false,
  },
  {
    id: 'prod-cokelat-latte',
    name: 'Cokelat Latte',
    category: 'Latte & Cokelat',
    price: 10000,
    description: 'Cokelat murni premium kental, rasa manis creamy yang memanjakan lidah.',
    imageUrl: makeSvgDrinkUrl('#581c87', '🍫'),
    isPopular: true,
  },
  {
    id: 'prod-aneka-pop-ice',
    name: 'Aneka Pop Ice',
    category: 'Minuman Sachet & Segar',
    price: 5000,
    description: 'Pop Ice aneka rasa (Cokelat, Permen Karet, Melon, Mangga, Strawberry) es blender.',
    imageUrl: makeSvgDrinkUrl('#0284c7', '🥤'),
    isPopular: false,
  },
  {
    id: 'prod-aneka-good-day',
    name: 'Aneka Good Day',
    category: 'Minuman Sachet & Segar',
    price: 5000,
    description: 'Kopi Good Day aneka rasa (Mocacinno, Chococino, Vanilla Latte, Freeze) dingin mantap.',
    imageUrl: makeSvgDrinkUrl('#b45309', '☕'),
    isPopular: false,
  },
  {
    id: 'prod-aneka-chocolatos',
    name: 'Aneka Chocolatos',
    category: 'Minuman Sachet & Segar',
    price: 5000,
    description: 'Minuman serbuk cokelat Chocolatos Italia super kental dan lezat.',
    imageUrl: makeSvgDrinkUrl('#3f2305', '🍫'),
    isPopular: false,
  },
  {
    id: 'prod-aneka-hilo',
    name: 'Aneka Hilo',
    category: 'Minuman Sachet & Segar',
    price: 5000,
    description: 'Susu Hilo kalsium tinggi rasa Cokelat, Banana, Taro, Swiss Chocolate.',
    imageUrl: makeSvgDrinkUrl('#1e3a8a', '🥛'),
    isPopular: false,
  },
  {
    id: 'prod-aneka-nutrisari',
    name: 'Aneka Nutrisari',
    category: 'Minuman Sachet & Segar',
    price: 5000,
    description: 'Nutrisari aneka rasa jeruk segar bervitamin, manis asam pas bikin segar.',
    imageUrl: makeSvgDrinkUrl('#ea580c', '🍊'),
    isPopular: false,
  },
  {
    id: 'prod-aneka-susu-soda',
    name: 'Aneka Susu Soda',
    category: 'Minuman Sachet & Segar',
    price: 5000,
    description: 'Minuman soda gembira berpadu susu kental manis dan sirup merah menggoda.',
    imageUrl: makeSvgDrinkUrl('#be123c', '🥤'),
    isPopular: true,
  },
];
