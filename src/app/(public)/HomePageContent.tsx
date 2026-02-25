"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { JSX } from 'react';

interface BrandSlide {
  id: string
  brand: string
  title: string
  subtitle: string | null
  description: string | null
  buttonText: string | null
  buttonLink: string | null
  backgroundImage: string | null
  theme: string
  accentColor: string
  icon: string
  order: number
}

// Varsayılan slide'lar (API'den yüklenene kadar)
const defaultSlides: BrandSlide[] = [
  {
    id: "1",
    brand: "alamira",
    title: "ALAMIRA",
    subtitle: "Premium Rice Specialties",
    description: "Quality rice products for trade, gastronomy, and food partners worldwide",
    buttonText: "Explore Products",
    buttonLink: "/alamira-rice",
    backgroundImage: "/images/rice-bg.jpg",
    theme: "light",
    accentColor: "orange",
    icon: "rice",
    order: 0,
  },
  {
    id: "2",
    brand: "grainfood",
    title: "GRAINFOOD",
    subtitle: "Transport, Freight & Logistics",
    description: "Professional logistics solutions for B2B, industry, and global trade",
    buttonText: "Explore Services",
    buttonLink: "/contact",
    backgroundImage: "/images/truck-bg.jpg",
    theme: "dark",
    accentColor: "blue",
    icon: "logistics",
    order: 1,
  },
]

