import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Download,
  Share2,
  Sliders,
  Check,
  Smartphone,
  Eye,
  Camera,
  Layers,
  Wand2,
  Palette,
  Droplets,
  Sun,
  Flame,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Info,
  Maximize2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, PosterState, WarungSettings } from '../types';
import { composeStudioProductPhoto, StudioFilterOptions } from '../utils/photoStudioComposer';
import { useToast } from './Toast';

interface AiImageGeneratorViewProps {
  products: Product[];
  settings: WarungSettings;
  onUseImageInPoster: (imageDataUrl: string, productName: string, promptText?: string) => void;
  onQuickCreate: () => void;
}

const AI_STYLES = [
  { id: 'fresh-drink', name: 'Fresh Drink Photography', tagline: 'Embun, es batu & kesegaran buah asli' },
  { id: 'realistic-photography', name: 'Realistic Product Photography', tagline: 'Kualitas studio komersial 8K jernih' },
  { id: 'commercial-advertising', name: 'Premium Commercial Advertising', tagline: 'Iklan billboard minuman mewah' },
  { id: 'cinematic-lighting', name: 'Cinematic Lighting', tagline: 'Pencahayaan dramatis berkelas' },
  { id: 'korean-cafe', name: 'Korean Cafe Style', tagline: 'Hangat, kayu estetik & minimalis' },
  { id: 'luxury-gold', name: 'Luxury Black and Gold', tagline: 'Hitam obsidian & aksen emas glamor' },
  { id: 'colorful-genz', name: 'Colorful Gen-Z', tagline: 'Warna pop-art berenergi tinggi' },
  { id: 'minimalist-studio', name: 'Minimalist Studio', tagline: 'Podium bersih dengan bayangan lembut' },
  { id: 'neon-advertising', name: 'Neon Advertising', tagline: 'Lampu neon cyber berlatar malam' },
  { id: 'street-food', name: 'Street Food Promotion', tagline: 'Warung nusantara autentik & ramai' },
  { id: 'illustration-3d', name: '3D Illustration', tagline: 'Gaya 3D render halus dan modern' },
  { id: 'cartoon', name: 'Cartoon Style', tagline: 'Ilustrasi pop art ceria' },
];

const RATIOS = [
  { id: '9:16', label: '9:16 — WhatsApp & IG Story', desc: '1080 × 1920 px (Vertikal Penuh)' },
  { id: '1:1', label: '1:1 — Postingan Persegi', desc: '1080 × 1080 px (Feed Instagram)' },
  { id: '4:5', label: '4:5 — Postingan Potret', desc: '1080 × 1350 px (Feed Vertikal)' },
  { id: '16:9', label: '16:9 — Banner Lanskap', desc: '1920 × 1080 px (Header & Facebook)' },
];

const PROMPT_INSPIRATIONS = [
  'Buat poster Jus Mangga segar dengan es batu dan percikan air berkilau.',
  'Buat poster Thai Tea dengan desain premium dan latar oranye hangat.',
  'Buat gambar promo minuman kekinian ala cafe Gen-Z warna cerah.',
  'Buat poster diskon minuman dengan desain elegan hitam emas.',
  'Buat gambar promosi produk dengan gaya fotografi studio profesional.',
  'Foto iklan Dalgona Coffee dengan busa kopi tebal di atas cangkir kaca dingin.',
];

