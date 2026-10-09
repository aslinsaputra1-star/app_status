import React, { useState, useRef } from 'react';
import {
  Settings,
  Store,
  Phone,
  MapPin,
  Instagram,
  Palette,
  Upload,
  Save,
  UserCheck,
  LogOut,
  ShieldCheck,
  Database,
  GitBranch,
  ExternalLink,
  Key,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { WarungSettings } from '../types';
import { useToast } from './Toast';

interface SettingsViewProps {
  settings: WarungSettings;
  onUpdateSettings: (newSettings: WarungSettings) => Promise<void>;
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [warungName, setWarungName] = useState<string>(settings.warungName);
  const [tagline, setTagline] = useState<string>(settings.tagline);
  const [phone, setPhone] = useState<string>(settings.phone);
  const [address, setAddress] = useState<string>(settings.address);
  const [instagram, setInstagram] = useState<string>(settings.instagram);
  const [primaryColor, setPrimaryColor] = useState<string>(settings.primaryColor);
  const [accentColor, setAccentColor] = useState<string>(settings.accentColor);
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('wbk_gh_token') || '');
  const [isPushingGit, setIsPushingGit] = useState<boolean>(false);
  const [gitPushMessage, setGitPushMessage] = useState<string | null>(null);

  const handlePushGit = async () => {
    if (!githubToken.trim()) {
      showToast('Masukkan GitHub Personal Access Token (PAT)', 'error');
      return;
    }
    setIsPushingGit(true);
    setGitPushMessage(null);
    try {
      localStorage.setItem('wbk_gh_token', githubToken.trim());
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken.trim(),
          repoUrl: 'https://github.com/aslinsaputra1-star/app_status.git',
        }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setGitPushMessage(data.message || 'Kode berhasil di-push ke GitHub repository!');
        showToast('Berhasil otomatis di-push ke GitHub!', 'success');
      } else {
        throw new Error(data?.error || 'Gagal push ke GitHub.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Gagal push ke GitHub', 'error');
    } finally {
      setIsPushingGit(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar valid', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setLogoUrl(res);
        showToast('Logo berhasil dimuat', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warungName.trim()) {
      showToast('Nama warung tidak boleh kosong', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateSettings({
        warungName: warungName.trim(),
        tagline: tagline.trim(),
        phone: phone.trim(),
        address: address.trim(),
        instagram: instagram.trim(),
        primaryColor,
        accentColor,
        logoUrl,
        updatedAt: new Date().toISOString(),
      });
      showToast('Pengaturan warung berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast('Gagal menyimpan pengaturan: ' + (err?.message || 'Error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Pengaturan Profil & Branding Warung
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Informasi ini akan otomatis muncul pada poster, footer WhatsApp, dan media promosi Warung Bang Kobra.
        </p>
      </div>

      <div className="space-y-6">
        {/* Firebase Authentication & Cloud Sync Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Akun & Sinkronisasi Cloud</h3>
                <p className="text-xs text-stone-400">
                  Data produk dan poster disimpan permanen di Google Cloud Firestore.
                </p>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-emerald-400 block">Terhubung</span>
                  <span className="text-[11px] text-stone-400">{currentUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-300 text-xs font-semibold border border-stone-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Masuk Akun Google</span>
              </button>
            )}
          </div>
        </div>

        {/* GitHub Repository Auto-Sync Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-white">
                <GitBranch className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Sinkronisasi Otomatis GitHub Repository</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Git Ready
                  </span>
                </h3>
                <p className="text-xs text-stone-400">
                  Target: <span className="font-mono text-stone-300">https://github.com/aslinsaputra1-star/app_status.git</span>
                </p>
              </div>
            </div>

            <a
              href="https://github.com/aslinsaputra1-star/app_status"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <span>Buka GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  GitHub Personal Access Token (PAT)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=WarungBangKobraAppStatus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Buat Token Baru di GitHub →
                </a>
              </div>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="Contoh: ghp_xxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Token disimpan aman di peramban Anda untuk mengotentikasi push ke repository <code>aslinsaputra1-star/app_status</code>.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePushGit}
              disabled={isPushingGit}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPushingGit ? 'animate-spin' : ''}`} />
              <span>{isPushingGit ? 'Menghubungkan & Melakukan Push...' : 'Hubungkan & Push Otomatis ke GitHub Sekarang'}</span>
            </button>

            {gitPushMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{gitPushMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Branding Form */}
        <form onSubmit={handleSave} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          {/* Logo Warung */}
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Logo Warung
            </label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-700 overflow-hidden flex items-center justify-center shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Warung" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-stone-600" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl text-xs font-medium border border-stone-700"
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                  Unggah Logo Warung
                </button>
                <p className="text-[11px] text-stone-400 mt-1">
                  Logo akan ditempatkan di bagian atas poster jika opsi logo diaktifkan.
                </p>
              </div>
            </div>
          </div>

          {/* Nama & Slogan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Nama Warung *
              </label>
              <input
                type="text"
                required
                value={warungName}
                onChange={(e) => setWarungName(e.target.value)}
                placeholder="WARUNG BANG KOBRA"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Segar Alami & Ramah di Kantong"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* WhatsApp & Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp Pemesanan *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-9876-5432"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Instagram Warung
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@warung.bangkobra"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Alamat Fisik Warung */}
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
              Alamat Fisik Warung
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Pemuda No. 45 (Depan Lapangan)"
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Warna Tema Branding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Warna Utama Branding
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Warna Aksen / Emas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-stone-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Warung'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
