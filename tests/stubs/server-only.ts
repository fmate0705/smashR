/**
 * `server-only` exists to fail the *build* when a client component imports a server module. The
 * test runner is neither a client nor a server bundle — it is Node — so the real package's browser
 * entry throws on import and takes the suite with it. Aliased to this empty module in
 * `vitest.config.ts`, the guard keeps doing its job in the build and stays out of the way here.
 */
export {};
