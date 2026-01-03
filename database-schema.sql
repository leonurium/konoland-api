-- Konoha Land API Database Schema
-- This schema matches the CSV file structure exactly

-- Create provinces table
CREATE TABLE provinces (
  code BIGINT PRIMARY KEY,
  province VARCHAR(255) NOT NULL
);

-- Create regencies table
-- CSV columns: code, province_code, regency, type
CREATE TABLE regencies (
  code BIGINT PRIMARY KEY,
  province_code BIGINT NOT NULL,
  regency VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Kota', 'Kabupaten')),
  FOREIGN KEY (province_code) REFERENCES provinces(code)
);

-- Create districts table
-- CSV columns: code, regency_code, district
CREATE TABLE districts (
  code BIGINT PRIMARY KEY,
  regency_code BIGINT NOT NULL,
  district VARCHAR(255) NOT NULL,
  FOREIGN KEY (regency_code) REFERENCES regencies(code)
);

CREATE INDEX idx_districts_regency_code ON districts(regency_code);

-- Create villages table
-- CSV columns: code, district_code, village, postal_code
CREATE TABLE villages (
  code BIGINT PRIMARY KEY,
  district_code BIGINT NOT NULL,
  village VARCHAR(255) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  FOREIGN KEY (district_code) REFERENCES districts(code)
);

