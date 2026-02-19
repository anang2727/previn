'use client';

import React, { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { FormInput } from '@/app/components/atom/input/FormInput';
import { FormCheckbox } from '@/app/components/atom/checkbox/FormCheckbox';
import { AuthButton } from '@/app/components/atom/button/AuthButton';
import { AuthHeader } from '@/app/components/molecules/auth/AuthHeader';
import { FormDivider } from '@/app/components/molecules/divider/FormDivider';
import { SocialAuthButtons } from '@/app/components/molecules/auth/SocialAuthButton';
import { AuthFooter } from '@/app/components/molecules/auth/AuthFooter';
import loginData from '@/data/loginPage.json';
import { createClient } from '@/utils/client';
import { useRouter } from 'next/navigation';
import { authService } from "@/services/authService";
import { toast } from 'sonner';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        try {
            // 1. Login
            await authService.login(email, password);

            // 2. Ambil user instance
            const { data: { user } } = await supabase.auth.getUser();

            // Di dalam handleSubmit LoginForm.tsx
            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name, role')
                    .eq('id', user.id)
                    .maybeSingle(); // Menggunakan maybeSingle lebih aman daripada single

                if (profileError) throw profileError;

                // Jika profil tidak ditemukan, beri role default agar tidak error
                if (!profile) {
                    console.error("Profil tidak ditemukan di database!");
                    router.push('/dashboard-user');
                    return;
                }

                toast.success(`Selamat datang kembali, ${profile.full_name}!`);

                if (profile.role === 'admin') {
                    router.push('/dashboard-admin');
                } else {
                    router.push('/dashboard-user');
                }

                router.refresh();
            }
        } catch (error: any) {
            setErrorMessage(error.message === 'Invalid login credentials' ? 'Email atau password salah!' : error.message);
            toast.error('Login gagal: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <AuthHeader
                brandLogo={loginData.header.brandLogo}
                brandName={loginData.header.brandName}
                title={loginData.form.title}
                subtitle={loginData.form.subtitle}
            />
            {errorMessage && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up delay-100">
                <FormInput
                    label={loginData.form.email.label}
                    placeholder={loginData.form.email.placeholder}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                />

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-900">
                            {loginData.form.password.label}
                        </label>
                        <a href="#" className="text-sm text-teal-700 hover:text-teal-800 font-medium">
                            {loginData.form.password.forgotPasswordText}
                        </a>
                    </div>
                    <FormInput
                        placeholder={loginData.form.password.placeholder}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        }
                        required
                    />
                </div>

                <FormCheckbox
                    id="remember"
                    label={loginData.form.rememberMe.label}
                    checked={rememberMe}
                    onChange={setRememberMe}
                />

                <AuthButton type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Logging in...' : loginData.form.submitButton}
                </AuthButton>
            </form>

            <FormDivider text={loginData.form.dividerText} />
            <SocialAuthButtons />
            <AuthFooter
                text={loginData.signUp.text}
                linkText={loginData.signUp.link}
                linkHref="/register"
            />
        </div>
    );
}
