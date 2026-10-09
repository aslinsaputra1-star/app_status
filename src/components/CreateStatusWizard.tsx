import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Check,
  Coffee,
  ChevronRight,
  Flame,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Product, DesignStyleId, AspectRatioId, PosterState, WarungSettings } from '../types';
import { DESIGN_STYLES, ASPECT_RATIOS } from '../data/constants';
import { formatRupiah } from '../utils/canvasRenderer';
import { useToast } from './Toast';

interface CreateStatusWizardProps {
  products: Product[];
  settings: WarungSettings;
  onDesignGenerated: (poster: PosterState) => void;
  onOpenProductManager: () => void;
}

export const CreateStatusWizard: React.FC<CreateStatusWizardProps> = ({
  products,
  settings,
  onDesignGenerated,
  onOpenProductManager,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Wizard state
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0] || null);
  const [customName, setCustomName] = useState<string>(products[0]?.name || '');
  const [customPrice, setCustomPrice] = useState<number>(products[0]?.price || 10000);
  const [customDesc, setCustomDesc] = useState<string>(products[0]?.description || '');
  const [customImage, setCustomImage] = useState<string>(products[0]?.imageUrl || '');

  const [selectedStyle, setSelectedStyle] = useState<DesignStyleId>('promo-viral');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioId>('whatsapp-status');
  const [copywritingStyle, setCopywritingStyle] = useState<string>('singkat-viral');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // When user picks a product from catalog
  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setCustomName(prod.name);
    setCustomPrice(prod.price);
    setCustomDesc(prod.description);
    setCustomImage(prod.imageUrl);
  };

  // Upload custom photo from phone gallery
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar yang valid', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setCustomImage(res);
        showToast('Foto dari HP berhasil diunggah!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered products list
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // The Big Feature: "BUAT STATUS OTOMATIS"
  const handleGenerateAutomatic = async () => {
    if (!customName.trim()) {
      showToast('Masukkan nama produk terlebih dahulu', 'error');
      return;
    }

    setIsGenerating(true);
    showToast('AI sedang meracik status promosi terbaik...', 'info');

    let generatedHeadline = 'SEGARNYA BIKIN MERINDING!';
    let generatedSubheadline = `${customName} dingin mantap siap segarkan harimu seketika.`;
    let generatedBadge = 'CUMA ' + formatRupiah(customPrice);
    let generatedCta = 'PESAN SEKARANG VIA WA!';

    try {
      // Call backend AI generator
      const res = await fetch('/api/ai/copywriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: customName,
          price: customPrice,
          description: customDesc,
          style: copywritingStyle,
          warungName: settings.warungName,
          phone: settings.phone,
          address: settings.address,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          generatedHeadline = json.data.headline || generatedHeadline;
          generatedSubheadline = json.data.subheadline || generatedSubheadline;
          generatedBadge = json.data.badge || generatedBadge;
          generatedCta = json.data.cta || generatedCta;
        }
      }
    } catch (err) {
      console.warn('AI Copywriting API call fallback used:', err);
    }

    const ratioInfo = ASPECT_RATIOS.find((r) => r.id === selectedRatio) || ASPECT_RATIOS[0];

    const posterResult: PosterState = {
      title: `Status ${customName}`,
      productId: selectedProduct?.id,
      productName: customName,
      productPrice: customPrice,
      productImageUrl: customImage,
      styleId: selectedStyle,
      aspectRatio: selectedRatio,
      width: ratioInfo.width,
      height: ratioInfo.height,
      headline: generatedHeadline,
      subheadline: generatedSubheadline,
      ctaText: generatedCta,
      badgeText: generatedBadge,
      warungName: settings.warungName,
      warungPhone: settings.phone,
      warungAddress: settings.address,
      backgroundColor: '#09090b',
      textColor: '#ffffff',
      accentColor: '#f97316',
      showPrice: true,
      showLogo: true,
      showBadge: true,
      showCta: true,
      showContact: true,
    };

    setIsGenerating(false);
    onDesignGenerated(posterResult);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Wizard Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 sm:p-8 text-stone-950 shadow-2xl mb-8 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/20 text-stone-950 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Studio Otomatis 1-Klik
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white mb-2">
            BUAT STATUS PRODUK OTOMATIS
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 font-medium leading-relaxed">
            Pilih produk warung, unggah foto dari HP, tentukan gaya favorit, dan biarkan AI menyusun poster promosi beresolusi tinggi siap bagikan ke WhatsApp Status & media sosial.
          </p>
        </div>
        {/* Background Graphic watermark accent */}
        <div className="absolute -right-8 -bottom-10 opacity-15 text-stone-950 select-none pointer-events-none font-black text-9xl">
          KOBRA
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT / MAIN COLUMN: WIZARD STEPS */}
        <div className="lg:col-span-8 space-y-6">
          {/* LANGKAH 1: PILIH PRODUK WARUNG */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-bold text-white">Pilih Produk Warung</h2>
              </div>
              <button
                onClick={onOpenProductManager}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                + Kelola Produk
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jus, kopi, latte, pop ice..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Product Quick-Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-stone-100 truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-400 block font-mono">
                        {formatRupiah(p.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LANGKAH 2: FOTO & DETAIL PRODUK */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-white">Foto & Informasi Produk</h2>
            </div>

            {/* Photo Uploader */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-950 border border-stone-800 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                {customImage ? (
                  <img src={customImage} alt={customName} className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-stone-500" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl text-xs font-medium border border-stone-700 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  Unggah Foto Asli dari HP
                </button>
                <p className="text-[11px] text-stone-400 mt-1.5">
                  Foto produk yang menarik akan langsung diposisikan sebagai sorotan utama poster.
                </p>
              </div>
            </div>

            {/* Inputs: Nama, Harga, Deskripsi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Deskripsi / Keunggulan Rasa
              </label>
              <textarea
                rows={2}
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* LANGKAH 3: PILIH GAYA DESAIN & GAYA KATA */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-base font-bold text-white">Pilih Gaya Desain & Copywriting</h2>
            </div>

            {/* Style Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5 max-h-56 overflow-y-auto pr-1">
              {DESIGN_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: style.previewBg,
                        border: `1.5px solid ${style.previewAccent}`,
                        color: style.previewAccent,
                      }}
                    >
                      {style.id.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-stone-100 truncate block">
                        {style.name}
                      </span>
                      <span className="text-[10px] text-amber-500 truncate block">
                        {style.tagline}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Copywriting tone selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Gaya Bahasa Copywriting AI
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'singkat-viral', label: 'Singkat & Viral' },
                  { id: 'lucu-menarik', label: 'Lucu & Menghibur' },
                  { id: 'gen-z', label: 'Anak Gaul Gen-Z' },
                  { id: 'promo-spesial', label: 'Promo Spesial' },
                  { id: 'persuasif', label: 'Persuasif / Bikin Ngiler' },
                  { id: 'santai-ramah', label: 'Santai & Ramah' },
                  { id: 'profesional', label: 'Kualitas Premium' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setCopywritingStyle(tone.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      copywritingStyle === tone.id
                        ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORMAT TARGET & THE BIG ONE-CLICK BUTTON */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl sticky top-20">
            <h3 className="text-sm font-bold text-white mb-3">Format Target Media Sosial</h3>

            <div className="space-y-2 mb-6">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = selectedRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-100 block">{ratio.label}</span>
                      <span className="text-[11px] text-stone-400">
                        {ratio.width} × {ratio.height} px
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Quick summary of Warung Info */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 mb-6 text-xs space-y-1 text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-400">Warung:</span>
                <span className="font-semibold">{settings.warungName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">WhatsApp:</span>
                <span className="font-semibold">{settings.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Alamat:</span>
                <span className="font-semibold truncate max-w-[140px]">{settings.address}</span>
              </div>
            </div>

            {/* THE MASTER BUTTON: BUAT STATUS OTOMATIS */}
            <button
              onClick={handleGenerateAutomatic}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>MEMPROSES STATUS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-stone-950" />
                  <span>BUAT STATUS OTOMATIS</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-400 mt-2.5">
              1 klik langsung meracik poster tajam, kata promosi, dan membuka editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
