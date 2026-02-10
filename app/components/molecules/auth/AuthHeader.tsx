'use client';

interface AuthHeaderProps {
  brandLogo?: string;
  brandName?: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({
  brandLogo = 'D',
  brandName = 'Prev-In',
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-teal-700 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          {brandLogo}
        </div>
        <span className="font-bold text-2xl text-gray-900">{brandName}</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
