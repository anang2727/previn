'use client';

import { Chrome, Facebook, Twitter } from 'lucide-react';
import { AuthButton } from '@/app/components/atom/button/AuthButton';

interface SocialAuthButtonsProps {
    onGoogle?: () => void;
    onFacebook?: () => void;
    onX?: () => void;
}

export function SocialAuthButtons({
    onGoogle,
    onFacebook,
    onX,
}: SocialAuthButtonsProps) {
    return (
        /* Menggunakan gap-3 untuk jarak antar tombol, justify-center agar di tengah */
        <div className="flex items-center justify-center gap-3 animate-fade-up delay-300 mt-2">
            
            {/* Google - Border merah tipis dengan hover halus */}
            <AuthButton
                variant="social"
                icon={Chrome}
                onClick={onGoogle}
                fullWidth
                className="py-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer"
            />

            {/* Facebook - Biru khas Facebook */}
            <AuthButton
                variant="social"
                icon={Facebook}
                onClick={onFacebook}
                fullWidth
                className="py-2 border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 cursor-pointer"
            />

            {/* X (Twitter) - Hitam Elegan */}
            <AuthButton
                variant="social"
                icon={Twitter}
                onClick={onX}
                fullWidth
                className="py-2 border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
            />
        </div>
    );
}