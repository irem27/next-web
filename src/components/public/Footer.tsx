"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Settings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  footerText: string;
  copyrightText: string;
  logoAlamira: string;
  logoLogistics: string;
}

interface LinkItem {
  label: string;
  href: string;
}

interface WorkingHour {
  day: string;
  hours: string;
}

interface FooterConfig {
  id: string;
  siteKey: string;
  newsletterTitle: string;
  brandName: string;
  brandDescription: string | null;
  accentColor: string;
  copyrightText: string | null;
  topLinks: string;
  serviceLinks: string;
  workingHours: string;
}

function parseJSON<T>(str: string | undefined | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function isValidUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function detectSiteKey(pathname: string): string {
  if (
    pathname.startsWith("/logistics") ||
    pathname.startsWith("/news") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/impressum") ||
    pathname.startsWith("/cookies") ||
    pathname.startsWith("/datenschutz")
  ) return "logistics";
  return "alamira";
}

export default function Footer() {
  const pathname = usePathname();
  const siteKey = detectSiteKey(pathname);

  const [email, setEmail] = useState("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/admin/footer?siteKey=${siteKey}`).then((r) => (r.ok ? r.json() : null)),
    ]).then(([s, c]) => {
      if (s) setSettings(s);
      if (c) setConfig(c);
    }).catch(() => {});
  }, [siteKey]);

  const isLogistics = siteKey === "logistics";
  const accent = config?.accentColor || (isLogistics ? "#f06721" : "#868792");
  const darkBg = isLogistics ? "#1a214f" : "#0c0f23";
  const brandName = config?.brandName || settings?.siteName || "ALAMIRA";
  const brandDesc = config?.brandDescription || settings?.siteDescription || "";
  const copyright = config?.copyrightText || settings?.copyrightText || `© ${brandName} ${new Date().getFullYear()}. Alle Rechte vorbehalten.`;
  const topLinks = parseJSON<LinkItem[]>(config?.topLinks, []);
  const serviceLinks = parseJSON<LinkItem[]>(config?.serviceLinks, []);
  const workingHours = parseJSON<WorkingHour[]>(config?.workingHours, []);
  const newsletterLines = (config?.newsletterTitle || "Bleiben Sie\nmit uns verbunden").split("\n");

  const socialLinks = [
    {
      name: "Facebook",
      href: settings?.facebook || "https://facebook.com",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
      show: isValidUrl(settings?.facebook),
    },
    {
      name: "Instagram",
      href: settings?.instagram || "https://instagram.com",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
      show: isValidUrl(settings?.instagram),
    },
    {
      name: "YouTube",
      href: settings?.youtube || "https://youtube.com",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
      show: isValidUrl(settings?.youtube),
    },
    {
      name: "X (Twitter)",
      href: settings?.twitter || "https://x.com",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
      show: isValidUrl(settings?.twitter),
    },
  ].filter((s) => s.show || !settings);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSubscribeStatus("success");
        setEmail("");
      } else {
        setSubscribeStatus("error");
      }
    } catch {
      setSubscribeStatus("error");
    }
    setTimeout(() => setSubscribeStatus("idle"), 3000);
  };

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: darkBg }}>
      {/* Background decoration */}
      {isLogistics ? (
        <>
          <div className="absolute left-0 top-0 bottom-0 opacity-[0.04] pointer-events-none">
            <svg className="h-full w-40" viewBox="0 0 120 500" fill="none" preserveAspectRatio="xMinYMin slice">
              <circle cx="60" cy="100" r="80" stroke="white" strokeWidth="0.5" />
              <circle cx="60" cy="300" r="60" stroke="white" strokeWidth="0.5" />
              <circle cx="20" cy="450" r="40" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="absolute right-0 top-0 bottom-0 opacity-[0.04] pointer-events-none">
            <svg className="h-full w-40" viewBox="0 0 120 500" fill="none" preserveAspectRatio="xMaxYMin slice">
              <circle cx="60" cy="150" r="70" stroke="white" strokeWidth="0.5" />
              <circle cx="80" cy="350" r="50" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 bottom-0 opacity-10 pointer-events-none">
            <svg className="h-full w-32 text-white" viewBox="0 0 100 400" fill="none" preserveAspectRatio="xMinYMin slice">
              <path d="M20 400 Q30 300 25 200 Q35 100 30 0" stroke="currentColor" strokeWidth="1" fill="none" />
              <ellipse cx="25" cy="50" rx="10" ry="25" fill="currentColor" transform="rotate(-15 25 50)" />
              <ellipse cx="30" cy="100" rx="10" ry="25" fill="currentColor" transform="rotate(10 30 100)" />
              <ellipse cx="25" cy="150" rx="10" ry="25" fill="currentColor" transform="rotate(-10 25 150)" />
            </svg>
          </div>
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
            <svg className="h-full w-32 text-white" viewBox="0 0 100 400" fill="none" preserveAspectRatio="xMaxYMin slice">
              <path d="M80 400 Q70 300 75 200 Q65 100 70 0" stroke="currentColor" strokeWidth="1" fill="none" />
              <ellipse cx="75" cy="50" rx="10" ry="25" fill="currentColor" transform="rotate(15 75 50)" />
              <ellipse cx="70" cy="100" rx="10" ry="25" fill="currentColor" transform="rotate(-10 70 100)" />
              <ellipse cx="75" cy="150" rx="10" ry="25" fill="currentColor" transform="rotate(10 75 150)" />
            </svg>
          </div>
        </>
      )}

      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white leading-tight">
              {newsletterLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
              <div className="relative flex-grow sm:min-w-[250px] lg:min-w-[300px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={subscribeStatus === "loading"}
                  className="w-full px-5 py-3 sm:py-3.5 bg-white/10 border border-white/20 sm:rounded-l-full sm:rounded-r-none rounded-full text-white placeholder-white/60 focus:outline-none transition-colors disabled:opacity-50"
                  style={{ borderColor: subscribeStatus === "idle" ? undefined : accent }}
                />
              </div>
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="group flex items-center justify-center gap-2 text-white px-6 py-3 sm:py-3.5 sm:rounded-r-full sm:rounded-l-none rounded-full font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: accent }}
              >
                <span>
                  {subscribeStatus === "loading" ? "..." : subscribeStatus === "success" ? "Abonniert!" : subscribeStatus === "error" ? "Fehlgeschlagen" : "Abonnieren"}
                </span>
                {subscribeStatus === "idle" && (
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Working Hours */}
          {workingHours.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Öffnungszeiten</h3>
              <ul className="space-y-3">
                {workingHours.map((wh, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-medium min-w-[70px]" style={{ color: accent }}>{wh.day}:</span>
                    <span className="text-gray-400">{wh.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Logo & About */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              {(isLogistics ? settings?.logoLogistics : settings?.logoAlamira) || settings?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(isLogistics ? settings?.logoLogistics : settings?.logoAlamira) || settings?.logo || ""} alt={brandName} className="h-10 w-auto" />
              ) : isLogistics ? (
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect x="2" y="2" width="36" height="36" rx="8" stroke={accent} strokeWidth="1.5" />
                  <path d="M10 26h8v-6h4l6 6V14H10v12z" stroke={accent} strokeWidth="1.5" fill="none" />
                  <circle cx="14" cy="28" r="2.5" stroke={accent} strokeWidth="1.5" />
                  <circle cx="26" cy="28" r="2.5" stroke={accent} strokeWidth="1.5" />
                </svg>
              ) : (
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke={accent} strokeWidth="1" />
                  <circle cx="20" cy="20" r="12" stroke={accent} strokeWidth="1" />
                  <circle cx="20" cy="20" r="6" fill={accent} />
                  <line x1="20" y1="2" x2="20" y2="8" stroke={accent} strokeWidth="1" />
                  <line x1="20" y1="32" x2="20" y2="38" stroke={accent} strokeWidth="1" />
                  <line x1="2" y1="20" x2="8" y2="20" stroke={accent} strokeWidth="1" />
                  <line x1="32" y1="20" x2="38" y2="20" stroke={accent} strokeWidth="1" />
                </svg>
              )}
              <span className="text-white text-xl font-serif tracking-wider">{brandName}</span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">{brandDesc}</p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={
                    index === 2
                      ? { backgroundColor: accent, color: darkBg }
                      : { backgroundColor: "rgba(255,255,255,0.1)", color: "white" }
                  }
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Top Links */}
          {topLinks.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Wichtige Links</h3>
              <ul className="space-y-3">
                {topLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-400 hover:transition-colors text-sm" style={{ ["--hover-color" as string]: accent }} onMouseEnter={(e) => (e.currentTarget.style.color = accent)} onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Links */}
          {serviceLinks.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Unsere Leistungen</h3>
              <ul className="space-y-3">
                {serviceLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-400 hover:transition-colors text-sm" onMouseEnter={(e) => (e.currentTarget.style.color = accent)} onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-500 text-sm text-center sm:text-left">{copyright}</p>
            <div className="flex items-center justify-center sm:justify-end gap-4 text-sm">
              <Link href="/impressum" className="text-gray-400 hover:text-white transition-colors">
                Impressum
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