export const AiImageGeneratorView: React.FC<AiImageGeneratorViewProps> = ({
  products,
  settings,
  onUseImageInPoster,
  onQuickCreate,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mode Selection
  const [generationMode, setGenerationMode] = useState<
    'text-to-image' | 'edit-photo' | 'replace-bg' | 'studio-compose'
  >('text-to-image');

  // Input states
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [prompt, setPrompt] = useState<string>(
    'Buat poster Jus Mangga segar dengan es batu kristal dan percikan air dingin.'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('fresh-drink');
  const [selectedRatio, setSelectedRatio] = useState<string>('9:16');
  const [lighting, setLighting] = useState<string>('Studio Softbox');
  const [uploadedImage, setUploadedImage] = useState<string>(products[0]?.imageUrl || '');

  // Effects toggles
  const [addWaterDroplets, setAddWaterDroplets] = useState<boolean>(true);
  const [addIceCubes, setAddIceCubes] = useState<boolean>(true);
  const [backgroundTheme, setBackgroundTheme] = useState<StudioFilterOptions['backgroundTheme']>(
    'studio-podium'
  );

  // Generation status & results
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStepText, setCurrentStepText] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(products[0]?.imageUrl || null);
  const [generatedGallery, setGeneratedGallery] = useState<string[]>([]);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<boolean>(false);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar yang valid (JPG/PNG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setUploadedImage(res);
        setResultImage(res);
        showToast('Foto produk berhasil diunggah!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Change product dropdown
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setUploadedImage(prod.imageUrl);
    setPrompt(`Buat foto iklan ${prod.name} segar dengan es batu dan latar studio profesional.`);
  };

  // Main Generator Action
  const handleGenerate = async () => {
    setIsGenerating(true);
    setApiNotice(null);

    try {
      if (generationMode === 'text-to-image') {
        setCurrentStepText('Menghubungkan ke model Gemini Image Generator...');
        const res = await fetch('/api/ai/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            productName: selectedProduct?.name || 'Minuman Segar',
            style: selectedStyle,
            aspectRatio: selectedRatio,
            lighting,
            decorativeElements: `${addWaterDroplets ? 'water droplets, ' : ''}${addIceCubes ? 'crystal ice cubes, ' : ''}`,
          }),
        });

        const data = await res.json();

        if (res.ok && data?.imageUrl) {
          setResultImage(data.imageUrl);
          setGeneratedGallery((prev) => [data.imageUrl, ...prev]);
          confetti({ particleCount: 70, spread: 60 });
          showToast('Gambar AI berhasil digenerate!', 'success');
          return;
        } else {
          // If Gemini API returns paid model notice or quota error:
          console.warn('AI image response:', data);
          setApiNotice(
            data?.error ||
              'Model AI Image Generator memerlukan API key dengan akses Gemini Image Generation. Studio Otomatis kami mengalihkan ke mode Studio Render Komposisi Fotografi HD.'
          );

          // Fallback seamlessly to our high-quality Studio Composer engine!
          setCurrentStepText('Menerapkan efek studio pencahayaan & embun dingin...');
          const composed = await composeStudioProductPhoto(uploadedImage || selectedProduct?.imageUrl, {
            backgroundTheme,
            lightingEffect: lighting === 'Studio Softbox' ? 'softbox' : 'spotlight',
            addWaterDroplets,
            addIceCubes,
            aspectRatio: selectedRatio as any,
          });

          setResultImage(composed);
          setGeneratedGallery((prev) => [composed, ...prev]);
          showToast('Gambar berhasil diproses dengan Efek Studio Fotografi!', 'success');
        }
      } else {
        // Edit / Background Replacement Mode
        setCurrentStepText('Memproses foto produk & mengganti background...');
        const res = await fetch('/api/ai/edit-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image: uploadedImage,
            instruction: prompt,
            mode: generationMode === 'replace-bg' ? 'replace-bg' : 'edit',
            style: selectedStyle,
          }),
        });

        const data = await res.json();

        if (res.ok && data?.imageUrl) {
          setResultImage(data.imageUrl);
          setGeneratedGallery((prev) => [data.imageUrl, ...prev]);
          showToast('Foto berhasil diedit dengan AI!', 'success');
        } else {
          // Process locally via Studio Composer engine
          setCurrentStepText('Mengganti latar belakang & merender efek studio...');
          const composed = await composeStudioProductPhoto(uploadedImage, {
            backgroundTheme,
            lightingEffect: 'spotlight',
            addWaterDroplets,
            addIceCubes,
            aspectRatio: selectedRatio as any,
          });

          setResultImage(composed);
          setGeneratedGallery((prev) => [composed, ...prev]);
          setApiNotice(
            data?.error || 'Latar belakang foto diganti menggunakan Studio Composer dengan efek pencahayaan studio.'
          );
          showToast('Foto studio berhasil diracik!', 'success');
        }
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      // Run fallback studio composer
      const composed = await composeStudioProductPhoto(uploadedImage || selectedProduct?.imageUrl, {
        backgroundTheme,
        lightingEffect: 'softbox',
        addWaterDroplets,
        addIceCubes,
        aspectRatio: selectedRatio as any,
      });
      setResultImage(composed);
      setGeneratedGallery((prev) => [composed, ...prev]);
      showToast('Gambar berhasil dibuat dengan Studio Composer!', 'success');
    } finally {
      setIsGenerating(false);
      setCurrentStepText('');
    }
  };

  // Download resulting image
  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `ai_warung_bang_kobra_${selectedProduct?.name || 'produk'}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Gambar ${format.toUpperCase()} berhasil diunduh!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            Fitur Premium: AI Image Generator
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            GENERATE GAMBAR PROMOSI AI
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
            Hasilkan gambar promosi produk warung dengan tampilan studio profesional, embun segar, dan pencahayaan komersial dari teks atau foto asli galeri HP.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONTROLS & PROMPTS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Selector Tabs */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-1.5 flex flex-wrap gap-1 shadow-md">
            {[
              { id: 'text-to-image', label: '1. Dari Teks', icon: Wand2 },
              { id: 'edit-photo', label: '2. Edit Foto HP', icon: Camera },
              { id: 'replace-bg', label: '3. Ganti Background', icon: Layers },
              { id: 'studio-compose', label: '4. Studio Efek HD', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setGenerationMode(tab.id as any)}
                  className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    generationMode === tab.id
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Product Select & Upload Foto Card */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Pilih Menu atau Unggah Foto Sendiri
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload dari Galeri
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-950 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-stone-600" />
                )}
              </div>
              <div className="flex-1">
                <select
                  value={selectedProduct?.id}
                  onChange={(e) => {
                    const p = products.find((prod) => prod.id === e.target.value);
                    if (p) handleSelectProduct(p);
                  }}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)})
                    </option>
                  ))}
                </select>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Prompt Input & Quick Inspirations */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
              Deskripsi Prompt Gambar AI
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan suasana, minuman, es batu, pencahayaan, dan latar belakang yang diinginkan..."
              className="w-full p-3.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
                Contoh Perintah Siap Pakai:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_INSPIRATIONS.map((insp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(insp)}
                    className="text-[11px] py-1 px-2.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-stone-700 transition-colors text-left"
                  >
                    "{insp}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style & Aspect Ratio Selection */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-4">
            {/* 12 Visual Styles */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Pilih Gaya Visual Fotografi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {AI_STYLES.map((st) => {
                  const isSelected = selectedStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStyle(st.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block truncate">{st.name}</span>
                      <span className="text-[10px] text-amber-500 block truncate mt-0.5">
                        {st.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Rasio Format Gambar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RATIOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRatio(r.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedRatio === r.id
                        ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{r.id}</span>
                    <span className="text-[10px] opacity-80 block truncate">{r.label.split('—')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photographic Effects (Embun, Pencahayaan, Backdrop) */}
            <div className="pt-3 border-t border-stone-800 space-y-3">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Efek Studio Tambahan
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addWaterDroplets}
                    onChange={(e) => setAddWaterDroplets(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <div className="text-xs text-stone-200">
                    <span className="font-semibold block">Embun Dingin</span>
                    <span className="text-[10px] text-stone-400">Tetesan air segar di gelas</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addIceCubes}
                    onChange={(e) => setAddIceCubes(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <div className="text-xs text-stone-200">
                    <span className="font-semibold block">Es Batu Kristal</span>
                    <span className="text-[10px] text-stone-400">Refleksi es jernih</span>
                  </div>
                </label>
              </div>

              {/* Background Theme Selector */}
              <div>
                <span className="text-[11px] font-semibold text-stone-400 block mb-1">
                  Tema Background Studio:
                </span>
                <select
                  value={backgroundTheme}
                  onChange={(e) => setBackgroundTheme(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="studio-podium">Studio Podium Netral (Modern Slate)</option>
                  <option value="luxury-obsidian">Luxury Obsidian & Aksen Emas</option>
                  <option value="tropical-fresh">Tropical Fresh Garden (Hijau Buah)</option>
                  <option value="neon-cyber">Neon Cyber Advertising (Malam Pendar)</option>
                  <option value="korean-warm-wood">Korean Cafe Warm Wood</option>
                </select>
              </div>
            </div>

            {/* Master Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{currentStepText || 'MEMPROSES GAMBAR AI...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-stone-950" />
                  <span>GENERATE GAMBAR AI SEKARANG</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & POSTER INTEGRATION (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                Pratinjau Hasil Gambar
              </span>
              {resultImage && (
                <button
                  onClick={() => setPreviewModal(true)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                  title="Perbesar"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Image Preview Canvas Display */}
            <div className="relative w-full aspect-9/16 bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden flex items-center justify-center p-2 shadow-inner">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="w-12 h-12 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
                  <span className="text-xs font-bold text-amber-400">
                    {currentStepText || 'Memproses komposisi fotografi...'}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Menyusun pencahayaan, embun es, dan rasio format {selectedRatio}...
                  </span>
                </div>
              ) : resultImage ? (
                <img
                  src={resultImage}
                  alt="Hasil AI"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-6 text-stone-500 text-xs">
                  <Camera className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <span>Klik tombol GENERATE untuk memuat hasil foto promosi</span>
                </div>
              )}
            </div>

            {/* Notification / API feedback info */}
            {apiNotice && (
              <div className="mt-3 p-3 rounded-xl bg-stone-950 border border-amber-500/30 text-[11px] text-amber-300/90 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{apiNotice}</span>
              </div>
            )}

            {/* Action Buttons for Result: Gunakan ke Poster, Download PNG/JPG */}
            {resultImage && (
              <div className="mt-4 space-y-2.5">
                {/* Master Bridge: Buka di Poster Editor dengan Teks & Harga Lengkap */}
                <button
                  onClick={() =>
                    onUseImageInPoster(
                      resultImage,
                      selectedProduct?.name || 'Produk Warung',
                      prompt
                    )
                  }
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-stone-950" />
                  <span>Gunakan Gambar & Tambah Teks/Harga di Poster</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownload('png')}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unduh PNG</span>
                  </button>
                  <button
                    onClick={() => handleDownload('jpeg')}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Unduh JPG</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleGenerate}
                    className="py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium border border-stone-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Ulang</span>
                  </button>
                  <button
                    onClick={onQuickCreate}
                    className="py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium border border-stone-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Buat Variasi Lain</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sesi Galeri Hasil Generate Gambar */}
          {generatedGallery.length > 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Riwayat Sesi Generate Gambar ({generatedGallery.length})
              </span>
              <div className="grid grid-cols-4 gap-2">
                {generatedGallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setResultImage(imgUrl)}
                    className="aspect-square rounded-xl overflow-hidden border border-stone-800 hover:border-amber-500 transition-all p-1 bg-stone-950"
                  >
                    <img src={imgUrl} alt={`Variasi ${i}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewModal && resultImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full flex items-center justify-between mb-3 text-stone-100">
            <span className="text-sm font-bold">Hasil Gambar Resolusi Penuh</span>
            <button
              onClick={() => setPreviewModal(false)}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-[85vh] max-w-sm w-full flex items-center justify-center bg-stone-950 rounded-2xl overflow-hidden shadow-2xl p-2 border border-stone-800">
            <img
              src={resultImage}
              alt="Fullscreen result"
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleDownload('png')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
            >
              Unduh Gambar PNG
            </button>
            <button
              onClick={() => setPreviewModal(false)}
              className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-medium text-xs hover:bg-stone-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
