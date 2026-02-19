import { createServerClient} from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Cek apakah ada session user
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Proteksi folder /dashboard-admin
    if (request.nextUrl.pathname.startsWith('/dashboard-admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Ambil role dari tabel profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            // Jika bukan admin, tendang ke dashboard user
            return NextResponse.redirect(new URL('/dashboard-user', request.url))
        }
    }

    // 3. Proteksi folder /dashboard-user agar orang yang belum login tidak bisa masuk
    if (request.nextUrl.pathname.startsWith('/dashboard-user')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard-admin/:path*',
        '/dashboard-user/:path*',
    ],
}