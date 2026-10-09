import React from 'react';
import {
  Sparkles,
  Coffee,
  Layers,
  Star,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  Plus,
  Flame,
  Palette,
  MessageSquare,
} from 'lucide-react';
import { Product, PosterState, WarungSettings } from '../types';
import { formatRupiah } from '../utils/canvasRenderer';

interface DashboardViewProps {
  products: Product[];
  designs: PosterState[];
  settings: WarungSettings;
  onQuickCreate: () => void;
  onSelectProductToCreate: (prod: Product) => void;
  onOpenDesign: (poster: PosterState) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  designs,
  settings,
  onQuickCreate,
  onSelectProductToCreate,
  onOpenDesign,
  onNavigateTab,
}) => {
  const favoriteCount = designs.filter((d) => d.isFavorite).length;
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 6);
  const recentDesigns = designs.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* HERO BANNER SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border border-stone-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Orange & Gold Glow in Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Studio Promosi Otomatis #1 Warung
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            {settings.warungName}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 font-medium leading-relaxed mb-6 max-w-2xl">
            {settings.tagline}. Buat poster promosi produk yang memikat untuk WhatsApp Status, Instagram Story, dan Facebook dalam 3 langkah mudah.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onQuickCreate}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>BUAT STATUS OTOMATIS</span>
            </button>

            <button
              onClick={() => onNavigateTab('ai-image')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/30 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Gambar AI</span>
            </button>

            <button
              onClick={() => onNavigateTab('products')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-800/90 hover:bg-stone-800 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700/80 transition-all"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Lihat Menu ({products.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK METRICS STRIP (Tabular & unboxed cleanly) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Menu Terdaftar</span>
            <Coffee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{products.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Jus, kopi, latte, sachet</div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Poster Dibuat</span>
            <Layers className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{designs.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Tersimpan di Cloud</div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Desain Favorit</span>
            <Star className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{favoriteCount}</div>
          <div className="text-[11px] text-stone-500 mt-1">Siap pakai kembali</div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span>Pilihan Gaya</span>
            <Palette className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">12</div>
          <div className="text-[11px] text-stone-500 mt-1">Format resolusi HD</div>
        </div>
      </div>

      {/* SECTION: MENU TERLARIS — BUAT STATUS 1 KLIK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Menu Laris Warung — Bikin Status Instan
            </h2>
            <p className="text-xs text-stone-400">
              Pilih salah satu minuman di bawah untuk langsung membuka studio poster otomatis:
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Semua Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProductToCreate(p)}
              className="group bg-stone-900/90 border border-stone-800 rounded-2xl p-3 text-left hover:border-amber-500/60 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-stone-950 rounded-xl overflow-hidden mb-2.5 border border-stone-800 flex items-center justify-center p-1">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-xs font-bold text-white block truncate group-hover:text-amber-400 transition-colors">
                  {p.name}
                </span>
                <span className="text-xs font-extrabold text-amber-500 font-mono block mt-0.5">
                  {formatRupiah(p.price)}
                </span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400 font-medium">
                <span>Buat Poster</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION: POSTER TERAKHIR & FITUR PENDUKUNG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Designs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Poster Terakhir Dibuat
            </h2>
            <button
              onClick={() => onNavigateTab('gallery')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Lihat Galeri
            </button>
          </div>

          {recentDesigns.length === 0 ? (
            <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-8 text-center">
              <Layers className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-stone-300">Belum ada poster tersimpan</p>
              <button
                onClick={onQuickCreate}
                className="mt-3 px-4 py-2 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold"
              >
                Buat Poster Pertama Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentDesigns.map((d) => (
                <div
                  key={d.id}
                  onClick={() => onOpenDesign(d)}
                  className="cursor-pointer group bg-stone-900 border border-stone-800 rounded-2xl p-2.5 hover:border-amber-500/60 transition-all shadow-md"
                >
                  <div className="aspect-4/5 bg-stone-950 rounded-xl overflow-hidden mb-2 border border-stone-800 flex items-center justify-center p-2">
                    <img
                      src={d.productImageUrl}
                      alt={d.productName}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-bold text-white truncate block">{d.productName}</span>
                  <span className="text-[11px] text-amber-400 font-mono font-bold block">
                    {formatRupiah(d.productPrice)}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate block mt-0.5">
                    {d.headline}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Shortcut (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Alat Cepat
          </h2>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateTab('ai-image')}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-500/30 rounded-2xl text-left hover:border-amber-500/60 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Generate Gambar AI</span>
                <span className="text-[11px] text-amber-200/80 block">
                  Studio foto komersial, embun segar & ganti background
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('copywriting')}
              className="w-full flex items-center gap-3 p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl text-left hover:border-stone-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">AI Copywriting Studio</span>
                <span className="text-[11px] text-stone-400 block">
                  7 variasi kata promosi status WhatsApp
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('templates')}
              className="w-full flex items-center gap-3 p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl text-left hover:border-stone-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Katalog 12 Gaya Desain</span>
                <span className="text-[11px] text-stone-400 block">
                  Luxury, Neon, Street Food, Korean Cafe
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full flex items-center gap-3 p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl text-left hover:border-stone-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Profil & WhatsApp Warung</span>
                <span className="text-[11px] text-stone-400 block">
                  {settings.phone} ({settings.warungName})
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
