export type UserRole = 'bettor' | 'operator' | 'owner';

export type MatchStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'READY'
  | 'LIVE'
  | 'PAUSED'
  | 'ENDED'
  | 'RESULT_PENDING_REVIEW'
  | 'RESULT_CONFIRMED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type DemoTxType =
  | 'INITIAL_CREDIT'
  | 'DEMO_BET_PLACED'
  | 'DEMO_PAYOUT_WIN'
  | 'DEMO_BET_REFUND'
  | 'FAUCET_REFILL'
  | 'ADMIN_ADJUSTMENT';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  withdrawalName: string; // Protected payout profile name
  gcashNum: string; // Protected GCash number
  role: UserRole;
  account_status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  account_status: 'active' | 'suspended';
  created_at: string;
}

export interface RoosterParticipant {
  name: string;
  breed: string;
  weightKg: number;
  legBand: string;
  farm: string;
  handler: string;
  odds: number; // e.g. 1.85 for Meron, 1.95 for Wala
  color: string;
  photoUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  scheduled_start: string;
  venue_metadata: {
    arena_name: string;
    city: string;
    coliseum_code: string;
    ring: string;
  };
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MatchItem {
  id: string;
  event_id: string;
  match_number: number;
  participant_a: RoosterParticipant; // Meron
  participant_b: RoosterParticipant; // Wala
  scheduled_start: string;
  status: MatchStatus;
  broadcast_room_id: string;
  proposed_result: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED' | null;
  confirmed_result: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED' | null;
  result_status: 'UNRESOLVED' | 'PENDING_REVIEW' | 'CONFIRMED' | 'CANCELLED';
  active_camera?: string;
  viewers_count?: number;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BroadcastSession {
  id: string;
  match_id: string;
  livekit_room_name: string;
  status: 'IDLE' | 'LIVE' | 'PAUSED' | 'ENDED';
  active_program_source: string;
  started_at: string | null;
  ended_at: string | null;
  created_by?: string;
}

export interface BroadcastEventLog {
  id: string;
  broadcast_id: string;
  event_type: 'stream_started' | 'camera_switched' | 'stream_paused' | 'stream_resumed' | 'stream_ended' | 'mic_toggled';
  source_metadata: {
    source_name: string;
    resolution?: string;
    fps?: number;
  };
  actor_id: string;
  occurred_at: string;
  details: Record<string, unknown>;
}

export interface DemoWallet {
  id: string;
  user_id: string;
  virtual_balance: number;
  created_at: string;
  updated_at: string;
}

export interface DemoTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  match_id?: string;
  transaction_type: DemoTxType;
  amount: number;
  previous_balance: number;
  resulting_balance: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  idempotency_key: string;
  metadata: {
    selection?: 'MERON' | 'WALA' | 'DRAW';
    potential_payout?: number;
    notes?: string;
  };
  created_at: string;
}

export interface ResultReview {
  id: string;
  match_id: string;
  submitted_by: string;
  reviewed_by: string | null;
  proposed_result: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED';
  confirmed_result: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED' | null;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface AuditLogItem {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  reason: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  notification_type: 'INFO' | 'WARNING' | 'MATCH' | 'DEMO_CREDIT' | 'SECURITY';
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface ComplianceRecord {
  id: string;
  authorization_type: string;
  issuing_authority: string;
  reference_number: string;
  status: 'PENDING_REVIEW' | 'SUSPENDED' | 'INSPECTION_REQUIRED' | 'ACTIVE';
  effective_date: string;
  expiry_date: string;
  verification_notes: string;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}
