import type { LegalContent } from '@/components/site/LegalDoc';
import { SITE_EMAIL, SITE_LEGAL_NAME, SITE_ADDRESS_INLINE } from '@/lib/constants';
import { formatPrice } from '@/i18n/format';
import { PRICES_USD } from '@/lib/products';

const EMAIL = SITE_EMAIL;
// Prices come from the one table (src/lib/products.ts), never typed out.
const price = (key: keyof typeof PRICES_USD) => formatPrice('de', PRICES_USD[key]);

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
        Diese Allgemeinen Geschäftsbedingungen (die „Bedingungen“) sind eine verbindliche Vereinbarung
        zwischen Ihnen und der <strong>Saver Miles LLC</strong>, einer Limited Liability Company nach dem
        Recht des US-Bundesstaats Wyoming („Saver Miles“, „wir“, „uns“ oder „unser“), und regeln Ihren
        Zugang zur Website savermiles.com und deren Nutzung sowie die von uns erbrachten Leistungen
        (zusammen die „Leistungen“). Indem Sie die Leistungen nutzen, eine Suche anfragen, einen Alert
        abonnieren oder eine Zahlung leisten, stimmen Sie diesen Bedingungen zu. Wenn Sie nicht zustimmen,
        nutzen Sie die Leistungen nicht.
      </p>

      <h2>1. Wer wir sind und was die Leistungen umfassen</h2>
      <p>
        Saver Miles ist ein manueller, von Menschen betriebener Concierge-Service für Punkte und Meilen.
        Ein Spezialist sucht die Prämienverfügbarkeit von Hand über Bonusprogramme und Transferpartner
        hinweg und teilt Ihnen mit, was mit den Punkten, die Sie bereits besitzen, buchbar ist – zusammen
        mit den Punktekosten und den Schritten zur Buchung. Wir bieten einmalige Suchen (für
        Privatpersonen und für Unternehmen) sowie fortlaufende Strecken-Alerts an.
      </p>
      <p>
        Wir sind ein unabhängiger Dienst. Wir sind <strong>kein</strong> buchendes Reisebüro (Travel Agency
        of Record), keine Fluggesellschaft, keine Bank, kein Kartenaussteller und kein Bonusprogramm, und
        wir sind mit keinem von ihnen verbunden, werden von keinem von ihnen unterstützt und handeln nicht
        in deren Auftrag. In den meisten Fällen besitzen und verwalten <strong>Sie</strong> Ihre eigenen
        Bonusprogramm- und Kartenkonten, und Sie führen etwaige Punktetransfers sowie die endgültige
        Buchung anhand unserer Anleitung selbst durch. Wo ein Programm dies verlangt, nehmen Sie die
        Buchung selbst vor.
      </p>

      <h2>2. Voraussetzungen</h2>
      <p>
        Um die Leistungen zu nutzen, müssen Sie mindestens 18 Jahre alt und in der Lage sein, einen
        verbindlichen Vertrag zu schließen. Mit der Nutzung der Leistungen versichern Sie, dass Sie diese
        Voraussetzungen erfüllen und dass die von Ihnen gemachten Angaben zutreffend sind und Ihre eigenen
        sind (oder dass Sie berechtigt sind, sie zu machen).
      </p>

      <h2>3. Gebühren und Zahlung</h2>
      <p>Unsere aktuellen Gebühren sind auf unserer Preisseite aufgeführt und hier zusammengefasst:</p>
      <ul>
        <li>
          <strong>Suche für Privatpersonen.</strong> Eine <strong>Anzahlung von {price('deposit')}</strong> zum Start
          sowie eine <strong>Erfolgsgebühr von {price('successFee')}</strong> pro Person und Richtung, die nur berechnet
          wird, wenn wir einen für Sie buchbaren Platz bestätigen, der den von Ihnen angegebenen Kriterien
          entspricht. Die Erfolgsgebühr ist für jede Kabinenklasse gleich.
        </li>
        <li>
          <strong>Suche für Unternehmen.</strong> Der Preis wird pro Kundenkonto festgelegt. Wir
          vereinbaren die Gebühr mit Ihnen, bevor die Suche beginnt.
        </li>
        <li>
          <strong>Weekly Lookup Alert.</strong> Ein Abonnement (derzeit {price('weeklyMonthly')}/Monat oder der angegebene
          Jahrespreis), das einen automatisierten wöchentlichen Scan Ihrer Strecken liefert.
        </li>
        <li>
          <strong>Human Search Alert.</strong> Ein Abonnement (derzeit {price('humanMonthly')}/Monat oder der angegebene
          Jahrespreis), bei dem ein Spezialist Ihre Strecken in jedem Zyklus prüft.
        </li>
      </ul>
      <p>
        Zahlungen werden von unserem Zahlungsdienstleister Stripe abgewickelt. Indem Sie ein Zahlungsmittel
        angeben, ermächtigen Sie uns (über Stripe), die anfallenden Gebühren zu belasten, einschließlich
        wiederkehrender Abonnementgebühren bis zu Ihrer Kündigung. Die Gebühren sind in US-Dollar
        angegeben und verstehen sich ohne etwaige Steuern, für die Sie verantwortlich sind. Wir können
        unsere Gebühren mit Wirkung für die Zukunft ändern; für Sie gelten die Gebühren, die zu dem
        Zeitpunkt angezeigt (oder, bei einer Suche für Unternehmen, mit Ihnen vereinbart) sind, zu dem Sie
        eine Suche beauftragen oder ein Abonnement abschließen oder verlängern.
      </p>

      <h3>3.1 Wann die Erfolgsgebühr verdient ist</h3>
      <p>
        Bei einer Suche für Privatpersonen ist die Erfolgsgebühr <strong>verdient und fällig, sobald wir
        eine buchbare Prämienoption liefern, die den mit Ihnen vereinbarten Kriterien entspricht</strong> –
        auch wenn Sie sich anschließend entscheiden, sie nicht zu buchen, eine andere Reiseroute buchen,
        stattdessen bar bezahlen oder so lange warten, bis der Platz nicht mehr verfügbar ist.
        Prämienverfügbarkeit ist zeitkritisch und wird von Dritten kontrolliert; wir können sie nicht für
        Sie reservieren, und wir werden für die Sucharbeit vergütet, sobald ein qualifizierendes Ergebnis
        geliefert wurde. Wenn Sie Ihre Kriterien (Daten, Strecken, Reisende, Kabinenklasse oder verfügbare
        Punkte) ändern, nachdem wir Ergebnisse geliefert haben, gilt dies als neue Suche, für die eine neue
        Gebühr anfallen kann.
      </p>

      <h2>4. Erstattungen und Kündigungen</h2>
      <ul>
        <li>
          <strong>Die Anzahlung für Privatpersonen wird erstattet, wenn wir nichts Buchbares
          finden.</strong> Wenn wir keine Prämienoption finden, die Ihren Kriterien entspricht, wird Ihre{' '}
          <strong>Anzahlung von {price('deposit')} vollständig erstattet</strong>. Sobald wir ein qualifizierendes
          buchbares Ergebnis geliefert haben, ist die Sucharbeit abgeschlossen, und die Anzahlung wird auf
          Ihre Suche angerechnet statt erstattet.
        </li>
        <li>
          <strong>Gebühren für Suchen für Unternehmen</strong> werden für die Sucharbeit berechnet und
          sind nicht erstattungsfähig, sobald die Suche durchgeführt wurde.
        </li>
        <li>
          <strong>Abonnements</strong> (Alerts) verlängern sich automatisch, bis sie gekündigt werden. Sie
          können jederzeit über das Abrechnungsportal oder durch Kontaktaufnahme mit uns kündigen; die
          Kündigung beendet künftige Verlängerungen, und Ihr Zugang bleibt bis zum Ende des bereits
          bezahlten Zeitraums bestehen. Soweit gesetzlich nicht anders vorgeschrieben, werden bereits
          berechnete Abonnementgebühren nicht anteilig für einen angebrochenen Zeitraum erstattet.
        </li>
        <li>
          Dieser Abschnitt schränkt keine unabdingbaren Erstattungs- oder Widerrufsrechte ein, die Ihnen
          nach geltendem Verbraucherschutzrecht zustehen.
        </li>
      </ul>

      <h2>5. Keine Garantie der Verfügbarkeit</h2>
      <p>
        Die Prämienverfügbarkeit wird vollständig von Fluggesellschaften, Hotels und Bonusprogrammen
        festgelegt und kontrolliert, nicht von uns. Sie ist begrenzt, ändert sich ständig und kann zwischen
        dem Moment, in dem sie gefunden wird, und dem Moment Ihrer Buchung verschwinden. Dementsprechend
        garantieren wir <strong>nicht</strong>, dass bestimmte Prämienplätze existieren, dass sie bis zu
        Ihrer Buchung verfügbar bleiben oder dass eine bestimmte Fluggesellschaft, ein bestimmtes
        Flugzeug, eine bestimmte Kabinenklasse, ein bestimmter Sitzplatz, eine bestimmte Strecke oder
        Uhrzeit erhältlich ist. Von automatisierten Tools (einschließlich unseres Weekly Lookup Alert)
        angezeigte Verfügbarkeit kann „Phantom“-Verfügbarkeit sein, die ein Programm anzeigt, aber nicht
        bestätigt. Wir legen Ihnen die besten Optionen vor, die wir finden und überprüfen können; die
        endgültige Buchung und deren Zeitpunkt liegen bei Ihnen.
      </p>

      <h2>6. Ihre Pflichten</h2>
      <ul>
        <li>
          Machen Sie zutreffende, vollständige Angaben und halten Sie Ihre Punktestände und Reisewünsche
          aktuell.
        </li>
        <li>
          Behalten Sie die Kontrolle über Ihre eigenen Bonusprogramm- und Kartenkonten. <strong>Wir fragen
          niemals nach Ihren Kontopasswörtern</strong>, und Sie sollten sie niemals weitergeben. Wo ein
          Transfer oder eine Buchung von Ihrem Konto aus erfolgen muss, nehmen Sie diese anhand der von uns
          bereitgestellten Schritte selbst vor.
        </li>
        <li>
          Bezahlen Sie alle flugbezogenen Steuern, von der Fluggesellschaft erhobenen Zuschläge und
          sonstigen Gebühren Dritter, die mit einer Buchung verbunden sind.
        </li>
        <li>
          Stellen Sie sicher, dass Sie alle Anforderungen an Reisedokumente, Reisepass, Visum, Gesundheit
          und Einreise für Ihre Reise erfüllen. Wir sind dafür nicht verantwortlich und beraten nicht
          dazu.
        </li>
        <li>
          Halten Sie die Bedingungen der von Ihnen genutzten Bonusprogramme, Fluggesellschaften und
          Kartenaussteller ein.
        </li>
      </ul>

      <h2>7. Programme, Fluggesellschaften und Leistungen Dritter</h2>
      <p>
        Ihre Bonusprogrammkonten, Punkte, Transfers und Buchungen unterliegen den Bedingungen des
        jeweiligen Programms, der Fluggesellschaft oder des Kartenausstellers. Diese Dritten können
        Prämientabellen, Transferverhältnisse, Regeln oder Verfügbarkeiten ändern, Zuschläge erheben, Flüge
        ändern oder streichen sowie Konten oder Meilen sperren, schließen oder einziehen – all dies
        außerhalb unserer Kontrolle. Wir sind für deren Handlungen, Unterlassungen, Änderungen oder
        Entscheidungen weder verantwortlich noch haftbar. Unsere Leistungen können auf Drittanbieter
        angewiesen sein (zum Beispiel für Hosting, Zahlungen, E-Mail und Datenspeicherung); deren
        Verfügbarkeit ist nicht garantiert.
      </p>

      <h2>8. Beispielhafte Zahlen; keine Finanz-, Steuer- oder Reiseberatung</h2>
      <p>
        Punktbewertungen, beispielhafte Prämienpreise, Spannen und Beispiele auf unserer Website, in
        unserem Blog, in unserem Rechner und in unserer Kommunikation dienen <strong>nur der
        Veranschaulichung und Information</strong>. Sie sind keine Angebote, Kostenvoranschläge, Garantien
        oder ein Live-Verfügbarkeits-Feed und ändern sich häufig. Nichts, was wir bereitstellen, ist eine
        Finanz-, Steuer-, Buchhaltungs-, Rechts- oder professionelle Reiseberatung. Sie sind für Ihre
        eigenen Entscheidungen verantwortlich und sollten gegebenenfalls eine qualifizierte Fachperson
        hinzuziehen.
      </p>

      <h2>9. Zulässige Nutzung</h2>
      <p>
        Sie verpflichten sich, die Leistungen nicht zu missbrauchen: keine rechtswidrigen, betrügerischen
        oder rechtsverletzenden Aktivitäten; keine Versuche, die Leistungen zu stören, zurückzuentwickeln
        (Reverse Engineering) oder sich unbefugten Zugang zu ihnen zu verschaffen; kein Scraping oder
        massenhaftes Extrahieren, soweit nicht ausdrücklich gestattet; und keine Nutzung, die die Rechte
        anderer oder die Bedingungen eines Bonusprogramms verletzt. Wir können den Zugang sperren oder
        beenden, wenn ein Verhalten nach unserem vernünftigen Ermessen gegen diese Bedingungen verstößt
        oder den Leistungen oder anderen schadet.
      </p>

      <h2>10. Geistiges Eigentum</h2>
      <p>
        Die Website, ihre Inhalte, das Branding sowie der Name und die Marken von Saver Miles gehören uns
        oder unseren Lizenzgebern und sind durch Gesetze zum Schutz des geistigen Eigentums geschützt. Wir
        gewähren Ihnen eine beschränkte, persönliche, nicht ausschließliche, nicht übertragbare Lizenz zur
        Nutzung der Website für ihren vorgesehenen Zweck. Sie dürfen unsere Inhalte nicht kopieren,
        vervielfältigen, erneut veröffentlichen oder verwerten, soweit dies nicht ausdrücklich gestattet
        ist oder wir nicht vorher schriftlich zugestimmt haben.
      </p>

      <h2>11. Gewährleistungsausschluss</h2>
      <p>
        Die Leistungen werden im größtmöglichen gesetzlich zulässigen Umfang „wie besehen“ („as is“) und
        „wie verfügbar“ („as available“) bereitgestellt, ohne jegliche ausdrückliche, stillschweigende
        oder gesetzliche Gewährleistung, einschließlich stillschweigender Gewährleistungen der
        Marktgängigkeit, der Eignung für einen bestimmten Zweck, des Rechtsanspruchs und der
        Nichtverletzung von Rechten Dritter. Wir gewährleisten nicht, dass die Leistungen ununterbrochen
        oder fehlerfrei sind oder dass ein bestimmtes Ergebnis, eine Ersparnis, eine Verfügbarkeit oder eine
        Buchung erreicht wird.
      </p>

      <h2>12. Haftungsbeschränkung</h2>
      <p>
        Im größtmöglichen gesetzlich zulässigen Umfang haften Saver Miles und seine Gesellschafter,
        leitenden Angestellten, Mitarbeitenden und Auftragnehmer nicht für indirekte, beiläufig
        entstandene, besondere oder Folgeschäden, für Schadensersatz mit Straf- oder Abschreckungscharakter
        oder für entgangenen Gewinn sowie den Verlust von Punkten, Meilen, Reisen, Gelegenheiten oder
        Daten, die sich aus den Leistungen oder im Zusammenhang mit ihnen ergeben, selbst wenn auf die
        Möglichkeit hingewiesen wurde. Unsere gesamte Haftung für alle Ansprüche aus oder im Zusammenhang
        mit den Leistungen übersteigt nicht den Betrag der Gebühren, die Sie uns für die betreffende Suche
        oder, bei Abonnements, in den drei Monaten vor dem anspruchsbegründenden Ereignis tatsächlich
        gezahlt haben. Einige Rechtsordnungen lassen bestimmte Beschränkungen nicht zu, sodass Teile
        dieses Abschnitts möglicherweise nicht für Sie gelten.
      </p>

      <h2>13. Freistellung</h2>
      <p>
        Sie verpflichten sich, Saver Miles und seine Gesellschafter, leitenden Angestellten,
        Mitarbeitenden und Auftragnehmer von allen Ansprüchen, Schäden, Verlusten, Verbindlichkeiten und
        Kosten (einschließlich angemessener Rechtsverfolgungskosten) freizustellen und schadlos zu halten,
        die sich aus Ihrem Missbrauch der Leistungen, Ihrem Verstoß gegen diese Bedingungen oder Ihrer
        Verletzung von Gesetzen oder Rechten Dritter, einschließlich der Bedingungen eines Bonusprogramms,
        ergeben.
      </p>

      <h2>14. Änderungen der Leistungen und dieser Bedingungen</h2>
      <p>
        Wir können jeden Teil der Leistungen jederzeit ändern, aussetzen oder einstellen. Wir können diese
        Bedingungen auch aktualisieren; in diesem Fall ändern wir das oben angegebene Datum „Zuletzt
        aktualisiert“ und informieren Sie gegebenenfalls zusätzlich. Wenn Sie die Leistungen nach einer
        Aktualisierung weiter nutzen, akzeptieren Sie die überarbeiteten Bedingungen.
      </p>

      <h2>15. Anwendbares Recht und Streitigkeiten</h2>
      <p>
        Diese Bedingungen unterliegen dem Recht des US-Bundesstaats Wyoming unter Ausschluss seiner
        kollisionsrechtlichen Bestimmungen. Bevor Sie einen förmlichen Anspruch geltend machen,
        verpflichten Sie sich, uns zunächst unter <a href={`mailto:${EMAIL}`}>{EMAIL}</a> zu kontaktieren,
        damit wir versuchen können, die Angelegenheit einvernehmlich zu klären. Streitigkeiten, die nicht
        einvernehmlich beigelegt werden können, unterliegen der ausschließlichen Zuständigkeit der Gerichte
        des Bundesstaats Wyoming und der Bundesgerichte mit Sitz in Wyoming, und Sie erklären sich mit
        diesem Gerichtsstand einverstanden, es sei denn, das geltende Recht gewährt Ihnen das Recht, einen
        Anspruch an einem anderen Ort geltend zu machen.
      </p>

      <h2>16. Allgemeines</h2>
      <p>
        Sollte eine Bestimmung dieser Bedingungen als nicht durchsetzbar befunden werden, bleiben die
        übrigen Bestimmungen in Kraft. Wenn wir eine Bestimmung nicht durchsetzen, stellt dies keinen
        Verzicht dar. Sie dürfen diese Bedingungen nicht ohne unsere Zustimmung übertragen; wir dürfen sie
        im Zusammenhang mit einer Fusion, einer Übernahme oder einem Verkauf von Vermögenswerten
        übertragen. Diese Bedingungen stellen die gesamte Vereinbarung zwischen Ihnen und uns in Bezug auf
        die Leistungen dar. Wir haften nicht für Verzögerungen oder Ausfälle, die durch Ereignisse
        außerhalb unseres zumutbaren Einflussbereichs verursacht werden.
      </p>

      <h2>17. Kontakt</h2>
      <p>
        Fragen zu diesen Bedingungen? Wenden Sie sich an die <strong>Saver Miles LLC</strong> unter{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Eingetragene Anschrift: {SITE_LEGAL_NAME},{' '}
        {SITE_ADDRESS_INLINE}.
      </p>
    </>
  );
}

const terms: LegalContent = {
  title: 'Allgemeine Geschäftsbedingungen',
  description:
    'Die Bedingungen für die Prämienflugsuche und die Alerts von Saver Miles: Gebühren, Anzahlung und Erfolgsgebühr, Erstattungen und Kündigungen sowie die Grenzen unserer Leistungen.',
  intro:
    'Diese Bedingungen erklären, wie unsere Prämienflugsuche und unsere Alerts funktionieren, was sie kosten und wo die Grenzen dessen liegen, was wir zusagen können. Bitte lesen Sie sie, bevor Sie uns beauftragen.',
  Body,
};

export default terms;
