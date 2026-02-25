"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_PREFERENCES_KEY = "cookie_preferences";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax;Secure`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = getCookie(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }

    const saved = getCookie(COOKIE_PREFERENCES_KEY);
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch { /* use defaults */ }
    }
  }, []);

  const saveConsent = useCallback((prefs: CookiePreferences) => {
    setCookie(COOKIE_CONSENT_KEY, "true", 365);
    setCookie(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), 365);
    setPreferences(prefs);
    setVisible(false);
  }, []);

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true, functional: true });
  };

  const rejectAll = () => {
    saveConsent({ ...DEFAULT_PREFERENCES });
  };

  const saveSelected = () => {
    saveConsent({ ...preferences, essential: true });
  };

  if (!visible) return null;

  const categories = [
    {
      key: "essential" as const,
      label: "Essenziell",
      description: "Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.",
      locked: true,
    },
    {
      key: "functional" as const,
      label: "Funktional",
      description: "Ermöglichen erweiterte Funktionen wie Spracheinstellungen und personalisierte Inhalte.",
      locked: false,
    },
    {
      key: "analytics" as const,
      label: "Analyse",
      description: "Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um das Nutzererlebnis zu verbessern.",
      locked: false,
    },
    {
      key: "marketing" as const,
      label: "Marketing",
      description: "Werden verwendet, um Besuchern relevante Werbung und Marketingkampagnen anzuzeigen.",
      locked: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={() => {}} />

      <div className="relative pointer-events-auto w-full max-w-2xl mx-4 mb-4 sm:mb-0 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Datenschutzeinstellungen</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
            Sie können Ihre Einstellungen jederzeit anpassen. Weitere Informationen finden Sie in unserer{" "}
            <Link href="/datenschutz" className="text-gray-900 underline underline-offset-2 hover:text-gray-700">
              Datenschutzerklärung
            </Link>{" "}
            und in der{" "}
            <Link href="/cookies" className="text-gray-900 underline underline-offset-2 hover:text-gray-700">
              Cookie-Richtlinie
            </Link>
            .
          </p>
        </div>

        {/* Cookie Categories (expandable) */}
        {showDetails && (
          <div className="px-6 pb-2 max-h-[45vh] overflow-y-auto">
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
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
                      className={`w-9 h-5 rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                        cat.locked
                          ? "bg-gray-400 cursor-not-allowed after:translate-x-full"
                          : preferences[cat.key]
                          ? "bg-gray-800 after:translate-x-full"
                          : "bg-gray-300"
                      }`}
                    />
                  </label>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{cat.label}</span>
                      {cat.locked && (
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                          Immer aktiv
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2">
            {showDetails ? (
              <>
                <button
                  onClick={saveSelected}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Alle akzeptieren
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Nur essenzielle
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Einstellungen
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
