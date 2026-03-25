export type ProductRow = {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  long_description: string | null
  price: number
  price_excl_vat: number
  vat_rate: number
  price_incl_vat: number
  active: boolean
  featured: boolean
  allow_personalization: boolean
  personalization_label: string | null
  default_image_url: string | null
  created_at: string
}

export type OrderRow = {
  id: string
  order_number: string | null
  company_name: string | null
  first_name: string
  last_name: string
  email: string
  street: string
  house_number: string
  postal_code: string
  city: string
  total_price: number
  total_items: number
  status: string
  stripe_session_id: string | null
  paid_at: string | null
  created_at: string
}

  // 🔥 NIEUW (Stripe + betaling)
  stripe_session_id: string | null
  paid_at: string | null

  created_at: string
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_slug: string
  product_name: string
  product_category: string
  product_image: string
  personalization_name: string | null
  logo_url: string | null
  logo_file_name: string | null
  unit_price: number
  quantity: number
  line_total: number
  created_at: string
}

export type CategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  active: boolean
  created_at: string
}

export type ProductRow = {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  long_description: string | null
  price: number
  active: boolean
  featured: boolean
  allow_personalization: boolean
  personalization_label: string | null
  default_image_url: string | null
  created_at: string
}

export type ProductImageRow = {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}