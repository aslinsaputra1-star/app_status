import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent as instructed
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Copywriting styles mapping
const STYLE_PROMPTS: Record<string, string> = {
  'lucu-menarik': 'Gaya lucu, humoris, menghibur, santai, dan bikin tersenyum atau tertawa tapi tetap menggoda selera.',
  'gen-z': 'Gaya bahasa anak muda Gen-Z Jakarta/Indonesia, gaul, trendi, pakai istilah seperti "vibes", "no debat", "worth it", "chill", "mantul".',
  'profesional': 'Gaya bahasa profesional, elegan, sopan, berkualitas tinggi, menonjolkan higienis, bahan pilihan, dan mutu terjamin.',
  'santai-ramah': 'Gaya ramah seperti menyapa tetangga atau teman akrab, hangat, ramah, dan bersahabat.',
  'persuasif': 'Gaya copywriting persuasif (AIDA/FOMO), menonjolkan urgensi, kenikmatan dahsyat saat haus atau lelah, dan ajakan kuat.',
  'singkat-viral': 'Gaya kalimat sangat singkat, padat, nendang (punchy), mudah dibaca dalam 3 detik, sangat cocok untuk WhatsApp Status dan IG Story.',
  'promo-spesial': 'Gaya pengumuman promo heboh hari ini, diskon, hemat, murah meriah bikin untung banyak.'
};

