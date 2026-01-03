-- Konoha Land API Database Schema (with custom schema support)
-- This file shows how to create tables in a specific schema
-- 
-- INSTRUCTIONS:
-- 1. Replace 'YOUR_SCHEMA_NAME' with your actual schema name (e.g., 'konoland-schema')
-- 2. Run this SQL in your Supabase SQL Editor
--
-- Example: If your schema is 'konoland-schema', replace all 'YOUR_SCHEMA_NAME' with 'konoland-schema'

-- Step 1: Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS YOUR_SCHEMA_NAME;

-- Step 2: Set search path to use the schema (optional, but recommended)
SET search_path TO YOUR_SCHEMA_NAME;

-- Step 3: Create provinces table
CREATE TABLE YOUR_SCHEMA_NAME.provinces (
  code BIGINT PRIMARY KEY,
  province VARCHAR(255) NOT NULL
);

-- Step 4: Create regencies table
-- CSV columns: code, province_code, regency, type
CREATE TABLE YOUR_SCHEMA_NAME.regencies (
  code BIGINT PRIMARY KEY,
  province_code BIGINT NOT NULL,
  regency VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Kota', 'Kabupaten')),
  FOREIGN KEY (province_code) REFERENCES YOUR_SCHEMA_NAME.provinces(code)
);

-- Step 5: Create districts table
-- CSV columns: code, regency_code, district
CREATE TABLE YOUR_SCHEMA_NAME.districts (
  code BIGINT PRIMARY KEY,
  regency_code BIGINT NOT NULL,
  district VARCHAR(255) NOT NULL,
  FOREIGN KEY (regency_code) REFERENCES YOUR_SCHEMA_NAME.regencies(code)
);

-- Step 6: Create index on districts
CREATE INDEX idx_districts_regency_code ON YOUR_SCHEMA_NAME.districts(regency_code);

-- Step 7: Create villages table
-- CSV columns: code, district_code, village, postal_code
CREATE TABLE YOUR_SCHEMA_NAME.villages (
  code BIGINT PRIMARY KEY,
  district_code BIGINT NOT NULL,
  village VARCHAR(255) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  FOREIGN KEY (district_code) REFERENCES YOUR_SCHEMA_NAME.districts(code)
);

