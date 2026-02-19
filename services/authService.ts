// services/authService.ts
import { createClient } from '@/utils/client';

const supabase = createClient();

export const authService = {
    /**
     * Fungsi untuk mendaftarkan user baru
     * @param email - Email user
     * @param password - Password user
     * @param fullName - Nama lengkap untuk disimpan di metadata
     */
    async register(email: string, password: string, fullName: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'user', // Kamu bisa set role default di sini, misal 'user'
                    // Kamu bisa tambah metadata lain di sini, misal: role: 'user'
                },
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Fungsi Login (untuk digunakan di LoginForm nanti)
     */
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async logout() {
        const {error} = await supabase.auth.signOut();
        if (error) throw error;
    }
};