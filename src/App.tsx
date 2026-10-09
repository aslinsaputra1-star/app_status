/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  handleFirestoreError,
  OperationType,
} from './lib/firebase';
import { Product, PosterState, WarungSettings, DesignStyleId } from './types';
import {
  INITIAL_PRODUCTS,
  DEFAULT_WARUNG_SETTINGS,
  ASPECT_RATIOS,
} from './data/constants';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CreateStatusWizard } from './components/CreateStatusWizard';
import { PosterEditor } from './components/PosterEditor';
import { ProductCatalogView } from './components/ProductCatalogView';
import { TemplatesView } from './components/TemplatesView';
import { DesignsGalleryView } from './components/DesignsGalleryView';
import { CopywritingStudioView } from './components/CopywritingStudioView';
import { SettingsView } from './components/SettingsView';
import { AiImageGeneratorView } from './components/AiImageGeneratorView';

function MainApp() {
  const { showToast } = useToast();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core Data States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wbk_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [designs, setDesigns] = useState<PosterState[]>(() => {
    const saved = localStorage.getItem('wbk_designs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [settings, setSettings] = useState<WarungSettings>(() => {
    const saved = localStorage.getItem('wbk_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_WARUNG_SETTINGS;
      }
    }
    return DEFAULT_WARUNG_SETTINGS;
  });

  // Active poster state being edited
  const [activePoster, setActivePoster] = useState<PosterState | null>(null);

  // Sync to localStorage as immediate offline cache
  useEffect(() => {
    localStorage.setItem('wbk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wbk_designs', JSON.stringify(designs));
  }, [designs]);

  useEffect(() => {
    localStorage.setItem('wbk_settings', JSON.stringify(settings));
  }, [settings]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Firestore Realtime Listeners when user is signed in
  useEffect(() => {
    if (!currentUser) return;

    // 1. Listen to products
    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('ownerId', '==', currentUser.uid));
    const unsubProducts = onSnapshot(
      productsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setProducts(loaded);
        } else {
          // If Firestore is empty for this user, seed initial products to user's collection
          INITIAL_PRODUCTS.forEach(async (initProd) => {
            try {
              const docId = `${currentUser.uid}_${initProd.id}`;
              await setDoc(doc(db, 'products', docId), {
                ...initProd,
                id: docId,
                ownerId: currentUser.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            } catch (e) {
              console.warn('Seeding product error:', e);
            }
          });
        }
      },
      (error) => {
        console.warn('Firestore Products listener error:', error);
      }
    );

    // 2. Listen to saved designs
    const designsRef = collection(db, 'designs');
    const designsQuery = query(designsRef, where('ownerId', '==', currentUser.uid));
    const unsubDesigns = onSnapshot(
      designsQuery,
      (snapshot) => {
        const loaded: PosterState[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setDesigns(loaded);
      },
      (error) => {
        console.warn('Firestore Designs listener error:', error);
      }
    );

    // 3. Listen to warung settings
    const settingDocRef = doc(db, 'settings', currentUser.uid);
    const unsubSettings = onSnapshot(
      settingDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as WarungSettings);
        }
      },
      (error) => {
        console.warn('Firestore Settings listener error:', error);
      }
    );

    return () => {
      unsubProducts();
      unsubDesigns();
      unsubSettings();
    };
  }, [currentUser]);

  // Auth Action Handlers
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      showToast('Berhasil login dengan akun Google!', 'success');
    } catch (err: any) {
      showToast('Gagal login: ' + (err?.message || 'Error'), 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Berhasil keluar dari akun.', 'info');
    } catch (err: any) {
      showToast('Gagal logout: ' + (err?.message || 'Error'), 'error');
    }
  };

  // Product CRUD
  const handleAddProduct = async (newProd: Omit<Product, 'id'>) => {
    const id = 'prod_' + Math.random().toString(36).substring(2, 9);
    const productWithId: Product = {
      ...newProd,
      id,
      ownerId: currentUser?.uid,
    };

    setProducts((prev) => [productWithId, ...prev]);

    if (currentUser) {
      const path = `products/${id}`;
      try {
        await setDoc(doc(db, 'products', id), {
          ...productWithId,
          ownerId: currentUser.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    if (currentUser) {
      const path = `products/${updated.id}`;
      try {
        await setDoc(
          doc(db, 'products', updated.id),
          {
            ...updated,
            ownerId: currentUser.uid,
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    if (currentUser) {
      const path = `products/${productId}`;
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  // Settings Update
  const handleUpdateSettings = async (newSettings: WarungSettings) => {
    setSettings(newSettings);

    if (currentUser) {
      const path = `settings/${currentUser.uid}`;
      try {
        await setDoc(doc(db, 'settings', currentUser.uid), {
          ...newSettings,
          ownerId: currentUser.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
  };

  // Poster Saving
  const handleSavePoster = async (poster: PosterState) => {
    const posterId = poster.id || 'des_' + Math.random().toString(36).substring(2, 9);
    const completePoster: PosterState = {
      ...poster,
      id: posterId,
      ownerId: currentUser?.uid,
      updatedAt: new Date().toISOString(),
      createdAt: poster.createdAt || new Date().toISOString(),
    };

    setDesigns((prev) => {
      const exists = prev.some((d) => d.id === posterId);
      if (exists) {
        return prev.map((d) => (d.id === posterId ? completePoster : d));
      }
      return [completePoster, ...prev];
    });

    if (currentUser) {
      const path = `designs/${posterId}`;
      try {
        await setDoc(doc(db, 'designs', posterId), {
          ...completePoster,
          ownerId: currentUser.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
  };

  // Poster Gallery Actions
  const handleToggleFavorite = async (designId: string) => {
    setDesigns((prev) =>
      prev.map((d) => {
        if (d.id === designId) {
          const updated = { ...d, isFavorite: !d.isFavorite };
          if (currentUser) {
            setDoc(doc(db, 'designs', designId), { isFavorite: updated.isFavorite }, { merge: true }).catch(console.error);
          }
          return updated;
        }
        return d;
      })
    );
  };

  const handleDeleteDesign = async (designId: string) => {
    setDesigns((prev) => prev.filter((d) => d.id !== designId));
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'designs', designId));
      } catch (err) {
        console.error('Delete design error:', err);
      }
    }
  };

  const handleDuplicateDesign = (poster: PosterState) => {
    const duplicated: PosterState = {
      ...poster,
      id: 'des_' + Math.random().toString(36).substring(2, 9),
      title: `${poster.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    handleSavePoster(duplicated);
    showToast('Desain berhasil diduplikasi ke galeri!', 'success');
  };

  // Workflow Handlers
  const handleOpenQuickCreate = () => {
    setCurrentTab('wizard');
  };

  const handleStartFromProduct = (prod: Product) => {
    const defaultRatio = ASPECT_RATIOS[0];
    const newPoster: PosterState = {
      title: `Status ${prod.name}`,
      productId: prod.id,
      productName: prod.name,
      productPrice: prod.price,
      productImageUrl: prod.imageUrl,
      styleId: 'promo-viral',
      aspectRatio: 'whatsapp-status',
      width: defaultRatio.width,
      height: defaultRatio.height,
      headline: 'SEGARNYA BIKIN MERINDING!',
      subheadline: `${prod.name} dingin mantap siap segarkan harimu seketika.`,
      ctaText: 'PESAN SEKARANG VIA WA!',
      badgeText: 'BEST SELLER',
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
    setActivePoster(newPoster);
    setCurrentTab('editor');
  };

  const handleStartFromTemplate = (styleId: DesignStyleId, prod: Product) => {
    const defaultRatio = ASPECT_RATIOS[0];
    const newPoster: PosterState = {
      title: `Status ${prod.name}`,
      productId: prod.id,
      productName: prod.name,
      productPrice: prod.price,
      productImageUrl: prod.imageUrl,
      styleId,
      aspectRatio: 'whatsapp-status',
      width: defaultRatio.width,
      height: defaultRatio.height,
      headline: 'SEGARNYA BIKIN MERINDING!',
      subheadline: `${prod.name} dingin mantap siap segarkan harimu seketika.`,
      ctaText: 'PESAN SEKARANG VIA WA!',
      badgeText: 'HARGA SPESIAL',
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
    setActivePoster(newPoster);
    setCurrentTab('editor');
  };

  const handleDesignGenerated = (poster: PosterState) => {
    setActivePoster(poster);
    setCurrentTab('editor');
  };

  const handleOpenInEditor = (poster: PosterState) => {
    setActivePoster(poster);
    setCurrentTab('editor');
  };

  const handleApplyCopywritingToStatus = (data: {
    product: Product;
    headline: string;
    subheadline: string;
    badge: string;
    cta: string;
  }) => {
    const defaultRatio = ASPECT_RATIOS[0];
    const newPoster: PosterState = {
      title: `Status ${data.product.name}`,
      productId: data.product.id,
      productName: data.product.name,
      productPrice: data.product.price,
      productImageUrl: data.product.imageUrl,
      styleId: 'promo-viral',
      aspectRatio: 'whatsapp-status',
      width: defaultRatio.width,
      height: defaultRatio.height,
      headline: data.headline,
      subheadline: data.subheadline,
      ctaText: data.cta,
      badgeText: data.badge,
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
    setActivePoster(newPoster);
    setCurrentTab('editor');
  };

  const handleUseAiImageInPoster = (
    imageDataUrl: string,
    productName: string,
    promptText?: string
  ) => {
    const matchedProduct = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    ) || products[0];

    const defaultRatio = ASPECT_RATIOS[0];
    const newPoster: PosterState = {
      title: `Poster AI ${productName}`,
      productId: matchedProduct?.id,
      productName: productName,
      productPrice: matchedProduct?.price || 10000,
      productImageUrl: imageDataUrl,
      styleId: 'premium-product-photo',
      aspectRatio: 'whatsapp-status',
      width: defaultRatio.width,
      height: defaultRatio.height,
      headline: 'SEGARNYA BIKIN MERINDING!',
      subheadline: promptText ? promptText.slice(0, 90) : `${productName} dingin nikmat siap segarkan harimu.`,
      ctaText: 'PESAN SEKARANG VIA WA!',
      badgeText: 'KUALITAS TERBAIK',
      warungName: settings.warungName,
      warungPhone: settings.phone,
      warungAddress: settings.address,
      backgroundColor: '#0c0a09',
      textColor: '#ffffff',
      accentColor: '#f59e0b',
      showPrice: true,
      showLogo: true,
      showBadge: true,
      showCta: true,
      showContact: true,
    };
    setActivePoster(newPoster);
    setCurrentTab('editor');
    showToast('Gambar AI dimuat ke Editor Poster!', 'success');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Navbar Contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLoginClick={handleLogin}
        onLogoutClick={handleLogout}
        onQuickCreate={handleOpenQuickCreate}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <DashboardView
            products={products}
            designs={designs}
            settings={settings}
            onQuickCreate={handleOpenQuickCreate}
            onSelectProductToCreate={handleStartFromProduct}
            onOpenDesign={handleOpenInEditor}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'ai-image' && (
          <AiImageGeneratorView
            products={products}
            settings={settings}
            onUseImageInPoster={handleUseAiImageInPoster}
            onQuickCreate={handleOpenQuickCreate}
          />
        )}

        {currentTab === 'wizard' && (
          <CreateStatusWizard
            products={products}
            settings={settings}
            onDesignGenerated={handleDesignGenerated}
            onOpenProductManager={() => setCurrentTab('products')}
          />
        )}

        {currentTab === 'editor' && (
          <PosterEditor
            initialPoster={
              activePoster || {
                title: 'Status Baru',
                productName: products[0]?.name || 'Jus Mangga',
                productPrice: products[0]?.price || 10000,
                productImageUrl: products[0]?.imageUrl || '',
                styleId: 'promo-viral',
                aspectRatio: 'whatsapp-status',
                width: 1080,
                height: 1920,
                headline: 'SEGARNYA BIKIN MERINDING!',
                subheadline: 'Dingin mantap siap segarkan harimu seketika.',
                ctaText: 'PESAN SEKARANG VIA WA!',
                badgeText: 'BEST SELLER',
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
              }
            }
            onSavePoster={handleSavePoster}
            onClose={() => setCurrentTab('dashboard')}
            onOpenAiCopywriter={() => setCurrentTab('copywriting')}
          />
        )}

        {currentTab === 'products' && (
          <ProductCatalogView
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onCreatePosterForProduct={handleStartFromProduct}
          />
        )}

        {currentTab === 'templates' && (
          <TemplatesView
            products={products}
            onSelectTemplate={handleStartFromTemplate}
          />
        )}

        {currentTab === 'gallery' && (
          <DesignsGalleryView
            designs={designs}
            onOpenInEditor={handleOpenInEditor}
            onDuplicateDesign={handleDuplicateDesign}
            onToggleFavorite={handleToggleFavorite}
            onDeleteDesign={handleDeleteDesign}
            onQuickCreate={handleOpenQuickCreate}
          />
        )}

        {currentTab === 'copywriting' && (
          <CopywritingStudioView
            products={products}
            settings={settings}
            onApplyToStatus={handleApplyCopywritingToStatus}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
