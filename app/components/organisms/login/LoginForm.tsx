'use client';

import React from "react"

import { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { FormInput } from '@/app/components/atom/input/FormInput';
import { FormCheckbox } from '@/app/components/atom/checkbox/FormCheckbox';
import { AuthButton } from '@/app/components/atom/button/AuthButton';
import { AuthHeader } from '@/app/components/molecules/auth/AuthHeader';
import { FormDivider } from '@/app/components/molecules/divider/FormDivider';
import { SocialAuthButtons } from '@/app/components/molecules/auth/SocialAuthButton';
import { AuthFooter } from '@/app/components/molecules/auth/AuthFooter';
import loginData from '@/data/loginPage.json';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password, rememberMe });
    };

    return (
        <div className="w-full max-w-md">
            <AuthHeader
                brandLogo={loginData.header.brandLogo}
                brandName={loginData.header.brandName}
                title={loginData.form.title}
                subtitle={loginData.form.subtitle}
            />

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

                <AuthButton type="submit" variant="primary" fullWidth>
                    {loginData.form.submitButton}
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
