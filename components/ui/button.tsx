import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Two buttons, and only two.
 *
 * A third variant is where a design system starts to leak: every new surface asks for "one more"
 * and the page ends up with five weights of the same action. Primary is the order; secondary is
 * everything else. Both are square-cornered, like every other block on the site — the geometry is
 * the brand, and a rounded control inside a squared layout reads as borrowed from somewhere else.
 *
 * The secondary hover fills from the bottom edge upward. It is drawn with a pseudo-element scaled
 * on the Y axis rather than a height or background-position transition, because only transform
 * and opacity can be composited — a fill animated on a layout property janks on the first frame,
 * which is exactly the frame the visitor is looking at.
 */
export const buttonVariants = cva(
  [
    'group relative isolate inline-flex select-none items-center justify-center gap-2.5',
    'overflow-hidden rounded-none font-medium uppercase tracking-[0.08em]',
    'transition-[color,background-color,border-color,transform] duration-fast ease-emphasized',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-primary focus-visible:ring-offset-[rgb(var(--smashr-ground))]',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-[rgb(240_20_32)]',
        // Drawn in the surface's own ink rather than in white, so the same button is legible on
        // the black tile, on the paper and on the beige without the caller choosing a colour.
        secondary: [
          'border-2 border-[rgb(var(--smashr-ink)/0.9)] bg-transparent',
          'text-[rgb(var(--smashr-ink))] hover:text-[rgb(var(--smashr-ground))]',
        ].join(' '),
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-sm sm:px-10 sm:text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;

/**
 * The rising white fill behind a secondary button's label.
 *
 * `-z-10` keeps it under the text without a stacking context of its own, and `origin-bottom`
 * with `scale-y` is what makes it grow upward from the bottom edge.
 */
function SecondaryFill() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[rgb(var(--smashr-ink))]',
        'transition-transform duration-normal ease-emphasized',
        'group-hover:scale-y-100 group-focus-visible:scale-y-100',
        'motion-reduce:transition-none',
      )}
    />
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

/** An action button. Use `ButtonLink` for navigation. */
export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {variant === 'secondary' ? <SecondaryFill /> : null}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends VariantProps<typeof buttonVariants> {
  readonly href: string;
  readonly className?: string;
  readonly children: React.ReactNode;
  /** Renders an outbound link with the referrer and opener protections it needs. */
  readonly external?: boolean;
  readonly ariaLabel?: string;
}

/**
 * A link styled as a button.
 *
 * External links open in a new tab and carry `rel="noopener noreferrer"` — SmashR's ordering
 * happens on foodora and Wolt, so most of this site's primary actions leave the site, and none
 * of them should hand the destination a handle back to this window.
 */
export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  external = false,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const fill = variant === 'secondary' ? <SecondaryFill /> : null;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {fill}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {fill}
      {children}
    </Link>
  );
}

export type { ButtonVariant };
