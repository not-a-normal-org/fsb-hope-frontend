import Link from '@/components/system/LocaleLink';
import type { LegalContent } from '@/components/site/LegalDoc';
import { SITE_EMAIL } from '@/lib/constants';

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
        Diese Cookie-Richtlinie beschreibt, wie die <strong>Saver Miles LLC</strong> („Saver Miles“,
        „wir“, „uns“) Cookies und ähnliche Browser-Speichertechnologien auf savermiles.com einsetzt. Sie
        sollte zusammen mit unserer <Link href="/legal/privacy">Datenschutzerklärung</Link> gelesen
        werden.
      </p>

      <h2>1. Was Cookies und Browser-Speicher sind</h2>
      <p>
        Cookies sind kleine Textdateien, die eine Website in Ihrem Browser speichert. Verwandte
        Technologien, der „Local Storage“ und der „Session Storage“, ermöglichen es einer Website, sich
        kleine Informationen auf Ihrem Gerät zu merken. Sie können <em>unbedingt erforderlich</em> (für das
        Funktionieren der Website nötig) oder <em>funktional</em> (zum Speichern Ihrer Einstellungen) sein
        oder für <em>Analyse</em> oder <em>Werbung</em> eingesetzt werden. Wir verwenden unbedingt
        erforderliche und funktionale Einträge sowie ein einziges <em>Analyse</em>-Tool (Google
        Analytics) für die aggregierte Reichweitenmessung. Wir verwenden keine Werbe-Cookies.
      </p>

      <h2>2. Was wir verwenden und warum</h2>
      <p>Wir setzen folgende Einträge:</p>
      <ul>
        <li>
          <strong>Empfehlungszuordnung</strong> (Cookie <code>sm_ref</code>, etwa 90 Tage) –{' '}
          <em>funktional.</em> Wenn Sie über einen Affiliate-Link zu uns kommen, merkt sich dieses Cookie,
          welcher Affiliate Sie empfohlen hat, damit ihm die Empfehlung gutgeschrieben wird. Es enthält nur
          einen kurzen Empfehlungscode.
        </li>
        <li>
          <strong>Design-Einstellung</strong> (Local Storage <code>sm-theme</code>) –{' '}
          <em>funktional.</em> Speichert, ob Sie das Design Hell, Dunkel oder Mono gewählt haben.
        </li>
        <li>
          <strong>Spracheinstellung</strong> (Cookie <code>sm-locale</code>, 1 Jahr) –{' '}
          <em>funktional.</em> Wird nur gesetzt, wenn Sie über die Sprachauswahl eine Sprache wählen. Es
          speichert diese Wahl (Englisch oder Deutsch), damit wir Ihnen die Website in dieser Sprache
          anzeigen und nicht in der Sprache, die wir sonst anhand Ihres ungefähren Standorts wählen würden.
          Es handelt sich um ein Erstanbieter-Cookie (<code>SameSite=Lax</code>).
        </li>
        <li>
          <strong>Newsletter-Hinweis</strong> (Local/Session Storage <code>sm-nl-dismissed</code>,
          <code> sm-nl-done</code>, <code>sm-nl-seen</code>) – <em>funktional.</em> Speichert, dass Sie
          den Newsletter-Hinweis geschlossen oder ausgefüllt haben, damit wir ihn nicht erneut anzeigen.
        </li>
        <li>
          <strong>Anmeldesitzung</strong> (Cookie <code>payload-token</code>) –{' '}
          <em>unbedingt erforderlich.</em> Wird nur gesetzt, wenn Sie sich bei einem Team- oder
          Affiliate-Konto anmelden; es hält Sie angemeldet. Für gewöhnliche Besucher wird es nicht gesetzt.
        </li>
        <li>
          <strong>Analyse</strong> (Cookies <code>_ga</code> und <code>_ga_&lt;id&gt;</code>, gesetzt
          von Google Analytics, bis zu etwa 13 Monate) – <em>Analyse.</em> Sie helfen uns, den
          Gesamtverkehr zu messen: wie viele Personen die Website besuchen, welche Seiten und Artikel
          gelesen werden und grob, woher Besucher kommen. Sie verraten uns nicht, wer Sie sind, und wir
          verwenden sie niemals für Werbung. Wie Sie widersprechen können, erfahren Sie in Abschnitt 4.
        </li>
      </ul>

      <h2>3. Cookies von Drittanbietern</h2>
      <p>
        Wenn Sie eine Zahlung vornehmen, werden Sie auf eine Checkout-Seite weitergeleitet, die von
        unserem Zahlungsdienstleister <strong>Stripe</strong> gehostet wird. Stripe setzt auf seinen
        eigenen Seiten eigene Cookies, um die Zahlung sicher abzuwickeln und Betrug zu verhindern. Für
        diese Cookies gilt die{' '}
        <a href="https://stripe.com/privacy" rel="noopener noreferrer" target="_blank">Datenschutzerklärung
        von Stripe</a>. Wir setzen keine Werbe- oder Social-Media-Cookies.
      </p>

      <h2>4. Analyse und Werbung</h2>
      <p>
        Wir verwenden <strong>Google Analytics 4</strong>, einen Webanalysedienst von Google, um in
        aggregierter Form zu verstehen, wie die Website genutzt wird, damit wir sie verbessern können.
        Google Analytics setzt die oben aufgeführten Cookies (<code>_ga</code> und{' '}
        <code>_ga_&lt;id&gt;</code>) und verarbeitet Nutzungsdaten wie aufgerufene Seiten, den ungefähren
        Standort (abgeleitet aus einer gekürzten IP-Adresse, die nicht gespeichert wird) sowie Geräte- und
        Browsertyp. Wir haben es ausschließlich für die Reichweitenmessung konfiguriert: Wir verwenden es{' '}
        <strong>nicht</strong> für Werbung, personalisierte Werbung oder Google Ads, und wir verkaufen diese
        Daten nicht und geben sie nicht weiter. Für Googles Umgang mit den Daten gilt die{' '}
        <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Datenschutzerklärung
        von Google</a>.
      </p>
      <p>Sie können Google Analytics jederzeit widersprechen:</p>
      <ul>
        <li>
          Installieren Sie das{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">Browser-Add-on
          zur Deaktivierung von Google Analytics</a>, das Google Analytics auf allen von Ihnen besuchten
          Websites unterbindet.
        </li>
        <li>
          Blockieren oder löschen Sie die <code>_ga</code>-Cookies über Ihre Browsereinstellungen (siehe
          Abschnitt 5).
        </li>
        <li>Nutzen Sie die „Do Not Track“- oder Tracking-Schutz-Funktionen Ihres Browsers.</li>
      </ul>
      <p>
        Wir verwenden keine Werbe-, Remarketing- oder Social-Media-Tracking-Cookies. Wo das Gesetz vor dem
        Setzen nicht unbedingt erforderlicher Cookies eine Einwilligung verlangt (zum Beispiel für Besucher
        in der EU, im Vereinigten Königreich oder in vergleichbaren Rechtsordnungen), gilt diese
        Anforderung für die oben genannten Analyse-Cookies, und Sie können die Widerspruchsmöglichkeiten in
        diesem Abschnitt jederzeit nutzen.
      </p>

      <h2>5. Wie Sie Cookies steuern können</h2>
      <p>
        Sie können Cookies über Ihre Browsereinstellungen steuern oder löschen und den Local Storage und
        Session Storage auf dieselbe Weise leeren. Da die oben genannten Einträge unbedingt erforderlich
        oder funktional sind, hindert Sie ihr Blockieren nicht daran, die Website zu nutzen, aber einige
        Funktionen (etwa das Speichern Ihres Designs oder Ihrer Sprache, das Angemeldetbleiben oder das
        Gutschreiben einer Empfehlung) funktionieren dann möglicherweise nicht wie vorgesehen.
      </p>

      <h2>6. Änderungen dieser Richtlinie</h2>
      <p>
        Wir können diese Cookie-Richtlinie aktualisieren, wenn sich unsere Praktiken ändern. In diesem Fall
        aktualisieren wir das oben angegebene Datum „Zuletzt aktualisiert“.
      </p>

      <h2>7. Kontakt</h2>
      <p>
        Fragen zu unserer Verwendung von Cookies? Kontaktieren Sie uns unter{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </>
  );
}

const cookies: LegalContent = {
  title: 'Cookie-Richtlinie',
  description:
    'Welche Cookies und welchen Browser-Speicher Saver Miles verwendet, warum wir sie verwenden und wie Sie sie steuern können, einschließlich Google Analytics für die aggregierte Reichweitenmessung. Wir verwenden keine Werbe-Cookies.',
  intro:
    'Diese Richtlinie erklärt, welche Cookies und welchen Browser-Speicher unsere Website verwendet, wozu sie dienen und wie Sie sie steuern können.',
  Body,
};

export default cookies;
