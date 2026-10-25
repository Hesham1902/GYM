# GYM — Workout & Posture PWA

Offline-first personal fitness app for iPhone: a 4-day Upper/Lower program with a return-to-gym ramp, a live workout logger, a progression engine, and a posture / kyphosis correction module. Bilingual: Egyptian Arabic (default, RTL) and English.

All data stays on the phone (localStorage + IndexedDB). No accounts, no server.

## Run locally

```bash
npm install
npm run dev
```

Open `http://<your-mac-ip>:5173` on the iPhone (same Wi-Fi). The service worker and Add to Home Screen need HTTPS, so install from the deployed site, not from the dev server.

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | type-check + production build into `dist/` |
| `npm run preview` | serve `dist/` with the service worker |
| `npm run test` | Vitest: progression engine, timers, data integrity |
| `npm run icons` | regenerate PNG icons from `public/icons/icon.svg` |

## Deploy (GitHub Pages)

1. Create an empty GitHub repository and push this folder to its `main` branch.
2. In the repository settings → Pages, set Source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
4. Open the Pages URL in Safari on the iPhone → Share → **Add to Home Screen**. Launch from the Home Screen for fullscreen and offline use.

The app uses a hash router and relative asset paths, so it works under any sub-path.

## Structure

```
src/data/exercises/   74 exercises with bilingual coaching guides, alternatives, posture drills
src/data/program.ts   Upper A / Lower A / Upper B / Lower B slots
src/data/routines.ts  posture routines (daily, gym activation, gym decompression)
src/data/poses.ts     stick-figure keyframes for the animated illustrations
src/engine/           week ramp, double progression, est. 1RM, volume, warm-up calculator
src/stores/           settings and the crash-safe active workout (localStorage)
src/db/               Dexie schema, repositories, JSON/CSV export and import
src/features/         one folder per screen
src/i18n/             en.ts is the source of keys; ar.ts must define every key (tsc enforces it)
```

## How the program works

- Week 1: 1 working set per exercise (2 on the first compound), ~4 RIR. Week 2: 2 sets, ~3 RIR. Week 3+: 2–3 sets, ~2 RIR. The week comes from the program start date or the override in Settings.
- Double progression: reps climb inside the target range first. When every working set hits the top of the range with clean form and no joint pain, the next session suggests +2.5 kg (dumbbells, cables, isolation) or +5 kg (machines, leg press). Joint pain or two sloppy sets suggest a 10% drop.
- History is keyed by exercise, so swapping a machine for an alternative keeps each exercise's own progression.

## iPhone notes

- Rest and hold timers are timestamp based: lock the phone, come back, the countdown is still right. iOS does not run JavaScript while locked, so the beep plays when the app returns to the foreground.
- iOS Safari has no vibration API; the toggle is hidden there.
- Back up from Settings → Export JSON now and then. Safari can evict site data from sites it considers unused; an installed Home Screen app is normally safe, but a backup costs nothing.
