'use client'

export default function AdminLogoutButton() {
  async function handleLogout() {
    await fetch('/api/admin/logout', {
      method: 'POST',
    })

    window.location.href = '/admin/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-2xl border border-stone-300 bg-white px-5 py-3 transition hover:bg-stone-100"
    >
      Uitloggen
    </button>
  )
}