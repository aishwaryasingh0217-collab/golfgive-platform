-- ===============================================
-- Golf Charity Subscription Platform — Database Schema
-- Run this in your Supabase SQL Editor
-- ===============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'visitor' CHECK (role IN ('visitor', 'subscriber', 'admin')),
  selected_charity_id UUID,
  contribution_percentage NUMERIC DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'lapsed')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCORES TABLE
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  played_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHARITIES TABLE
CREATE TABLE IF NOT EXISTS charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  website_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  total_received NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DRAWS TABLE
CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'published')),
  draw_numbers INTEGER[] DEFAULT '{}',
  prize_pool NUMERIC DEFAULT 0,
  five_match_prize NUMERIC DEFAULT 0,
  four_match_prize NUMERIC DEFAULT 0,
  three_match_prize NUMERIC DEFAULT 0,
  jackpot_rollover NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  drawn_at TIMESTAMPTZ
);

-- DRAW ENTRIES TABLE
CREATE TABLE IF NOT EXISTS draw_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_numbers INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_id, user_id)
);

-- DRAW RESULTS TABLE
CREATE TABLE IF NOT EXISTS draw_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('5-match', '4-match', '3-match')),
  matched_numbers INTEGER[] NOT NULL,
  prize_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHARITY CONTRIBUTIONS TABLE
CREATE TABLE IF NOT EXISTS charity_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WINNER VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS winner_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_result_id UUID REFERENCES draw_results(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proof_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- ROW LEVEL SECURITY
-- ===============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE winner_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, edit own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions: users see own, admins see all
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions FOR ALL USING (true);

-- Scores: users manage own
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);

-- Charities: public read, admin manage
CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);
CREATE POLICY "Service role can manage charities" ON charities FOR ALL USING (true);

-- Draws: public read
CREATE POLICY "Draws are viewable by everyone" ON draws FOR SELECT USING (true);
CREATE POLICY "Service role can manage draws" ON draws FOR ALL USING (true);

-- Draw entries: users manage own
CREATE POLICY "Users can view own entries" ON draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entries" ON draw_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Draw results: users see own
CREATE POLICY "Users can view own results" ON draw_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage results" ON draw_results FOR ALL USING (true);

-- Charity contributions: users see own
CREATE POLICY "Users can view own contributions" ON charity_contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage contributions" ON charity_contributions FOR ALL USING (true);

-- Winner verifications: users see own
CREATE POLICY "Users can view own verifications" ON winner_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verifications" ON winner_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage verifications" ON winner_verifications FOR ALL USING (true);

-- ===============================================
-- TRIGGER: Auto-create profile on signup
-- ===============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- SEED SOME CHARITIES
-- ===============================================
INSERT INTO charities (name, description, image_url, is_featured) VALUES
  ('Golf for Youth Foundation', 'Supporting underprivileged youth through golf programs, mentorship, and scholarship opportunities.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', true),
  ('Green Fairways Initiative', 'Dedicated to environmental sustainability in golf courses worldwide. Planting trees and protecting wildlife habitats.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400', true),
  ('Wounded Warriors Golf', 'Providing therapeutic golf experiences for military veterans recovering from physical and mental health challenges.', 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400', true),
  ('First Tee Community', 'Building character and instilling life-enhancing values through the game of golf for children and teens.', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', false),
  ('Accessibility in Sport', 'Making golf accessible to people with disabilities through adaptive equipment and inclusive programs.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', false),
  ('Community Health Golf', 'Promoting mental health and wellbeing through outdoor golf activities and community building events.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', false);
