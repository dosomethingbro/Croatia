# Split History Companion – Vercel Maps Package

This version focuses on reliable Google Maps pins.

## Files

- `index.html` — map command center with all 30 stop pins
- `full-history-guide.html` — full history companion
- `split-history-stops-google-my-maps.csv` — import into Google My Maps for a true all-pins map
- `vercel.json` — static Vercel config
- `DEPLOYMENT.md` — deployment steps

## How to use

Deploy to Vercel, then open `index.html` on your phone.

Use:
- route buttons for reliable route chunks
- individual pin buttons for exact stop locations
- CSV import for a true Google My Maps layer with all 30 pins

## Why route chunks?

Google Maps URLs do not reliably support 30 named waypoints. Splitting by Core Palace / Medieval / Waterfront / Salona-Klis makes the pins and names much more reliable.
