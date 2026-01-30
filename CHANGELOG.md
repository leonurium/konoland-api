# Changelog

All notable changes to Konoland API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 2026-01-30

### Added
- 📄 **Static API on GitHub Pages** – Same data as JSON files, no backend required:
  - Generator script: `scripts/generate-static-api.js` (reads `data/2025/` CSVs, outputs `static-api/api/`)
  - Response shape matches main API: `{ data, meta }` for lists, single object for detail
  - Endpoints: `api/provinces.json`, `api/province/{code}.json`, `api/regencies/{provinceCode}.json`, `api/regency/{code}.json`, `api/districts/{regencyCode}.json`, `api/district/{code}.json`, `api/villages/{districtCode}.json`, `api/village/{code}.json`
- 🌐 **Landing page on GitHub Pages** – Root URL serves the same landing page as Vercel; when served from `*.github.io`, demos and playground use the same-origin static API
- 🤖 **GitHub Actions workflow** – `Deploy Static API to GitHub Pages` (push to `main` or manual): generates static API, copies `public/index.html` to output, deploys to GitHub Pages (Source: GitHub Actions)
- 📜 **npm script** – `npm run generate:static` to generate static API locally
- 📖 **Documentation** – [docs/STATIC_API.md](docs/STATIC_API.md) for fork-and-host steps and endpoint reference

### Changed
- **README** – Option 2 (Static API) now describes landing page + API URLs, feature bullet for static API, `generate:static` and test script in Available Scripts, roadmap item checked, acknowledgments for api-wilayah-indonesia and GitHub Pages, bandwidth limitation note to encourage forking
- **docs/STATIC_API.md** – Added "Bandwidth & Shared API" section explaining GitHub Pages' 100GB/month limit and why users should fork for production use

---

## 2026-01-24

### 🎉 Major Update: 2025 Government Data

Complete migration to **Kepmendagri No 300.2.2-2138 Tahun 2025** official data.

### Added
- ✨ **4 new provinces** in Papua region:
  - Papua Selatan (code: 93)
  - Papua Tengah (code: 94)
  - Papua Pegunungan (code: 95)
  - Papua Barat Daya (code: 96)
- 📮 **Complete postal code coverage** for all 83,762 villages (100%)
- 🔀 **Sorting feature** - `sortBy` and `sortDirection` query parameters

### Changed
- 📊 **Updated to 2025 data**:
  - Provinces: 34 → **38** (+4)
  - Districts: 7,276 → **7,285** (+9)
  - Villages: 83,762 (same count, updated data)
- 🔄 **Response format consistency**: All fields use camelCase (JavaScript standard)
  - `province_code` → `provinceCode`
  - `regency_code` → `regencyCode`
  - `district_code` → `districtCode`
  - `postal_code` → `postalCode`

### Maintained
- ✅ **100% Backward compatibility** with 2022 API
- ✅ **Legacy parameter aliases** still work:
  - `provinsiCode` (alias for `provinceCode`)
  - `kabkotCode` (alias for `regencyCode`)
  - `kecamatanCode` (alias for `districtCode`)
- ✅ All existing endpoints unchanged
- ✅ Same response structure

### Fixed
- 🐛 Special character handling (apostrophes in village/district names like "Ma'u", "Ba'u")
- 🔧 Improved error handling in serverless function

### Data Sources
- **Administrative Regions**: Kepmendagri No 300.2.2-2138 Tahun 2025
- **Postal Codes**: Kepmendagri No 300.2.2-2138 Tahun 2025



## 2025

### Initial Release

- 🚀 First public release of Konoland API
- 📊 **2022 data** (Permendagri No 58 Tahun 2021):
  - 34 provinces
  - 514 regencies
  - 7,276 districts
  - 83,762 villages
- 🔄 Drop-in replacement for Wilayah Nusantara API
- 🆓 Free and open-source
- 📦 Self-hostable on Vercel
- 🗄️ PostgreSQL database (Supabase)
- 🔍 Search and filter capabilities
- 📄 Pagination support

### Endpoints
- `GET /province` - List all provinces
- `GET /province/:code` - Get province by code
- `GET /regency` - List regencies (with filters)
- `GET /regency/:code` - Get regency by code
- `GET /district` - List districts (with filters)
- `GET /district/:code` - Get district by code
- `GET /village` - List villages (with filters)
- `GET /village/:code` - Get village by code

### Features
- Query parameters: `name`, `code`, `provinceCode`, `regencyCode`, `districtCode`
- Pagination: `limit`, `page`
- Legacy aliases support
- JSON response format
- CORS enabled

---

## Links

- **Repository**: https://github.com/leonurium/konoland-api
- **Live API**: https://konoland-api.vercel.app
- **Documentation**: See README.md

---

## Credits

- **Original Inspiration**: [Wilayah Nusantara API](https://github.com/theodevoid/wilayah-nusantara) by [@theodevoid](https://github.com/theodevoid)
- **Indonesian Government**: Kepmendagri No 300.2.2-2138 Tahun 2025

---

**Note**: This API is maintained by the community. For issues or contributions, please open an issue on GitHub.