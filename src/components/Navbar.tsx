import React from 'react';
import { Sparkles, LayoutDashboard, Coffee, Layers, Palette, FileText, Settings, UserCircle, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onQuickCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onLoginClick,
  onLogoutClick,
  onQuickCreate,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 text-stone-950 font-black text-lg">
              K
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-tight group-hover:text-amber-400 transition-colors">
                WARUNG BANG KOBRA
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-amber-500 uppercase block">
                Status Studio AI
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'dashboard' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('ai-image')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'ai-image' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Generate Gambar AI
            </button>
            <button
              onClick={() => setCurrentTab('products')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'products' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              Produk Saya
            </button>
            <button
              onClick={() => setCurrentTab('templates')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'templates' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              Template
            </button>
            <button
              onClick={() => setCurrentTab('gallery')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'gallery' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              Desain Saya
            </button>
            <button
              onClick={() => setCurrentTab('copywriting')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'copywriting' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              Copywriting AI
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'settings' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent'
              }`}
            >
              Pengaturan
            </button>
          </nav>

          {/* Zone 3: Primary Action + Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="truncate max-w-[100px]">{currentUser.displayName || currentUser.email}</span>
                <button
                  onClick={onLogoutClick}
                  title="Keluar"
                  className="text-stone-400 hover:text-rose-400 ml-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <UserCircle className="w-4 h-4 text-amber-500" />
                Login Akun
              </button>
            )}

            <button
              onClick={onQuickCreate}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>BUAT STATUS OTOMATIS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar for Warung owners on smartphones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800/80 px-2 py-1.5 flex justify-around items-center">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'dashboard' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          Dashboard
        </button>
        <button
          onClick={() => setCurrentTab('products')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'products' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <Coffee className="w-5 h-5 mb-0.5" />
          Produk
        </button>
        <button
          onClick={onQuickCreate}
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 p-3 rounded-full shadow-lg shadow-orange-500/30"
        >
          <Sparkles className="w-6 h-6 fill-stone-950" />
        </button>
        <button
          onClick={() => setCurrentTab('ai-image')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'ai-image' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          AI Gambar
        </button>
        <button
          onClick={() => setCurrentTab('gallery')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'gallery' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          Desain
        </button>
        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'settings' ? 'text-amber-400' : 'text-stone-400'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          Profil
        </button>
      </div>
    </>
  );
};
