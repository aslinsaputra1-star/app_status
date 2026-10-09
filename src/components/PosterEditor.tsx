import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Share2,
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  Eye,
  Sliders,
  Sparkles,
  Upload,
  Check,
  Smartphone,
  Instagram,
  Facebook,
  Maximize2,
  Copy,
  Layers,
  Palette,
  Type,
  Tag,
  PhoneCall,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PosterState, DesignStyleId, AspectRatioId } from '../types';
import { DESIGN_STYLES, ASPECT_RATIOS } from '../data/constants';
import { renderPosterToCanvas, downloadCanvas, shareCanvasImage, formatRupiah } from '../utils/canvasRenderer';
import { useToast } from './Toast';

interface PosterEditorProps {
  initialPoster: PosterState;
  onSavePoster: (poster: PosterState) => Promise<void>;
  onClose?: () => void;
  onOpenAiCopywriter: (productName: string, price: number) => void;
}

export const PosterEditor: React.FC<PosterEditorProps> = ({
  initialPoster,
  onSavePoster,
  onClose,
  onOpenAiCopywriter,
}) => {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Current poster state
  const [poster, setPoster] = useState<PosterState>(initialPoster);

  // History for Undo / Redo
  const [history, setHistory] = useState<PosterState[]>([initialPoster]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active editor tab
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'visibility' | 'format'>('content');

  // Preview full modal
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Update history when poster state changes deliberately
  const pushState = (newPoster: PosterState) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPoster);
    // Limit history stack to 20 states
    if (updatedHistory.length > 20) {
      updatedHistory.shift();
    }
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setPoster(newPoster);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPoster(history[newIndex]);
      showToast('Undo berhasil', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPoster(history[newIndex]);
      showToast('Redo berhasil', 'info');
    }
  };

  const handleReset = () => {
    pushState({ ...initialPoster });
    showToast('Desain dikembalikan ke awal', 'info');
  };

  // Re-render canvas whenever poster state changes
  useEffect(() => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    renderPosterToCanvas(canvasRef.current, poster)
      .catch((err) => console.error('Error rendering canvas:', err))
      .finally(() => setIsRendering(false));
  }, [poster]);

  // Handle local photo upload from phone or computer
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar valid (PNG/JPG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        pushState({
          ...poster,
          productImageUrl: result,
        });
        showToast('Foto produk berhasil diunggah!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Change Aspect Ratio
  const handleRatioChange = (ratioId: AspectRatioId) => {
    const targetRatio = ASPECT_RATIOS.find((r) => r.id === ratioId) || ASPECT_RATIOS[0];
    pushState({
      ...poster,
      aspectRatio: ratioId,
      width: targetRatio.width,
      height: targetRatio.height,
    });
    showToast(`Format diubah ke ${targetRatio.label}`, 'info');
  };

  // Change Design Style
  const handleStyleChange = (styleId: DesignStyleId) => {
    pushState({
      ...poster,
      styleId,
    });
    showToast(`Gaya desain diubah`, 'info');
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePoster(poster);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
      showToast('Poster berhasil disimpan ke Desain Saya!', 'success');
    } catch (err: any) {
      showToast('Gagal menyimpan poster: ' + (err?.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Download PNG
  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const safeName = poster.productName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadCanvas(canvasRef.current, `warung_bang_kobra_${safeName}_status`, 'png');
    confetti({
      particleCount: 50,
      spread: 70,
    });
    showToast('Gambar PNG berhasil diunduh dalam kualitas tinggi!', 'success');
  };

  // Handle Download JPG
  const handleDownloadJpg = () => {
    if (!canvasRef.current) return;
    const safeName = poster.productName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadCanvas(canvasRef.current, `warung_bang_kobra_${safeName}_status`, 'jpeg');
    showToast('Gambar JPG berhasil diunduh!', 'success');
  };

  // Handle Share to WhatsApp / Social Media
  const handleShare = async () => {
    if (!canvasRef.current) return;
    const caption = `${poster.headline} - ${poster.productName} cuma ${formatRupiah(
      poster.productPrice
    )} di ${poster.warungName}! Pesan via WA: ${poster.warungPhone}`;

    const shared = await shareCanvasImage(
      canvasRef.current,
      `${poster.productName} — ${poster.warungName}`,
      caption
    );

    if (shared) {
      showToast('Berhasil membuka menu bagikan!', 'success');
    } else {
      // Fallback: Copy caption and notify user to download image
      try {
        await navigator.clipboard.writeText(caption);
        showToast('Teks promosi disalin! Silakan unduh gambar untuk diunggah ke WhatsApp Status.', 'info');
      } catch {
        showToast('Silakan unduh gambar lalu bagikan ke WhatsApp.', 'info');
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-8">
      {/* LEFT COLUMN: LIVE CANVAS PREVIEW & QUICK ACTIONS */}
      <div className="lg:w-5/12 flex flex-col items-center">
        {/* Top Control Bar: Undo, Redo, Reset, Fullscreen */}
        <div className="w-full flex items-center justify-between bg-stone-900 border border-stone-800 rounded-2xl p-2.5 mb-4 shadow-lg">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset Desain"
              className="p-2 rounded-xl text-stone-300 hover:text-amber-400 hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-800 rounded-lg text-amber-400">
              {poster.width} × {poster.height} px
            </span>
            <button
              onClick={() => setShowFullPreview(true)}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title="Pratinjau Layar Penuh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Display Container (Responsive scaled frame) */}
        <div className="relative w-full flex items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800/80 rounded-3xl shadow-2xl overflow-hidden min-h-[460px]">
          {isRendering && (
            <div className="absolute inset-0 z-10 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center text-amber-400 text-xs font-semibold">
              Memproses rendering...
            </div>
          )}

          {/* Actual Canvas */}
          <canvas
            ref={canvasRef}
            className="max-h-[68vh] w-auto max-w-full rounded-xl shadow-2xl object-contain border border-stone-700/50"
            style={{
              aspectRatio: `${poster.width} / ${poster.height}`,
            }}
          />
        </div>

        {/* Primary Action Buttons: Simpan, Unduh PNG/JPG, Bagikan */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-700 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Unduh PNG</span>
          </button>

          <button
            onClick={handleDownloadJpg}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-700 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Unduh JPG</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: TABBED INSPECTOR & CONTROLS */}
      <div className="lg:w-7/12 flex flex-col bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        {/* Editor Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3 mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'content'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Type className="w-4 h-4" />
            Konten & Foto
          </button>

          <button
            onClick={() => setActiveTab('style')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'style'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            12 Gaya Desain
          </button>

          <button
            onClick={() => setActiveTab('format')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'format'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Ukuran Media Sosial
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'visibility'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Pengaturan Elemen
          </button>
        </div>

        {/* TAB 1: KONTEN & FOTO */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Foto Produk Upload & Preview */}
            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Foto Produk dari HP / Komputer
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center shrink-0">
                  {poster.productImageUrl ? (
                    <img
                      src={poster.productImageUrl}
                      alt={poster.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-6 h-6 text-stone-600" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl text-xs font-medium border border-stone-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    Pilih Foto Baru dari Galeri
                  </button>
                  <p className="text-[11px] text-stone-400 mt-1.5">
                    Mendukung format JPG, PNG, atau WEBP. Foto produk akan otomatis diatur di posisi utama poster.
                  </p>
                </div>
              </div>
            </div>

            {/* Nama Produk & Harga */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={poster.productName}
                  onChange={(e) => pushState({ ...poster, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  placeholder="Contoh: Jus Mangga Segar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Harga Produk (Rp)
                </label>
                <input
                  type="number"
                  value={poster.productPrice}
                  onChange={(e) =>
                    pushState({ ...poster, productPrice: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="Contoh: 10000"
                />
              </div>
            </div>

            {/* Judul Promosi (Headline) + AI Assist Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Judul Promosi (Headline)
                </label>
                <button
                  onClick={() => onOpenAiCopywriter(poster.productName, poster.productPrice)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                >
                  <Sparkles className="w-3 h-3" />
                  Bikin Kata AI
                </button>
              </div>
              <input
                type="text"
                value={poster.headline}
                onChange={(e) => pushState({ ...poster, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                placeholder="Contoh: SEGARNYA BIKIN MERINDING!"
              />
            </div>

            {/* Subheadline / Deskripsi */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Subheadline / Daya Tarik
              </label>
              <textarea
                rows={2}
                value={poster.subheadline}
                onChange={(e) => pushState({ ...poster, subheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Contoh: Dibuat dari mangga harum manis asli, dingin kental mantap."
              />
            </div>

            {/* Badge Stiker & Tombol Ajakan (CTA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Teks Stiker / Badge Promo
                </label>
                <input
                  type="text"
                  value={poster.badgeText}
                  onChange={(e) => pushState({ ...poster, badgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  placeholder="Contoh: HARGA SPESIAL"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Tombol Ajakan (CTA)
                </label>
                <input
                  type="text"
                  value={poster.ctaText}
                  onChange={(e) => pushState({ ...poster, ctaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  placeholder="Contoh: PESAN SEKARANG VIA WA!"
                />
              </div>
            </div>

            {/* Info Warung & WhatsApp Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-800">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Nama Warung
                </label>
                <input
                  type="text"
                  value={poster.warungName}
                  onChange={(e) => pushState({ ...poster, warungName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp Pemesanan
                </label>
                <input
                  type="text"
                  value={poster.warungPhone}
                  onChange={(e) => pushState({ ...poster, warungPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 12 GAYA DESAIN */}
        {activeTab === 'style' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              Pilih salah satu dari 12 gaya visual profesional yang dirancang khusus untuk memikat calon pembeli:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
              {DESIGN_STYLES.map((style) => {
                const isSelected = poster.styleId === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-inner"
                      style={{
                        backgroundColor: style.previewBg,
                        border: `2px solid ${style.previewAccent}`,
                        color: style.previewAccent,
                      }}
                    >
                      {style.id.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-100 truncate">
                          {style.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] font-medium text-amber-500 block">
                        {style.tagline}
                      </span>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                        {style.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FORMAT UKURAN MEDIA SOSIAL */}
        {activeTab === 'format' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              Pilih format ukuran poster yang pas dengan platform target promosi Anda:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = poster.aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    onClick={() => handleRatioChange(ratio.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 font-mono text-xs font-bold shrink-0">
                      {ratio.ratioText}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-100">{ratio.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        {ratio.width} × {ratio.height} px ({ratio.platform})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VISIBILITAS ELEMEN */}
        {activeTab === 'visibility' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-400">
              Atur elemen apa saja yang ingin Anda tampilkan atau sembunyikan di poster:
            </p>

            <div className="space-y-2.5">
              {[
                { key: 'showPrice', label: 'Tampilkan Harga Produk', desc: 'Kotak harga besar & jelas' },
                { key: 'showBadge', label: 'Tampilkan Stiker / Badge Promo', desc: 'Stempel diskon / best seller' },
                { key: 'showCta', label: 'Tampilkan Tombol Ajakan (CTA)', desc: 'Tombol hijau WhatsApp order' },
                { key: 'showLogo', label: 'Tampilkan Nama & Logo Warung', desc: 'Badge identitas Warung Bang Kobra' },
                { key: 'showContact', label: 'Tampilkan Info Kontak & Alamat', desc: 'Nomor WA & alamat di bawah' },
              ].map((item) => {
                const isChecked = (poster as any)[item.key];
                return (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-3.5 bg-stone-950/60 border border-stone-800 rounded-2xl cursor-pointer hover:bg-stone-950 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">{item.label}</span>
                      <span className="text-[11px] text-stone-400">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        pushState({
                          ...poster,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {showFullPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full flex items-center justify-between mb-3 text-stone-100">
            <span className="text-sm font-bold">Pratinjau Resolusi Penuh</span>
            <button
              onClick={() => setShowFullPreview(false)}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-[85vh] max-w-sm w-full flex items-center justify-center bg-stone-950 rounded-2xl overflow-hidden shadow-2xl p-2 border border-stone-800">
            {canvasRef.current && (
              <img
                src={canvasRef.current.toDataURL()}
                alt="Poster Preview"
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownloadPng}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
            >
              Unduh Poster
            </button>
            <button
              onClick={() => setShowFullPreview(false)}
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
