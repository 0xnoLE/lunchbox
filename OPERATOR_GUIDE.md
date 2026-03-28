# Operator Guide — Neighborhood Discovery Platform

This document is for developers or technical co-founders picking up this project. It covers what's built, how to extend it, and what to add when you're ready to take it beyond a local app.

---

## 1. Current Architecture

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS

**Free APIs in use (no keys required):**

| API | Used For | Endpoint |
|---|---|---|
| Nominatim (OpenStreetMap) | ZIP/city → lat/lon geocoding | `nominatim.openstreetmap.org/search` |
| Overpass API | Nearby restaurants, shops, parks, attractions | `overpass-api.de/api/interpreter` |
| US Census Bureau CBP | Employment by industry sector per ZIP | `api.census.gov/data/2021/cbp` |

**Key files:**
- `src/lib/geocode.ts` — geocoding logic
- `src/lib/places.ts` — Overpass POI queries
- `src/lib/employers.ts` — Census employment data
- `src/app/api/` — server-side API routes (proxy layer to avoid CORS)
- `src/components/NeighborhoodSummary.tsx` — plain-English verdict card
- `src/components/AreaStats.tsx` — computed neighborhood scores

**Limitations of current free data:**
- OpenStreetMap coverage is excellent in cities, sparse in rural areas
- Census CBP data is from 2021 (most recent available at time of build)
- No ratings, photos, or real-time hours
- No school data, crime data, or cost of living

---

## 2. API Upgrade Paths

### 2a. Places & Points of Interest

#### Google Places API ⭐ Highest impact upgrade
- **Adds:** Ratings, photos, real-time open/closed, user reviews, price range, much better coverage
- **Cost:** ~$17 per 1,000 requests (Nearby Search). Free $200/month credit covers ~11K searches.
- **Get key:** console.cloud.google.com → Enable "Places API"
- **Add to `.env.local`:** `GOOGLE_PLACES_API_KEY=your_key_here`
- **Integrate in:** `src/lib/places.ts` — replace or supplement Overpass queries with:
  ```
  GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
    ?location={lat},{lon}&radius=2000&type=restaurant&key={KEY}
  ```

#### Yelp Fusion API
- **Adds:** Star ratings, review count, price tier ($ / $$ / $$$), cuisine type, photos
- **Cost:** Free tier — 500 requests/day
- **Get key:** yelp.com/developers → Create App
- **Add to `.env.local`:** `YELP_API_KEY=your_key_here`
- **Integrate in:** `src/lib/places.ts` for dining category only:
  ```
  GET https://api.yelp.com/v3/businesses/search
    ?latitude={lat}&longitude={lon}&categories=restaurants&limit=20
  Authorization: Bearer {KEY}
  ```

#### Foursquare Places API
- **Adds:** Venue tips, trending places, visit counts
- **Cost:** Free tier available (limited calls/day)
- **Get key:** foursquare.com/developers
- **Add to `.env.local`:** `FOURSQUARE_API_KEY=your_key_here`

---

### 2b. Schools

#### GreatSchools API ⭐ High value for families
- **Adds:** School ratings (1–10), grades served (K-12), school type, test scores, district name
- **Cost:** Free for non-commercial use
- **Get key:** greatschools.org/api → Request access
- **Add to `.env.local`:** `GREATSCHOOLS_API_KEY=your_key_here`
- **Integrate:** Add a "Schools" tab in `src/app/explore/[location]/page.tsx` using:
  ```
  GET https://api.greatschools.org/schools/nearby
    ?key={KEY}&lat={lat}&lon={lon}&limit=10
  ```
- **Also show in:** `NeighborhoodSummary` — "X schools nearby, avg rating Y/10"

#### National Center for Education Statistics (NCES)
- **Adds:** School location data, enrollment numbers, public/private
- **Cost:** Free, no key needed
- **Endpoint:** `https://nces.ed.gov/ccd/schoolsearch/`

---

### 2c. Jobs & Employment

