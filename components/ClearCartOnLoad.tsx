'use client'

import { useEffect } from 'react'
import { useCart } from '@/components/cart/CartProvider'

export default function ClearCartOnLoad() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [])

  return null
}