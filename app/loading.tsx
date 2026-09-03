/**
 * The route-transition state.
 *
 * A black field with the wordmark on it, at the same scale the header uses, so a navigation reads
 * as the brand holding still for a moment rather than as a page falling apart into skeleton bars.
 * It fades in after a short delay, which is what keeps a fast navigation from flashing a loader
 * the visitor never needed to see.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[100svh] items-center justify-center bg-black motion-safe:animate-[smashr-loading-in_600ms_ease-out_both]"
    >
      <span className="sr-only">Betöltés…</span>
      <img
        src="/brand/smashr-logo.svg"
        width={1038}
        height={389}
        alt=""
        aria-hidden="true"
        className="w-40 opacity-70 motion-safe:animate-[smashr-pulse_1.6s_ease-in-out_infinite]"
      />
    </div>
  );
}
