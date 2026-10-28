import type { Messages } from './en';

/**
 * German UI copy. Typed as `Messages`, so a key missing here (or one that does not
 * exist in `en.ts`) fails `tsc`.
 *
 * Voice: formal "Sie", short sentences, no hype — the same quietly premium tone
 * as the English. Brand and product names stay English ("Saver Miles", "Weekly
 * Lookup Alert"). Nav labels are kept as short as the English ones: the desktop
 * bar has no width to spare at the `md` breakpoint. Terms follow
 * docs/i18n/glossary-de.md; prices stay USD in German format (`4,99 $`).
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

  common: {
    automatedLabel: 'Automatisiert – bitte lesen',
    cabins: { economy: 'Economy', premium: 'Premium Economy', business: 'Business', first: 'First' },
    points: '{points} Pkt.',
    startFlightRequest: 'Flug-Anfrage starten',
    seeFullPricing: 'Alle Preise ansehen',
    seeAlertPlans: 'Alert-Pläne ansehen',
    seeFullProcess: 'Den ganzen Ablauf ansehen →',
  },

  stats: [
    { value: '14+', label: 'Jahre Erfahrung' },
    { value: '23.000+', label: 'Suchen von Hand' },
    { value: '30+', label: 'Vielfliegerprogramme' },
  ],

  report: {
    regionsLabel: 'Beispielhafte Prämienbuchungen nach Region',
    regions: {
      asia: 'Asien',
      europe: 'Europa',
      australia: 'Australien',
      africa: 'Afrika',
      americas: 'Amerika',
    },
    example: 'Beispielbericht · #{id}',
    confirmed: 'Bestätigt',
    taxes: '{taxes} Gebühren',
    retailFare: 'Barpreis',
    youPayPoints: ' · Sie zahlen mit Punkten',
    transferFrom: 'Transfer von',
    seats: { one: '{n} Platz · bestätigt verfügbar', other: '{n} Plätze · bestätigt verfügbar' },
    verified: 'Von Hand geprüft',
  },

  caseStudy: {
    eyebrow: 'Fallbeispiel',
    fallbackTitle: 'Fallbeispiel',
    allResults: '← Alle Ergebnisse',
    from: 'Von',
    to: 'Nach',
    cabin: 'Reiseklasse',
    pointsUsed: 'Eingesetzte Punkte',
    program: 'Programm',
    seeDetails: 'Details ansehen',
    bodyPending: 'Der ausführliche Bericht zu dieser Einlösung folgt in Kürze.',
  },

  lead: {
    close: 'Schließen',
    audience: {
      eyebrow: 'Loslegen',
      title: 'Buchen Sie privat oder für ein Unternehmen?',
      hint: 'Wählen Sie eine Option – wir stellen Ihnen dann nur die passenden Fragen.',
      individual: { label: 'Ich buche privat', hint: 'Für mich selbst' },
      business: { label: 'Ich buche für ein Unternehmen', hint: 'Ich organisiere Firmenreisen' },
    },
    step: 'Schritt {n} von {total}',
    back: 'Zurück',
    next: 'Weiter',
    sending: 'Wird gesendet',
    choose: 'Bitte wählen …',
    chooseOne: 'Bitte wählen …',
    emailPlaceholder: 'name@beispiel.de',
    phonePlaceholder: '+49 170 0000000',
    notes: {
      label: 'Notizen / Wünsche (optional)',
      placeholder: 'Sonstiges – Airlines, die Sie meiden möchten, Anlass, Umsteigezeiten …',
    },
    consent: 'Mit dem Absenden stimmen Sie unserer <link>Datenschutzerklärung</link> zu.',
    errors: {
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      contact: 'Bitte geben Sie eine WhatsApp- oder Telefonnummer an, damit wir Sie erreichen können.',
      route: 'Bitte sagen Sie uns, wohin Sie reisen möchten.',
      generic: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    },
    individual: {
      trip: {
        title: 'Wohin und wann?',
        hint: 'Ihr Ziel und ein ungefährer Zeitraum – genaue Daten sind optional.',
        where: 'Wohin?',
        wherePlaceholder: 'z. B. Frankfurt → Tokio oder FRA–HND',
        nearby: 'Bei einem guten Angebot bin ich auch für Flughäfen in der Nähe offen',
        tripType: 'Reiseart',
        when: 'Wann? (optional)',
        whenOneWay: 'z. B. Mitte März oder ein genaues Datum',
        whenRoundTrip: 'z. B. Mitte März, ca. 7 Nächte, oder genaue Daten',
        flexibility: 'Wie flexibel sind Ihre Reisedaten?',
      },
      tripTypes: { round_trip: 'Hin & zurück', one_way: 'Nur Hinflug' },
      flexibility: {
        flexible: 'Flexibel – finden Sie das beste Angebot',
        fixed: 'Fest – genau diese Daten',
        unsure: 'Noch unklar',
      },
      travelers: {
        title: 'Wer fliegt?',
        hint: 'Anzahl der Reisenden und die gewünschte Reiseklasse.',
        count: 'Wie viele Reisende?',
        cabin: 'Welche Reiseklasse?',
      },
      travelerOptions: {
        '1': '1 Person',
        '2': '2 Personen',
        '3': '3 Personen',
        '4': '4 Personen',
        '5': '5 Personen',
        '6+': '6+ Personen',
      },
      cabinOptions: {
        economy: 'Economy',
        premium: 'Premium Economy',
        business: 'Business',
        first: 'First',
        any: 'Egal / bestes Angebot',
      },
      points: {
        title: 'Welche Punkte haben Sie?',
        hint: 'Ungefähre Angaben genügen. Nicht sicher? Sagen Sie es einfach – das hilft Ihrem Spezialisten, das beste Angebot zu finden.',
        label: 'Punkte & Meilen (optional)',
        placeholder: 'z. B. ca. 120.000 Amex MR, 80.000 Miles & More – oder „weiß nicht“',
      },
      contact: {
        title: 'Wohin sollen wir Ihre Ergebnisse schicken?',
        hint: 'Wir senden Ihnen einen Screenshot und den genauen Punktepreis per E-Mail und melden uns, falls eine kurze Rückfrage nötig ist.',
        email: 'E-Mail',
        phone: 'WhatsApp oder Telefon',
      },
      submit: 'Flug-Anfrage senden',
      successTitle: 'Wir sind dran.',
      successBody:
        'Ihrer Strecke wird gerade ein Spezialist zugewiesen, der Ihnen die Ergebnisse per E-Mail schickt – meist innerhalb eines Tages. Kein Konto nötig, und das Suchen kostet Sie nichts.',
    },
    business: {
      spend: {
        title: 'Die Reisen Ihres Teams',
        hint: 'Grobe Zahlen genügen – so kann ein Spezialist den Umfang einschätzen.',
        label: 'Ungefähre jährliche Flugausgaben?',
      },
      spendOptions: {
        'Under $50k': 'Unter 50.000 $',
        '$50k–$150k': '50.000–150.000 $',
        '$150k–$500k': '150.000–500.000 $',
        '$500k+': 'Über 500.000 $',
        'Not sure': 'Weiß nicht',
      },
      routes: {
        title: 'Wohin fliegt Ihr Team?',
        hint: 'Strecken, Reiseklassen und Häufigkeit – so viel oder so wenig, wie Sie wissen.',
        label: 'Strecken & Reiseklassen',
        placeholder: 'z. B. FRA/MUC → New York & Singapur, Business Class, ca. monatlich',
      },
      budget: {
        title: 'Punkte, Meilen oder Budget vorhanden?',
        hint: 'Für Reisen gebündelte Punkte oder ein Barbudget. Optional.',
        label: 'Punkte / Budget (optional)',
        placeholder: 'z. B. 2 Mio. Amex Business MR oder ca. 8.000 $ Budget',
      },
      call: {
        title: 'Lassen Sie uns telefonieren',
        hint: 'Ein Spezialist meldet sich, um Ihren Bedarf zu klären.',
        email: 'Geschäftliche E-Mail',
        emailPlaceholder: 'name@firma.de',
        phone: 'Telefon (optional)',
        calendar:
          'Lieber selbst einen Termin wählen? Die Kalenderbuchung kommt bald – bis dahin meldet sich ein Spezialist per E-Mail zur Terminabsprache.',
      },
      submit: 'Rückruf anfordern',
      successTitle: 'Danke – wir melden uns.',
      successBody:
        'Ein Spezialist meldet sich, um Ihren Bedarf zu klären und ein Gespräch zu vereinbaren – meist innerhalb eines Tages.',
    },
    done: 'Fertig',
    home: 'Zur Startseite',
  },

  newsletter: {
    subscribe: 'Abonnieren',
    airportLabel: 'Heimatflughafen',
    airportPlaceholder: 'Heimatflughafen (z. B. FRA)',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'name@beispiel.de',
    consent: 'Mit dem Abonnieren stimmen Sie unserer <link>Datenschutzerklärung</link> zu.',
    errors: {
      airport: 'Bitte geben Sie Ihren Heimatflughafen an.',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      generic: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    },
    success: 'Sie sind dabei – schauen Sie in Ihr Postfach.',
    already: 'Sie stehen bereits auf der Liste.',
    inline: {
      title: 'Prämienplätze auf Ihren Strecken, jeden Montag per E-Mail.',
      body: 'Nennen Sie uns Ihren Heimatflughafen – wir zeigen Ihnen, wohin Ihre Punkte Sie von dort bringen. Der Newsletter erscheint auf Englisch.',
      notify: 'Benachrichtigen',
      confirm: 'Bestätigen',
      errors: {
        airport: 'Bitte zuerst Ihren Heimatflughafen angeben.',
        email: 'Bitte eine gültige E-Mail-Adresse eingeben.',
        generic: 'Etwas ist schiefgelaufen.',
      },
      success: 'Sie sind dabei – Prämienplätze, jeden Montag.',
      watching:
        'Wir beobachten {airport} – wohin sollen wir es schicken? Mit dem Bestätigen stimmen Sie unserer <link>Datenschutzerklärung</link> zu.',
    },
    popup: {
      dialog: 'Newsletter-Anmeldung',
      dismiss: 'Schließen',
      eyebrow: 'Jeden Montag per E-Mail',
      title: 'Sie beobachten eine Strecke? Wir auch.',
      body: 'Nennen Sie uns Ihren Heimatflughafen, und wir schicken Ihnen, wohin Ihre Punkte Sie von dort wirklich bringen – geprüfte Plätze, einmal pro Woche. Der Newsletter erscheint auf Englisch.',
      button: 'Benachrichtigen',
    },
  },

  checkout: {
    intervalLabel: 'Abrechnungszeitraum',
    monthly: 'monatlich',
    annual: 'jährlich',
    perMonth: '/ Monat',
    perYear: '/ Jahr',
    twoMonthsFree: '2 Monate gratis',
    emailLabel: 'E-Mail (optional)',
    emailPlaceholder: 'name@beispiel.de',
    subscribe: 'Abonnieren',
    secure: 'Sichere Bezahlung über Stripe. Jederzeit kündbar.',
    redirecting: 'Weiterleitung …',
    notConfigured: 'Der Checkout ist noch nicht eingerichtet – dieser Preis fehlt.',
    error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
  },

  products: {
    business: {
      name: 'Business Search',
      price: 'Individuell',
      priceUnit: 'auf Anfrage',
      tagline: 'Der Einstieg auf Kontoebene für Firmenreisen.',
      description:
        'Schicken Sie uns eine Strecke und Ihren Bedarf. Ein Spezialist durchsucht über 30 Vielfliegerprogramme und schickt Ihnen die Ergebnisse – mit Screenshots und dem genauen Punktepreis.',
      features: [
        'Ein Spezialist durchsucht über 30 Programme für Sie',
        'Screenshots und der genaue Punktepreis',
        'Preis passend zu den Reisen Ihres Teams',
      ],
      note: 'Sagen Sie uns, was Ihr Team braucht – wir melden uns mit einem Angebot.',
      cta: 'Business-Suche starten',
    },
    individual: {
      name: 'Individual Search',
      price: '{deposit}',
      priceUnit: 'Anzahlung zum Start',
      priceSub:
        '+ {successFee} pro Person und Richtung – erst fällig, wenn wir einen buchbaren Platz bestätigen.',
      tagline: 'Das Honorar zahlen Sie nur, wenn Ihr Spezialist einen echten Platz findet.',
      description:
        'Ein Spezialist setzt Ihre vorhandenen Punkte in jedem passenden Programm ein. Das Honorar von {successFee} ist pauschal – gleich für Economy, Business oder First.',
      features: [
        '{successFee} pauschales Erfolgshonorar, jede Reiseklasse',
        'Von Ihrem Spezialisten geprüft, bevor das Honorar fällig wird',
        'Honorar nur bei einem bestätigten, buchbaren Platz',
      ],
      footnote: 'Nichts Buchbares gefunden? Ihre Anzahlung von {deposit} erhalten Sie vollständig zurück.',
      cta: 'Ihre Suche starten',
    },
    weekly: {
      name: 'Weekly Lookup Alert',
      price: '{weeklyMonthly}',
      priceAnnual: '{weeklyAnnual}',
      priceUnit: '/ Monat',
      tagline: 'Ein frühes Signal für Strecken, die Sie locker im Blick behalten.',
      description:
        'Jeden Montag, 12 Monate lang, ein Scan Ihrer Strecken: welche Airlines Prämienplätze zeigen, welche Kartenprogramme dorthin übertragen, die Daten und die Punkte. Günstig genug zum Einrichten und Vergessen – ein Hinweis, keine Buchung.',
      features: [
        'Jeden Montag, 12 Monate lang',
        'Airlines, Transferpartner, Daten, Punkte',
        'Jederzeit kündbar',
      ],
      disclosure:
        'Automatisierter Scan – zeigt Verfügbarkeit, keinen bestätigten Platz, und manche Plätze können Phantomplätze sein. Für eine Buchung, auf die Sie sich verlassen können, nutzen Sie den Human Search Alert oder eine einmalige Suche.',
      cta: 'Wöchentliche Alerts buchen',
    },
    human: {
      name: 'Human Search Alert',
      price: '{humanMonthly}',
      priceAnnual: '{humanAnnual}',
      priceUnit: '/ Monat',
      tagline: 'Ein Spezialist bestätigt den Platz, bevor Sie von uns hören.',
      description:
        'Dieselbe Sorgfalt wie bei unserer einmaligen Suche, als laufender Service. Ein Spezialist prüft Ihre Strecken in jedem Zyklus und schickt geprüfte Ergebnisse – das Gegenteil eines automatisierten Scans.',
      features: [
        'Suche durch einen Spezialisten, in jedem Zyklus',
        'Geprüfte, buchbare Plätze statt roher Feed-Daten',
        'Monatlich, jederzeit kündbar',
      ],
      cta: 'Human Alerts buchen',
    },
  },

  home: {
    title: 'Saver Miles – Ihr persönlicher Prämienflug-Concierge',
    hero: {
      eyebrow: 'Ihr eigener Punkte-Spezialist',
      title: 'Das Prämiensystem ist kaputt. Ihr Spezialist bringt es zum Laufen.',
      body: 'Ein echter Spezialist nutzt jedes große Vielfliegerprogramm mit den Punkten, die Sie bereits haben – und übergibt Ihnen einen Platz, der sich lohnt, mit den genauen Kosten für die Buchung.',
      secondary: 'So funktioniert’s',
      noCard: 'Keine Kreditkarte, keine Verpflichtung.',
    },
    fork: {
      individual: {
        kicker: 'Ich buche für mich',
        title: 'Geben Sie Ihre Punkte einem Spezialisten – und vergessen Sie das Rätselraten.',
        body: 'Sie haben die Punkte, aber keinen klaren Weg, sie gut einzusetzen. Wir stellen Ihnen einen Spezialisten zur Seite, der den tatsächlich buchbaren Platz findet und Ihnen genau sagt, wie Sie ihn sichern.',
        cta: 'Für Privatreisende',
      },
      business: {
        kicker: 'Ich organisiere Firmenreisen',
        title: 'Übergeben Sie die Reisen Ihres Teams einem Spezialisten, der die Punkte arbeiten lässt.',
        body: 'Suche auf Kontoebene für Teams, die oft fliegen. Ein Spezialist kümmert sich um die Programme, die Plätze und die Nachweise – Ihr Reisebudget reicht weiter, und auf Ihrer Seite muss niemand einen Finger rühren.',
        cta: 'Für Unternehmen',
      },
    },
    pricingBand: {
      eyebrow: 'Klare Preise',
      title: '{successFee} pro Person und Richtung. Alle Reiseklassen.',
      titleAccent: 'Nur wenn Sie fliegen.',
      body: 'Eine Anzahlung von {deposit} startet Ihre Suche – vollständig erstattet, wenn wir nichts Buchbares finden. Das Erfolgshonorar von {successFee} wird erst fällig, wenn Ihr Platz bestätigt ist.',
    },
    alertsTeaser: {
      eyebrow: 'Alerts',
      title: 'Noch nicht bereit zu buchen? Wir behalten Ihre Strecken für Sie im Blick.',
      weeklyPrice: '{weeklyMonthly}/Monat',
      weeklyBody: 'Ein automatisierter wöchentlicher Scan Ihrer Strecken – breit und günstig.',
      weeklyNote:
        'Automatisierter Scan: Manche angezeigten Plätze können Phantomplätze sein, die bei der Buchung nicht halten. Er kann keinen Platz bestätigen und Ihnen kein buchungsreifes Ergebnis liefern.',
      badge: 'Am genauesten',
      humanPrice: '{humanMonthly}/Monat',
      humanBody:
        'Ein Spezialist prüft Ihre Strecken in jedem Zyklus – das Gegenteil eines automatisierten Feeds. <strong>Er öffnet die Buchung und bestätigt den Platz, bevor Sie von uns hören.</strong>',
      compare: 'Alert-Pläne vergleichen →',
    },
    compare: {
      eyebrow: 'Automatisiert vs. von Hand',
      title: 'Die Tools zeigen Ihnen Verfügbarkeit. Ihr Spezialist übergibt Ihnen einen Platz, den Sie buchen können.',
      ghostHeading: 'Was automatisierte Tools zeigen',
      realHeading: 'Was ein Spezialist liefert',
      ghost: [
        'Zwischengespeicherte Verfügbarkeit, die sich womöglich nicht buchen lässt',
        'Phantomplätze, die beim Bezahlen verschwinden',
        'Ein Programm nach dem anderen, an den Daten, die Ihnen gerade eingefallen sind',
        'Ein Screenshot einer Suche, kein Platz',
      ],
      real: [
        'Ein Spezialist öffnet die Buchung und bestätigt, dass Ihr Platz wirklich da ist',
        'Der Nachweis in der Hand: der genaue Platz und der Punktepreis',
        'Über 30 Programme und Transferpartner, für Sie durchgearbeitet',
        'Echte Verfügbarkeit an Ihren Daten – oder ein ehrliches Nein',
      ],
    },
    deals: {
      eyebrow: 'Wohin Ihre Punkte reichen',
      title: 'Was Ihre Punkte wirklich wert sind.',
      body: 'Typische Prämienpreise in Business und First, die ein Spezialist auf diesen Strecken findet – neben dem Barpreis, den Sie sonst zahlen würden. Ihre Daten und Ihr Punktestand entscheiden über die echte Zahl; eine Suche findet sie.',
      cities: {
        tokyo: 'Tokio',
        paris: 'Paris',
        sydney: 'Sydney',
        london: 'London',
        lisbon: 'Lissabon',
      },
      retail: 'Barpreis',
      typicalRate: {
        economy: 'typischer Economy-Preis',
        premium: 'typischer Premium-Economy-Preis',
        business: 'typischer Business-Preis',
        first: 'typischer First-Preis',
      },
      from: 'ab',
      pts: 'Pkt.',
      tileLabel: '{city}: {from} nach {to}, {cabin}, ab {points} Punkten – Flug-Anfrage starten',
      footnote:
        'Beispielhafte typische Prämienpreise, kein Live-Verfügbarkeits-Feed. Ein echter Mensch bestätigt den Platz, bevor Sie buchen.',
    },
    caseStudies: {
      eyebrow: 'Nachweise',
      title: 'Diese Plätze hat ein Spezialist gefunden.',
      body: 'Keine Schätzung eines Algorithmus. Echte Buchungen, die ein Spezialist bestätigt und mit Erlaubnis der Reisenden geteilt hat.',
      more: 'Weitere Ergebnisse ansehen →',
    },
    calculator: {
      eyebrow: 'Rechner',
      title: 'Sehen Sie, was Ihre Punkte für Sie wert sein könnten.',
      body: 'Eine schnelle Schätzung für den Anfang. Geben Sie Ihren Punktestand ein und erhalten Sie einen groben Reisewert – dann lassen Sie einen Spezialisten die echte Suche durchführen, um zu sehen, was tatsächlich buchbar ist.',
    },
    faq: {
      eyebrow: 'Fragen',
      title: 'Beantwortet, bevor Sie fragen.',
      items: [
        {
          q: 'Was, wenn Sie nichts finden?',
          a: 'Dann sagen wir es Ihnen offen – kein Upselling, kein „vielleicht“. Bei einer individuellen Suche erhalten Sie Ihre Anzahlung von {deposit} vollständig zurück, auf Ihr ursprüngliches Zahlungsmittel.',
        },
        {
          q: 'Wie lange dauert eine Suche?',
          a: 'Die meisten Suchen sind innerhalb von fünf Werktagen fertig, oft schneller. Alles Zeitkritische melden wir, sobald wir es finden.',
        },
        {
          q: 'Brauchen Sie meine Zugangsdaten für Airline oder Kreditkarte?',
          a: 'Nein. Ihre Punkte und Ihre Konten bleiben Ihre. Ein Spezialist findet und bestätigt die Plätze und gibt Ihnen dann die genauen Schritte, um selbst zu buchen – nach Ihren Passwörtern fragen wir nie.',
        },
        {
          q: 'Wer bucht das Ticket – Sie oder ich?',
          a: 'Sie. Wir übernehmen das Finden und Prüfen; Sie behalten die Kontrolle und buchen mit der Schritt-für-Schritt-Anleitung, die wir Ihnen schicken. Sollen wir mehr übernehmen? Fragen Sie uns, und wir sagen Ihnen, was möglich ist.',
        },
        {
          q: 'Was, wenn der Platz verschwindet, bevor ich buche?',
          a: 'Prämienverfügbarkeit kann sich ändern. Wir weisen auf alles Zeitkritische hin, und wenn ein von uns bestätigter Platz weg ist, bevor Sie buchen, schulden Sie die {successFee} nicht – wir suchen weiter.',
        },
        {
          q: 'Ist das ein Abo?',
          a: 'Eine individuelle Suche ist einmalig: eine Anzahlung von {deposit}, plus {successFee} nur dann, wenn wir einen buchbaren Platz bestätigen. Business-Preise sind individuell, deshalb besprechen wir sie zuerst mit Ihnen. Alerts sind die einzige monatliche Option, und Sie können jederzeit kündigen.',
        },
      ],
      stillUnsure: 'Noch unsicher? <link>Fragen Sie uns direkt</link>.',
    },
  },

  receipt: {
    heading: 'So wird abgerechnet',
    badge: 'Nur wenn Sie fliegen',
    rows: [
      { amount: '{deposit}', label: 'Anzahlung zum Start', sub: 'Erstattungsfähig – hinterlegt, nicht ausgegeben.' },
      { amount: '{successFee}', label: 'Wenn ein Platz bestätigt ist', sub: 'Pro Person und Richtung. Jede Reiseklasse.' },
      { amount: '{zero}', label: 'Wenn nichts buchbar ist', sub: 'Ihre Anzahlung kommt vollständig zurück.' },
    ],
  },

  alertPreview: {
    label: 'Strecken-Alert · Beispiel',
    title: 'Prämienplatz gefunden.',
    details: 'ANA · Business · 24. Okt. · 2 Plätze',
    verified: 'Von Hand geprüft – ein Spezialist hat ihn in diesem Zyklus bestätigt.',
  },

  teamBooking: {
    label: 'Teambuchung · Beispiel',
    confirmed: 'Bestätigt',
    details: '4 Reisende · Business · 3.–10. März',
    points: '320.000 Pkt.',
    seats: '4 Plätze',
    retail: 'Barpreis',
    retailValue: '34.800 $',
    bookedOnPoints: ' · mit Punkten gebucht',
    footer: 'Punktepreis pro Person, Screenshots, eine Rechnung.',
  },

  pricing: {
    title: 'Preise',
    hero: {
      eyebrow: 'Preise',
      title: 'Lassen Sie einen Spezialisten Ihre Punkte einsetzen.',
      intro:
        'Zwei Arten zu suchen, einmalig oder laufend, dazu Alerts, die Ihre Strecken im Blick behalten. Die Preise sind pauschal und vorab genannt (Business wird pro Konto angeboten), und das eine automatisierte Produkt sagt das offen, direkt auf seiner Karte.',
    },
    search: {
      label: 'Einmalige Suchen',
      title: 'Bezahlung pro Suche. Ein Spezialist macht die Arbeit.',
      sub: 'Kein Abo. Sagen Sie uns, was Sie brauchen – ein Spezialist durchsucht über 30 Programme und schickt Ihnen dann den Nachweis.',
    },
    alerts: {
      label: 'Laufende Alerts',
      title: 'Zwei Wege, Ihre Strecken im Blick zu behalten: einer automatisiert, einer mit Spezialist.',
      sub: 'Auf den Unterschied kommt es an, deshalb steht er auf den Karten: ein günstiger automatisierter Scan, der Phantomplätze anzeigen kann, oder ein Spezialist, der Ihre Strecken wirklich prüft.',
    },
    closing:
      'Keine Countdowns, keine künstlichen Fristen. Wenn wir nichts Buchbares finden, sagen wir es Ihnen offen, und bei einer individuellen Suche erhalten Sie Ihre Anzahlung zurück.',
    currencyNote: 'Alle Preise in US-Dollar.',
  },

  alerts: {
    title: 'Alerts',
    hero: {
      eyebrow: 'Alerts',
      title: 'Behalten Sie Ihre Strecken im Blick: automatisiert oder mit Spezialist.',
      intro:
        'Prämienplätze kommen und gehen. Wählen Sie einen automatisierten wöchentlichen Scan oder einen Spezialisten, der Ihre Strecken in jedem Zyklus prüft. Das eine kann Phantomplätze anzeigen, das andere ist geprüft. Die Karte sagt, welches was ist.',
    },
    subscribed: 'Sie haben abonniert – vielen Dank. Eine Bestätigung ist per E-Mail unterwegs.',
    weeklyEyebrow: 'Wöchentlicher Alert',
    humanEyebrow: 'Human Alert',
  },

  individual: {
    title: 'Für Privatreisende',
    hero: {
      eyebrow: 'Für Privatreisende',
      title: '200.000 Punkte – und keine Ahnung, was sie wert sind.',
      intro:
        'Sie haben sie gesammelt. Wir stellen Ihnen einen Spezialisten zur Seite, der das Beste aus ihnen herausholt, den tatsächlich buchbaren Platz findet und Ihnen den genauen Punktepreis nennt. Sie sagen uns nur, wohin Sie möchten.',
    },
    howTitle: 'So funktioniert es für Sie',
    steps: [
      {
        title: 'Nennen Sie uns die Reise',
        body: 'Wohin Sie möchten und welche Punkte Sie haben. Kein Konto, kein langes Formular. Dann können Sie es vergessen.',
      },
      {
        title: 'Ein Spezialist übernimmt',
        body: 'Ihr Spezialist setzt Ihre Punkte in über 30 Programmen ein – auch auf den Routings, die die Tools übersehen.',
      },
      {
        title: 'Sie erhalten den Nachweis',
        body: 'Ein Screenshot und der genaue Punktepreis, direkt an Sie. Das Honorar von {successFee} zahlen Sie nur, wenn wir einen buchbaren Platz finden.',
      },
    ],
    cost: {
      eyebrow: 'Was es kostet',
      price: '{deposit}',
      unit: 'Anzahlung zum Start',
      body: 'Dann pauschal <strong>{successFee}</strong>, jede Reiseklasse – erst fällig, wenn Ihr Spezialist einen buchbaren Platz bestätigt. Finden wir nichts, erhalten Sie Ihre Anzahlung vollständig zurück.',
      cta: 'Suche starten',
    },
    alerts: {
      title: 'Noch nicht bereit, eine Reise zu buchen?',
      body: 'Der Weekly Lookup Alert behält Ihre Strecken im Blick und meldet sich, sobald Prämienplätze frei werden. {weeklyMonthly}/Monat, jederzeit kündbar.',
    },
  },

  business: {
    title: 'Für Unternehmen',
    hero: {
      eyebrow: 'Für Unternehmen',
      title: 'Machen Sie aus Ihren Reiseausgaben Premium-Plätze.',
      intro:
        'Für Teams, die oft fliegen. Ein Spezialist führt Prämiensuchen auf Kontoebene in über 30 Programmen durch und liefert den Nachweis – so reicht Ihr Reisebudget weiter, ohne dass jemand mehr Arbeit hat.',
    },
    howTitle: 'Suche auf Kontoebene, erledigt von einem Spezialisten',
    steps: [
      {
        title: 'Schicken Sie uns die Strecke',
        body: 'Die Reise, die Ihr Team braucht, und die Punkte oder Programme, die Sie haben. Eine Anfrage, dann können Sie es vergessen.',
      },
      {
        title: 'Ab hier übernimmt ein Spezialist',
        body: 'Ihr Spezialist durchsucht über 30 Programme und Transferpartner nach echten, buchbaren Business-Class-Plätzen – nicht nach den Phantomplätzen, die die Tools anzeigen.',
      },
      {
        title: 'Sie erhalten den Nachweis zum Buchen',
        body: 'Ein Screenshot und der genaue Punktepreis, pro Platz. Verlässlich genug, um die Reisen eines ganzen Teams danach zu planen.',
      },
    ],
    value: {
      eyebrow: 'Was eine Suche auf Kontoebene wert ist',
      title: 'Ein Quartal Teamreisen, mit Punkten statt Geld.',
      body: 'Ein beispielhaftes Quartal – die Art von Spanne, die ein Spezialist auf den Strecken Ihres Teams in buchbare Business-Class-Plätze verwandelt.',
      columns: { route: 'Strecke', team: 'Team', cash: 'Barpreis', points: 'Mit Punkten' },
      rows: [
        { route: 'SFO → LHR · Business', team: '4 Plätze', cash: '34.800 $', points: '320.000 Pkt.' },
        { route: 'LAX → NRT · Business', team: '3 Plätze', cash: '18.600 $', points: '225.000 Pkt.' },
        { route: 'JFK → GRU · Business', team: '2 Plätze', cash: '9.400 $', points: '150.000 Pkt.' },
      ],
      total: 'Quartalssumme',
      totalCash: '62.800 $',
      totalPoints: '695.000 Pkt.',
      footer:
        'Eine Rechnung, der Punktepreis pro Person und eine Übersicht, die Ihre Buchhaltung abzeichnen kann – kein Stapel Belege.',
    },
    cost: {
      eyebrow: 'Was es kostet',
      price: 'Individuell',
      unit: 'auf Anfrage',
      body: 'Jedes Team fliegt anders, deshalb erstellen wir Business-Preise pro Konto. Sagen Sie uns, was Sie brauchen, und wir melden uns mit einem Angebot. Der Einstieg auf Kontoebene für Teams, die oft fliegen.',
      cta: 'Business-Suche starten',
    },
    alerts: {
      title: 'Wiederkehrende Strecken, von einem Menschen beobachtet',
      body: 'Für Konten mit wichtigen, wiederkehrenden Reisen hält der Human Search Alert in jedem Zyklus einen Spezialisten auf Ihren Strecken. {humanMonthly}/Monat, jederzeit kündbar.',
    },
  },

  about: {
    title: 'Über uns',
    hero: {
      eyebrow: 'Über uns',
      title: 'Das System war kaputt. Wir sind hier, um es zu reparieren.',
      intro:
        'Prämien-Tools sind schnell, günstig und voller Plätze, die es gar nicht gibt. Saver Miles ist das Gegenteil: ein Spezialist an Ihrer Seite, der das Durcheinander sortiert, den Platz prüft und Ihnen einen übergibt, den Sie wirklich buchen können.',
    },
    lead: 'Die meisten Menschen sitzen auf Punkten, aus denen sie nichts Gutes machen können.',
    story:
      'Die Tools, die eigentlich helfen sollen, sind schnell, günstig und voller Plätze, die verschwinden, sobald Sie buchen wollen. Wir haben Saver Miles gegründet, um das zu ändern: Ihnen einen Spezialisten zur Seite zu stellen, das Beste aus Ihren vorhandenen Punkten herauszuholen, vor der Zahlung zu prüfen und Ihnen einen Platz zu übergeben, den Sie wirklich buchen können.',
    howTitle: 'Wie wir wirklich arbeiten',
    how: [
      {
        title: 'Ein Spezialist, kein Feed',
        body: 'Prämienverfügbarkeit ändert sich im Minutentakt, und zwischengespeicherte Daten lügen. Ihr Spezialist durchsucht über 30 Programme und Transferpartner – auch die Routings, die automatisierte Tools auslassen.',
      },
      {
        title: 'Geprüft, bevor Sie sich festlegen',
        body: 'Ihr Spezialist öffnet die Buchung und bestätigt, dass der Platz wirklich da ist, zum genannten Preis – bevor Sie einen Punkt oder einen Dollar ausgeben.',
      },
      {
        title: 'Geliefert als Nachweis',
        body: 'Sie erhalten einen Screenshot und den genauen Punktepreis – etwas, das Sie buchen können, keinen Tipp und kein Vielleicht.',
      },
    ],
    numbers: 'Die Zahlen dahinter',
    chargeTitle: 'Wie wir abrechnen',
    charge:
      'Pauschale Gebühren für die Arbeit, vollständig auf der Preisseite aufgeführt. Eine private Buchung kostet eine Anzahlung von {deposit} plus ein Honorar von {successFee}, und findet Ihr Spezialist nichts Buchbares, kommt die Anzahlung zurück. Business-Preise werden pro Konto angeboten. Laufende Alerts sind monatlich. Das ist das ganze Modell, nichts versteckt.',
    closing: 'Lassen Sie einen Spezialisten Ihre Punkte einsetzen.',
    checkRoute: 'Strecke prüfen lassen',
    seeHow: 'So funktioniert’s',
  },

  howItWorks: {
    title: 'So funktioniert’s',
    eyebrow: 'So funktioniert’s',
    heading: 'Drei Schritte – und in der Mitte macht ein Spezialist die Arbeit.',
    intro:
      'Kein automatisiertes Tool, das Plätze anzeigt, die beim Bezahlen verschwinden. Sie nennen uns den Plan, ein Spezialist übernimmt, und Sie erhalten einen Nachweis, mit dem Sie handeln können.',
    steps: [
      {
        title: 'Nennen Sie uns den Plan',
        body: 'Schicken Sie uns, wohin Sie möchten und welche Punkte Sie haben. Kein Konto, kein langwieriges Formular, nur die Reise, die Sie im Kopf haben. Dann können Sie es vergessen.',
      },
      {
        title: 'Ein Spezialist durchsucht über 30 Programme',
        body: 'Ihr Spezialist durchsucht live die Prämienverfügbarkeit in über 30 Vielfliegerprogrammen und bei Transferpartnern, findet die Routings, die ein automatisiertes Tool übersieht, und lässt die Plätze aus, die es fälschlich als buchbar anzeigt.',
      },
      {
        title: 'Sie erhalten den Nachweis',
        body: 'Wir schicken Ihnen, was tatsächlich buchbar ist: einen Screenshot und den genauen Punktepreis. Echte Verfügbarkeit an Ihren Daten – oder ein ehrliches „noch nicht“.',
      },
    ],
    forBusiness: 'Für Unternehmen',
  },

  calculator: {
    title: 'Punkte-Rechner',
    hero: {
      eyebrow: 'Rechner',
      title: 'Was sind Ihre Punkte wirklich wert?',
      intro:
        'Eine schnelle Schätzung, was Ihr Punktestand an Reisewert bringen und realistisch buchen könnte. Ein Ausgangspunkt, keine Live-Suche. Die echte Antwort kommt von einem Spezialisten, der Ihre Daten prüft.',
    },
    widget: {
      balance: 'Punktestand',
      example: '185.000',
      roughly: 'Ungefährer Wert',
      travelValue: 'Reisewert · nur eine Schätzung',
      startThat: '≈ {flight} – diese Suche starten →',
      openFull: 'Zum vollständigen Rechner →',
      program: 'Programm',
      programs: {
        flexible: 'Flexibel / übertragbar (Amex, Chase, Citi, Cap One)',
        airline: 'Direkt ein US-Airline-Programm',
        mixed: 'Nicht sicher / gemischt',
      },
      estimated: 'Geschätzter Reisewert',
      enterBalance: 'Punktestand eingeben',
      enoughFor: 'Das reicht ungefähr für',
      tiers: {
        domesticEconomy: 'einen Inlands-Hin- und Rückflug in der Economy',
        domesticBusiness:
          'einen Inlands-Hin- und Rückflug in der Business oder einen internationalen Economy-Flug (einfache Strecke)',
        intlBusinessOneWay: 'einen internationalen Business-Class-Flug (einfache Strecke)',
        intlBusinessRoundTrip: 'eine internationale Hin- und Rückreise in der Business Class',
        intlFirstOneWay: 'einen internationalen First-Class-Flug (einfache Strecke)',
      },
      disclaimer:
        'Dies sind Schätzungen auf Basis typischer Einlösewerte, keine Live-Suche. Der tatsächliche Wert hängt von der echten Prämienverfügbarkeit an Ihren Daten ab. Starten Sie eine kostenlose Suche, um zu sehen, was tatsächlich buchbar ist.',
    },
  },

  contact: {
    title: 'Kontakt',
    hero: {
      eyebrow: 'Kontakt',
      title: 'Sprechen Sie mit einem Spezialisten.',
      intro:
        'Presse, Partnerschaften oder eine Frage, die nicht zu einer Suchanfrage passt: Schreiben Sie uns direkt. Wenn Sie das Beste aus Ihren Punkten herausholen möchten, sind die Seiten für Privatreisende und Unternehmen der schnellere Weg.',
    },
    heading: 'Schreiben Sie uns',
    calendar:
      'Ein Buchungskalender ist in Arbeit. Bis dahin erreichen Sie einen Spezialisten am schnellsten per E-Mail.',
    cta: 'So funktioniert’s',
  },

  results: {
    title: 'Ergebnisse',
    hero: {
      eyebrow: 'Ergebnisse',
      title: 'Echte Ergebnisse, sobald sie da sind.',
      intro:
        'Wir zeigen Ihnen lieber nichts als etwas Erfundenes. Bestätigte Buchungen und Kundengeschichten erscheinen hier, sobald sie echt sind und wir sie teilen dürfen.',
    },
    empty: {
      heading: 'Die ersten Ergebnisse kommen',
      body: 'Wir sind eine neue Marke, und jedes Ergebnis hier hat ein Spezialist tatsächlich geliefert. Schauen Sie bald wieder vorbei – oder finden Sie heraus, was Ihre eigenen Punkte buchen können.',
      cta: 'Strecke prüfen lassen',
    },
  },

  blog: {
    title: 'Blog',
    description:
      'Ratgeber zum Buchen von Flügen mit Punkten und Meilen, geprüft von einem echten Spezialisten – nicht von einem Algorithmus.',
    home: 'Startseite',
    hero: {
      eyebrow: 'Blog',
      title: 'Notizen zu Punkten, Plätzen und echter Handarbeit.',
      intro:
        'Erfahrungen aus der Prämiensuche auf die langsame, richtige Art: was die Tools übersehen und wie Sie die Punkte, die Sie haben, wirklich nutzen.',
    },
    index: {
      searchPlaceholder: 'Beiträge durchsuchen …',
      searchLabel: 'Beiträge durchsuchen',
      all: 'Alle',
      latest: 'Neu',
      readPost: 'Beitrag lesen',
      minutes: '{n} Min.',
      minutesRead: '{n} Min. Lesezeit',
      results: { one: '{n} Ergebnis', other: '{n} Ergebnisse' },
      empty: 'Wir fangen gerade erst an. Die ersten Beiträge sind unterwegs – schauen Sie bald wieder vorbei.',
      noMatch: 'Keine Beiträge zu „{query}“.',
      noneInCategory: 'In dieser Kategorie gibt es noch keine Beiträge.',
      clear: 'Filter zurücksetzen',
    },
    post: {
      allPosts: '← Alle Beiträge',
      minutesRead: '{n} Min. Lesezeit',
      related: 'Ähnliche Beiträge',
      pager: 'Weitere Beiträge',
      previous: 'Vorheriger',
      next: 'Nächster',
      notFound: 'Nicht gefunden',
    },
    category: {
      filedUnder: 'Alles, was wir unter {name} abgelegt haben.',
      guides: {
        title: 'Ratgeber',
        intro:
          'Wie Prämienreisen wirklich funktionieren – Schritt-für-Schritt-Anleitungen aus echten Suchen von Hand, keine Schätzung eines Algorithmus.',
      },
      deals: {
        title: 'Deals',
        intro:
          'Herausragende Prämienplätze und Preisfunde, die unser Team von Hand aufgespürt hat. Naturgemäß zeitkritisch – handeln Sie, solange sie verfügbar sind.',
      },
    },
    feed: {
      description: 'Ratgeber zum Buchen von Flügen mit Punkten und Meilen, geprüft von einem echten Spezialisten.',
    },
    og: {
      tagline: 'Prämiensuche von Hand · savermiles.com',
    },
  },

  emails: {
    welcome: {
      subject: 'Willkommen bei Saver Miles ✈',
      title: 'Willkommen bei Saver Miles',
      greeting: 'Willkommen an Bord, {name}.',
      greetingNoName: 'Willkommen an Bord.',
      intro:
        'Sie stehen auf der Liste. Saver Miles ist ein Concierge-Service für Punkte und Meilen: Ein echter Spezialist durchsucht die Prämienverfügbarkeit von Hand, damit Sie mit den Punkten, die Sie bereits haben, in Premium-Kabinen fliegen können. Kein Algorithmus, kein Rätselraten – ein Mensch, der das jeden Tag macht.',
      listIntro: 'Das schicken wir Ihnen:',
      items: [
        'Praktische Tipps zum Sammeln und Einlösen von Punkten',
        'Sweet Spots in Business und First, die die meisten Reisenden übersehen',
        'Wie Transferpartner und Prämientabellen wirklich funktionieren',
        'Ab und zu einen herausragenden Prämienplatz, für den sich der Flug lohnt',
      ],
      headStart:
        'Sie möchten direkt loslegen? Lesen Sie unsere <link>Punkte-Ratgeber</link> oder sehen Sie sich an, wie eine Suche genau abläuft.',
      cta: 'So funktioniert’s →',
      languageNote: 'Der Newsletter selbst erscheint auf Englisch.',
      footer:
        'Sie erhalten diese E-Mail, weil Sie sich auf savermiles.com angemeldet haben. Falls das ein Versehen war, können Sie diese E-Mail einfach ignorieren.',
    },
  },
};

export default de;
