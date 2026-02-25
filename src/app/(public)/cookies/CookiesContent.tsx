"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax;Secure`;
}

export default function CookiesContent() {
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    const stored = getCookie("cookie_preferences");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return { essential: true, analytics: false, marketing: false, functional: false };
  });

  const cookieCategories = useMemo(
    () => [
      { key: "essential" as const, label: "Essenziell", locked: true, description: "Notwendig für die Grundfunktionen der Website." },
      { key: "functional" as const, label: "Funktional", locked: false, description: "Ermöglichen zusätzliche Funktionen und Personalisierung." },
      { key: "analytics" as const, label: "Analyse", locked: false, description: "Helfen uns, die Nutzung der Website zu verstehen und zu verbessern." },
      { key: "marketing" as const, label: "Marketing", locked: false, description: "Werden genutzt, um relevante Inhalte und Werbung anzuzeigen." },
    ],
    []
  );

  const savePreferences = () => {
    setCookie("cookie_consent", "true", 365);
    setCookie("cookie_preferences", JSON.stringify({ ...preferences, essential: true }), 365);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    setPreferences({ essential: true, functional: true, analytics: true, marketing: true });
    setTimeout(savePreferences, 0);
  };

  const rejectAll = () => {
    setPreferences({ essential: true, functional: false, analytics: false, marketing: false });
    setTimeout(savePreferences, 0);
  };

  return (
    <main className="bg-[#f4f4f4] min-h-screen">
      {/* Hero */}
      <section className="bg-[#1a214f] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <a
              href="/logistics-landing"
              className="inline-flex items-center gap-2 text-[#f06721] hover:text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück zu Logistics
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-6 h-6 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2m2 0V8a4 4 0 118 0v4m-8 0h8" />
            </svg>
            <span className="text-[#f06721] text-sm font-medium tracking-wider uppercase">Cookie-Richtlinie</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Cookies</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hier können Sie Ihre Cookie-Einstellungen verwalten. Details zum Datenschutz finden Sie in unserer{" "}
            <Link href="/datenschutz" className="text-white underline underline-offset-4 hover:text-gray-200">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Ihre Cookie-Einstellungen</h2>
            <p className="text-sm text-gray-600 mb-6">
              Sie können jederzeit auswählen, welche Cookie-Kategorien Sie zulassen möchten. Essenzielle Cookies sind immer aktiv.
            </p>

            <div className="space-y-3">
              {cookieCategories.map((cat) => (
                <div key={cat.key} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                      {cat.locked && (
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                          Immer aktiv
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cat.description}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={preferences[cat.key]}
                      disabled={cat.locked}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, [cat.key]: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-10 h-6 rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        cat.locked
                          ? "bg-gray-400 cursor-not-allowed after:translate-x-4"
                          : preferences[cat.key]
                          ? "bg-gray-900 after:translate-x-4"
                          : "bg-gray-300"
                      }`}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={savePreferences}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              >
                {saved ? "Gespeichert" : "Einstellungen speichern"}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                Nur essenzielle
              </button>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Was sind Cookies?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Sie helfen dabei, bestimmte Funktionen
              bereitzustellen, Einstellungen zu speichern und die Nutzung der Website zu analysieren.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

