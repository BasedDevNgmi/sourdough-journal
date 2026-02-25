-- WildYeast Supabase Schema
-- Designed by The Architect

-- Starter Logs: Tracking the health and feeding of the wild yeast
CREATE TABLE starter_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    feed_ratio TEXT NOT NULL DEFAULT '1:1:1', -- e.g., '1:2:2'
    starter_amount_g INTEGER NOT NULL,
    flour_fed_g INTEGER NOT NULL,
    water_fed_g INTEGER NOT NULL,
    peak_time_hr NUMERIC, -- hours until peak activity
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Loaves: The final ritual, from flour to bread
CREATE TABLE loaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL DEFAULT 'Daily Loaf',
    total_flour_g INTEGER NOT NULL,
    hydration_pct NUMERIC NOT NULL,
    salt_pct NUMERIC NOT NULL,
    starter_pct NUMERIC NOT NULL,
    bulk_ferment_hr NUMERIC,
    proof_hr NUMERIC,
    baking_method TEXT, -- e.g., 'Dutch Oven', 'Open Bake'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    starter_id UUID REFERENCES starter_logs(id)
);

-- Setup RLS (Row Level Security) if needed later
-- ALTER TABLE starter_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loaves ENABLE ROW LEVEL SECURITY;