#### Bureau of Labor Statistics (BLS) API
- **Adds:** Current unemployment rate by county, more up-to-date than Census CBP
- **Cost:** Free. Key optional (higher rate limits with key)
- **Get key (optional):** data.bls.gov/registrationEngine/
- **Add to `.env.local`:** `BLS_API_KEY=your_key_here`
- **Integrate in:** `src/lib/employers.ts`:
  ```
  POST https://api.bls.gov/publicAPI/v2/timeseries/data/
  Body: { "seriesid": ["LAUCN{county_fips}0000000003"], "registrationkey": "{KEY}" }
  ```
  Series code format: LAUS + county FIPS + `0000000003` (unemployment rate)

#### Indeed Publisher API
- **Adds:** Real job listings with titles, company names, salaries, apply links
- **Cost:** Free for non-commercial
- **Get key:** indeed.com/publisher
- **Add to `.env.local`:** `INDEED_PUBLISHER_KEY=your_key_here`
- **Integrate:** Add "Open Jobs" section in the Jobs tab

#### LinkedIn Jobs API
- **Adds:** Professional job listings with LinkedIn apply
- **Cost:** Requires LinkedIn developer account + OAuth partner agreement
- **Note:** Harder to get access; start with Indeed instead

---

### 2d. Safety & Crime

#### FBI Crime Data Explorer API ⭐ Free and authoritative
- **Adds:** Violent crime rate, property crime rate per 100K residents by city/county
- **Cost:** Free
- **Get key:** api.data.gov/signup
- **Add to `.env.local`:** `FBI_API_KEY=your_key_here`
- **Endpoint:**
  ```
  GET https://api.usa.gov/crime/fbi/cde/summarized/agency/{ori}/violent-crime
    ?from=2019&to=2021&API_KEY={KEY}
  ```
- **Show in:** `AreaStats.tsx` as a "Safety" score bar

#### CrimeGrade.org API
- **Adds:** Simple A–F crime grade per neighborhood, very family-friendly format
- **Cost:** Commercial (~$50/month)
- **Integrate:** Replace or supplement FBI data for better UX

---

### 2e. Walkability & Transit

#### Walk Score API ⭐ Drop-in replacement for computed walkability
- **Adds:** Official Walk Score (0–100), Transit Score, Bike Score per address
- **Cost:** Free for non-commercial / low-volume
- **Get key:** walkscore.com/professional/api.php
- **Add to `.env.local`:** `WALKSCORE_API_KEY=your_key_here`
- **Integrate in:** `src/components/AreaStats.tsx` — replace `walkabilityScore` computation:
  ```
  GET https://api.walkscore.com/score
    ?format=json&lat={lat}&lon={lon}&wsapikey={KEY}
  ```

#### Google Maps Distance Matrix
- **Adds:** Real commute time estimates to a user-specified workplace
- **Cost:** ~$5 per 1,000 requests
- **Use same key as Google Places** (`GOOGLE_PLACES_API_KEY`)

---

### 2f. Real Estate & Cost of Living

#### Rentcast API
- **Adds:** Average rent by bedroom count, rent trends, rental market data
- **Cost:** Free tier available
- **Get key:** rentcast.io
- **Add to `.env.local`:** `RENTCAST_API_KEY=your_key_here`

#### API Ninjas — Cost of Living
- **Adds:** Cost of living index, grocery/utilities/transport costs vs national average
- **Cost:** Free tier — 10,000 requests/month
- **Get key:** api-ninjas.com
- **Endpoint:**
  ```
  GET https://api.api-ninjas.com/v1/costoflivingindex?city={city}
  X-Api-Key: {KEY}
  ```

#### Zillow (via Bridge Interactive)
- **Adds:** Median home price, price trends, Zestimate
- **Note:** Requires broker/MLS partnership — not straightforward for a startup

---

### 2g. Weather & Environment

#### OpenWeatherMap API
- **Adds:** Current conditions, seasonal climate summary, average temperatures
- **Cost:** Free tier — 1,000 requests/day
- **Get key:** openweathermap.org/api
- **Add to `.env.local`:** `OPENWEATHER_API_KEY=your_key_here`

