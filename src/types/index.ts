export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isPopular?: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DesignStyleId =
  | 'premium-luxury'
  | 'modern-minimalis'
  | 'cafe-genz'
  | 'promo-viral'
  | 'colorful-fresh'
  | 'dark-elegant'
  | 'neon-glow'
  | 'korean-cafe'
  | 'street-food'
  | 'diskon-besar'
  | 'estetik-instagram'
  | 'premium-product-photo';

export interface DesignStyleInfo {
  id: DesignStyleId;
  name: string;
  tagline: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  primaryFont: string;
  badgeStyle: string;
}

export type AspectRatioId =
  | 'whatsapp-status'
  | 'instagram-story'
  | 'facebook-story'
  | 'instagram-post'
  | 'portrait-post'
  | 'custom-poster';

export interface AspectRatioInfo {
  id: AspectRatioId;
  label: string;
  width: number;
  height: number;
  ratioText: string;
  platform: string;
}

export interface PosterState {
  id?: string;
  title: string;
  productId?: string;
  productName: string;
  productPrice: number;
  productOriginalPrice?: number;
  productImageUrl: string;
  styleId: DesignStyleId;
  aspectRatio: AspectRatioId;
  width: number;
  height: number;
  headline: string;
  subheadline: string;
  ctaText: string;
  badgeText: string;
  warungName: string;
  warungPhone: string;
  warungAddress: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  secondaryColor?: string;
  showPrice: boolean;
  showLogo: boolean;
  showBadge: boolean;
  showCta: boolean;
  showContact: boolean;
  isFavorite?: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WarungSettings {
  warungName: string;
  tagline: string;
  phone: string;
  address: string;
  instagram: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  ownerId?: string;
  updatedAt?: string;
}

export interface CopywritingResult {
  headline: string;
  subheadline: string;
  badge: string;
  cta: string;
  fullCaption: string;
  socialHook: string;
}
