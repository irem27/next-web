import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';

interface BrandSlide {
  id: string;
  brand: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  backgroundImage: string | null;
  theme: string;
  accentColor: string;
  icon: string;
  order: number;
}

interface BrandSliderProps {
  slides: BrandSlide[];
  accentColors: Record<string, { bg: string, hover: string, text: string, shadow: string }>;
  icons: Record<string, React.ReactNode>;
  isLightDefault?: boolean;
}

const BrandSlider: React.FC<BrandSliderProps> = ({ slides, accentColors, icons, isLightDefault }) => {
  if (!slides || slides.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">No slides</div>;
  }
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      className="w-full h-full"
    >
      {slides.map((slide, index) => {
        const colors = accentColors[slide.accentColor] || accentColors.orange;
        const isLight = slide.theme === 'light' || isLightDefault;
        return (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden">
              {/* Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700`}
                style={{
                  backgroundImage: slide.backgroundImage ? `url('${slide.backgroundImage}')` : undefined,
                  backgroundColor: isLight ? '#f5f0e8' : '#1e3a5f',
                }}
              />
              {/* Overlay */}
              <div className={`absolute inset-0 transition-all duration-500 ${isLight ? 'bg-gradient-to-b from-amber-50/85 via-amber-50/70 to-amber-50/85' : 'bg-gradient-to-b from-slate-900/75 via-slate-900/55 to-slate-900/75'}`} />
              {/* Content */}
              <div className="relative z-10 text-center px-8 py-16 max-w-lg">
                <div className={`w-20 h-20 mx-auto mb-8 ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}>
                  {icons[slide.icon] || icons.default}
                </div>
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{slide.title}</h1>
                {slide.subtitle && <p className={`text-xl md:text-2xl font-semibold mb-6 ${isLight ? colors.text : colors.text}`}>{slide.subtitle}</p>}
                {slide.description && <p className={`text-lg mb-10 leading-relaxed max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-white/80'}`}>{slide.description}</p>}
                {slide.buttonText && slide.buttonLink && (
                  <Link href={slide.buttonLink} className={`inline-flex items-center gap-3 ${colors.bg} ${colors.hover} text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1`}>
                    {slide.buttonText}
                    <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default BrandSlider;
