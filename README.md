<div align="center">

![Konoha Land API Banner](./banner.png)

# 🌏 Konoha Land API

**Free Indonesian Administrative Regions API**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/leonurium/konoland-api)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Live API**: [https://konoland-api.vercel.app](https://konoland-api.vercel.app) 🆓 Free to use!

</div>

## 📖 About

**Konoha Land API** is a free, open-source REST API providing comprehensive data about Indonesian administrative regions (Provinces, Regencies, Districts, and Villages).

**Inspired by**: [Wilayah Nusantara API](https://github.com/theodevoid/wilayah-nusantara) by [@theodevoid](https://github.com/theodevoid)

### ✨ Features

- 🆓 **100% Free** - No API keys required
- 🚀 **Fast & Reliable** - Powered by Vercel serverless
- 📊 **Complete Data** - 34 provinces, 514 regencies, 7,000+ districts, 80,000+ villages
- 🔄 **Backward Compatible** - Drop-in replacement for legacy API
- 📦 **Self-Hostable** - Deploy to your own Vercel account

## 🚀 Quick Start

### Option 1: Use the Free Public API (Easiest)

The API is available for free - no setup needed!

```bash
# Get all provinces
curl https://konoland-api.vercel.app/province

# Get province by code
curl https://konoland-api.vercel.app/province/11

# Search by name
curl https://konoland-api.vercel.app/province?name=Jawa
```

### Option 2: Self-Host on Vercel (5 minutes)

1. **Fork this repository** on GitHub
2. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier works)
3. **Get your database URL** from Supabase Settings → Database
4. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your forked repository
   - Add environment variable: `DATABASE_URL` (your Supabase connection string)
   - Click Deploy
5. **Import data** (see Database Setup below)

## 📡 API Endpoints

All endpoints return data in this format:

```json
{
  "data_header": {
    "status": "OK",
    "message": "Success",
    "time_stamp": "2024-01-01T00:00:00.000Z",
    "trace_code": "uuid"
  },
  "data_body": {
    // Your data here
  }
}
```

### Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /province` | List provinces (paginated) | `/province?page=1&limit=10` |
| `GET /province/:code` | Get province by code | `/province/11` |
| `GET /regency` | List regencies (paginated) | `/regency?provinceCode=11` |
| `GET /regency/:code` | Get regency by code | `/regency/1101` |
| `GET /district` | List districts (paginated) | `/district?regencyCode=1101` |
| `GET /district/:code` | Get district by code | `/district/110101` |
| `GET /village` | List villages (paginated) | `/village?districtCode=110101` |
| `GET /village/:code` | Get village by code | `/village/1101012001` |

### Query Parameters

All list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `name` - Search by name (partial match)
- `code` - Filter by code (returns entity directly)
- `provinceCode` - Filter by parent province
- `regencyCode` - Filter by parent regency
- `districtCode` - Filter by parent district

## 🗄️ Database Setup (For Self-Hosting)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project
2. Get your connection string from **Settings** → **Database**
3. Use **Connection Pooling** URL for Vercel (port 6543)

### Step 2: Create Tables

**Option A: Use the SQL file (Recommended)**

- **For default 'public' schema**: Copy and paste the contents of `database-schema.sql` into Supabase SQL Editor, then click **Run**.
- **For custom schema**: Use `database-schema-with-schema.sql` instead. Replace `YOUR_SCHEMA_NAME` with your actual schema name (e.g., 'konoland-schema'), then run it.

**Option B: Copy SQL manually**

Run this SQL in Supabase SQL Editor:

```sql
-- Create provinces table
CREATE TABLE provinces (
  code BIGINT PRIMARY KEY,
  province VARCHAR(255) NOT NULL
);

-- Create regencies table
CREATE TABLE regencies (
  code BIGINT PRIMARY KEY,
  province_code BIGINT NOT NULL,
  regency VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Kota', 'Kabupaten')),
  FOREIGN KEY (province_code) REFERENCES provinces(code)
);

-- Create districts table
CREATE TABLE districts (
  code BIGINT PRIMARY KEY,
  regency_code BIGINT NOT NULL,
  district VARCHAR(255) NOT NULL,
  FOREIGN KEY (regency_code) REFERENCES regencies(code)
);

CREATE INDEX idx_districts_regency_code ON districts(regency_code);

-- Create villages table
CREATE TABLE villages (
  code BIGINT PRIMARY KEY,
  district_code BIGINT NOT NULL,
  village VARCHAR(255) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  FOREIGN KEY (district_code) REFERENCES districts(code)
);
```

### Step 3: Import CSV Data

CSV files are in `data/2022/` directory - **ready to import, columns match database exactly!**

1. Go to Supabase **Table Editor**
2. Import in this order (important for foreign keys!):
   - `provinces.csv` → `provinces` table
   - `regencies.csv` → `regencies` table  
   - `districts.csv` → `districts` table
   - `villages.csv` → `villages` table
3. For each file:
   - Select the table
   - Click **Insert** → **Import data from CSV**
   - Upload the file
   - ✅ Columns will auto-map correctly (no manual mapping needed!)

**CSV Files** (columns match database exactly):
- `provinces.csv`: `code, province` (34 provinces)
- `regencies.csv`: `code, province_code, regency, type` (514 regencies)
- `districts.csv`: `code, regency_code, district` (7,276 districts)
- `villages.csv`: `code, district_code, village, postal_code` (83,762 villages)

### Step 4: Configure Environment Variables

In Vercel dashboard (or `.env` file for local development), add:
- `DATABASE_URL` - Your Supabase Connection Pooling URL
- `NODE_ENV=production` (or `development` for local)
- `APP_ENV=production` (or `development` for local)
- `DATABASE_SCHEMA` (Optional) - Specify a custom schema name if you're not using the default 'public' schema

**Example `.env` file:**
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
NODE_ENV=production
APP_ENV=production
DATABASE_SCHEMA=aloe  # Optional: only if using a custom schema
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm
- Supabase account (for database)

### Setup

```bash
# Clone repository
git clone https://github.com/leonurium/konoland-api.git
cd konoland-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your Supabase credentials
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Start development server
npm run start:dev

# API will be available at http://localhost:3000
```

### Available Scripts

```bash
npm run start:dev      # Start with hot reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run lint           # Run linter
```

## 📊 Data Statistics

- **34 Provinces** (Provinsi)
- **514 Regencies** (Kota/Kabupaten)
- **7,276 Districts** (Kecamatan)
- **83,762 Villages** (Desa/Kelurahan)

Data is accurate as of 2022 and follows official Indonesian government structure.

## 🔄 Backward Compatibility

This API is **100% backward compatible** with the original [Wilayah Nusantara API](https://github.com/theodevoid/wilayah-nusantara):

- ✅ Same response format
- ✅ Same endpoints
- ✅ Same query parameters
- ✅ Same error messages
- ✅ Drop-in replacement

Existing applications can switch to this API without any code changes!

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/leonurium/konoland-api.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables (see Database Setup)
   - Click Deploy

3. **Your API is live!** 🎉

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

ISC License - See [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **[Wilayah Nusantara API](https://github.com/theodevoid/wilayah-nusantara)** by [@theodevoid](https://github.com/theodevoid) - Original inspiration
- Indonesian government for administrative region data
- [Supabase](https://supabase.com) for free PostgreSQL hosting
- [Vercel](https://vercel.com) for free serverless hosting

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/leonurium/konoland-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leonurium/konoland-api/discussions)

---

<div align="center">

Made with ❤️ for the Indonesian developer community

**Konoha Land API** - Free Indonesian Administrative Regions API

⭐ Star this repo if you find it useful!

</div>