#### EPA AirNow API
- **Adds:** Air Quality Index (AQI) — very relevant for families with asthma/allergies
- **Cost:** Free, no key needed
- **Endpoint:**
  ```
  GET https://www.airnowapi.org/aq/observation/zipCode/current/
    ?format=application/json&zipCode={zip}&distance=25&API_KEY={KEY}
  ```
  (Key from airnowapi.org — free)

---

### 2h. Demographics

#### US Census American Community Survey (ACS) API
- **Adds:** Population, median household income, education levels, age breakdown, % families with children
- **Cost:** Free
- **Get key:** api.census.gov/data/key_signup.html
- **Add to `.env.local`:** `CENSUS_API_KEY=your_key_here`
- **Sample query:**
  ```
  GET https://api.census.gov/data/2022/acs/acs5
    ?get=NAME,B19013_001E,B01003_001E,B15003_022E
    &for=zip+code+tabulation+area:{zip}
    &key={KEY}
  ```
  `B19013_001E` = median household income, `B01003_001E` = total population

---

## 3. Environment Variables

Create a `.env.local` file in the project root. Never commit this file — it's in `.gitignore`.

```bash
# .env.local — copy this, fill in keys as you add APIs

# Google (Places, Maps, Distance Matrix — one key covers all)
GOOGLE_PLACES_API_KEY=

# Yelp
YELP_API_KEY=

# Foursquare
FOURSQUARE_API_KEY=

# GreatSchools
GREATSCHOOLS_API_KEY=

# Bureau of Labor Statistics (optional — raises rate limits)
BLS_API_KEY=

# Walk Score
WALKSCORE_API_KEY=

# FBI Crime Data (via api.data.gov)
FBI_API_KEY=

# OpenWeatherMap
OPENWEATHER_API_KEY=

# EPA AirNow
AIRNOW_API_KEY=

# Rentcast
RENTCAST_API_KEY=

# API Ninjas (cost of living)
API_NINJAS_KEY=

# US Census ACS
CENSUS_API_KEY=
```

In API routes, access with `process.env.GOOGLE_PLACES_API_KEY`.

---

## 4. Deployment

### Vercel (Recommended — free tier works great)
1. Install CLI: `npm i -g vercel`
2. Run: `vercel --prod` in the project root
3. Add environment variables: Vercel Dashboard → Project → Settings → Environment Variables
4. Free tier: 100GB bandwidth/month, unlimited deployments

### Netlify
- Add `netlify.toml`:
  ```toml
  [build]
  command = "npm run build"
  publish = ".next"

  [[plugins]]
  package = "@netlify/plugin-nextjs"
  ```
- Add env vars in Netlify dashboard

### Self-hosted (VPS / DigitalOcean)
```bash
# Build
npm run build

# Run with PM2
npm i -g pm2
pm2 start npm --name lunchbox -- start
pm2 save && pm2 startup

# Nginx reverse proxy config
# proxy_pass http://localhost:3000;
```

---

## 5. User Accounts & Saved Neighborhoods

When you're ready to let users save favorites:

### Auth — Use Clerk (easiest)
- clerk.com — free up to 10,000 MAU
- Install: `npm install @clerk/nextjs`
- Wrap `src/app/layout.tsx` in `<ClerkProvider>`
- Add `<SignInButton>` / `<UserButton>` to header

### Database — Use Supabase (free tier)
- supabase.com — free 500MB PostgreSQL
- Schema for saved neighborhoods:
  ```sql
  CREATE TABLE saved_neighborhoods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL,         -- from Clerk
    query text NOT NULL,           -- e.g. "Austin TX"
    display_name text,             -- e.g. "Austin, TX"
    nickname text,                 -- user's custom label
    notes text,
    overall_score integer,
    saved_at timestamptz DEFAULT now()
  );
  ```
- Install: `npm install @supabase/supabase-js`
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

---

## 6. Alerts & Notifications

"Alert me when new restaurants open near [ZIP]" feature:

### Architecture
1. Store user alert preferences in Supabase (`alert_subscriptions` table: `user_id`, `zip`, `categories[]`, `email`)
2. Daily cron job re-queries Overpass API for subscribed ZIPs
3. Diff results against stored snapshot (`neighborhood_snapshots` table)
4. Email users when new places appear

