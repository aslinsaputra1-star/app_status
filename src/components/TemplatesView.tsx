import React, { useState } from 'react';
import { Palette, Sparkles, Check, ArrowRight } from 'lucide-react';
import { DESIGN_STYLES } from '../data/constants';
import { DesignStyleId, Product } from '../types';

interface TemplatesViewProps {
  products: Product[];
  onSelectTemplate: (styleId: DesignStyleId, product: Product) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  products,
  onSelectTemplate,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5" />
            12 Preset Desain Profesional
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Katalog Template Promosi
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Setiap gaya memiliki tata letak, palet warna, tipografi, dan ornamen visual tersendiri untuk memikat pelanggan.
          </p>
        </div>

        {/* Product selector to preview with actual product */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-stone-400 whitespace-nowrap">
            Uji Coba dengan Menu:
          </span>
          <select
            value={selectedProduct?.id}
            onChange={(e) => {
              const p = products.find((prod) => prod.id === e.target.value);
              if (p) setSelectedProduct(p);
            }}
            className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 12 Design Styles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DESIGN_STYLES.map((style) => (
          <div
            key={style.id}
            className="group bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            {/* Visual Preview Miniature Card */}
            <div
              className="relative aspect-3/4 p-5 flex flex-col justify-between overflow-hidden"
              style={{ backgroundColor: style.previewBg }}
            >
              {/* Subtle aesthetic backdrop styling */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${style.previewAccent}, transparent 70%)`,
                }}
              />

              {/* Top Miniature Header */}
              <div className="relative z-10 flex justify-between items-center text-[10px] font-bold">
                <span
                  className="px-2 py-0.5 rounded-full border text-[9px]"
                  style={{
                    color: style.previewAccent,
                    borderColor: style.previewAccent,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                  }}
                >
                  WARUNG BANG KOBRA
                </span>
                <span className="text-stone-400 uppercase tracking-widest text-[8px]">
                  {style.tagline}
                </span>
              </div>

              {/* Center Miniature Product Image */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/20 mb-2">
                  <img
                    src={selectedProduct?.imageUrl}
                    alt={selectedProduct?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-white font-extrabold text-xs text-center drop-shadow-md">
                  {selectedProduct?.name}
                </span>
                <span
                  className="font-black text-xs font-mono px-2 py-0.5 rounded-md mt-1"
                  style={{
                    backgroundColor: style.previewAccent,
                    color: '#000000',
                  }}
                >
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                  }).format(selectedProduct?.price || 10000)}
                </span>
              </div>

              {/* Bottom Miniature CTA Button */}
              <div className="relative z-10 text-center">
                <div
                  className="w-full py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
                  style={{
                    backgroundColor: style.id === 'premium-luxury' ? '#d97706' : '#22c55e',
                  }}
                >
                  PESAN SEKARANG VIA WA
                </div>
              </div>
            </div>

            {/* Template Info & Action */}
            <div className="p-4 bg-stone-900 border-t border-stone-800">
              <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                {style.name}
              </h3>
              <p className="text-xs text-amber-500 font-medium mt-0.5">{style.tagline}</p>
              <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {style.description}
              </p>

              <button
                onClick={() => onSelectTemplate(style.id, selectedProduct)}
                className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                <span>Gunakan Gaya Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
