import { SiteChrome } from '@/components/site/site-chrome';
import { NotFoundContent } from '@/components/sections/not-found-content';

/**
 * The global 404: a URL that matches no route at all.
 *
 * At the root, because that is where Next looks when nothing matches — and there it is wrapped by
 * the root layout only, so it draws the site's chrome itself. A mistyped address still arrives
 * somewhere with a way out of it.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
