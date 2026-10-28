import Link from '@/components/system/LocaleLink';
import type { LegalContent } from '@/components/site/LegalDoc';
import { SITE_EMAIL, SITE_LEGAL_NAME, SITE_ADDRESS_INLINE } from '@/lib/constants';

const EMAIL = SITE_EMAIL;

// German translation of content.en.tsx. The English version governs (see the
// notice at the top); keep the two in step when either changes.
function Body() {
  return (
    <>
      <p>
        <strong>Hinweis zur Sprachfassung:</strong> Diese deutsche Fassung ist eine Übersetzung, die wir
        Ihnen nur zur Erleichterung bereitstellen. Bei Abweichungen zwischen der deutschen und der
        englischen Fassung ist die englische Fassung maßgeblich.
      </p>
      <p>
        Die <strong>Saver Miles LLC</strong>, eine Limited Liability Company nach dem Recht des
        US-Bundesstaats Wyoming („Saver Miles“, „wir“, „uns“), ist der Verantwortliche für die in dieser
        Erklärung beschriebenen personenbezogenen Daten. Sie gilt für savermiles.com und die von uns
        erbrachten Leistungen (die „Leistungen“). Durch die Nutzung der Leistungen stimmen Sie dieser
        Erklärung zu.
      </p>

      <h2>1. Welche Daten wir erheben</h2>
      <h3>Daten, die Sie uns geben</h3>
      <p>Je nachdem, wie Sie die Leistungen nutzen, können wir Folgendes erheben:</p>
      <ul>
        <li>
          <strong>Suchanfragen.</strong> Wenn Sie eine Prämienflugsuche für Privatpersonen oder
          Unternehmen anfragen, erheben wir Ihre E-Mail-Adresse, Ihre Telefon- oder WhatsApp-Nummer, die
          gewünschten Strecken und Daten, die Kabinenklasse und die Anzahl der Reisenden, die Punkte oder
          Programme, die Sie besitzen, Ihr Budget oder Ihre Ausgaben sowie etwaige Anmerkungen, die Sie
          hinzufügen.
        </li>
        <li>
          <strong>Newsletter und Alerts.</strong> Ihre E-Mail-Adresse, Ihren Heimatflughafen und (für
          Alert-Einstellungen) die Strecken, die beobachtet werden sollen.
        </li>
        <li>
          <strong>Kontaktaufnahme und Anträge.</strong> Ihren Namen, Ihre E-Mail-Adresse, Ihre
          Telefonnummer, Angaben zu Ihrem Unternehmen, die Art des Unternehmens, Ihren Ausgabenbereich
          sowie alle Nachrichten oder Ziele, die Sie uns senden, wenn Sie uns kontaktieren oder einen
          Antrag stellen.
        </li>
        <li>
          <strong>Zahlungen.</strong> Wenn Sie bezahlen, erhebt unser Zahlungsdienstleister Stripe Ihre
          Kartendaten und Rechnungsinformationen direkt. <strong>Wir erhalten und speichern Ihre
          vollständige Kartennummer nicht.</strong> Wir speichern nur Stripe-Kennungen, den Betrag, den
          Tarif und den Status sowie eine E-Mail-Adresse für die Rechnungsstellung.
        </li>
        <li>
          <strong>Konten.</strong> Wenn Sie als Teammitglied oder Affiliate einen Login haben, speichern
          wir Ihren Namen, Ihre E-Mail-Adresse, Ihre Rolle und (bei Affiliates) einen Empfehlungscode.
        </li>
      </ul>
      <h3>Automatisch erhobene Daten</h3>
      <p>
        Wenn Sie die Website besuchen, verarbeiten unsere Hosting- und Infrastrukturanbieter automatisch
        technische Daten wie Ihre IP-Adresse, Ihren Browser- und Gerätetyp, die aufgerufenen Seiten und
        Zeitstempel, um die Website bereitzustellen und abzusichern. Außerdem verwenden wir eine kleine
        Anzahl von Cookies und Einträgen im Browser-Speicher, die in unserer{' '}
        <Link href="/legal/cookies">Cookie-Richtlinie</Link> beschrieben sind.
      </p>
      <p>
        Wir verwenden <strong>Google Analytics 4</strong>, um in aggregierter Form zu verstehen, wie die
        Website genutzt wird (zum Beispiel wie viele Personen sie besuchen und welche Artikel gelesen
        werden), damit wir sie verbessern können. Google Analytics setzt Analyse-Cookies und verarbeitet
        Nutzungsdaten wie aufgerufene Seiten, ungefähren Standort und Gerätetyp. Wir verwenden es{' '}
        <strong>ausschließlich zur Reichweitenmessung</strong> – nicht für Werbung, personalisierte
        Werbung oder Google Ads –, und wir verkaufen diese Daten nicht und geben sie nicht weiter.
        Analyse-Cookies sind nicht unbedingt erforderlich; wo das Gesetz es verlangt, bitten wir vor dem
        Setzen um Ihre Einwilligung, und Sie können jederzeit widersprechen (Opt-out), wie in unserer{' '}
        <Link href="/legal/cookies">Cookie-Richtlinie</Link> beschrieben. Wir verwenden{' '}
        <strong>keine</strong> Werbe-Cookies und keine Werbepixel von Drittanbietern.
      </p>

      <h2>2. Wie wir Ihre Daten verwenden</h2>
      <ul>
        <li>
          Um die Leistungen zu erbringen: Suchen durchzuführen, Ergebnisse und Alerts zu liefern und Ihnen
          zu antworten.
        </li>
        <li>Um Zahlungen abzuwickeln und Abonnements zu verwalten (über Stripe).</li>
        <li>
          Um Ihnen Transaktionsnachrichten (Bestätigungen, Ergebnisse, Servicehinweise) und, sofern Sie
          sich angemeldet haben, unseren Newsletter und Marketing-E-Mails zu senden. Sie können sich
          jederzeit vom Marketing abmelden.
        </li>
        <li>
          Um eine Empfehlung zuzuordnen, wenn Sie über einen Affiliate-Link zu uns kommen (siehe
          Cookie-Richtlinie).
        </li>
        <li>
          Um die Leistungen zu betreiben, abzusichern, Fehler zu beheben und sie zu verbessern sowie Betrug
          und Missbrauch zu verhindern.
        </li>
        <li>Um gesetzliche Pflichten zu erfüllen und unsere Bedingungen durchzusetzen.</li>
      </ul>

      <h2>3. Rechtsgrundlagen (Besucher aus dem EWR und dem Vereinigten Königreich)</h2>
      <p>
        Soweit die DSGVO (GDPR) oder die UK GDPR gilt, stützen wir uns auf: die{' '}
        <strong>Erfüllung eines Vertrags</strong> (um eine von Ihnen angefragte Suche oder ein Abonnement
        bereitzustellen); Ihre <strong>Einwilligung</strong> (für Marketing-E-Mails; Sie können sie
        jederzeit widerrufen); unsere <strong>berechtigten Interessen</strong> (um die Leistungen zu
        betreiben, abzusichern und zu verbessern und mit Ihnen zu kommunizieren); und eine{' '}
        <strong>rechtliche Verpflichtung</strong> (zum Beispiel steuerliche und buchhalterische
        Aufzeichnungen).
      </p>

      <h2>4. Wie wir Daten weitergeben</h2>
      <p>
        Wir verkaufen Ihre personenbezogenen Daten <strong>nicht</strong>. Wir geben sie nur weiter, soweit
        dies zum Betrieb der Leistungen erforderlich ist, und zwar an:
      </p>
      <ul>
        <li>
          <strong>Dienstleister (Auftragsverarbeiter)</strong>, die nach unseren Weisungen handeln:{' '}
          <strong>Supabase</strong> (Datenbank und Dateispeicher), <strong>Stripe</strong>
          {' '}(Zahlungsabwicklung), <strong>Vercel</strong> (Website-Hosting) und <strong>Google</strong>
          {' '}(Google Workspace für den Versand von Transaktions- und Newsletter-E-Mails sowie Google
          Analytics für die aggregierte Reichweitenmessung). Jeder erhält nur die Daten, die für seine
          Funktion erforderlich sind.
        </li>
        <li>
          <strong>Affiliates.</strong> Wenn Sie über einen Affiliate-Link zu uns kommen, ordnen wir Ihre
          Anfrage diesem Affiliate zu; Affiliates sehen nur begrenzte Informationen über vermittelte
          Anfragen, nicht Ihren vollständigen Datensatz.
        </li>
        <li>
          <strong>Recht und Sicherheit.</strong> Soweit dies gesetzlich oder durch ein rechtliches
          Verfahren vorgeschrieben ist oder zum Schutz der Rechte, der Sicherheit und des Eigentums von
          Saver Miles, unseren Nutzern oder anderen erforderlich ist.
        </li>
        <li>
          <strong>Unternehmensübertragungen.</strong> Im Zusammenhang mit einer Fusion, einer Übernahme,
          einer Finanzierung oder einem Verkauf von Vermögenswerten, vorbehaltlich dieser Erklärung.
        </li>
      </ul>

      <h2>5. Internationale Datenübermittlungen</h2>
      <p>
        Wir haben unseren Sitz in den Vereinigten Staaten, und unsere Anbieter können Daten in den
        Vereinigten Staaten und anderen Ländern verarbeiten. Wenn wir personenbezogene Daten aus dem EWR,
        dem Vereinigten Königreich oder der Schweiz übermitteln, stützen wir uns auf geeignete Garantien wie
        die Standardvertragsklauseln der Europäischen Kommission.
      </p>

      <h2>6. Speicherdauer</h2>
      <p>
        Wir speichern personenbezogene Daten so lange, wie es erforderlich ist, um die Leistungen zu
        erbringen, unsere Geschäftsunterlagen zu führen, gesetzliche Pflichten zu erfüllen, Streitigkeiten
        beizulegen und unsere Vereinbarungen durchzusetzen. Newsletter-Abonnements werden gespeichert, bis
        Sie sich abmelden (wodurch Sie als inaktiv markiert werden). Sie können uns wie unten beschrieben
        bitten, Ihre Daten zu löschen, vorbehaltlich gesetzlicher Ausnahmen.
      </p>

      <h2>7. Sicherheit</h2>
      <p>
        Wir setzen angemessene technische und organisatorische Maßnahmen ein, um personenbezogene Daten zu
        schützen, darunter verschlüsselte Verbindungen und Zugriffskontrollen, und wir nutzen etablierte
        Anbieter (Supabase, Stripe, Vercel, Google) mit eigenen Sicherheitsprogrammen. Keine Methode der
        Übertragung oder Speicherung ist vollständig sicher, daher können wir keine absolute Sicherheit
        garantieren.
      </p>

      <h2>8. Ihre Rechte und Wahlmöglichkeiten</h2>
      <p>
        Sie können sich jederzeit über den Link in der E-Mail oder durch Kontaktaufnahme mit uns von
        Marketing-E-Mails abmelden. Je nach Ihrem Wohnort haben Sie möglicherweise weitere Rechte:
      </p>
      <h3>EWR / Vereinigtes Königreich (DSGVO)</h3>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten, auf
        Einschränkung der Verarbeitung, auf Widerspruch gegen die Verarbeitung und auf
        Datenübertragbarkeit sowie das Recht, Ihre Einwilligung jederzeit zu widerrufen. Außerdem haben
        Sie das Recht, sich bei Ihrer Datenschutzaufsichtsbehörde zu beschweren.
      </p>
      <h3>Kalifornien (CCPA/CPRA)</h3>
      <p>
        Sie haben das Recht zu erfahren, welche personenbezogenen Daten wir erheben und wie wir sie
        verwenden und weitergeben, die Löschung oder Berichtigung zu verlangen und dem „Verkauf“ („sale“)
        oder der „Weitergabe“ („sharing“) personenbezogener Daten zu widersprechen.{' '}
        <strong>Wir verkaufen Ihre personenbezogenen Daten nicht und geben sie nicht weiter</strong> im
        Sinne dieser Begriffe nach kalifornischem Recht. Wir werden Sie nicht benachteiligen, wenn Sie Ihre
        Rechte ausüben.
      </p>
      <p>
        Um eines dieser Rechte auszuüben, schreiben Sie uns an <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        Möglicherweise müssen wir Ihre Identität überprüfen, bevor wir eine Anfrage bearbeiten.
      </p>

      <h2>9. Kinder</h2>
      <p>
        Die Leistungen richten sich an Erwachsene und nicht an Kinder. Wir erheben wissentlich keine
        personenbezogenen Daten von Personen unter 18 Jahren (bzw. unter 16 Jahren im EWR und im
        Vereinigten Königreich). Wenn Sie glauben, dass ein Kind uns Daten übermittelt hat, kontaktieren
        Sie uns, und wir löschen sie.
      </p>

      <h2>10. Links zu Dritten</h2>
      <p>
        Unsere Website und E-Mails können auf Websites Dritter verlinken (zum Beispiel auf Seiten von
        Fluggesellschaften oder Bonusprogrammen). Für deren Datenschutzpraktiken sind diese selbst
        verantwortlich, nicht wir. Lesen Sie deren Richtlinien, bevor Sie Daten angeben.
      </p>

      <h2>11. Änderungen dieser Erklärung</h2>
      <p>
        Wir können diese Erklärung von Zeit zu Zeit aktualisieren. In diesem Fall ändern wir das oben
        angegebene Datum „Zuletzt aktualisiert“ und informieren Sie gegebenenfalls zusätzlich.
      </p>

      <h2>12. Kontakt</h2>
      <p>
        Bei Fragen zum Datenschutz oder um Ihre Rechte auszuüben, wenden Sie sich an die{' '}
        <strong>Saver Miles LLC</strong> unter <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Eingetragene
        Anschrift: {SITE_LEGAL_NAME}, {SITE_ADDRESS_INLINE}.
      </p>
    </>
  );
}

const privacy: LegalContent = {
  title: 'Datenschutzerklärung',
  description:
    'Wie Saver Miles Ihre personenbezogenen Daten erhebt, verwendet, weitergibt und schützt, welche Auftragsverarbeiter wir einsetzen und welche Datenschutzrechte Sie haben (einschließlich DSGVO und Kalifornien).',
  intro:
    'Diese Erklärung beschreibt, welche personenbezogenen Daten wir erheben, wie wir sie verwenden und weitergeben und welche Wahlmöglichkeiten und Rechte Sie haben.',
  Body,
};

export default privacy;
