'use client';

import React from "react"

import { type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface FormInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  rightElement?: ReactNode;
  error?: string;
  required?: boolean;
}

export function FormInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  rightElement,
  error,
  required,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
