'use client';

interface IllustrationSectionProps {
    imageSrc: string;
    title: string;
    description: string;
    imageAlt?: string;
}

export function IllustrationSection({
    imageSrc,
    title,
    description,
    imageAlt = 'Illustration',
}: IllustrationSectionProps) {
    return (
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-teal-600 to-teal-800 overflow-hidden items-center justify-center p-12">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
            <div
                className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
                style={{ animationDelay: '2s' }}
            />
            <div
                className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
                style={{ animationDelay: '4s' }}
            />

            {/* Content Card */}
            <div className="relative z-10 text-center">
                <img
                    src={imageSrc || "/placeholder.svg"}
                    alt={imageAlt}
                    className="w-80 h-80 object-cover rounded-2xl shadow-2xl mb-8 animate-slide-right"
                />
                <div className="text-white">
                    <h2 className="text-3xl font-bold mb-4">{title}</h2>
                    <p className="text-teal-100 text-lg max-w-sm mx-auto">{description}</p>
                </div>
            </div>
        </div>
    );
}
