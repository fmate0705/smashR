import Link from 'next/link';
import { Container } from '@/components/sections/surface';
import { ConsentSettingsButton } from '@/components/consent/consent-settings-button';
import { Logo } from '@/components/ui/logo';
import { SocialLinks } from '@/components/ui/social-links';
import { credit, legalNavigation, orderLinks, site } from '@/content/site';

/**
 * Site footer.
 *
 * Two rows, no rules. The address, phone and opening hours used to be repeated here; they are
 * already the subject of the section directly above on every page that has one, and printing them
 * twice was what made this block tall and hollow in the middle.
 *
 * The first row is the mark against the outbound links — the social accounts and the two ordering
 * platforms, both places to go. The second row is the fine print: ownership, the legal documents
 * and authorship, all one weight of information and so all one row.
 *
 * `z-20` rather than the default: the home page lifts its sections to z-10 to clear the sticky
 * hero, and a footer left in the z-auto layer has its wave painted over by that wrapper.
 *
 * The consent control sits with the legal links because withdrawing consent has to stay exactly as
 * easy as giving it was; a banner the visitor already dismissed is not a withdrawal path.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="smashr-wave-top relative isolate z-20 bg-black pt-[calc(var(--smashr-wave-h)+2.5rem)] text-white">
      <Container width="wide">
        <div className="flex flex-col gap-8 pb-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <Link
            href="/"
            className="w-fit shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            aria-label="SmashR — vissza a főoldalra"
          >
            <Logo tone="red" className="w-40" decorative />
          </Link>

          {/* Somewhere to go, twice over: the accounts, then the two platforms side by side. The
              platforms are alternatives, and stacking them made the second read as a lesser one. */}
          <div className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-4">
            <SocialLinks className="text-white" />
            <div className="flex items-center gap-3">
              {Object.values(orderLinks).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="smashr-display border border-white/20 px-5 py-3 text-sm transition-colors duration-fast hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {link.label}
                  <span className="sr-only"> — rendelés, új lapon nyílik meg</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* The fine-print line: ownership, the legal documents, authorship. All three are the same
            weight of information, so they share one row and one type size. */}
        <div className="flex flex-col items-center gap-4 pb-10 text-sm text-white/45 lg:flex-row lg:justify-between lg:gap-10">
          <p className="shrink-0">
            © {year} {site.legalName}. Minden jog fenntartva.
          </p>

          <nav aria-label="Jogi információk" className="lg:flex-1">
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-fast hover:text-white focus-visible:text-primary focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <ConsentSettingsButton className="transition-colors duration-fast hover:text-white focus-visible:text-primary focus-visible:outline-none" />
              </li>
            </ul>
          </nav>

          <p className="shrink-0">
            Készítette:{' '}
            <a
              href={credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline underline-offset-4 transition-colors duration-fast hover:text-white focus-visible:text-primary focus-visible:outline-none"
            >
              {credit.label}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
