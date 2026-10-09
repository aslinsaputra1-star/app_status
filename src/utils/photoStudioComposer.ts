import { loadImage } from './canvasRenderer';

export interface StudioFilterOptions {
  backgroundTheme:
    | 'studio-podium'
    | 'tropical-fresh'
    | 'neon-cyber'
    | 'luxury-obsidian'
    | 'korean-warm-wood'
    | 'cinematic-dark';
  lightingEffect: 'spotlight' | 'softbox' | 'rim-light' | 'none';
  addWaterDroplets: boolean;
  addIceCubes: boolean;
  aspectRatio: '9:16' | '1:1' | '4:5' | '16:9';
}

export function getDimensionsForRatio(ratio: string): { width: number; height: number } {
  switch (ratio) {
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '4:5':
      return { width: 1080, height: 1350 };
    case '16:9':
      return { width: 1920, height: 1080 };
    default:
      return { width: 1080, height: 1920 };
  }
}

/**
 * Procedurally draws realistic water droplets & ice condensation on the canvas
 */
function drawCondensationDroplets(ctx: CanvasRenderingContext2D, width: number, height: number, productBounds: { x: number; y: number; w: number; h: number }) {
  ctx.save();
  // Draw droplets around and over the product glass
  const seed = 42;
  const numDroplets = 45;

  for (let i = 0; i < numDroplets; i++) {
    // Generate droplet position focused on product area
    const dx = productBounds.x + 30 + Math.sin(i * 99 + seed) * (productBounds.w / 2 - 40) + productBounds.w / 2 - 30;
    const dy = productBounds.y + 40 + (i / numDroplets) * (productBounds.h - 90);
    const radius = 3 + (Math.abs(Math.sin(i * 13)) * 6);

    // Droplet shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(dx + 1.5, dy + 2, radius, radius * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Droplet body highlight
    const grad = ctx.createRadialGradient(dx - radius * 0.3, dy - radius * 0.3, 1, dx, dy, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    grad.addColorStop(0.9, 'rgba(186, 230, 253, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(dx, dy, radius, radius * 1.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiny specular bright white pin-point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(dx - radius * 0.35, dy - radius * 0.35, Math.max(1, radius * 0.25), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Creates high-fidelity studio commercial photograph composition
 */
export async function composeStudioProductPhoto(
  productImageUrl: string,
  options: StudioFilterOptions
): Promise<string> {
  const { width, height } = getDimensionsForRatio(options.aspectRatio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // 1. Draw Photographic Backdrop
  switch (options.backgroundTheme) {
    case 'luxury-obsidian': {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.5, '#18181b');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold shimmer floor
      const floorGrad = ctx.createRadialGradient(width / 2, height * 0.72, 30, width / 2, height * 0.72, width * 0.45);
      floorGrad.addColorStop(0, 'rgba(234, 179, 8, 0.25)');
      floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'tropical-fresh': {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#022c22');
      grad.addColorStop(0.4, '#064e3b');
      grad.addColorStop(1, '#021e17');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Tropical bokeh circles
      ctx.fillStyle = 'rgba(52, 211, 153, 0.15)';
      ctx.beginPath(); ctx.arc(width * 0.2, height * 0.3, 160, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(width * 0.8, height * 0.4, 190, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'neon-cyber': {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Cyber ambient lights
      const cyanGlow = ctx.createRadialGradient(width * 0.2, height * 0.4, 20, width * 0.2, height * 0.4, width * 0.5);
      cyanGlow.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      cyanGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, width, height);

      const magentaGlow = ctx.createRadialGradient(width * 0.8, height * 0.5, 20, width * 0.8, height * 0.5, width * 0.5);
      magentaGlow.addColorStop(0, 'rgba(236, 72, 153, 0.25)');
      magentaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = magentaGlow;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'korean-warm-wood': {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#292524');
      grad.addColorStop(0.6, '#1c1917');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Warm morning sunbeam
      const sun = ctx.createLinearGradient(0, 0, width * 0.8, height * 0.6);
      sun.addColorStop(0, 'rgba(254, 240, 138, 0.18)');
      sun.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'studio-podium':
    default: {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft neutral spotlight
      const light = ctx.createRadialGradient(width / 2, height * 0.45, 40, width / 2, height * 0.45, width * 0.6);
      light.addColorStop(0, 'rgba(248, 250, 252, 0.18)');
      light.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
      break;
    }
  }

  // 2. Studio Pedestal / Ground Shadow
  const pedestalCenterY = height * 0.68;
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(width / 2, pedestalCenterY, width * 0.38, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle podium rim
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(width / 2, pedestalCenterY, width * 0.38, 42, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Load & Draw Product Image
  let productImg: HTMLImageElement | null = null;
  if (productImageUrl) {
    try {
      productImg = await loadImage(productImageUrl);
    } catch (e) {
      console.warn('Failed to load image for studio compose:', e);
    }
  }

  const maxProductDim = Math.min(width * 0.65, height * 0.46);
  let pX = (width - maxProductDim) / 2;
  let pY = height * 0.32;
  let pW = maxProductDim;
  let pH = maxProductDim;

  if (productImg) {
    const aspect = productImg.width / productImg.height;
    if (aspect > 1) {
      pH = maxProductDim / aspect;
    } else {
      pW = maxProductDim * aspect;
    }
    pX = (width - pW) / 2;
    pY = pedestalCenterY - pH + 30;

    // Contact drop-shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 24;
    ctx.drawImage(productImg, pX, pY, pW, pH);
    ctx.restore();
  }

  // 4. Procedural Condensation Droplets Effect
  if (options.addWaterDroplets) {
    drawCondensationDroplets(ctx, width, height, { x: pX, y: pY, w: pW, h: pH });
  }

  // 5. Lighting Overlays
  if (options.lightingEffect === 'spotlight') {
    ctx.save();
    const spot = ctx.createRadialGradient(width / 2, height * 0.1, 10, width / 2, pY + pH / 2, width * 0.7);
    spot.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    spot.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  } else if (options.lightingEffect === 'rim-light') {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(width / 2, pY + pH / 2, pW * 0.58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  return canvas.toDataURL('image/png', 0.95);
}
