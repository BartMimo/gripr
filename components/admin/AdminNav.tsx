'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminLogoutButton from '@/components/AdminLogoutButton'

const links = [
  { href: '/admin/orders', label: 'Bestellingen' },
  { href: '/admin/categories', label: 'Categorieën' },
  { href: '/admin/products', label: 'Producten' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {links.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <AdminLogoutButton />
      </div>
    </div>
  )
}