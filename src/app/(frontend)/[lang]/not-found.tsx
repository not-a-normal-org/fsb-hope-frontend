import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import NotFoundBody from './NotFoundBody';

/**
 * The public 404, in the visitor's language. Reached through `[...rest]` for
 * unknown URLs and through `notFound()` from any page (e.g. an unknown blog slug).
 * not-found receives no params, so the body reads the locale from LocaleProvider.
 */
export default function NotFound() {
  return (
    <>
      <NavBar />
      <NotFoundBody />
      <Footer />
    </>
  );
}