### Email — Use Resend
- resend.com — free 3,000 emails/month
- Install: `npm install resend`
- Add `RESEND_API_KEY` to `.env.local`
- Basic send:
  ```typescript
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'alerts@yourdomain.com',
    to: user.email,
    subject: '3 new restaurants opened near 78701',
    html: '...',
  });
  ```

### Cron — Use Vercel Cron Jobs (free)
- Add to `vercel.json`:
  ```json
  {
    "crons": [{ "path": "/api/cron/check-alerts", "schedule": "0 8 * * *" }]
  }
  ```
- Create `src/app/api/cron/check-alerts/route.ts` that runs the diff + email logic

### SMS — Use Twilio
- twilio.com — pay per message (~$0.0079/SMS)
- Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` to `.env.local`

---

## 7. Production Readiness Checklist

- [ ] **Rate limiting** — Add `@upstash/ratelimit` with Redis to API routes. Free tier at upstash.com. Prevents abuse.
- [ ] **Response caching** — Cache Overpass/Nominatim responses in Redis for 24h. Speeds up repeat searches significantly.
- [ ] **Error monitoring** — Add Sentry (`npm install @sentry/nextjs`). Free tier covers small apps.
- [ ] **Analytics** — Add Plausible or Posthog. Privacy-friendly, no cookie banner needed.
- [ ] **Custom domain** — Point your domain to Vercel. Add SSL (automatic).
- [ ] **Open Graph images** — Add `opengraph-image.tsx` per route for nice social sharing previews.
- [ ] **Accessibility** — Run axe DevTools browser extension. Fix any ARIA/contrast issues.
- [ ] **Mobile testing** — Test on actual iOS/Android. Tab bar scrollability is critical.
- [ ] **Overpass rate limiting** — Overpass API has usage limits. For production traffic, consider running your own Overpass instance or caching aggressively.
- [ ] **Nominatim ToS** — For high traffic, Nominatim requires you to either self-host or use a commercial provider. At scale, switch to Google Geocoding API.

---

## 8. Data Quality Notes

- **OpenStreetMap** coverage is excellent in major US cities, good in suburbs, sparse in rural areas. Results will be thin for rural ZIPs — this is expected.
- **Census CBP 2021** is the most recent year available as of this build. Check `api.census.gov/data.html` for newer releases and update the year in `src/lib/employers.ts`.
- **Scores are relative, not absolute.** A "Family Friendliness: 82" means 82 relative to a 2km radius sample — not a nationally standardized rating. Be transparent about this with users.
- To improve rural data, consider adding an "Edit on OpenStreetMap" link to encourage local contributors.

---

## 9. Monetization Options

If the platform goes commercial:

- **Freemium** — Free searches, paid "Full Neighborhood Report" PDF export
- **Affiliate links** — Link to Zillow/Realtor.com listings for the searched area. Both have affiliate programs.
- **Featured listings** — Let local businesses pay to be highlighted in results
- **White-label** — License to real estate agencies, relocation companies, HR departments helping new hires find housing
- **Data subscription** — Monthly access for real estate investors tracking neighborhood trends

---

## 10. Quick-Start Checklist for New Operators

1. Clone the repo and run `npm install && npm run dev`
2. Test a few searches — try a major city and a ZIP code
3. Copy `.env.local.example` → `.env.local` (or create from the template in section 3 above)
4. **First upgrade:** Get a free Walk Score API key and replace the computed walkability score
5. **Second upgrade:** Get a free Yelp API key to add star ratings to dining results
6. **Third upgrade:** Get a free GreatSchools API key to add a Schools tab — huge for families
7. Deploy to Vercel (`vercel --prod`) — takes under 5 minutes
8. Set up Sentry for error monitoring before sharing publicly
9. Add Supabase + Clerk when you're ready for user accounts and saved neighborhoods
10. Set up Vercel cron + Resend when you're ready for neighborhood alerts

---

*Built with Next.js 16 · Data from OpenStreetMap, Overpass API, and US Census Bureau*
