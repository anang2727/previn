'use client';

import { useState } from 'react';
import { Mail, Eye, EyeOff, Chrome, Facebook, Twitter } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-teal-700 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <span className="font-bold text-2xl text-gray-900">Prev-In</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Kembali</h1>
              <p className="text-gray-600">Masuk ke akun Anda untuk berbagi dokumen</p>
            </div>

            {/* Form */}
            <form className="space-y-5 animate-fade-up delay-100">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Password
                  </label>
                  <a href="#" className="text-sm text-teal-700 hover:text-teal-800 font-medium">
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Subscribe */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 text-teal-700 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Ingat saya
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg mt-6"
              >
                Masuk
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 animate-fade-up delay-200">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-50 text-gray-600">Atau masuk dengan</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 animate-fade-up delay-300">
              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
              >
                <Chrome size={20} />
                Masuk dengan Google
              </button>

              {/* Facebook */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
              >
                <Facebook size={20} />
                Masuk dengan Facebook
              </button>

              {/* X (Twitter) */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
              >
                <Twitter size={20} />
                Masuk dengan X
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-700 mt-8 animate-fade-up delay-400">
              Belum punya akun?{' '}
              <a href="#" className="text-teal-700 hover:text-teal-800 font-semibold">
                Daftar di sini
              </a>
            </p>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-teal-600 to-teal-800 overflow-hidden items-center justify-center p-12">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

          {/* Content Card */}
          <div className="relative z-10 text-center">
            <img
              src="/login-illustration.jpg"
              alt="Login illustration"
              className="w-80 h-80 object-cover rounded-2xl shadow-2xl mb-8 animate-slide-right"
            />
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">Berbagi Dokumen Lebih Mudah</h2>
              <p className="text-teal-100 text-lg max-w-sm mx-auto">
                Upload, bagikan, dan lihat preview dokumen Anda tanpa perlu download atau install software
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
