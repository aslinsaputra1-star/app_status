import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  ArrowRight,
  Share2,
  Coffee,
  MessageSquare,
} from 'lucide-react';
import { Product, WarungSettings, CopywritingResult } from '../types';
import { formatRupiah } from '../utils/canvasRenderer';
import { useToast } from './Toast';

interface CopywritingStudioViewProps {
  products: Product[];
  settings: WarungSettings;
  onApplyToStatus: (data: {
    product: Product;
    headline: string;
    subheadline: string;
    badge: string;
    cta: string;
  }) => void;
}

const STYLES = [
  { id: 'singkat-viral', name: 'Singkat & Viral', desc: 'Cocok untuk status cepat dibaca dalam 3 detik.' },
  { id: 'lucu-menarik', name: 'Lucu & Menghibur', desc: 'Gaya candaan santai yang mengundang senyum.' },
  { id: 'gen-z', name: 'Bahasa Anak Gen-Z', desc: 'Gaya gaul kekinian: vibes, no debat, moodbooster.' },
  { id: 'promo-spesial', name: 'Promo Spesial Hari Ini', desc: 'Menonjolkan harga murah hemat & diskon heboh.' },
  { id: 'persuasif', name: 'Persuasif / Bikin Ngiler', desc: 'Menggoda selera saat haus atau lapar seketika.' },
  { id: 'santai-ramah', name: 'Santai & Ramah', desc: 'Menyapa hangat seperti tetangga akrab.' },
  { id: 'profesional', name: 'Kualitas Premium', desc: 'Elegan, higienis, dan menonjolkan mutu terbaik.' },
];

export const CopywritingStudioView: React.FC<CopywritingStudioViewProps> = ({
  products,
  settings,
  onApplyToStatus,
}) => {
  const { showToast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>('singkat-viral');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Result state
  const [result, setResult] = useState<CopywritingResult>({
    headline: 'SEGARNYA BIKIN MERINDING!',
    subheadline: `${products[0]?.name} dingin mantap siap segarkan harimu seketika.`,
    badge: 'CUMA ' + formatRupiah(products[0]?.price || 10000),
    cta: 'PESAN SEKARANG VIA WA!',
    fullCaption: `Lagi haus atau gerah? Seruput ${products[0]?.name} dari ${settings.warungName}! Rasa nikmat buah mantap, cuma ${formatRupiah(products[0]?.price || 10000)}. Langsung bungkus ke WA: ${settings.phone}! 🚀`,
    socialHook: 'Definisi moodbooster yang sesungguhnya hari ini!',
  });

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/copywriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          price: selectedProduct.price,
          description: selectedProduct.description,
          style: selectedStyle,
          warungName: settings.warungName,
          phone: settings.phone,
          address: settings.address,
        }),
      });

      if (!res.ok) throw new Error('Gagal memanggil AI');
      const data = await res.json();

      if (data?.data) {
        setResult(data.data);
        showToast('Kata promosi AI berhasil dibuat!', 'success');
      }
    } catch (err: any) {
      showToast('Gagal: ' + (err?.message || 'Error koneksi'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Teks berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApply = () => {
    onApplyToStatus({
      product: selectedProduct,
      headline: result.headline,
      subheadline: result.subheadline,
      badge: result.badge,
      cta: result.cta,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          AI Copywriting Generator
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          Generator Kata-Kata Promosi Warung
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Hasilkan teks status WhatsApp, caption Instagram, dan hook promosi persuasif dalam hitungan detik dengan 7 gaya bahasa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: SELECTION INPUTS */}
        <div className="lg:col-span-5 space-y-5">
          {/* Pick Product */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-3">
              1. Pilih Produk Menu
            </label>
            <select
              value={selectedProduct?.id}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) setSelectedProduct(prod);
              }}
              className="w-full px-3.5 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatRupiah(p.price)} ({p.category})
                </option>
              ))}
            </select>

            {/* Selected product card summary */}
            {selectedProduct && (
              <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
                <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {selectedProduct.name}
                  </span>
                  <span className="text-xs font-extrabold text-amber-500 font-mono">
                    {formatRupiah(selectedProduct.price)}
                  </span>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pick Tone of Voice */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-3">
              2. Pilih Gaya Bahasa (Tone of Voice)
            </label>
            <div className="space-y-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    selectedStyle === style.id
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">{style.name}</span>
                    <span className="text-[11px] text-stone-400 mt-0.5 block">{style.desc}</span>
                  </div>
                  {selectedStyle === style.id && (
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full mt-5 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Sedang Meracik Kata...' : 'Buat Kata Promosi AI'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI RESULTS & EDITABLE BLOCKS */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Full WhatsApp Caption Box */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Teks Status WhatsApp & Instagram Lengkap
                </span>
              </div>
              <button
                onClick={() => handleCopy(result.fullCaption, 'full')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors"
              >
                {copiedKey === 'full' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Status</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={5}
              value={result.fullCaption}
              onChange={(e) => setResult({ ...result, fullCaption: e.target.value })}
              className="w-full p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 leading-relaxed font-sans resize-none"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Anda dapat mengedit langsung teks di atas sebelum menyalinnya.
            </p>
          </div>

          {/* Breakdown: Headline, Subheadline, Badge, CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Headline */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Judul Poster (Headline)
                </span>
                <button
                  onClick={() => handleCopy(result.headline, 'headline')}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                value={result.headline}
                onChange={(e) => setResult({ ...result, headline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Badge Stiker */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Badge / Stiker Diskon
                </span>
                <button
                  onClick={() => handleCopy(result.badge, 'badge')}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                value={result.badge}
                onChange={(e) => setResult({ ...result, badge: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Subheadline */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Subheadline / Daya Tarik
                </span>
                <button
                  onClick={() => handleCopy(result.subheadline, 'sub')}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                value={result.subheadline}
                onChange={(e) => setResult({ ...result, subheadline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* CTA Button Text */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                  Tombol Ajakan (CTA)
                </span>
                <button
                  onClick={() => handleCopy(result.cta, 'cta')}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                value={result.cta}
                onChange={(e) => setResult({ ...result, cta: e.target.value })}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Social Hook Quote */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Hook Pembuka Story / Video
              </span>
              <p className="text-xs font-semibold text-white mt-0.5 italic">
                "{result.socialHook}"
              </p>
            </div>
            <button
              onClick={() => handleCopy(result.socialHook, 'hook')}
              className="p-2 text-stone-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Apply To Status Button */}
          <button
            onClick={handleApply}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Terapkan Teks Ini ke Poster Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
