'use client';

import { LoginForm } from '@/app/components/organisms/login/LoginForm';
import { IllustrationSection } from '@/app/components/organisms/auth/IlustrationSection';
import loginData from '@/data/loginPage.json';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <LoginForm />
        </div>

        {/* Right Section - Illustration */}
        <IllustrationSection
          imageSrc="/login-illustration.jpg"
          title={loginData.illustration.title}
          description={loginData.illustration.description}
          imageAlt="Login illustration"
        />
      </div>
    </div>
  );
}
