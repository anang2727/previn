import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Buat response awal
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Inisialisasi Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Sinkronisasi ke request agar getUser() nanti bisa baca token terbaru
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                    // PENTING: Update response agar browser menerima cookie baru
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

    // 3. Refresh session (Sangat krusial untuk Vercel/Production)
    const { data: { user } } = await supabase.auth.getUser()

    // 4. Proteksi Rute
    const isDashboardAdmin = request.nextUrl.pathname.startsWith('/dashboard-admin')
    const isDashboardUser = request.nextUrl.pathname.startsWith('/dashboard-user')

    if (isDashboardAdmin || isDashboardUser) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if (isDashboardAdmin) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard-user', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Cocokkan semua request kecuali yang statis
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}