import Link from 'next/link';
import { Container } from '@/components/sections/surface';
import { ConsentSettingsButton } from '@/components/consent/consent-settings-button';
import { Logo } from '@/components/ui/logo';
import { SocialLinks } from '@/components/ui/social-links';
import { PlatformMark } from '@/components/ui/platform-mark';
import { credit, legalNavigation, openingHours, orderLinks, site } from '@/content/site';

/**
 * Site footer.
 *
 * Three bands rather than three columns. The top band is the brand and the two things a customer
 * most often wants at the bottom of a page — where to order and how to reach the venue. The
 * middle rule carries the legal links as one row, because four short titles stacked in a column
 * made a list of them; read across, they are what they are: fine print. The last band holds the
 * copyright, the consent control and the maker's mark.
 *
 * The consent control lives here on every page because withdrawing consent has to stay exactly as
 * easy as giving it was — a banner the visitor already dismissed is not a withdrawal path.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate border-t border-white/10 bg-black text-white">
      <Container width="wide">
        <div className="grid gap-12 py-16 md:grid-cols-[1.1fr_auto] md:items-start md:gap-16 lg:py-20">
          <div className="flex flex-col gap-7">
            <Link
              href="/"
              className="w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              aria-label="SmashR — vissza a főoldalra"
            >
              <Logo tone="red" className="w-44" decorative />
            </Link>

            <div className="flex flex-col gap-1.5 text-sm text-white/60">
              <address className="not-italic">{site.address.full}</address>
              <a
                href={site.phone.href}
                className="w-fit transition-colors duration-fast hover:text-white focus-visible:text-primary focus-visible:outline-none"
              >
                {site.phone.display}
              </a>
              {openingHours.map((slot) => (
                <span key={slot.label} className="text-white/45">
                  {slot.label}: <span className="tabular-nums">{slot.hours}</span>
                </span>
              ))}
            </div>

            <SocialLinks className="text-white" />
          </div>

          {/* Ordering, as the platforms themselves — the mark identifies the destination faster
              than the name does, and the name is right beside it anyway. */}
          <div className="flex flex-col gap-3 md:min-w-[15rem]">
            {Object.values(orderLinks).map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 border border-white/15 px-4 py-3.5 transition-colors duration-fast hover:border-primary/70 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <PlatformMark
                  platform={link.label === 'Wolt' ? 'wolt' : 'foodora'}
                  className="h-6 w-6"
                />
                <span className="smashr-display text-sm">{link.label}</span>
                <span
                  aria-hidden="true"
                  className="ml-auto text-white/35 transition-[color,transform] duration-normal ease-emphasized group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:group-hover:translate-x-0"
                >
                  →
                </span>
                <span className="sr-only">— rendelés, új lapon nyílik meg</span>
              </a>
            ))}
          </div>
        </div>

        <nav
          aria-label="Jogi információk"
          className="border-t border-white/10 py-6 text-sm text-white/55"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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

        <div className="flex flex-col items-center gap-3 border-t border-white/10 py-6 text-xs text-white/35 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.legalName}. Minden jog fenntartva.
          </p>
          <p>
            Készítette:{' '}
            <a
              href={credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 underline underline-offset-4 transition-colors duration-fast hover:text-white focus-visible:text-primary focus-visible:outline-none"
            >
              {credit.label}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
