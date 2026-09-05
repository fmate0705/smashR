import { NotFoundContent } from '@/components/sections/not-found-content';

/**
 * The boundary for a `notFound()` thrown by a page inside the site.
 *
 * Without it those calls unwind to the root boundary and the response comes back HTTP 200 with the
 * 404 drawn inside it — a soft 404, which a search engine indexes as a real page. No chrome here:
 * this one renders inside `(site)/layout.tsx`, which already has it.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
