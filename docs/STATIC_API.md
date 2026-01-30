# Static API (GitHub Pages)

The same Indonesian region data is available as **static JSON files** you can host on GitHub Pages. Response shape matches the main Konoland API (`{ data, meta }` for lists, single object for detail).

## Generate locally

From the repo root:

```bash
npm run generate:static
```

Output: `static-api/api/` (provinces, regencies, districts, villages as JSON).

## Host on your own GitHub Pages (fork)

### 1. Fork the repo

Fork [konoland-api](https://github.com/leonurium/konoland-api) to your GitHub account.

### 2. Enable GitHub Pages

In **your fork**:

1. Go to **Settings** → **Pages**.
2. Under **Build and deployment**:
   - **Source**: choose **GitHub Actions** (the workflow will deploy the static API).
3. No need to create a branch manually; the workflow handles deployment.

### 3. Deploy

- **Automatic**: Every push to `main` runs the workflow and deploys the static API.
- **Manual**: **Actions** → **Deploy Static API to GitHub Pages** → **Run workflow**.

Your site will be available at:

- **Landing page**: `https://<your-username>.github.io/konoland-api/` (same as the main project landing page)
- **Static API**: `https://<your-username>.github.io/konoland-api/api/` (e.g. `.../api/provinces.json`)

(Replace `konoland-api` with your repo name if you renamed it.) When served from GitHub Pages, the landing page uses the same-origin static API for demos and the playground.

## Endpoints (same shape as main API)

| Purpose | URL | Response |
|--------|-----|----------|
| List provinces | `/api/provinces.json` | `{ data: [...], meta: { limit, page, total } }` |
| One province | `/api/province/{code}.json` | `{ code, province }` |
| Regencies by province | `/api/regencies/{provinceCode}.json` | `{ data: [...], meta }` (each item has `province`) |
| One regency | `/api/regency/{code}.json` | `{ code, provinceCode, regency, type, province }` |
| Districts by regency | `/api/districts/{regencyCode}.json` | `{ data: [...], meta }` (each item has `regency`) |
| One district | `/api/district/{code}.json` | `{ code, regencyCode, district, regency }` |
| Villages by district | `/api/villages/{districtCode}.json` | `{ data: [...], meta }` (each item has `district`, `postalCode`) |
| One village | `/api/village/{code}.json` | `{ code, districtCode, village, postalCode, district }` |

Codes and field names match the main API (camelCase, e.g. `provinceCode`, `postalCode`).

## Data source

Generated from `data/2025/` CSVs (same as the main API). Regenerate after updating those files, then push to trigger a new deploy.

## Limits

- No pagination or sorting: each list file returns all items for that parent.
- Data is fixed at build time; update CSVs and redeploy to refresh.

## Bandwidth & Shared API

**The public static API** (`https://leonurium.github.io/konoland-api/api/`) is shared among all users and subject to **GitHub Pages' 100GB/month bandwidth limit**.

- Average JSON file size: ~1KB per request
- Estimated capacity: ~3 million requests/month (shared)
- If this limit is reached, the API may be temporarily unavailable

### Why you should fork and self-host (2-minute setup!)

**For production use or high traffic apps**, we strongly recommend forking and hosting on **your own GitHub Pages**:

**Free forever** – No costs, GitHub Pages is 100% free  
**Your own 100GB/month** – Dedicated bandwidth, not shared  
**100% uptime** – No dependency on the shared public API  
**Fast** – Static files served from GitHub's CDN  
**Easy** – Just fork, enable Pages, done!  
**Customizable** – Add your own data or modify responses