'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/supabase'

export type CartItem = {
  product: Product
  quantity: number
  flavor?: string
  size?: string
  primaryImage?: string
}

type Lang = 'ar' | 'fr'

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  lang: Lang
  addItem: (product: Product, quantity?: number, flavor?: string, size?: string) => void
  removeItem: (productId: string, flavor?: string, size?: string) => void
  updateQty: (productId: string, qty: number, flavor?: string, size?: string) => void
  clearCart: () => void
  toggleCart: () => void
  setLang: (l: Lang) => void
  count: () => number
  subtotal: () => number
}

const key = (id: string, f?: string, s?: string) => `${id}|${f ?? ''}|${s ?? ''}`

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lang: 'ar',

      addItem: (product, quantity = 1, flavor, size) => {
        set(state => {
          const k = key(product.id, flavor, size)
          const idx = state.items.findIndex(i => key(i.product.id, i.flavor, i.size) === k)
          const img = product.product_images?.find(i => i.is_primary)?.url ?? product.product_images?.[0]?.url
          if (idx >= 0) {
            const items = [...state.items]
            items[idx] = { ...items[idx], quantity: Math.min(items[idx].quantity + quantity, product.quantity || 99) }
            return { items }
          }
          return { items: [...state.items, { product, quantity, flavor, size, primaryImage: img }] }
        })
      },

      removeItem: (productId, flavor, size) => {
        const k = key(productId, flavor, size)
        set(state => ({ items: state.items.filter(i => key(i.product.id, i.flavor, i.size) !== k) }))
      },

      updateQty: (productId, qty, flavor, size) => {
        if (qty <= 0) { get().removeItem(productId, flavor, size); return }
        const k = key(productId, flavor, size)
        set(state => ({ items: state.items.map(i => key(i.product.id, i.flavor, i.size) === k ? { ...i, quantity: qty } : i) }))
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
      setLang: (lang) => set({ lang }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    }),
    { name: 'fmz-cart', partialize: s => ({ items: s.items, lang: s.lang }) }
  )
)