// API Route: AI Copywriting Generator
app.post('/api/ai/copywriting', async (req, res) => {
  try {
    const {
      productName = 'Jus Mangga Segar',
      price = 10000,
      description = 'Dibuat dari mangga harum manis asli dengan es batu segar',
      style = 'lucu-menarik',
      warungName = 'WARUNG BANG KOBRA',
      phone = '0812-3456-7890',
      address = 'Jl. Kenangan No. 8',
    } = req.body;

    const styleGuide = STYLE_PROMPTS[style] || STYLE_PROMPTS['lucu-menarik'];

    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);

    if (ai) {
      const prompt = `Anda adalah master copywriter kuliner dan warung minuman/makanan profesional untuk "${warungName}".
Tugas Anda adalah membuat teks promosi untuk produk:
- Nama Produk: ${productName}
- Harga: ${formattedPrice}
- Deskripsi/Keunggulan: ${description}
- Gaya Bahasa: ${styleGuide}
- Warung: ${warungName}
- WhatsApp Pemesanan: ${phone}
- Alamat: ${address}

Berikan output dalam JSON yang menarik dan persuasif sesuai schema.
Pastikan teks mengandung info harga ${formattedPrice} dan call to action memesan via WhatsApp (${phone}).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah copywriter promosi media sosial UMKM Indonesia berpengalaman yang ahli membuat status WhatsApp viral.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: 'Judul poster yang sangat memikat (3-6 kata, huruf kapital/catchy)',
              },
              subheadline: {
                type: Type.STRING,
                description: 'Subheadline atau kalimat penjelas (1 kalimat padat)',
              },
              badge: {
                type: Type.STRING,
                description: 'Teks stiker/badge promo singkat, contoh: "HARGA SPESIAL", "BEST SELLER", "SEGAR ALAMI"',
              },
              cta: {
                type: Type.STRING,
                description: 'Kalimat ajakan bertindak (Call To Action), contoh: "PESAN VIA WA SEKARANG!"',
              },
              fullCaption: {
                type: Type.STRING,
                description: 'Teks lengkap status WhatsApp / Instagram dengan emoji, rincian harga, info rasa, dan kontak WA',
              },
              socialHook: {
                type: Type.STRING,
                description: '1 kalimat hook pembuka untuk story atau reels',
              },
            },
            required: ['headline', 'subheadline', 'badge', 'cta', 'fullCaption', 'socialHook'],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed });
      }
    }

    // High-quality deterministic fallback if AI is not available
    const fallbackTemplates: Record<string, any> = {
      'lucu-menarik': {
        headline: 'HAUS? JANGAN DITAHAN NANTI MASUK ANGIN!',
        subheadline: `${productName} dingin mantap siap segarkan harimu seketika.`,
        badge: 'CUMA ' + formattedPrice,
        cta: 'PESAN SEKARANG VIA WA!',
        fullCaption: `Lagi haus atau gerah? Jangan ditahan, nanti meriang! 🥶 Yuk seruput ${productName} dari ${warungName}! Rasa nikmat, buah mantap, cuma ${formattedPrice}. Langsung bungkus ke WA: ${phone} (${address}) 🚀`,
        socialHook: `Bikin harimu auto segar dalam satu tegukan!`,
      },
      'gen-z': {
        headline: 'FIX INI ENAK BANGET NO DEBAT!',
        subheadline: `${productName} ${warungName} rasanya beneran se-refreshing itu.`,
        badge: 'FAVORIT KITA',
        cta: 'GAS ORDER SEKARANG',
        fullCaption: `Vibes hari ini butuh yang seger-seger gak sih? Bestie wajib coba ${productName} di ${warungName}! Cuma ${formattedPrice} udah bisa nongkrong chill. Cus WA ke ${phone} sebelum kehabisan! ✨`,
        socialHook: `Definisi moodbooster yang sesungguhnya!`,
      },
      'profesional': {
        headline: 'KESEGARAN PREMIUM, KUALITAS TERBAIK',
        subheadline: `Dibuat higienis dari bahan pilihan berkualitas untuk kepuasan Anda.`,
        badge: 'KUALITAS TERJAMIN',
        cta: 'PESAN HARI INI',
        fullCaption: `Nikmati kesegaran istimewa ${productName} persembahan ${warungName}. Diproses dengan standar higienis dan bahan bermutu tinggi. Harga terjangkau ${formattedPrice}. Hubungi kami di ${phone}.`,
        socialHook: `Pilihan cerdas untuk kesegaran harian Anda.`,
      },
      'santai-ramah': {
        headline: 'ISTIRAHAT SEBENTAR, SEGARIN DULU!',
        subheadline: `Yuk mampir dan cicipi ${productName} khas ${warungName}.`,
        badge: 'HARGA RAMAH',
        cta: 'MAMPIR & PESAN',
        fullCaption: `Halo sobat ${warungName}! Capek beraktivitas? Segarkan kembali semangatmu dengan ${productName}! Cuma ${formattedPrice}, ramah di kantong dan bikin adem. WA kita di ${phone} ya! 😊`,
        socialHook: `Teman setia pelepas dahaga setiap hari.`,
      },
      'persuasif': {
        headline: 'LELEHKAN DAHAGAMU DENGAN SENSASI DINGIN!',
        subheadline: `Sekali coba langsung nagih, jangan sampai terlewatkan hari ini!`,
        badge: 'PROMO HARI INI',
        cta: 'HUBUNGI WA SEKARANG',
        fullCaption: `Tenggorokan kering butuh penyelamat? ${productName} dari ${warungName} jawabannya! Perpaduan rasa manis, segar, dan dingin cuma ${formattedPrice}. Pesan sekarang sebelum antrean panjang di WA: ${phone}! 💥`,
        socialHook: `Penyelamat dahaga paling ampuh hari ini!`,
      },
      'singkat-viral': {
        headline: 'SEGARNYA BIKIN MERINDING!',
        subheadline: `${productName} dingin cuma ${formattedPrice}.`,
        badge: 'VIRAL!',
        cta: 'ORDER WA DI SINI',
        fullCaption: `Cuma ${formattedPrice} dapet kesegaran ${productName} seenak ini di ${warungName}! Yuk cobain, langsung WA ke ${phone} sekarang! 🔥`,
        socialHook: `Yang lagi viral dan paling laris hari ini!`,
      },
      'promo-spesial': {
        headline: 'PROMO SPESIAL HARI INI!',
        subheadline: `Spesial buat kamu, nikmati ${productName} dengan harga hemat.`,
        badge: 'HEMAT MAKSIMAL',
        cta: 'KLAIM PROMO VIA WA',
        fullCaption: `🎉 PROMO SPESIAL ${warungName} HARI INI! Dapatkan ${productName} favorit dengan harga cuma ${formattedPrice}. Stok terbatas, pesan sekarang via WhatsApp: ${phone}! 🛒`,
        socialHook: `Jangan lewatkan harga promo spesial ini!`,
      },
    };

    const chosen = fallbackTemplates[style] || fallbackTemplates['lucu-menarik'];
    return res.json({ success: true, data: chosen, isFallback: true });
  } catch (error: any) {
    console.error('Error generating copywriting:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Gagal menghasilkan copywriting',
    });
  }
});

// Helper to convert aspect ratio for Gemini SDK
function normalizeGeminiAspectRatio(ratio: string): '1:1' | '3:4' | '4:3' | '9:16' | '16:9' {
  switch (ratio) {
    case '9:16':
      return '9:16';
    case '1:1':
      return '1:1';
    case '16:9':
      return '16:9';
    case '4:5':
    case '3:4':
      return '3:4';
    case '4:3':
      return '4:3';
    default:
      return '9:16';
  }
}

// Map 12 visual image styles into detailed photo prompts
const IMAGE_STYLE_DESCRIPTIONS: Record<string, string> = {
  'realistic-photography': 'Ultra-realistic commercial studio product photography, hyper-detailed, clean natural lighting, 8k resolution, crisp focus.',
  'commercial-advertising': 'High-end billboard commercial advertising beverage photo, dramatic commercial lighting, premium reflection and clarity.',
  'cinematic-lighting': 'Cinematic moody lighting, rim highlights, deep atmospheric contrast, depth of field, anamorphic lens aesthetic.',
  'fresh-drink': 'Refreshing beverage macro shot, condensation droplets on glass, crystal clear floating ice cubes, fresh citrus and fruit slices, refreshing summer vibe.',
  'korean-cafe': 'Minimalist cozy Korean cafe aesthetic, warm soft pastel wooden table, gentle morning sun rays, clean organic mood.',
  'luxury-gold': 'Luxury black and obsidian background with elegant gold accents, dramatic overhead studio spotlight, premium VIP look.',
  'colorful-genz': 'Vibrant colorful pop-art Gen-Z aesthetic, bold saturated studio backdrop, youthful energetic composition.',
  'minimalist-studio': 'Minimalist clean podium studio composition, neutral travertine surface, subtle shadows, modern Scandinavian simplicity.',
  'neon-advertising': 'Cyberpunk dark night scene, glowing vibrant neon lights (cyan, orange, magenta), glowing wet street reflections.',
  'street-food': 'Authentic Southeast Asian Indonesian street food and warung vibe, rich colors, nostalgic lively atmosphere, appetizing food display.',
  'illustration-3d': 'Clean modern 3D rendered clay/isometric commercial product illustration, smooth textures, playful studio lighting.',
  'cartoon': 'Vibrant stylized pop beverage cartoon art, clean outlines, joyful expressive design.',
};

// API Route: AI Image Generator (from text)
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const {
      prompt = '',
      productName = 'Jus Mangga Segar',
      style = 'fresh-drink',
      aspectRatio = '9:16',
      lighting = 'Studio Softbox',
      decorativeElements = '',
      negativePrompt = 'blurry, distorted, low quality, messy, unappetizing',
    } = req.body;

    if (!apiKey || !ai) {
      return res.status(503).json({
        success: false,
        error: 'API Key Gemini belum terkonfigurasi pada server.',
        needsConfig: true,
      });
    }

    const styleDesc = IMAGE_STYLE_DESCRIPTIONS[style] || IMAGE_STYLE_DESCRIPTIONS['fresh-drink'];
    const geminiRatio = normalizeGeminiAspectRatio(aspectRatio);

    const fullPrompt = `${prompt || `A stunning promotional commercial beverage photograph of ${productName} for "WARUNG BANG KOBRA"`}.
Style: ${styleDesc}.
Lighting: ${lighting}.
Details: ${decorativeElements ? `Featuring ${decorativeElements}.` : 'Crystal clear ice cubes, fresh condensation droplets, appetizing presentation.'}
Composition: Centered product showcase with clean negative space around top and bottom for text and price placement.
Quality: Commercial 8k advertising photograph, high detail, vibrant colors. Avoid: ${negativePrompt}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: geminiRatio,
        },
      },
    });

    // Iterate through candidates and parts to find the generated image
    let generatedImageUrl: string | null = null;
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (generatedImageUrl) {
      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        prompt: fullPrompt,
        style,
        aspectRatio: geminiRatio,
      });
    } else {
      // Model returned response but without an inline image part
      const textResponse = response.text || '';
      return res.status(422).json({
        success: false,
        error: textResponse || 'Model tidak mengembalikan data gambar inline.',
      });
    }
  } catch (error: any) {
    console.error('Error generating AI image:', error);
    const errorMsg = error?.message || 'Gagal memproses pembuatan gambar AI.';
    const isPaidModelNotice = errorMsg.includes('paid') || errorMsg.includes('quota') || errorMsg.includes('permission') || errorMsg.includes('403');

    return res.status(500).json({
      success: false,
      error: errorMsg,
      isPaidModelNotice,
    });
  }
});

