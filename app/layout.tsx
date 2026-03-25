import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartProvider from '@/components/cart/CartProvider'

export const metadata: Metadata = {
  title: 'GRIPR — Deurknoppen met uw logo',
  description:
    'Premium deurknoppen met uw eigen logo. Perfect voor bedrijven, kantoren en showrooms.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className="bg-stone-50 text-stone-900 antialiased">
        <CartProvider>
          <Header />
          <main className="pt-20 min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}