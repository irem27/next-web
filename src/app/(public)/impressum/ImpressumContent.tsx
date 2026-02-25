"use client";

import { useEffect, useState } from "react";

type Settings = {
  siteName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export default function ImpressumContent() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  const siteName = settings?.siteName || "Unternehmen";

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3zm-3 7h12a2 2 0 002-2V8a2 2 0 00-2-2H9a3 3 0 00-3 3v6a2 2 0 002 2z" />
            </svg>
            <span className="text-[#f06721] text-sm font-medium tracking-wider uppercase">Rechtliches</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Impressum</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Anbieterkennzeichnung und Kontaktinformationen.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-gray-900">{siteName}</p>
              <p className="text-gray-600 whitespace-pre-line">{settings?.address || "-"}</p>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-semibold text-gray-900">E-Mail</dt>
                <dd className="text-gray-600">{settings?.email || "-"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Telefon</dt>
                <dd className="text-gray-600">{settings?.phone || "-"}</dd>
              </div>
            </dl>
          </article>

          <article className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Weitere Angaben</h2>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>
                <span className="font-semibold text-gray-900">Umsatzsteuer-ID:</span>{" "}
                <span>–</span>
              </li>
              <li>
                <span className="font-semibold text-gray-900">Handelsregister:</span>{" "}
                <span>–</span>
              </li>
              <li>
                <span className="font-semibold text-gray-900">Vertretungsberechtigte(r):</span>{" "}
                <span>–</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              Hinweis: Bitte ersetzen Sie die Platzhalter (–) mit Ihren verbindlichen Unternehmensangaben.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

