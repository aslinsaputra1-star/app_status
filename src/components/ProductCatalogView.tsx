import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Upload,
  Check,
  X,
  Coffee,
  Tag,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/canvasRenderer';
import { useToast } from './Toast';

interface ProductCatalogViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onCreatePosterForProduct: (product: Product) => void;
}

const CATEGORIES = [
  'Semua Kategori',
  'Jus Buah Segar',
  'Minuman Segar',
  'Kopi & Latte',
  'Latte & Teh',
  'Latte & Cokelat',
  'Minuman Sachet & Segar',
  'Makanan & Cemilan',
];

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCreatePosterForProduct,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Search & filter
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');

  // Modal states: add or edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Jus Buah Segar');
  const [formPrice, setFormPrice] = useState<number>(10000);
  const [formDesc, setFormDesc] = useState<string>('');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formIsPopular, setFormIsPopular] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete confirmation modal state
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Jus Buah Segar');
    setFormPrice(10000);
    setFormDesc('');
    setFormImageUrl('');
    setFormIsPopular(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormDesc(product.description || '');
    setFormImageUrl(product.imageUrl || '');
    setFormIsPopular(!!product.isPopular);
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar valid', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormImageUrl(result);
        showToast('Foto berhasil dimuat!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Nama produk wajib diisi', 'error');
      return;
    }
    if (formPrice < 0) {
      showToast('Harga tidak boleh negatif', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await onUpdateProduct({
          ...editingProduct,
          name: formName.trim(),
          category: formCategory,
          price: formPrice,
          description: formDesc.trim(),
          imageUrl: formImageUrl || editingProduct.imageUrl,
          isPopular: formIsPopular,
          updatedAt: new Date().toISOString(),
        });
        showToast(`Produk "${formName}" berhasil diperbarui`, 'success');
      } else {
        await onAddProduct({
          name: formName.trim(),
          category: formCategory,
          price: formPrice,
          description: formDesc.trim(),
          imageUrl: formImageUrl,
          isPopular: formIsPopular,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showToast(`Produk "${formName}" berhasil ditambahkan`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast('Gagal menyimpan: ' + (err?.message || 'Error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      await onDeleteProduct(deletingProductId);
      showToast('Produk berhasil dihapus', 'success');
    } catch (err: any) {
      showToast('Gagal menghapus: ' + (err?.message || 'Error'), 'error');
    } finally {
      setDeletingProductId(null);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchCategory =
      selectedCategory === 'Semua Kategori' || p.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Database Produk Warung
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola {products.length} menu minuman & cemilan Warung Bang Kobra, ubah harga, atau unggah foto asli.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk (contoh: Jus Alpukat, Gula Aren, Kopi)..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills / Select */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-stone-900/60 border border-stone-800 rounded-3xl">
          <Coffee className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-stone-300">Tidak ada produk yang cocok</p>
          <p className="text-xs text-stone-400 mt-1">Coba kata kunci pencarian atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between hover:border-stone-700 transition-all group shadow-md"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative w-full aspect-square bg-stone-950 rounded-xl overflow-hidden mb-3 border border-stone-800/80 flex items-center justify-center">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.isPopular && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-stone-950" />
                      Laris
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-xs text-stone-300 text-[10px] font-medium border border-stone-800">
                    {prod.category}
                  </span>
                </div>

                {/* Name & Price */}
                <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-base font-extrabold text-amber-500 font-mono mt-0.5">
                  {formatRupiah(prod.price)}
                </p>
                <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                  {prod.description || 'Segar dan nikmat di Warung Bang Kobra.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onCreatePosterForProduct(prod)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                  <span>Buat Status</span>
                </button>

                <button
                  onClick={() => openEditModal(prod)}
                  title="Edit Produk"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeletingProductId(prod.id)}
                  title="Hapus Produk"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <h2 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Warung Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Photo preview & upload */}
              <div className="flex items-center gap-4 p-3 bg-stone-950 rounded-2xl border border-stone-800">
                <div className="w-16 h-16 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center shrink-0">
                  {formImageUrl ? (
                    <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-stone-600" />
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
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 border border-stone-700"
                  >
                    Pilih Foto dari Galeri HP
                  </button>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Gunakan foto minuman/makanan asli warung agar makin menggoda.
                  </p>
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Jus Sirsak Spesial"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'Semua Kategori').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Popular Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseInt(e.target.value, 10) || 0)}
                    placeholder="10000"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="text-xs text-stone-200 font-medium">
                      Tandai Menu Best Seller / Laris
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Deskripsi / Keistimewaan Rasa
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Kental, manis pas, buah asli segar..."
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Strictly confirms before deletion) */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Hapus Produk Ini?</h3>
            <p className="text-xs text-stone-400 mb-5">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus dari katalog warung Anda.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
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
