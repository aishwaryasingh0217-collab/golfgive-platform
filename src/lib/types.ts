export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'visitor' | 'subscriber' | 'admin';
  selected_charity_id: string | null;
  contribution_percentage: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'monthly' | 'yearly';
  status: 'active' | 'inactive' | 'cancelled' | 'lapsed';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  played_date: string;
  created_at: string;
}

export interface Draw {
  id: string;
  month: string;
  year: number;
  status: 'upcoming' | 'active' | 'completed' | 'published';
  draw_numbers: number[];
  prize_pool: number;
  five_match_prize: number;
  four_match_prize: number;
  three_match_prize: number;
  jackpot_rollover: number;
  created_at: string;
  drawn_at: string | null;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  entry_numbers: number[];
  created_at: string;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: '5-match' | '4-match' | '3-match';
  matched_numbers: number[];
  prize_amount: number;
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  website_url: string | null;
  is_featured: boolean;
  total_received: number;
  created_at: string;
}

export interface CharityContribution {
  id: string;
  user_id: string;
  charity_id: string;
  amount: number;
  month: string;
  year: number;
  created_at: string;
}

export interface WinnerVerification {
  id: string;
  draw_result_id: string;
  user_id: string;
  proof_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  payment_status: 'pending' | 'paid';
  reviewed_at: string | null;
  created_at: string;
}
