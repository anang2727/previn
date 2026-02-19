'use client';

import React from "react"
import { useState } from 'react';
import { Mail, Eye, EyeOff, User } from 'lucide-react';
import { FormInput } from '@/app/components/atom/input/FormInput';
import { FormCheckbox } from '@/app/components/atom/checkbox/FormCheckbox';
import { AuthButton } from '@/app/components/atom/button/AuthButton';
import { AuthHeader } from '@/app/components/molecules/auth/AuthHeader';
import { FormDivider } from '@/app/components/molecules/divider/FormDivider';
import { SocialAuthButtons } from '@/app/components/molecules/auth/SocialAuthButton';
import { AuthFooter } from '@/app/components/molecules/auth/AuthFooter';
import registerData from '@/data/registerPage.json';
import { createClient } from '@/utils/supabase/client';
import { authService } from "@/services/authService";
import { init } from "next/dist/compiled/webpack/webpack";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }
        if (!formData.agreeTerms) {
            alert('Anda harus menyetujui syarat dan ketentuan!');
            return;
        }
        setLoading(true);
        try {
            await authService.register(
                formData.email,
                formData.password,
                formData.fullName);
            toast.success('Pendaftaran berhasil! Silahkan cek email Anda atau Login.');
            router.push('/dashboard-user');
            router.refresh();
        } catch (error: any) {
            toast.error('Pendaftaran gagal: ' + error.message);
        } finally {
            setLoading(false);
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                agreeTerms: false,
            });
        }
    };

    return (
        <div className="w-full max-w-md">
            <AuthHeader
                brandLogo={registerData.header.brandLogo}
                brandName={registerData.header.brandName}
                title={registerData.form.title}
                subtitle={registerData.form.subtitle}
            />

            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up delay-100">
                <FormInput
                    label={registerData.form.fullName.label}
                    placeholder={registerData.form.fullName.placeholder}
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    icon={User}
                    required
                />

                <FormInput
                    label={registerData.form.email.label}
                    placeholder={registerData.form.email.placeholder}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    icon={Mail}
                    required
                />

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {registerData.form.password.label}
                    </label>
                    <FormInput
                        placeholder={registerData.form.password.placeholder}
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
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
                    <p className="text-xs text-gray-500 mt-1">{registerData.form.password.hint}</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {registerData.form.confirmPassword.label}
                    </label>
                    <FormInput
                        placeholder={registerData.form.confirmPassword.placeholder}
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        }
                        required
                    />
                </div>

                <FormCheckbox
                    id="agreeTerms"
                    label={
                        <>
                            {registerData.form.agreeTerms.text}{' '}
                            <a href="#" className="text-teal-700 hover:text-teal-800 font-medium">
                                {registerData.form.agreeTerms.linkText}
                            </a>
                        </>
                    }
                    checked={formData.agreeTerms}
                    onChange={(checked) => handleChange('agreeTerms', checked)}
                />

                <AuthButton type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Creating Account...' : registerData.form.submitButton}
                </AuthButton>
            </form>

            <FormDivider text={registerData.form.dividerText} />

            <SocialAuthButtons />

            <AuthFooter
                text={registerData.signIn.text}
                linkText={registerData.signIn.link}
                linkHref="/login"
            />
        </div>
    );
}
