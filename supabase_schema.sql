-- ============================================================
--  IKAZE — Compatible Cloud Database Schema (Supabase / PostgreSQL + PostGIS)
-- ============================================================
-- Run this in Supabase SQL Editor if you want live cloud sync
-- for tourist sites, Mediafire/Terabox videos, and user trip plans.

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Rwanda Districts (30 districts across 5 provinces)
CREATE TABLE districts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED
);

-- 2. Tourist Sites
CREATE TABLE tourist_sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  province TEXT NOT NULL,
  districts TEXT[] NOT NULL DEFAULT '{}',
  emoji TEXT,
  tagline TEXT,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  local_price TEXT,
  foreign_price TEXT,
  duration TEXT,
  best_time TEXT,
  distance_from_kigali TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  video_url TEXT, -- Mediafire or Terabox share link
  location GEOGRAPHY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Profiles (Tourists & Certified Tour Guides)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('tourist', 'guide')),
  nationality TEXT CHECK (nationality IN ('rwandan', 'foreigner')),
  district_id TEXT REFERENCES districts(id),
  rdb_license_no TEXT, -- For Tour Guides
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tour Guide Email Invitations
CREATE TABLE guide_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tourist_email TEXT NOT NULL,
  tourist_name TEXT,
  trip_title TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  personal_note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Guide Deliverables (Info, Itineraries, Mediafire/Terabox Videos, Meeting Points)
CREATE TABLE guide_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES guide_invitations(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('itinerary', 'site_info', 'video', 'meeting_point', 'permit_alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  site_id TEXT REFERENCES tourist_sites(id),
  video_url TEXT, -- Mediafire or Terabox link
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Saved Trip Plans / User Visits
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  device_id TEXT,
  user_type TEXT CHECK (user_type IN ('rwandan', 'foreigner')),
  district_id TEXT REFERENCES districts(id),
  site_id TEXT REFERENCES tourist_sites(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'visiting', 'visited')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Fast Geospatial Query: Find sites nearest to user's live GPS
CREATE OR REPLACE FUNCTION get_nearby_sites(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  limit_count INT DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  category TEXT,
  province TEXT,
  distance_km DOUBLE PRECISION
)
LANGUAGE SQL STABLE AS $$
  SELECT
    s.id,
    s.name,
    s.category,
    s.province,
    ROUND((ST_Distance(
      s.location,
      ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
    ) / 1000.0)::numeric, 2)::double precision AS distance_km
  FROM tourist_sites s
  ORDER BY s.location <-> ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
  LIMIT limit_count;
$$;
