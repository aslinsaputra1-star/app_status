import React, { useState } from 'react';
import {
  Layers,
  Star,
  Download,
  Copy,
  Edit2,
  Trash2,
  Share2,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { PosterState } from '../types';
import { formatRupiah } from '../utils/canvasRenderer';
import { useToast } from './Toast';

interface DesignsGalleryViewProps {
  designs: PosterState[];
  onOpenInEditor: (poster: PosterState) => void;
  onDuplicateDesign: (poster: PosterState) => void;
  onToggleFavorite: (designId: string) => void;
  onDeleteDesign: (designId: string) => void;
  onQuickCreate: () => void;
}

export const DesignsGalleryView: React.FC<DesignsGalleryViewProps> = ({
  designs,
  onOpenInEditor,
  onDuplicateDesign,
  onToggleFavorite,
  onDeleteDesign,
  onQuickCreate,
}) => {
  const { showToast } = useToast();
  const [filterFavorite, setFilterFavorite] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDesigns = designs.filter((d) => {
    const matchFav = filterFavorite ? !!d.isFavorite : true;
    const matchSearch =
      d.productName.toLowerCase().includes(search.toLowerCase()) ||
      d.headline.toLowerCase().includes(search.toLowerCase()) ||
      d.title.toLowerCase().includes(search.toLowerCase());
    return matchFav && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Desain Saya & Riwayat Promosi
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Arsip {designs.length} poster promosi yang telah Anda buat. Anda dapat mengedit ulang, menduplikasi, atau mengunduh kembali kapan saja.
          </p>
        </div>

        <button
          onClick={onQuickCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 fill-stone-950" />
          <span>Buat Desain Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari poster berdasarkan nama produk atau headline..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            filterFavorite
              ? 'bg-amber-500/15 border-amber-500 text-amber-400 ring-1 ring-amber-500'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Star className={`w-4 h-4 ${filterFavorite ? 'fill-amber-400' : ''}`} />
          <span>{filterFavorite ? 'Menampilkan Favorit' : 'Semua Desain'}</span>
        </button>
      </div>

      {/* Designs Gallery Grid */}
      {filteredDesigns.length === 0 ? (
        <div className="p-12 text-center bg-stone-900/60 border border-stone-800 rounded-3xl">
          <Layers className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-stone-300">Belum ada desain tersimpan</p>
          <p className="text-xs text-stone-400 mt-1 mb-5">
            Mulai buat status promosi otomatis untuk produk warung Anda sekarang!
          </p>
          <button
            onClick={onQuickCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            Mulai Buat Status Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDesigns.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900/90 border border-stone-800 rounded-3xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group"
            >
              <div>
                {/* Visual miniature preview */}
                <div className="relative aspect-4/5 bg-stone-950 rounded-2xl overflow-hidden mb-3 border border-stone-800 flex items-center justify-center p-3">
                  {item.productImageUrl && (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  )}

                  {/* Favorite Toggle button */}
                  <button
                    onClick={() => item.id && onToggleFavorite(item.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-black/60 backdrop-blur-xs text-stone-400 hover:text-amber-400 border border-stone-700/50 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {/* Style tag */}
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/90 text-[10px] font-semibold text-amber-400 border border-stone-700">
                    {item.styleId}
                  </span>
                </div>

                {/* Info Text */}
                <h3 className="font-bold text-sm text-white truncate">{item.productName}</h3>
                <p className="text-xs text-amber-500 font-extrabold font-mono mt-0.5">
                  {formatRupiah(item.productPrice)}
                </p>
                <p className="text-xs text-stone-400 line-clamp-1 mt-1 font-medium italic">
                  "{item.headline}"
                </p>
                <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-2">
                  <span>{item.aspectRatio}</span>
                  <span>·</span>
                  <span>{item.width}×{item.height}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onOpenInEditor(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Buka Editor</span>
                </button>

                <button
                  onClick={() => onDuplicateDesign(item)}
                  title="Duplikasi Desain"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => item.id && setDeletingId(item.id)}
                  title="Hapus Desain"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Hapus Desain Ini?</h3>
            <p className="text-xs text-stone-400 mb-5">
              Poster yang dihapus tidak dapat dipulihkan kembali dari riwayat Anda.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteDesign(deletingId);
                  setDeletingId(null);
                  showToast('Desain berhasil dihapus', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
