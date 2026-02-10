'use client';

import { RegisterForm } from '@/app/components/organisms/register/RegisterForm';
import { IllustrationSection } from '@/app/components/organisms/auth/IlustrationSection';
import registerData from '@/data/registerPage.json';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <RegisterForm />
        </div>

        {/* Right Section - Illustration */}
        <IllustrationSection
          imageSrc="/register-illustration.jpg"
          title={registerData.illustration.title}
          description={registerData.illustration.description}
          imageAlt="Register illustration"
        />
      </div>
    </div>
  );
}
