// lib/shopify-server.ts - Server-only wrapper
import 'server-only';

// Re-export all functions from the main shopify file
export {
  createCart,
  addToCart,
  removeFromCart,
  updateCart,
  getCart,
  getCollection,
  getCollectionProducts,
  getCollections,
  getMenu,
  getPage,
  getPages,
  getProduct,
  getProductRecommendations,
  getProducts,
  revalidate
} from './shopify';

// Re-export types
export type {
  Cart,
  Collection,
  Menu,
  Page,
  Product
} from './shopify/types';