// API Route: AI Image Editor & Background Replacement (from uploaded image)
app.post('/api/ai/edit-image', async (req, res) => {
  try {
    const {
      base64Image,
      instruction = 'Place this beverage product onto a clean professional studio surface with soft lighting and refreshing droplets.',
      mode = 'edit',
      style = 'fresh-drink',
    } = req.body;

    if (!base64Image) {
      return res.status(400).json({
        success: false,
        error: 'Foto produk (base64) diperlukan untuk mode edit gambar.',
      });
    }

    if (!apiKey || !ai) {
      return res.status(503).json({
        success: false,
        error: 'API Key Gemini belum terkonfigurasi pada server.',
        needsConfig: true,
      });
    }

    // Extract raw base64 data and mimeType
    let mimeType = 'image/png';
    let rawBase64 = base64Image;
    if (base64Image.includes(';base64,')) {
      const parts = base64Image.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/png';
      rawBase64 = parts[1];
    }

    const styleDesc = IMAGE_STYLE_DESCRIPTIONS[style] || IMAGE_STYLE_DESCRIPTIONS['fresh-drink'];

    let promptText = '';
    if (mode === 'replace-bg') {
      promptText = `Seamlessly replace the background of this product image with a professional commercial photography backdrop. Keep the bottle, cup, and label intact. Style: ${styleDesc}. ${instruction}`;
    } else if (mode === 'add-effects') {
      promptText = `Enhance this beverage product photo by adding glistening condensation water droplets, ice reflections, and studio lighting while strictly preserving the main product shape and label. Style: ${styleDesc}. ${instruction}`;
    } else {
      promptText = `Edit this product image: ${instruction}. Style: ${styleDesc}. Maintain product identity, crisp focus, commercial grade quality.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: rawBase64,
              mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
    });

    let generatedImageUrl: string | null = null;
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const retMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${retMime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (generatedImageUrl) {
      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        instruction: promptText,
      });
    } else {
      const textResponse = response.text || '';
      return res.status(422).json({
        success: false,
        error: textResponse || 'Model tidak mengembalikan hasil gambar yang diedit.',
      });
    }
  } catch (error: any) {
    console.error('Error editing AI image:', error);
    const errorMsg = error?.message || 'Gagal mengedit gambar dengan AI.';
    const isPaidModelNotice = errorMsg.includes('paid') || errorMsg.includes('quota') || errorMsg.includes('permission') || errorMsg.includes('403');

    return res.status(500).json({
      success: false,
      error: errorMsg,
      isPaidModelNotice,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server Warung Bang Kobra listening on port ${port}`);
  });
}

startServer();
