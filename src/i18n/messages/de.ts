import type { Messages } from './en';

/**
 * German UI copy. Typed as `Messages`, so a key missing here (or one that does not
 * exist in `en.ts`) fails `tsc`.
 *
 * Voice: formal "Sie", short sentences, no hype — the same quietly premium tone
 * as the English. Brand and product names stay English ("Saver Miles", "Weekly
 * Lookup Alert"). Nav labels are kept as short as the English ones: the desktop
 * bar has no width to spare at the `md` breakpoint.
 */
const de: Messages = {
  meta: {
    tagline: 'Prämienflüge, gefunden von einem echten Spezialisten statt von einem Algorithmus',
    organization:
      'Ein manueller, von Menschen geführter Concierge-Service für Punkte und Meilen. Ein echter Spezialist durchsucht die Prämienverfügbarkeit von Hand in über 30 Vielfliegerprogrammen und übergibt Ihnen einen buchbaren Sitzplatz mit den exakten Punktekosten.',
  },

  links: {
    individual: 'Privat',
    business: 'Business',
    alerts: 'Alerts',
    pricing: 'Preise',
    calculator: 'Rechner',
    blog: 'Blog',
    guides: 'Ratgeber',
    deals: 'Deals',
    howItWorks: 'So funktioniert’s',
    about: 'Über uns',
    results: 'Ergebnisse',
    contact: 'Kontakt',
    privacy: 'Datenschutz',
    terms: 'AGB',
    cookies: 'Cookies',
  },

  navGroups: {
    product: 'Angebot',
    read: 'Lesen',
    company: 'Unternehmen',
    legal: 'Rechtliches',
  },

  nav: {
    home: 'Saver Miles Startseite',
    getStarted: 'Loslegen',
    menu: 'Menü',
    closeMenu: 'Menü schließen',
    siteMenu: 'Seitenmenü',
    theme: 'Design',
  },

  footer: {
    blurb:
      'Prämienreisen sind kompliziert. Wir stellen Ihnen einen Spezialisten zur Seite, der über 30 Vielfliegerprogramme durchsucht und einen Sitzplatz findet, der die Punkte wert ist.',
    newsletterHeading: 'Punkte-Wissen, gelegentlich',
    newsletterButton: 'Abonnieren',
    copyright: '© {year} Saver Miles',
  },

  theme: {
    colorMode: 'Farbmodus',
    light: 'Hell',
    dark: 'Dunkel',
    mono: 'Mono',
    current: 'Design: {current}',
    cycle: 'Design: {current} – zu {next} wechseln',
  },

  language: {
    label: 'Sprache',
    names: { en: 'English', de: 'Deutsch' },
  },

  consent: {
    dialog: 'Cookie-Einwilligung',
    eyebrow: 'Cookies',
    body: 'Wir verwenden notwendige Cookies für den Betrieb der Website und Google Analytics, um den Gesamtverkehr zu messen und die Website zu verbessern. Niemals Werbung. Mehr dazu in unserer <link>Cookie-Richtlinie</link>.',
    decline: 'Ablehnen',
    accept: 'Akzeptieren',
    preferences: 'Cookie-Einstellungen',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    eyebrow: '404',
    body: 'Diese Seite gibt es nicht oder sie ist umgezogen. Die Startseite ist ein guter Ausgangspunkt.',
    home: 'Zur Startseite',
  },
};

export default de;
