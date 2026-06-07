import { SensitivityConfig } from './types';

export const BRANDS = [
  'Samsung', 'Apple', 'Xiaomi', 'Redmi', 'POCO', 'Realme', 'Vivo', 
  'Oppo', 'OnePlus', 'Motorola', 'ASUS', 'Infinix', 'Tecno', 'iQOO', 
  'Nothing', 'Google Pixel', 'Nokia', 'Honor', 'Huawei', 'Sony', 
  'Lenovo', 'Lava', 'Micromax'
];

export const GAMES = [
  'Free Fire', 'Free Fire MAX', 'PUBG Mobile', 'BGMI', 'Call of Duty Mobile', 'Apex Legends Mobile'
];

export const MOCK_CONFIGS: SensitivityConfig[] = [
  {
    id: 'f1',
    name: 'Pro Standard Settings',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    game: 'Free Fire',
    type: 'free',
    general: 100,
    redDot: 95,
    scope2x: 90,
    scope4x: 85,
    sniperScope: 50,
    freeLook: 70
  },
  {
    id: 'f2',
    name: 'Headshot Master',
    brand: 'Realme',
    model: 'Realme GT 2',
    game: 'Free Fire MAX',
    type: 'free',
    general: 98,
    redDot: 100,
    scope2x: 95,
    scope4x: 90,
    sniperScope: 45,
    freeLook: 65
  },
  {
    id: 'p1',
    name: 'God Level Auto-Aim',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    game: 'PUBG Mobile',
    type: 'premium',
    description: 'Exclusive 0-recoil setup used by top competitive players.',
    price: 4.99,
    general: 120,
    redDot: 110,
    scope2x: 100,
    scope4x: 90,
    sniperScope: 60,
    freeLook: 80,
    features: ['Zero Recoil', 'Enhanced Movement', 'Tested in Tournaments']
  },
  {
    id: 'p2',
    name: 'One-Tap Secret',
    brand: 'POCO',
    model: 'POCO X3 Pro',
    game: 'Free Fire',
    type: 'premium',
    description: 'Perfect for quick drag headshots on mid-range devices.',
    price: 2.99,
    general: 100,
    redDot: 100,
    scope2x: 100,
    scope4x: 100,
    sniperScope: 50,
    freeLook: 50,
    features: ['Optimized for 60FPS', 'Smooth Drag', 'Sniper Friendly']
  }
];
