'use client';

interface FormDividerProps {
  text?: string;
}

export function FormDivider({ text = 'Atau lanjutkan dengan' }: FormDividerProps) {
  return (
    <div className="relative my-8 animate-fade-up delay-200">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-slate-50 text-gray-600">{text}</span>
      </div>
    </div>
  );
}
