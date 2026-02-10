'use client';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref?: string;
  onClick?: () => void;
}

export function AuthFooter({ text, linkText, linkHref, onClick }: AuthFooterProps) {
  return (
    <p className="text-center text-gray-700 mt-8 animate-fade-up delay-400">
      {text}{' '}
      <a
        href={linkHref || '#'}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className="text-teal-700 hover:text-teal-800 font-semibold"
      >
        {linkText}
      </a>
    </p>
  );
}
