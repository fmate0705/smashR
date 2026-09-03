import { ButtonLink } from '@/components/ui/button';
import { PinMark, PlatformMark } from '@/components/ui/platform-mark';
import { directionsUrl, orderLinks } from '@/content/site';
import { cn } from '@/lib/cn';

type Layout = 'row' | 'column';

interface OrderButtonsProps {
  readonly className?: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly layout?: Layout;
  /** Adds the route-planning action beside the ordering ones. */
  readonly withDirections?: boolean;
  /** Both platforms, or just the primary one. */
  readonly platforms?: 'both' | 'primary';
}

/**
 * The site's conversion block.
 *
 * SmashR takes orders on two platforms and the primary is foodora, so foodora is always the
 * filled button and Wolt is always the outlined one — a customer should never have to work out
 * which of two identical buttons the restaurant prefers.
 *
 * Each button carries the platform's own icon and then just its name. "Rendelés — foodora" said
 * the obvious twice; the icon already says where the button goes, and the surrounding section
 * already says what it is for.
 */
export function OrderButtons({
  className,
  size = 'md',
  layout = 'row',
  withDirections = false,
  platforms = 'both',
}: OrderButtonsProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        layout === 'row' ? 'flex-col sm:flex-row sm:flex-wrap sm:items-center' : 'flex-col',
        className,
      )}
    >
      <ButtonLink
        href={orderLinks.foodora.href}
        external
        size={size}
        ariaLabel="Rendelés a foodorán, új lapon nyílik meg"
      >
        <PlatformMark platform="foodora" />
        foodora
      </ButtonLink>

      {platforms === 'both' ? (
        <ButtonLink
          href={orderLinks.wolt.href}
          external
          variant="secondary"
          size={size}
          ariaLabel="Rendelés a Wolton, új lapon nyílik meg"
        >
          <PlatformMark platform="wolt" />
          Wolt
        </ButtonLink>
      ) : null}

      {withDirections ? (
        <ButtonLink
          href={directionsUrl}
          external
          variant="secondary"
          size={size}
          ariaLabel="Útvonaltervezés a Google Térképen, új lapon nyílik meg"
        >
          <PinMark />
          Útvonal
        </ButtonLink>
      ) : null}
    </div>
  );
}
