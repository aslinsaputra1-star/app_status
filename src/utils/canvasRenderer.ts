import { PosterState } from '../types';

/**
 * Loads an image from URL or data URI safely into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Wraps text into multiple lines for canvas rendering
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Formats numeric price to Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Draws rounded rectangle path
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws starburst / explosion shape for promo badges
 */
function drawStarburst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  points: number,
  outerRadius: number,
  innerRadius: number
) {
  const step = Math.PI / points;
  ctx.beginPath();
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

/**
 * Main render function that draws the entire poster to the HTML5 canvas
 */
export async function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  poster: PosterState
): Promise<void> {
  const {
    width,
    height,
    styleId,
    productName,
    productPrice,
    productImageUrl,
    headline,
    subheadline,
    ctaText,
    badgeText,
    warungName,
    warungPhone,
    warungAddress,
    showPrice,
    showLogo,
    showBadge,
    showCta,
    showContact,
  } = poster;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Load product image safely
  let productImg: HTMLImageElement | null = null;
  if (productImageUrl) {
    try {
      productImg = await loadImage(productImageUrl);
    } catch (e) {
      console.warn('Could not load product image, will use fallback shape:', e);
    }
  }

  // --- DRAW BACKGROUND & STYLES ---
  switch (styleId) {
    case 'premium-luxury': {
      // 1. Premium Luxury: Obsidian backdrop with gold dual-borders & serif typography
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.5, '#18181b');
      grad.addColorStop(1, '#050505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold ambient radial glow in center
      const radial = ctx.createRadialGradient(width / 2, height * 0.48, 50, width / 2, height * 0.48, width * 0.55);
      radial.addColorStop(0, 'rgba(234, 179, 8, 0.16)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Dual Ornate Gold Frames
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Corner diamonds
      const corners = [
        [36, 36],
        [width - 36, 36],
        [36, height - 36],
        [width - 36, height - 36],
      ];
      ctx.fillStyle = '#fbbf24';
      for (const [cx, cy] of corners) {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'modern-minimalis': {
      // 2. Modern Minimalis: Deep navy-slate clean gradient with subtle architectural lines
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft cyan radial spot
      const spot = ctx.createRadialGradient(width / 2, height * 0.45, 20, width / 2, height * 0.45, width * 0.6);
      spot.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, width, height);

      // Clean modern corner cross-hairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 70); ctx.lineTo(50, 50); ctx.lineTo(70, 50);
      ctx.moveTo(width - 70, 50); ctx.lineTo(width - 50, 50); ctx.lineTo(width - 50, 70);
      ctx.moveTo(50, height - 70); ctx.lineTo(50, height - 50); ctx.lineTo(70, height - 50);
      ctx.moveTo(width - 70, height - 50); ctx.lineTo(width - 50, height - 50); ctx.lineTo(width - 50, height - 70);
      ctx.stroke();
      break;
    }

    case 'cafe-genz': {
      // 3. Cafe Gen-Z: Playful pastel purple & vibrant magenta/cyan bubbles
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.6, '#311042');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative playful blobs
      ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.2, 140, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.65, 160, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful sparkles
      ctx.fillStyle = '#fde047';
      ctx.font = '32px sans-serif';
      ctx.fillText('✨', width * 0.2, height * 0.22);
      ctx.fillText('⚡', width * 0.8, height * 0.5);
      ctx.fillText('💖', width * 0.15, height * 0.42);
      break;
    }

    case 'promo-viral': {
      // 4. Promo Viral: Sunburst radial orange with high energy
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.5, '#c2410c');
      grad.addColorStop(1, '#431407');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Sunburst rays
      ctx.save();
      ctx.translate(width / 2, height * 0.45);
      ctx.fillStyle = 'rgba(251, 146, 60, 0.12)';
      const rays = 20;
      for (let i = 0; i < rays; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, width * 0.9, (i * 2 * Math.PI) / rays, ((i * 2 + 1) * Math.PI) / rays);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Big yellow frame
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, width - 60, height - 60);
      break;
    }

    case 'colorful-fresh': {
      // 5. Colorful Fresh: Green garden gradient with lime accents
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#022c22');
      grad.addColorStop(0.4, '#064e3b');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Tropical lime/citrus glow
      const radial = ctx.createRadialGradient(width / 2, height * 0.45, 40, width / 2, height * 0.45, width * 0.55);
      radial.addColorStop(0, 'rgba(52, 211, 153, 0.25)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'dark-elegant': {
      // 6. Dark Elegant: Rich charcoal & warm amber rim light
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.6, '#09090b');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(width / 2, height * 0.46, 40, width / 2, height * 0.46, width * 0.5);
      glow.addColorStop(0, 'rgba(217, 119, 6, 0.22)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'neon-glow': {
      // 7. Neon Glow: Pitch dark + glowing cyan & pink strokes
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Neon cyan border
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 24;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      roundRect(ctx, 36, 36, width - 72, height - 72, 24);
      ctx.stroke();
      ctx.restore();

      // Neon magenta inner accent line
      ctx.save();
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      roundRect(ctx, 48, 48, width - 96, height - 96, 18);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'korean-cafe': {
      // 8. Korean Cafe: Soft warm taupe & clean cozy rounded surfaces
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#292524');
      grad.addColorStop(0.5, '#1c1917');
      grad.addColorStop(1, '#141211');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft warm card in the middle
      ctx.fillStyle = 'rgba(254, 243, 199, 0.05)';
      roundRect(ctx, 44, 44, width - 88, height - 88, 32);
      ctx.fill();
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }

    case 'street-food': {
      // 9. Street Food: Authentic Indonesian Warung board with red-yellow awning
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1c1012');
      grad.addColorStop(0.5, '#2b1014');
      grad.addColorStop(1, '#13080a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Awning banner stripes at the top
      const awningHeight = 44;
      const stripeWidth = 50;
      for (let x = 0; x < width; x += stripeWidth) {
        ctx.fillStyle = (Math.floor(x / stripeWidth) % 2 === 0) ? '#dc2626' : '#ffffff';
        ctx.fillRect(x, 0, stripeWidth, awningHeight);
      }
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, awningHeight, width, 6);
      break;
    }

    case 'diskon-besar': {
      // 10. Diskon Besar: Red discount theme with warning/sale tape
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#450a0a');
      grad.addColorStop(0.5, '#7f1d1d');
      grad.addColorStop(1, '#1e0505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Diagonal Caution/Sale ribbon across top corner
      ctx.save();
      ctx.translate(width - 180, 70);
      ctx.rotate((35 * Math.PI) / 180);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-150, -22, 300, 44);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥 SUPER SALE 🔥', 0, 0);
      ctx.restore();
      break;
    }

    case 'estetik-instagram': {
      // 11. Estetik Instagram: Modern Editorial Polaroid style
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, width, height);

      // White/Cream polaroid frame for the product
      const frameX = 80;
      const frameY = height * 0.22;
      const frameW = width - 160;
      const frameH = height * 0.48;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.fillStyle = '#fafaf9';
      roundRect(ctx, frameX, frameY, frameW, frameH, 16);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'premium-product-photo':
    default: {
      // 12. Premium Product Photography: Studio Pedestal with overhead spotlight
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0c0a09');
      grad.addColorStop(0.6, '#1c1917');
      grad.addColorStop(1, '#050404');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Spotlight cone
      const cone = ctx.createRadialGradient(width / 2, height * 0.15, 10, width / 2, height * 0.5, width * 0.65);
      cone.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      cone.addColorStop(0.7, 'rgba(251, 191, 36, 0.04)');
      cone.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cone;
      ctx.fillRect(0, 0, width, height);

      // Studio pedestal ellipse at bottom of product
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.65, width * 0.35, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal glow ring
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.65, width * 0.35, 38, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
  }

  // --- DRAW TOP BRANDING (WARUNG NAME & LOGO) ---
  if (showLogo) {
    const topY = styleId === 'street-food' ? 75 : 90;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Badge pill for warung
    ctx.save();
    const brandText = warungName.toUpperCase();
    ctx.font = 'bold 26px "Outfit", sans-serif';
    const brandWidth = ctx.measureText(brandText).width + 60;
    const brandHeight = 44;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    roundRect(ctx, width / 2 - brandWidth / 2, topY - brandHeight / 2, brandWidth, brandHeight, 22);
    ctx.fill();

    ctx.strokeStyle = (styleId === 'premium-luxury') ? '#fbbf24' : '#f97316';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = (styleId === 'premium-luxury') ? '#fbbf24' : '#ffffff';
    ctx.fillText(brandText, width / 2, topY);
    ctx.restore();
  }

  // --- DRAW HEADLINE PROMOSI ---
  const headlineY = height * 0.14;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  if (styleId === 'premium-luxury' || styleId === 'estetik-instagram') {
    ctx.font = 'bold 54px "Playfair Display", Georgia, serif';
  } else if (styleId === 'promo-viral' || styleId === 'diskon-besar' || styleId === 'street-food') {
    ctx.font = '900 60px "Bebas Neue", "Outfit", sans-serif';
  } else {
    ctx.font = '800 52px "Outfit", sans-serif';
  }

  const headlineLines = wrapText(ctx, headline.toUpperCase(), width - 140);
  const headlineLineHeight = 62;

  headlineLines.forEach((line, index) => {
    const currentY = headlineY + index * headlineLineHeight;

    // Glowing shadow for high legibility
    ctx.save();
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;

    if (styleId === 'premium-luxury') {
      ctx.fillStyle = index === 0 ? '#fbbf24' : '#ffffff';
    } else if (styleId === 'promo-viral' || styleId === 'diskon-besar') {
      ctx.fillStyle = index === 0 ? '#facc15' : '#ffffff';
    } else if (styleId === 'neon-glow') {
      ctx.fillStyle = index === 0 ? '#06b6d4' : '#ffffff';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;
    } else {
      ctx.fillStyle = index === 0 ? '#f97316' : '#ffffff';
    }

    ctx.fillText(line, width / 2, currentY);
    ctx.restore();
  });

  // --- DRAW SUBHEADLINE / DESKRIPSI SINGKAT ---
  const subY = headlineY + headlineLines.length * headlineLineHeight + 14;
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const subLines = wrapText(ctx, subheadline, width - 180);
  subLines.slice(0, 2).forEach((line, idx) => {
    ctx.fillText(line, width / 2, subY + idx * 32);
  });

  // --- DRAW PRODUCT IMAGE (CENTERED HERO FOCUS) ---
  const imgCenterY = height * 0.48;
  const maxImgSize = Math.min(width * 0.62, height * 0.38);

  if (productImg) {
    ctx.save();
    // Drop shadow under the image
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 20;

    const imgAspect = productImg.width / productImg.height;
    let drawW = maxImgSize;
    let drawH = maxImgSize;
    if (imgAspect > 1) {
      drawH = maxImgSize / imgAspect;
    } else {
      drawW = maxImgSize * imgAspect;
    }

    const imgX = (width - drawW) / 2;
    const imgY = imgCenterY - drawH / 2;

    // In estetik-instagram, draw within polaroid frame
    if (styleId === 'estetik-instagram') {
      const innerW = width - 200;
      const innerH = height * 0.36;
      const innerX = (width - innerW) / 2;
      const innerY = height * 0.25;

      ctx.save();
      roundRect(ctx, innerX, innerY, innerW, innerH, 8);
      ctx.clip();
      ctx.drawImage(productImg, innerX, innerY, innerW, innerH);
      ctx.restore();
    } else {
      ctx.drawImage(productImg, imgX, imgY, drawW, drawH);
    }
    ctx.restore();
  }

  // --- DRAW BADGE / STIKER PROMO ---
  if (showBadge && badgeText) {
    ctx.save();
    const badgeX = width * 0.22;
    const badgeY = height * 0.35;
    ctx.translate(badgeX, badgeY);
    ctx.rotate((-12 * Math.PI) / 180);

    if (styleId === 'promo-viral' || styleId === 'diskon-besar') {
      // Starburst explosion badge
      ctx.fillStyle = '#dc2626';
      drawStarburst(ctx, 0, 0, 12, 60, 48);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px "Bebas Neue", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText.toUpperCase(), 0, 0);
    } else if (styleId === 'premium-luxury') {
      // Gold ornate round seal
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 15px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const bLines = wrapText(ctx, badgeText.toUpperCase(), 80);
      bLines.forEach((l, i) => {
        ctx.fillText(l, 0, (i - (bLines.length - 1) / 2) * 18);
      });
    } else {
      // Modern chic capsule tag
      ctx.fillStyle = (styleId === 'neon-glow') ? '#06b6d4' : '#f97316';
      roundRect(ctx, -75, -24, 150, 48, 24);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText.toUpperCase(), 0, 0);
    }
    ctx.restore();
  }

  // --- DRAW PRODUCT NAME ---
  const nameY = height * 0.69;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.font = '900 44px "Outfit", sans-serif';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(productName, width / 2, nameY);
  ctx.restore();

  // --- DRAW PRICE (BIG & PROMINENT) ---
  if (showPrice) {
    const priceY = height * 0.75;
    const formattedPrice = formatRupiah(productPrice);

    ctx.save();
    ctx.font = '900 64px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const priceTextWidth = ctx.measureText(formattedPrice).width + 80;
    const pricePillHeight = 84;

    // Price container card
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    if (styleId === 'premium-luxury') {
      const pGrad = ctx.createLinearGradient(0, priceY - 42, 0, priceY + 42);
      pGrad.addColorStop(0, '#fef08a');
      pGrad.addColorStop(0.5, '#eab308');
      pGrad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = '#09090b';
      roundRect(ctx, width / 2 - priceTextWidth / 2, priceY - pricePillHeight / 2, priceTextWidth, pricePillHeight, 42);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.fillText(formattedPrice, width / 2, priceY);
    } else if (styleId === 'promo-viral' || styleId === 'diskon-besar') {
      ctx.fillStyle = '#eab308';
      roundRect(ctx, width / 2 - priceTextWidth / 2, priceY - pricePillHeight / 2, priceTextWidth, pricePillHeight, 20);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.fillText(formattedPrice, width / 2, priceY);
    } else if (styleId === 'neon-glow') {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      roundRect(ctx, width / 2 - priceTextWidth / 2, priceY - pricePillHeight / 2, priceTextWidth, pricePillHeight, 42);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;
      ctx.fillText(formattedPrice, width / 2, priceY);
    } else {
      ctx.fillStyle = '#ea580c';
      roundRect(ctx, width / 2 - priceTextWidth / 2, priceY - pricePillHeight / 2, priceTextWidth, pricePillHeight, 42);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(formattedPrice, width / 2, priceY);
    }
    ctx.restore();
  }

  // --- DRAW CALL TO ACTION BUTTON (CTA) ---
  if (showCta && ctaText) {
    const ctaY = height * 0.83;
    ctx.save();
    ctx.font = 'bold 26px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const ctaWidth = Math.min(width - 160, ctx.measureText(ctaText.toUpperCase()).width + 80);
    const ctaHeight = 64;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    if (styleId === 'premium-luxury') {
      const ctaGrad = ctx.createLinearGradient(0, ctaY - 32, 0, ctaY + 32);
      ctaGrad.addColorStop(0, '#fbbf24');
      ctaGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = ctaGrad;
      roundRect(ctx, width / 2 - ctaWidth / 2, ctaY - ctaHeight / 2, ctaWidth, ctaHeight, 16);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.fillText(ctaText.toUpperCase(), width / 2, ctaY);
    } else if (styleId === 'promo-viral' || styleId === 'diskon-besar') {
      ctx.fillStyle = '#dc2626';
      roundRect(ctx, width / 2 - ctaWidth / 2, ctaY - ctaHeight / 2, ctaWidth, ctaHeight, 16);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(ctaText.toUpperCase(), width / 2, ctaY);
    } else {
      ctx.fillStyle = '#22c55e'; // WhatsApp green button for high conversion!
      roundRect(ctx, width / 2 - ctaWidth / 2, ctaY - ctaHeight / 2, ctaWidth, ctaHeight, 32);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(`💬 ${ctaText.toUpperCase()}`, width / 2, ctaY);
    }
    ctx.restore();
  }

  // --- DRAW FOOTER CONTACT INFO (WHATSAPP & ALAMAT) ---
  if (showContact) {
    const footY = height * 0.92;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // WhatsApp phone number
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillStyle = (styleId === 'premium-luxury') ? '#fde047' : '#ffffff';
    ctx.fillText(`📲 WhatsApp: ${warungPhone}`, width / 2, footY);

    // Address
    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`📍 ${warungAddress}`, width / 2, footY + 36);
    ctx.restore();
  }
}

/**
 * Exports canvas as downloadable blob or triggers browser download
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpeg' = 'png'
): void {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpeg' ? 0.92 : undefined;
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Native Device Share using Web Share API
 */
export async function shareCanvasImage(
  canvas: HTMLCanvasElement,
  title: string,
  text: string
): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        const file = new File([blob], `${title.replace(/\s+/g, '_')}.png`, {
          type: 'image/png',
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title,
            text,
          });
          resolve(true);
        } else if (navigator.share) {
          await navigator.share({
            title,
            text,
          });
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.warn('Share aborted or unsupported:', err);
        resolve(false);
      }
    }, 'image/png');
  });
}
