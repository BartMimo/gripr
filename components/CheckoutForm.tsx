'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'

type CustomerDetails = {
  companyName: string
  firstName: string
  lastName: string
  email: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

export default function CheckoutForm() {
  const router = useRouter()
  const { items } = useCart()

  const [form, setForm] = useState<CustomerDetails>({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField<K extends keyof CustomerDetails>(
    key: K,
    value: CustomerDetails[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function validateForm() {
    if (!form.companyName.trim()) return 'Vul uw bedrijfsnaam in.'
    if (!form.firstName.trim()) return 'Vul uw voornaam in.'
    if (!form.lastName.trim()) return 'Vul uw achternaam in.'
    if (!form.email.trim()) return 'Vul uw e-mailadres in.'
    if (!form.street.trim()) return 'Vul uw straatnaam in.'
    if (!form.houseNumber.trim()) return 'Vul uw huisnummer in.'
    if (!form.postalCode.trim()) return 'Vul uw postcode in.'
    if (!form.city.trim()) return 'Vul uw plaats in.'
    if (!items.length) return 'Uw winkelwagen is leeg.'
    return ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: form,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Aanmaken van checkout mislukt.')
      }

      if (!data.url) {
        throw new Error('Geen checkout URL ontvangen.')
      }

      router.push(data.url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Er ging iets mis bij het starten van de betaling.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
          Gegevens
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
          Factuur- en contactgegevens
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          Vul hieronder uw gegevens in om uw bestelling af te ronden. We
          gebruiken deze gegevens voor de verwerking van uw bestelling en voor
          eventuele terugkoppeling over het aangeleverde bestand.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Bedrijfsnaam"
          value={form.companyName}
          onChange={(value) => updateField('companyName', value)}
          className="sm:col-span-2"
        />

        <Field
          label="Voornaam"
          value={form.firstName}
          onChange={(value) => updateField('firstName', value)}
          autoComplete="given-name"
        />

        <Field
          label="Achternaam"
          value={form.lastName}
          onChange={(value) => updateField('lastName', value)}
          autoComplete="family-name"
        />

        <Field
          label="E-mailadres"
          type="email"
          value={form.email}
          onChange={(value) => updateField('email', value)}
          autoComplete="email"
          className="sm:col-span-2"
        />

        <Field
          label="Straat"
          value={form.street}
          onChange={(value) => updateField('street', value)}
          autoComplete="street-address"
        />

        <Field
          label="Huisnummer"
          value={form.houseNumber}
          onChange={(value) => updateField('houseNumber', value)}
          autoComplete="address-line2"
        />

        <Field
          label="Postcode"
          value={form.postalCode}
          onChange={(value) => updateField('postalCode', value)}
          autoComplete="postal-code"
        />

        <Field
          label="Plaats"
          value={form.city}
          onChange={(value) => updateField('city', value)}
          autoComplete="address-level2"
        />
      </div>

      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
        <p className="text-sm font-medium text-stone-900">
          Belangrijk om te weten
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-stone-600">
          <li>• Prijzen op de site zijn exclusief btw.</li>
          <li>• Uw geüploade bestand wordt gekoppeld aan uw bestelling.</li>
          <li>
            • We nemen contact op als er iets nodig is voor een goed
            eindresultaat.
          </li>
        </ul>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-stone-900 px-6 py-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Bezig met laden...' : 'Verder naar betaling'}
        </button>
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  className?: string
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  className = '',
}: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-stone-900">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900"
      />
    </div>
  )
}