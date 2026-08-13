# Pixel Speed Sim Racing — Website Rebuild

Static rebuild of **pixelspeedsimracing.com** for Pixel Speed Sim Racing, DFW's first
dedicated sim racing lounge (Murphy, TX). Replaces the existing Hostinger/Zyro build.

No frameworks, no build step — plain HTML, one stylesheet, one script. Drop the folder
on any host (or GitHub Pages) and it runs.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `pricing.html` | Pricing & Memberships |
| `parties.html` | Parties & Groups |
| `mobile-rigs.html` | Rent Our Mobile Rigs |
| `rig-builds.html` | Turn-Key Rig Builds |
| `academy.html` | Sim Racing Academy |
| `contact.html` | Contact & Hours |

Shared: `style.css`, `main.js`, `images/` (logo in AVIF + PNG fallback).

## Business details baked in

- **222 E FM 544, Suite 206, Murphy, TX 75094**
- **945-333-9115** · support@pixelspeedsimracing.com
- Instagram: [@pixelspeedsimracing](https://www.instagram.com/pixelspeedsimracing)
- Bookings: every "Book Now" points at **https://bookings.clubspeed.com/PSR/PSMurphy** (ClubSpeed)
- Hours: Mon closed · Tue–Sat 12PM–10PM · Sun 2PM–9PM

## Design

Modeled on the racing landing-page concept supplied with the brief, recolored to Pixel
Speed's own brand:

| Token | Value | Use |
|---|---|---|
| `--ink-900` | `#0A1826` | base canvas |
| `--blue-700` / `--blue-500` | `#123A63` / `#1B6FA8` | gradient mids |
| `--blue` | `#1B9CE0` | "PIXEL" blue — primary accent |
| `--red` | `#E01B22` | "SPEED" red — CTAs |
| `--cyan` | `#4FE0E8` | eyebrows, underlines, Sunday hours |
| `--gold` | `#F2B300` | chevron strips, step markers |

Display type is Barlow Condensed italic with Anton for the mega headlines (skewed to
match the logo's italic lettering). Recurring devices: angular `[ ]` bracket frames,
gold chevron racing strips, diagonal section cuts, clipped-corner cards, numbered step
flow with a connector line that draws itself.

## Motion

Scroll reveals, hero parallax, animated chevrons, speed-streak overlays, count-up stats,
card hover tilt, and the step connector — all disabled under `prefers-reduced-motion`.

## SEO

- Per-page title/description/canonical/OG/Twitter tags
- `LocalBusiness`/`EntertainmentBusiness` JSON-LD on the home page (address, phone, hours,
  price range, geo, offers, `ReserveAction` → ClubSpeed)
- `Course` JSON-LD on the Academy page
- Local area coverage: Murphy, Plano, Wylie, Sachse, Richardson, Allen, Garland, Dallas
- `robots.txt` + `sitemap.xml`

## Photography

All imagery is Pixel Speed's own, pulled from the current live site (Zyro CDN) and
re-cropped. Sources are cached in `images/` as WebP + JPEG pairs, served via `<picture>`
so modern browsers get WebP and everything else falls back to JPEG. The hero background
additionally ships AVIF.

| Asset | Used on |
|---|---|
| `hero-bg` | Home hero (the lounge mid-session — client-selected) |
| `racers-pair` | Home / About |
| `driver-wheel` | Home / Memberships |
| `coach-driver` | Home / Academy, Academy hero + feature |
| `mobile-rigs` | Home / Additional Services, Mobile Rigs hero + feature |
| `wheel-closeup` | Home / Turn-Key card, Rig Builds hero |
| `rig-ferrari-tall` | Rig Builds feature |
| `lounge-empty` | Pricing hero, Contact hero + feature |
| `lounge-racing` | Pricing feature, Parties feature |
| `hero-lounge` | Parties hero |
| `ig-1` … `ig-6` | Home / Instagram grid |

Two source stills (`still023`, `still033`) were letterboxed 2.39:1 inside a 16:9 frame;
the black bars are stripped before cropping. Total image payload is roughly 4 MB across
all pages, every file lazy-loaded except the hero.

## Before launch — confirm with the client

1. **Membership details conflict with their own graphic.** The build follows the numbers in
   the brief. Their current site's memberships table (`pixel-speed-memberships-061526-v2`)
   says something different on three points:
   - Student "friends & family" discount: brief says **20%**, graphic says **10%**
   - iRacing credit: brief says **$15 / $15 / $20**, graphic says **$10 / $10 / $15**
   - The graphic labels the top tier **"Summer Unlimited"** and shows the *3 months free
     iRacing* perk as **excluded** from it (brief lists that perk membership-wide)

   Confirm which is current before launch — this is live pricing.
2. Party / group pricing (placeholders marked `[confirm rate]` on `parties.html`)
3. Mobile rig rental rates + delivery radius (`mobile-rigs.html`)
4. Turn-key build tiers, inclusions and starting prices (`rig-builds.html`)
5. Academy schedule and whether it has its own booking link (`academy.html`)
6. League launch timing (referenced in membership benefits)
7. Target service areas listed above
8. Geo coordinates in the home-page JSON-LD are approximate for Murphy — replace with the
   exact suite location
9. Instagram grid is hand-placed stills, not a live feed — wire to a feed widget if they
   want it self-updating
10. Confirm they're happy re-using the current site's photography, or supply fresh shots

## Forms

The enquiry forms on `parties.html`, `mobile-rigs.html`, `rig-builds.html` and
`contact.html` validate client-side but post to `/f/demo`, which is not wired up. On
submit they surface the phone number instead of silently dropping the enquiry. Point the
`action` at a real endpoint (Formspree, Netlify Forms, etc.) before launch.