const icons: Record<string, JSX.Element> = {
  rice: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  logistics: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  default: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

const accentColors: Record<string, { bg: string, hover: string, text: string, shadow: string }> = {
  orange: { bg: 'bg-[#868792]', hover: 'hover:bg-[#6e6f7a]', text: 'text-[#868792]', shadow: 'shadow-[#868792]/30' },
  blue: { bg: 'bg-[#f06721]', hover: 'hover:bg-[#d95a1b]', text: 'text-[#f06721]', shadow: 'shadow-[#f06721]/30' },
  green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-green-400', shadow: 'shadow-green-500/30' },
  purple: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-purple-400', shadow: 'shadow-purple-500/30' },
  red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-400', shadow: 'shadow-red-500/30' },
}

export default function HomePageContent() {
  const [hoveredAlamira, setHoveredAlamira] = useState<number | null>(null)
  const [hoveredGrainfood, setHoveredGrainfood] = useState<number | null>(null)
  const [alamiraSlides, setAlamiraSlides] = useState<BrandSlide[]>([])
  const [grainfoodSlides, setGrainfoodSlides] = useState<BrandSlide[]>([])
  const [isClient, setIsClient] = useState(false)
  // Yeni: aktif slide indexleri
  const [alamiraIndex, setAlamiraIndex] = useState(0)
  const [grainfoodIndex, setGrainfoodIndex] = useState(0)

  useEffect(() => {
    setIsClient(true)
    fetch('/api/brand-slides')
      .then(res => res.json())
      .then(data => {
        if (data.alamira) setAlamiraSlides(data.alamira)
        if (data.grainfood) setGrainfoodSlides(data.grainfood)
      })
      .catch(err => {
        console.error('Failed to fetch brand slides:', err)
      })
  }, [])

  // Slider helpers
  const getSlideWidth = (index: number, hovered: number | null, total: number) => {
    if (hovered === null) return `${100 / total}%`
    if (hovered === index) return `${Math.min(60, 100 - (total - 1) * 15)}%`
    return `${(100 - Math.min(60, 100 - (total - 1) * 15)) / (total - 1)}%`
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Alamira */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex items-center justify-center">
        {alamiraSlides.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">No Alamira slides</div>
        ) : (
          (() => {
            const slide = alamiraSlides[alamiraIndex]
            const colors = accentColors[slide.accentColor] || accentColors.orange
            const isHovered = hoveredAlamira === alamiraIndex
            const isLight = slide.theme === 'light'
            return (
              <div
                key={slide.id}
                className="relative flex-1 min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out"
                onMouseEnter={() => setHoveredAlamira(alamiraIndex)}
                onMouseLeave={() => setHoveredAlamira(null)}
              >
                {/* Background Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  style={{
                    backgroundImage: slide.backgroundImage ? `url('${slide.backgroundImage}')` : undefined,
                    backgroundColor: isLight ? '#f4f4f4' : '#1a214f',
                  }}
                />
                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${isLight ? (isHovered ? 'bg-gradient-to-b from-gray-100/70 via-gray-100/50 to-gray-100/70' : 'bg-gradient-to-b from-gray-100/85 via-gray-100/70 to-gray-100/85') : (isHovered ? 'bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60' : 'bg-gradient-to-b from-slate-900/75 via-slate-900/55 to-slate-900/75')}`} />
                {/* Content */}
                <div className={`relative z-10 text-center px-8 py-16 max-w-lg transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}>
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight transition-all duration-500 ${isHovered ? 'tracking-wide' : ''} ${isLight ? 'text-[#0c0f23]' : 'text-white'}`}>{slide.title}</h1>
                  {slide.subtitle && <p className={`text-xl md:text-2xl font-semibold mb-6 ${isLight ? colors.text : colors.text}`}>{slide.subtitle}</p>}
                  {slide.description && <p className={`text-lg mb-10 leading-relaxed max-w-md mx-auto ${isLight ? 'text-[#868792]' : 'text-white/80'}`}>{slide.description}</p>}
                  {slide.buttonText && slide.buttonLink && (
                    <Link href={slide.buttonLink} className={`inline-flex items-center gap-3 ${colors.bg} ${colors.hover} text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${isHovered ? 'scale-105' : ''}`}>
                      {slide.buttonText}
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
                {/* Slide Indicator ve butonlar */}
                {alamiraSlides.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 items-center">
                    <button
                      className="px-2 py-1 rounded bg-transparent text-[#0c0f23] hover:bg-gray-300 transition-all text-lg font-bold"
                      onClick={() => setAlamiraIndex((prev) => prev === 0 ? alamiraSlides.length - 1 : prev - 1)}
                      aria-label="Previous slide"
                    >
                      {'<'}
                    </button>
                    {alamiraSlides.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === alamiraIndex ? `${colors.bg} w-6` : isLight ? 'bg-slate-400/50' : 'bg-white/30'}`} />
                    ))}
                    <button
                      className="px-2 py-1 rounded bg-transparent text-slate-700 hover:bg-slate-300 transition-all text-lg font-bold"
                      onClick={() => setAlamiraIndex((prev) => prev === alamiraSlides.length - 1 ? 0 : prev + 1)}
                      aria-label="Next slide"
                    >
                      {'>'}
                    </button>
                  </div>
                )}
              </div>
            )
          })()
        )}
      </div>
      {/* Right Panel - Grainfood */}
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex items-center justify-center">
        {grainfoodSlides.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">No Grainfood slides</div>
        ) : (
          (() => {
            const slide = grainfoodSlides[grainfoodIndex]
            const colors = accentColors[slide.accentColor] || accentColors.blue
            const isHovered = hoveredGrainfood === grainfoodIndex
            const isLight = slide.theme === 'light'
            return (
              <div
                key={slide.id}
                className="relative flex-1 min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out"
                onMouseEnter={() => setHoveredGrainfood(grainfoodIndex)}
                onMouseLeave={() => setHoveredGrainfood(null)}
              >
                {/* Background Image */}
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  style={{
                    backgroundImage: slide.backgroundImage ? `url('${slide.backgroundImage}')` : undefined,
                    backgroundColor: isLight ? '#f4f4f4' : '#1a214f',
                  }}
                />
                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${isLight ? (isHovered ? 'bg-gradient-to-b from-gray-100/70 via-gray-100/50 to-gray-100/70' : 'bg-gradient-to-b from-gray-100/85 via-gray-100/70 to-gray-100/85') : (isHovered ? 'bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/60' : 'bg-gradient-to-b from-slate-900/75 via-slate-900/55 to-slate-900/75')}`} />
                {/* Content */}
                <div className={`relative z-10 text-center px-8 py-16 max-w-lg transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}>
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight transition-all duration-500 ${isHovered ? 'tracking-wide' : ''} ${isLight ? 'text-[#0c0f23]' : 'text-white'}`}>{slide.title}</h1>
                  {slide.subtitle && <p className={`text-xl md:text-2xl font-semibold mb-6 ${isLight ? colors.text : colors.text}`}>{slide.subtitle}</p>}
                  {slide.description && <p className={`text-lg mb-10 leading-relaxed max-w-md mx-auto ${isLight ? 'text-[#868792]' : 'text-white/80'}`}>{slide.description}</p>}
                  {slide.buttonText && slide.buttonLink && (
                    <Link href={slide.buttonLink} className={`inline-flex items-center gap-3 ${colors.bg} ${colors.hover} text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${isHovered ? 'scale-105' : ''}`}>
                      {slide.buttonText}
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
                {/* Slide Indicator ve butonlar */}
                {grainfoodSlides.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 items-center">
                    <button
                      className="px-2 py-1 rounded bg-transparent text-slate-700 hover:bg-slate-300 transition-all text-lg font-bold"
                      onClick={() => setGrainfoodIndex((prev) => prev === 0 ? grainfoodSlides.length - 1 : prev - 1)}
                      aria-label="Previous slide"
                    >
                      {'<'}
                    </button>
                    {grainfoodSlides.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === grainfoodIndex ? `${colors.bg} w-6` : isLight ? 'bg-slate-400/50' : 'bg-white/30'}`} />
                    ))}
                    <button
                      className="px-2 py-1 rounded bg-transparent text-slate-700 hover:bg-slate-300 transition-all text-lg font-bold"
                      onClick={() => setGrainfoodIndex((prev) => prev === grainfoodSlides.length - 1 ? 0 : prev + 1)}
                      aria-label="Next slide"
                    >
                      {'>'}
                    </button>
                  </div>
                )}
              </div>
            )
          })()
        )}
      </div>
    </main>
  )
}
