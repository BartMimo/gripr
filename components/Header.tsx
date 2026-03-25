'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartProvider'
import { useEffect, useState } from 'react'

export default function Header() {
  const { totalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-stone-200 bg-white/85 backdrop-blur-md'
          : 'bg-[#F8F8F7]/95'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-griprv2.png"
            alt="GRIPR"
            width={170}
            height={40}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-stone-700">
          <Link href="/" className="transition hover:text-stone-900">
            Home
          </Link>

          <Link href="/producten" className="transition hover:text-stone-900">
            Producten
          </Link>

          <Link href="/over-ons" className="transition hover:text-stone-900">
            Voor bedrijven
          </Link>

          <Link href="/contact" className="transition hover:text-stone-900">
            Contact
          </Link>

          <Link
            href="/winkelwagen"
            className="rounded-full border border-stone-300 px-4 py-2 transition hover:bg-stone-100"
          >
            Winkelwagen ({totalItems})
          </Link>
        </nav>
      </div>
    </header>
  )
}