'use client';

import { type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthButtonProps {
    children?: ReactNode;
    variant?: 'primary' | 'secondary' | 'social';
    icon?: LucideIcon;
    type?: 'button' | 'submit';
    disabled?: boolean;
    onClick?: () => void;
    fullWidth?: boolean;
    className?: string;
}

export function AuthButton({
    children,
    variant = 'primary',
    icon: Icon,
    type = 'button',
    disabled = false,
    onClick,
    fullWidth = false,
    className = '',
}: AuthButtonProps) {
    const baseStyles = 'font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-3';
    const widthStyles = fullWidth ? 'w-full' : '';
    const gapStyle = Icon && children ? 'gap-3' : '';
    const variantStyles = {
        primary:
            'bg-teal-700 hover:bg-teal-800 text-white shadow-md hover:shadow-lg disabled:bg-gray-400',
        secondary:
            'border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
        social:
            'border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            // Gabungkan semua style
            className={`${baseStyles} ${widthStyles} ${gapStyle} ${variantStyles[variant]} ${className}`}
        >
            {Icon && <Icon size={20} />}
            {children}
        </button>
    );
}
