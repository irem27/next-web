"use client";

import { useState } from "react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax;Secure`;
}

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function DatenschutzContent() {
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    const stored = getCookie("cookie_preferences");
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fallback */ }
    }
    return { essential: true, analytics: false, marketing: false, functional: false };
  });

  const savePreferences = () => {
    setCookie("cookie_consent", "true", 365);
    setCookie("cookie_preferences", JSON.stringify({ ...preferences, essential: true }), 365);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    {
      id: "overview",
      title: "1. Datenschutz auf einen Blick",
      content: `
        <h4>Allgemeine Hinweise</h4>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
        <h4>Datenerfassung auf dieser Website</h4>
        <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
        <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
        <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
        <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z.B. über ein Kontaktformular). Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>
      `,
    },
    {
      id: "hosting",
      title: "2. Hosting",
      content: `
        <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
        <p>Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.</p>
      `,
    },
    {
      id: "general",
      title: "3. Allgemeine Hinweise und Pflichtinformationen",
      content: `
        <h4>Datenschutz</h4>
        <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
        <h4>Hinweis zur verantwortlichen Stelle</h4>
        <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website entnehmen Sie bitte dem Impressum.</p>
        <h4>Speicherdauer</h4>
        <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.</p>
        <h4>Ihre Rechte (DSGVO)</h4>
        <ul>
          <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.</li>
          <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht, die Berichtigung unrichtiger Daten zu verlangen.</li>
          <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie haben das Recht, die Löschung Ihrer Daten zu verlangen.</li>
          <li><strong>Recht auf Einschränkung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer Daten zu verlangen.</li>
          <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, Ihre Daten in einem gängigen Format zu erhalten.</li>
          <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das Recht, der Verarbeitung Ihrer Daten zu widersprechen.</li>
          <li><strong>Beschwerderecht:</strong> Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren.</li>
        </ul>
      `,
    },
    {
      id: "cookies",
      title: "4. Cookies",
      content: `
        <p>Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden und die Ihr Browser speichert.</p>
        <h4>Essenziell</h4>
        <p>Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. Hierzu gehören z.B. Cookies für die Speicherung Ihrer Cookie-Einstellungen und Session-Cookies. Diese Cookies können nicht deaktiviert werden.</p>
        <h4>Funktional</h4>
        <p>Funktionale Cookies ermöglichen erweiterte Funktionen und Personalisierung, wie z.B. Spracheinstellungen. Ohne diese Cookies stehen einige Funktionen möglicherweise nicht zur Verfügung.</p>
        <h4>Analyse</h4>
        <p>Analyse-Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. Alle Daten werden anonymisiert erfasst und dienen ausschließlich der Verbesserung unserer Website.</p>
        <h4>Marketing</h4>
        <p>Marketing-Cookies werden verwendet, um Besuchern auf Websites zu folgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer sind.</p>
        <p>Sie können Ihre Cookie-Einstellungen jederzeit über den nachfolgenden Bereich ändern:</p>
      `,
    },
    {
      id: "contact-form",
      title: "5. Kontaktformular",
      content: `
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>
        <p>Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt, oder auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</p>
      `,
    },
    {
      id: "newsletter",
      title: "6. Newsletter",
      content: `
        <p>Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse. Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</p>
        <p>Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns hinterlegten Daten werden von uns bis zu Ihrer Austragung aus dem Newsletter bei uns gespeichert und nach Abbestellung gelöscht.</p>
      `,
    },
  ];

  const cookieCategories = [
    { key: "essential" as const, label: "Essenziell", locked: true },
    { key: "functional" as const, label: "Funktional", locked: false },
    { key: "analytics" as const, label: "Analyse", locked: false },
    { key: "marketing" as const, label: "Marketing", locked: false },
  ];

  return (
    <main className="bg-[#f4f4f4] min-h-screen">
      {/* Hero */}
      <section className="bg-[#0c0f23] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-6 h-6 text-[#868792]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[#868792] text-sm font-medium tracking-wider uppercase">DSGVO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Datenschutzerklärung</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Informationen zum Datenschutz und zur Verwendung von Cookies auf unserer Website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Table of Contents */}
          <nav className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Inhaltsverzeichnis</h3>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 scroll-mt-24"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{s.title}</h2>
                <div
                  className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:text-base prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-800 prose-ul:my-3 prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: s.content }}
                />

                {/* Cookie settings inline for the cookies section */}
                {s.id === "cookies" && (
                  <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Cookie-Einstellungen verwalten</h4>
                    <div className="space-y-3">
                      {cookieCategories.map((cat) => (
                        <label
                          key={cat.key}
                          className="flex items-center justify-between gap-4 py-2"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {cat.label}
                            {cat.locked && (
                              <span className="ml-2 text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                                Immer aktiv
                              </span>
                            )}
                          </span>
                          <div className="relative inline-flex items-center">
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
                              className={`w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                                cat.locked
                                  ? "bg-gray-400 cursor-not-allowed after:translate-x-full"
                                  : preferences[cat.key]
                                  ? "bg-gray-800 after:translate-x-full"
                                  : "bg-gray-300"
                              }`}
                              onClick={() => {
                                if (!cat.locked) {
                                  setPreferences((prev) => ({ ...prev, [cat.key]: !prev[cat.key] }));
                                }
                              }}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={savePreferences}
                      className="mt-4 px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      {saved ? "✓ Gespeichert" : "Einstellungen speichern"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Last Updated */}
          <p className="text-center text-xs text-gray-400 mt-10">
            Stand: Februar 2026
          </p>
        </div>
      </section>
    </main>
  );
}
