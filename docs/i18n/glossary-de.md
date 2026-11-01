# German glossary

The terms the German site uses, so new copy (pages, legal, emails, blog posts)
reads as one voice. The dictionaries live in `src/i18n/messages/de.ts`; the rules
for adding copy are in `AGENTS.md` → "Languages".

## Voice

- **Formal *Sie*** everywhere, including buttons ("Suche starten", not "Starte").
- Short sentences, no hype, same quietly premium tone as the English.
- Typography: German quotes „…“, en dash with spaces ( – ) for a break in UI
  copy, `z. B.` with a thin space, `…` with a space before it in placeholders.
  **Blog posts are the exception:** the writing guide's no-dash rule applies, so no
  em dash and no spaced en dash as punctuation (commas, colons, parentheses
  instead); an en dash only in ranges ("2–4").
- No German-language service promise. The team answers in English unless told
  otherwise; the newsletter blurbs say "Der Newsletter erscheint auf Englisch."

## Stays English

| Term | Why |
|---|---|
| Saver Miles | Brand |
| Weekly Lookup Alert, Human Search Alert, Individual Search, Business Search | Product names (docs/plans/03) |
| Economy, Premium Economy, Business, First | Cabin names Germans use as-is ("Business Class") |
| Alerts | Product family and nav label |
| Airline names, program names (Amex MR, Chase UR, Flying Blue, Miles & More), airport codes | Proper names |
| Screenshot, Feed, Routing, Upselling, Checkout, Sweet Spot | Established loanwords |

## Terms

| English | German |
|---|---|
| specialist | Spezialist ("Ihr Spezialist") |
| a real person | ein echter Mensch |
| award seat / award space | Prämienplatz / Prämienplätze, Prämienverfügbarkeit |
| award travel / flight | Prämienreise / Prämienflug |
| seat | Platz (Sitzplatz where it needs to be explicit) |
| points and miles | Punkte und Meilen |
| loyalty program | Vielfliegerprogramm (legal pages: Bonusprogramm) |
| transfer partner | Transferpartner |
| phantom seat / phantom space | Phantomplatz / Phantomplätze |
| point cost | Punktepreis ("der genaue Punktepreis") |
| retail / cash fare | Barpreis |
| taxes (on an award ticket) | Gebühren (short form on cards) |
| deposit | Anzahlung |
| success fee | Erfolgshonorar ("das Honorar"); legal pages: Erfolgsgebühr |
| per person, per direction | pro Person und Richtung |
| cabin | Reiseklasse |
| bookable | buchbar |
| verified by hand | von Hand geprüft |
| confirmed | bestätigt |
| proof | Nachweis |
| route | Strecke |
| home airport | Heimatflughafen |
| round trip / one-way | Hin & zurück / Nur Hinflug |
| traveler(s) | Person(en), Reisende |
| account-level (business) | auf Kontoebene |
| Custom / let's talk (price) | Individuell / auf Anfrage |
| Cancel anytime | Jederzeit kündbar |
| Get started | Loslegen |
| pts | Pkt. |
| Privacy Policy / Terms / Cookie Policy | Datenschutzerklärung / AGB / Cookie-Richtlinie |

## Numbers, prices, dates

- Prices stay **USD**, written the German way: `4,99 $`, `99 $`, `34.800 $`.
  Copy never types a product price. It uses `{deposit}`, `{successFee}`, … and
  `getMessages()` fills them from `PRICES_USD` (src/lib/products.ts). Illustrative
  figures (the business table, example cards) are written out per language.
- Thousands use a dot (`75.000`), decimals a comma.
- Dates: `24. Okt.` on cards, `28. Oktober 2026` in running text; use
  `formatDate` / `formatDayMonth` from `src/i18n/format.ts`, never a hardcoded
  locale.
