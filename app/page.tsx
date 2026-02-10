import { Share2, Eye, Link2 } from 'lucide-react';
import data from '@/data/landingPage.json';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6 sm:px-8 animate-fade-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-700 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm">
              {data.header.brandLogo}
            </div>
            <span className="font-semibold text-gray-800">{data.header.brandName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">{data.header.loginText}</Link>
            <Link href="/register" className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 font-medium transition-colors">
              {data.header.registerText}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-6 font-medium text-sm animate-fade-up">
                {data.hero.badge}
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-up delay-100">
                {data.hero.title} <span className="text-teal-700">{data.hero.titleHighlight}</span> <br />
                {data.hero.titleSuffix}
              </h1>
              <p className="text-gray-600 text-lg mb-8 animate-fade-up delay-200">
                {data.hero.description}
              </p>
              <div className="flex gap-4 mb-8 animate-fade-up delay-300">
                <button className="bg-teal-700 text-white px-6 py-3 rounded font-medium hover:bg-teal-800 transition-colors shadow-md hover:shadow-lg">
                  {data.hero.primaryButtonText}
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  {data.hero.secondaryButtonText}
                </button>
              </div>
              <div className="flex items-center gap-4 animate-fade-up delay-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white animate-pulse-soft"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-900">{data.hero.userCount}</span> {data.hero.userCountText}
                </p>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-center animate-slide-right delay-200">
              <div className="relative w-full max-w-sm">
                {/* Document Card with Image */}
                <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl p-8 shadow-lg overflow-hidden animate-float">
                  <img 
                    src="/hero-illustration.jpg" 
                    alt={data.hero.illustrationAlt} 
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                  <div className="mt-8 flex justify-center gap-3">
                    <div className="bg-teal-700 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors cursor-pointer">
                      <Share2 size={20} />
                    </div>
                    <div className="bg-teal-700 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors cursor-pointer">
                      <Link2 size={20} />
                    </div>
                    <div className="bg-teal-700 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors cursor-pointer">
                      <Eye size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section className="py-16 px-6 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {data.caraKerja.title} <span className="text-teal-700">{data.caraKerja.titleHighlight}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {data.caraKerja.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.caraKerja.cards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition hover:translate-y-[-4px] duration-300 animate-fade-up" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                <img 
                  src={card.imageSrc || "/placeholder.svg"} 
                  alt={card.imageAlt} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-gray-400 text-sm font-semibold mb-2">{card.number}</h3>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h4>
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-2xl p-12 text-white animate-fade-scale">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl font-bold mb-6 animate-fade-up">{data.benefits.title}</h2>
                <p className="text-teal-100 mb-8 animate-fade-up delay-100">
                  {data.benefits.description}
                </p>
                <div className="space-y-4">
                  {data.benefits.features.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Stats */}
              <div className="grid grid-cols-2 gap-6">
                {data.benefits.stats.map((stat, idx) => (
                  <div key={idx} className="bg-teal-600 rounded-lg p-6 text-center hover:bg-teal-500 transition-colors animate-fade-scale" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                    {stat.icon === 'eye' && <Eye className="w-8 h-8 mx-auto mb-2" />}
                    {stat.icon === 'share2' && <Share2 className="w-8 h-8 mx-auto mb-2" />}
                    {stat.value && <div className="text-4xl font-bold mb-2">{stat.value}</div>}
                    <div className={stat.icon ? 'font-semibold mb-1' : 'text-sm text-teal-100'}>{stat.title || stat.label}</div>
                    {stat.label && <div className="text-xs text-teal-100">{stat.icon ? stat.label : ''}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 sm:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-up">
            {data.cta.title} <span className="text-teal-700">{data.cta.titleHighlight}</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 animate-fade-up delay-100">
            {data.cta.description}
          </p>
          <button className="bg-teal-700 text-white px-8 py-3 rounded font-medium hover:bg-teal-800 transition-colors shadow-md hover:shadow-lg animate-fade-up delay-200">
            {data.cta.buttonText}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-teal-700 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm">
                  {data.footer.brandLogo}
                </div>
                <span className="font-semibold text-white">{data.footer.brandName}</span>
              </div>
              <p className="text-sm">
                {data.footer.brandDescription}
              </p>
            </div>

            {/* Dynamic Footer Sections */}
            {Object.entries(data.footer.sections).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, idx) => (
                    <li key={idx}><a href={link.href} className="hover:text-white">{link.text}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>{data.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
