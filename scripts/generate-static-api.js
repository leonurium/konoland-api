#!/usr/bin/env node
/**
 * Generate static API JSON files from data/2025 CSV files.
 * Output matches konoland-api response shape: { data, meta } for lists, single object for detail.
 * Run: node scripts/generate-static-api.js
 * Output: static-api/api/
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', '2025');
const OUT_DIR = path.join(__dirname, '..', 'static-api', 'api');

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] != null ? values[i] : '';
    });
    return row;
  });
  return { headers, rows };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeJson(filePath, obj) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 0) + '\n', 'utf8');
}

// --- Load CSVs ---
const provincesPath = path.join(DATA_DIR, 'provinces.csv');
const regenciesPath = path.join(DATA_DIR, 'regencies.csv');
const districtsPath = path.join(DATA_DIR, 'districts.csv');
const villagesPath = path.join(DATA_DIR, 'villages.csv');

if (!fs.existsSync(provincesPath)) {
  console.error('Missing data/2025/provinces.csv. Run from repo root.');
  process.exit(1);
}

const { rows: provinceRows } = parseCsv(provincesPath);
const { rows: regencyRows } = parseCsv(regenciesPath);
const { rows: districtRows } = parseCsv(districtsPath);
const { rows: villageRows } = parseCsv(villagesPath);

const provincesById = {};
provinceRows.forEach((r) => {
  provincesById[r.code] = { code: r.code, province: r.province };
});

// --- Build indexes ---
const regenciesByProvince = {};
regencyRows.forEach((r) => {
  const pc = r.province_code;
  if (!regenciesByProvince[pc]) regenciesByProvince[pc] = [];
  regenciesByProvince[pc].push({
    code: r.code,
    provinceCode: r.province_code,
    regency: r.regency,
    type: r.type,
    province: provincesById[r.province_code] || { code: r.province_code, province: '' },
  });
});

const districtsByRegency = {};
districtRows.forEach((r) => {
  const rc = r.regency_code;
  if (!districtsByRegency[rc]) districtsByRegency[rc] = [];
  const reg = regencyRows.find((x) => x.code === rc);
  const province = reg ? provincesById[reg.province_code] : null;
  districtsByRegency[rc].push({
    code: r.code,
    regencyCode: r.regency_code,
    district: r.district,
    regency: reg
      ? {
          code: reg.code,
          provinceCode: reg.province_code,
          regency: reg.regency,
          type: reg.type,
          province: province || {},
        }
      : {},
  });
});

const villagesByDistrict = {};
villageRows.forEach((r) => {
  const dc = r.district_code;
  if (!villagesByDistrict[dc]) villagesByDistrict[dc] = [];
  const dist = districtRows.find((x) => x.code === dc);
  const reg = dist ? regencyRows.find((x) => x.code === dist.regency_code) : null;
  const prov = reg ? provincesById[reg.province_code] : null;
  villagesByDistrict[dc].push({
    code: r.code,
    districtCode: r.district_code,
    village: r.village,
    postalCode: r.postal_code || '',
    district: dist
      ? {
          code: dist.code,
          regencyCode: dist.regency_code,
          district: dist.district,
          regency: reg
            ? { code: reg.code, provinceCode: reg.province_code, regency: reg.regency, type: reg.type, province: prov || {} }
            : {},
        }
      : {},
  });
});

// Sort by code for consistent output
Object.keys(regenciesByProvince).forEach((k) => regenciesByProvince[k].sort((a, b) => (a.code < b.code ? -1 : 1)));
Object.keys(districtsByRegency).forEach((k) => districtsByRegency[k].sort((a, b) => (a.code < b.code ? -1 : 1)));
Object.keys(villagesByDistrict).forEach((k) => villagesByDistrict[k].sort((a, b) => (a.code < b.code ? -1 : 1)));

// --- Emit list: provinces ---
const provincesList = provinceRows.map((r) => ({ code: r.code, province: r.province }));
writeJson(path.join(OUT_DIR, 'provinces.json'), {
  data: provincesList,
  meta: { limit: provincesList.length, page: 1, total: provincesList.length },
});

// --- Emit detail: province/{code}.json ---
const provinceDetailDir = path.join(OUT_DIR, 'province');
ensureDir(provinceDetailDir);
provinceRows.forEach((r) => {
  writeJson(path.join(provinceDetailDir, `${r.code}.json`), { code: r.code, province: r.province });
});

// --- Emit list: regencies/{provinceCode}.json ---
const regenciesListDir = path.join(OUT_DIR, 'regencies');
ensureDir(regenciesListDir);
Object.keys(regenciesByProvince).forEach((provinceCode) => {
  const data = regenciesByProvince[provinceCode];
  writeJson(path.join(regenciesListDir, `${provinceCode}.json`), {
    data,
    meta: { limit: data.length, page: 1, total: data.length },
  });
});

// --- Emit detail: regency/{code}.json ---
const regencyDetailDir = path.join(OUT_DIR, 'regency');
ensureDir(regencyDetailDir);
regencyRows.forEach((r) => {
  const province = provincesById[r.province_code] || {};
  writeJson(path.join(regencyDetailDir, `${r.code}.json`), {
    code: r.code,
    provinceCode: r.province_code,
    regency: r.regency,
    type: r.type,
    province: { code: province.code, province: province.province },
  });
});

// --- Emit list: districts/{regencyCode}.json ---
const districtsListDir = path.join(OUT_DIR, 'districts');
ensureDir(districtsListDir);
Object.keys(districtsByRegency).forEach((regencyCode) => {
  const data = districtsByRegency[regencyCode];
  writeJson(path.join(districtsListDir, `${regencyCode}.json`), {
    data,
    meta: { limit: data.length, page: 1, total: data.length },
  });
});

// --- Emit detail: district/{code}.json ---
const districtDetailDir = path.join(OUT_DIR, 'district');
ensureDir(districtDetailDir);
districtRows.forEach((r) => {
  const reg = regencyRows.find((x) => x.code === r.regency_code);
  const province = reg ? provincesById[reg.province_code] : null;
  writeJson(path.join(districtDetailDir, `${r.code}.json`), {
    code: r.code,
    regencyCode: r.regency_code,
    district: r.district,
    regency: reg
      ? { code: reg.code, provinceCode: reg.province_code, regency: reg.regency, type: reg.type, province: province || {} }
      : {},
  });
});

// --- Emit list: villages/{districtCode}.json ---
const villagesListDir = path.join(OUT_DIR, 'villages');
ensureDir(villagesListDir);
Object.keys(villagesByDistrict).forEach((districtCode) => {
  const data = villagesByDistrict[districtCode];
  writeJson(path.join(villagesListDir, `${districtCode}.json`), {
    data,
    meta: { limit: data.length, page: 1, total: data.length },
  });
});

// --- Emit detail: village/{code}.json ---
const villageDetailDir = path.join(OUT_DIR, 'village');
ensureDir(villageDetailDir);
villageRows.forEach((r) => {
  const dist = districtRows.find((x) => x.code === r.district_code);
  const reg = dist ? regencyRows.find((x) => x.code === dist.regency_code) : null;
  const prov = reg ? provincesById[reg.province_code] : null;
  writeJson(path.join(villageDetailDir, `${r.code}.json`), {
    code: r.code,
    districtCode: r.district_code,
    village: r.village,
    postalCode: r.postal_code || '',
    district: dist
      ? {
          code: dist.code,
          regencyCode: dist.regency_code,
          district: dist.district,
          regency: reg
            ? { code: reg.code, provinceCode: reg.province_code, regency: reg.regency, type: reg.type, province: prov || {} }
            : {},
        }
      : {},
  });
});

const totalFiles =
  1 +
  provinceRows.length +
  1 +
  Object.keys(regenciesByProvince).length +
  regencyRows.length +
  Object.keys(districtsByRegency).length +
  districtRows.length +
  Object.keys(villagesByDistrict).length +
  villageRows.length;

console.log('Static API generated:', OUT_DIR);
console.log('Total JSON files:', totalFiles);
