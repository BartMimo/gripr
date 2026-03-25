import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const password = body.password

  if (!password) {
    return NextResponse.json(
      { error: 'Wachtwoord ontbreekt.' },
      { status: 400 }
    )
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Onjuist wachtwoord.' },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()

  cookieStore.set('admin-session', process.env.ADMIN_COOKIE_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ success: true })
}