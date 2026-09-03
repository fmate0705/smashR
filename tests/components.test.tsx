import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonLink } from '@/components/ui/button';
import { SmashImage } from '@/components/ui/smash-image';
import { Logo } from '@/components/ui/logo';
import { ProductCard } from '@/components/sections/product-card';
import { menuItems } from '@/content/menu';
import { WIDTHS } from '@/lib/images/responsive';

describe('ButtonLink', () => {
  it('protects the opener on outbound links, which is most of this site’s actions', () => {
    render(
      <ButtonLink href="https://example.com" external>
        Rendelés
      </ButtonLink>,
    );
    const link = screen.getByRole('link', { name: 'Rendelés' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('keeps internal links in the tab, with no rel of their own', () => {
    render(<ButtonLink href="/etlap">Étlap</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Étlap' });
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('rel')).toBeNull();
  });

  it('lets the accessible name say where an outbound link goes', () => {
    render(
      <ButtonLink href="https://example.com" external ariaLabel="Rendelés a foodorán, új lapon">
        Rendelés
      </ButtonLink>,
    );
    expect(screen.getByRole('link', { name: 'Rendelés a foodorán, új lapon' })).toBeDefined();
  });
});

describe('SmashImage', () => {
  it('always reserves its box, so nothing below it moves when the bytes land', () => {
    render(
      <SmashImage
        base="/images/story/tortenetunk"
        widths={WIDTHS.story}
        sizes="50vw"
        alt="A pult"
      />,
    );
    const image = screen.getByRole('img', { name: 'A pult' });
    expect(Number(image.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(image.getAttribute('height'))).toBeGreaterThan(0);
  });

  it('offers every built width in the srcset', () => {
    render(
      <SmashImage
        base="/images/burger/complete"
        widths={WIDTHS.burger}
        sizes="40vw"
        alt="Burger"
      />,
    );
    const srcSet = screen.getByRole('img', { name: 'Burger' }).getAttribute('srcset') ?? '';
    for (const width of WIDTHS.burger) {
      expect(srcSet).toContain(`-${width}.webp`);
    }
  });

  it('hides a decorative image from assistive technology rather than reading an empty name', () => {
    const { container } = render(
      <SmashImage base="/images/texture/paper.webp" widths={[1400]} sizes="100vw" alt="" />,
    );
    expect(container.querySelector('img')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('loads eagerly only when told it is the largest paint', () => {
    const { container, rerender } = render(
      <SmashImage base="/images/burger/complete" widths={WIDTHS.burger} sizes="40vw" alt="a" />,
    );
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('lazy');

    rerender(
      <SmashImage
        base="/images/burger/complete"
        widths={WIDTHS.burger}
        sizes="40vw"
        alt="a"
        priority
      />,
    );
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('eager');
  });
});

describe('Logo', () => {
  it('names itself for assistive technology by default', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'SmashR' })).toBeDefined();
  });

  it('goes silent when the brand name is already in the surrounding text', () => {
    const { container } = render(<Logo decorative />);
    expect(container.querySelector('img')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('ProductCard', () => {
  const photographed = menuItems.find((item) => item.image !== undefined);
  const woltOnly = menuItems.find((item) => item.channels.length === 1);

  it('names the item, its price and its destination in one accessible name', () => {
    if (photographed === undefined) {
      throw new Error('fixture: expected at least one photographed menu item');
    }
    render(
      <ul>
        <ProductCard item={photographed} />
      </ul>,
    );
    const link = screen.getByRole('link');
    const name = link.getAttribute('aria-label') ?? '';
    expect(name).toContain(photographed.name);
    expect(name).toContain('Ft');
    expect(name).toContain('új lapon');
  });

  it('sends a Wolt-only size to Wolt, not to the platform that does not sell it', () => {
    if (woltOnly === undefined) {
      throw new Error('fixture: expected at least one single-platform menu item');
    }
    render(
      <ul>
        <ProductCard item={woltOnly} />
      </ul>,
    );
    expect(screen.getByRole('link').getAttribute('href')).toContain('wolt.com');
  });
});
