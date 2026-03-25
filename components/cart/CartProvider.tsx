'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { CartItem } from '@/lib/cart-types'

type AddToCartInput = {
  slug: string
  name: string
  price: string
  category: string
  image: string
  vatRate: number
  logoUrl: string
  logoFileName: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: AddToCartInput) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function parsePrice(price: string) {
  return Number(price.replace('€', '').replace(',', '.').trim())
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('kleingeluk-cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('kleingeluk-cart', JSON.stringify(items))
  }, [items])

  function addItem(item: AddToCartInput) {
    setItems((prev) => {
      const existingItem = prev.find(
        (cartItem) =>
          cartItem.slug === item.slug && cartItem.logoUrl === item.logoUrl
      )

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === existingItem.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        )
      }

      const newItem: CartItem = {
        id: crypto.randomUUID(),
        slug: item.slug,
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image,
        vatRate: item.vatRate,
        logoUrl: item.logoUrl,
        logoFileName: item.logoFileName,
        quantity: item.quantity,
      }

      return [...prev, newItem]
    })
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function increaseQuantity(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function decreaseQuantity(id: string) {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item]
        if (item.quantity === 1) return []
        return [{ ...item, quantity: item.quantity - 1 }]
      })
    )
  }

  const clearCart = useCallback(() => {
  setItems([])
  localStorage.removeItem('kleingeluk-cart')
}, [])

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + parsePrice(item.price) * item.quantity
    }, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}