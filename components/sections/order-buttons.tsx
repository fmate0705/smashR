import { ButtonLink } from '@/components/ui/button';
import { PinMark } from '@/components/ui/platform-mark';
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
  /** Keeps the row on one line in a narrow column, by trading away button padding. */
  readonly tight?: boolean;
  /**
   * Which action leads the row and carries the filled treatment. foodora everywhere the question
   * is what to order; route planning in the location block, where the question is how to get here
   * and the map beside it has already made that the subject.
   */
  readonly lead?: 'order' | 'directions';
}

/**
 * The site's conversion block.
 *
 * SmashR takes orders on two platforms and the primary is foodora, so foodora is always the
 * filled button and Wolt is always the outlined one — a customer should never have to work out
 * which of two identical buttons the restaurant prefers.
 *
 * Each button is just the platform's name. "Rendelés — foodora" said the obvious twice: the
 * surrounding section already says what the buttons are for, so the name alone is the label.
 */
export function OrderButtons({
  className,
  size = 'md',
  layout = 'row',
  withDirections = false,
  platforms = 'both',
  tight = false,
  lead = 'order',
}: OrderButtonsProps) {
  const item = tight ? 'flex-1 px-3 sm:px-4' : undefined;
  const directionsLeads = lead === 'directions' && withDirections;

  const directions = withDirections ? (
    <ButtonLink
      href={directionsUrl}
      external
      variant={directionsLeads ? 'primary' : 'secondary'}
      size={size}
      className={item}
      ariaLabel="Útvonaltervezés a Google Térképen, új lapon nyílik meg"
    >
      <PinMark />
      Útvonal
    </ButtonLink>
  ) : null;

  const order = (
    <>
      <ButtonLink
        href={orderLinks.foodora.href}
        external
        variant={directionsLeads ? 'secondary' : 'primary'}
        size={size}
        className={item}
        ariaLabel="Rendelés a foodorán, új lapon nyílik meg"
      >
        foodora
      </ButtonLink>

      {platforms === 'both' ? (
        <ButtonLink
          href={orderLinks.wolt.href}
          external
          variant="secondary"
          size={size}
          className={item}
          ariaLabel="Rendelés a Wolton, új lapon nyílik meg"
        >
          Wolt
        </ButtonLink>
      ) : null}
    </>
  );

  return (
    <div
      className={cn(
        'flex gap-3',
        layout === 'row' ? 'flex-col sm:flex-row sm:items-center' : 'flex-col',
        layout === 'row' && !tight && 'sm:flex-wrap',
        className,
      )}
    >
      {/* The leading action comes first in the DOM as well as in weight, so the tab order and the
          reading order agree with what the filled button is telling the eye. */}
      {directionsLeads ? (
        <>
          {directions}
          {order}
        </>
      ) : (
        <>
          {order}
          {directions}
        </>
      )}
    </div>
  );
}
