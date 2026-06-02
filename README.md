# Water + Up

A **frontend-only** nudge that pairs two micro-habits into one: drink a glass of
water **and** stand on your feet for 30 seconds. One reminder, two small wins. It
tracks your glasses (with a filling-glass visual toward a daily goal) and your
stand breaks, and resets each day. No backend, works offline.

## The flow

`home → running → nudge → stand`

Start nudges (default every 45m) → at each, a **water** prompt ("I drank") → a
**30-second stand** countdown → back to running.

## Tech

React 19 + TypeScript (strict), Vite, Tailwind v4, Zustand, Zod-validated
localStorage, PWA. Tested with Vitest + Testing Library and Playwright.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Notes

- The daily reset is a pure function (`lib/day.ts`), applied on read and
  unit-tested. The timers' updaters stay pure; transitions run in effects.
- Entrances animate transform only and keep `opacity: 1`. Two themes (aqua +
  light); reduced motion honored.

## License

MIT.
