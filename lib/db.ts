import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  PublicUserProfile,
  EventItem,
  MatchItem,
  MatchStatus,
  BroadcastSession,
  BroadcastEventLog,
  DemoWallet,
  DemoTransaction,
  ResultReview,
  AuditLogItem,
  NotificationItem,
  ComplianceRecord,
  UserRole,
} from './types';

interface DatabaseSchema {
  profiles: Record<string, UserProfile>;
  passwords: Record<string, string>; // In-memory/local hash simulation for demo
  events: Record<string, EventItem>;
  matches: Record<string, MatchItem>;
  broadcasts: Record<string, BroadcastSession>;
  broadcast_events: BroadcastEventLog[];
  wallets: Record<string, DemoWallet>;
  transactions: DemoTransaction[];
  result_reviews: ResultReview[];
  audit_logs: AuditLogItem[];
  notifications: NotificationItem[];
  compliance_records: ComplianceRecord[];
  system_settings: {
    demo_mode: boolean;
    legal_authorization_verified: boolean;
    faucet_refill_amount: number;
    max_demo_bet: number;
    allow_operator_signups: boolean;
  };
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'sabong_db.json');

// Initial seeded records
const getInitialDatabase = (): DatabaseSchema => {
  const ownerId = 'usr_owner_001';
  const operatorId = 'usr_oper_002';
  const bettorId = 'usr_bettor_003';
  const eventId = 'evt_derby_2026_01';
  const now = new Date().toISOString();

  return {
    profiles: {
      [ownerId]: {
        id: ownerId,
        name: 'Maria Santos',
        username: 'maria.owner',
        withdrawalName: 'Maria Santos',
        gcashNum: '09171234567',
        role: 'owner',
        account_status: 'active',
        created_at: now,
        updated_at: now,
      },
      [operatorId]: {
        id: operatorId,
        name: 'Juan Del Rosario',
        username: 'juan.operator',
        withdrawalName: 'Juan Del Rosario',
        gcashNum: '09189876543',
        role: 'operator',
        account_status: 'active',
        created_at: now,
        updated_at: now,
      },
      [bettorId]: {
        id: bettorId,
        name: 'Carlos Reyes',
        username: 'carlos.bettor',
        withdrawalName: 'Carlos Reyes',
        gcashNum: '09195551234',
        role: 'bettor',
        account_status: 'active',
        created_at: now,
        updated_at: now,
      },
    },
    passwords: {
      'maria.owner': 'OwnerPass2026!',
      'juan.operator': 'OperatorPass2026!',
      'carlos.bettor': 'BettorPass2026!',
    },
    events: {
      [eventId]: {
        id: eventId,
        title: '2026 Pasay Coliseum Championship Derby (Demo)',
        description: 'Multi-camera broadcast demonstration event featuring 4-cock derby matches in strict non-wagering mode.',
        scheduled_start: new Date(Date.now() - 3600000).toISOString(),
        venue_metadata: {
          arena_name: 'Pasay Grand Coliseum',
          city: 'Pasay City, Metro Manila',
          coliseum_code: 'PASAY-RING-A',
          ring: 'Ring 1 Main Octagon',
        },
        status: 'ACTIVE',
        created_by: ownerId,
        created_at: now,
        updated_at: now,
      },
    },
    matches: {
      'match_001': {
        id: 'match_001',
        event_id: eventId,
        match_number: 1,
        participant_a: {
          name: 'Thunderbird Crimson Hatch',
          breed: 'Hatch / Roundhead Cross',
          weightKg: 2.35,
          legBand: 'PH-BATCH-881',
          farm: 'Batangas Elite Gamefarm',
          handler: 'Mang Carding',
          odds: 1.85,
          color: '#DC2626',
          photoUrl: '/images/match_rooster_meron_1791703471669.jpg',
        },
        participant_b: {
          name: 'Silver Cobalt Kelso',
          breed: 'Out-and-Out Kelso',
          weightKg: 2.32,
          legBand: 'CEB-KEL-402',
          farm: 'Cebu Highlands Loft',
          handler: 'Master Dennis',
          odds: 1.95,
          color: '#2563EB',
          photoUrl: '/images/match_rooster_wala_1791703484706.jpg',
        },
        scheduled_start: new Date(Date.now() - 1200000).toISOString(),
        status: 'LIVE',
        broadcast_room_id: 'livekit-room-match-001',
        proposed_result: null,
        confirmed_result: null,
        result_status: 'UNRESOLVED',
        active_camera: 'Camera 1 — Main View',
        viewers_count: 34,
        created_by: operatorId,
        updated_by: operatorId,
        created_at: now,
        updated_at: now,
      },
      'match_002': {
        id: 'match_002',
        event_id: eventId,
        match_number: 2,
        participant_a: {
          name: 'Boston Red Leiper',
          breed: 'Leiper Hatch',
          weightKg: 2.40,
          legBand: 'LAG-LEI-109',
          farm: 'Laguna Crest Farm',
          handler: 'Bong Tan',
          odds: 1.90,
          color: '#DC2626',
          photoUrl: '/images/match_rooster_meron_1791703471669.jpg',
        },
        participant_b: {
          name: 'Midnight Black McRae',
          breed: 'Black McRae / Mel Sims',
          weightKg: 2.38,
          legBand: 'DVO-MCR-776',
          farm: 'Davao Southern Aviary',
          handler: 'Coach Lito',
          odds: 1.90,
          color: '#2563EB',
          photoUrl: '/images/match_rooster_wala_1791703484706.jpg',
        },
        scheduled_start: new Date(Date.now() + 1800000).toISOString(),
        status: 'READY',
        broadcast_room_id: 'livekit-room-match-002',
        proposed_result: null,
        confirmed_result: null,
        result_status: 'UNRESOLVED',
        active_camera: 'Camera 1 — Main View',
        viewers_count: 0,
        created_by: operatorId,
        updated_by: operatorId,
        created_at: now,
        updated_at: now,
      },
      'match_003': {
        id: 'match_003',
        event_id: eventId,
        match_number: 3,
        participant_a: {
          name: 'Gold Phoenix Albany',
          breed: 'Albany Claret',
          weightKg: 2.29,
          legBand: 'PAMP-ALB-311',
          farm: 'Pampanga Valley Ranch',
          handler: 'Vic Sotto',
          odds: 1.80,
          color: '#DC2626',
        },
        participant_b: {
          name: 'Sweater 5K Line',
          breed: 'Sweater Line',
          weightKg: 2.31,
          legBand: 'ILO-SWT-612',
          farm: 'Iloilo Premier Breeders',
          handler: 'Jun Morales',
          odds: 2.00,
          color: '#2563EB',
        },
        scheduled_start: new Date(Date.now() + 5400000).toISOString(),
        status: 'SCHEDULED',
        broadcast_room_id: 'livekit-room-match-003',
        proposed_result: null,
        confirmed_result: null,
        result_status: 'UNRESOLVED',
        active_camera: 'Camera 1 — Main View',
        viewers_count: 0,
        created_by: operatorId,
        updated_by: operatorId,
        created_at: now,
        updated_at: now,
      },
      'match_004': {
        id: 'match_004',
        event_id: eventId,
        match_number: 4,
        participant_a: {
          name: 'Butcher Gray Feather',
          breed: 'Phil Marsh Butcher',
          weightKg: 2.33,
          legBand: 'RIZ-BUT-901',
          farm: 'Rizal Ridge Aviary',
          handler: 'Boyet Cruz',
          odds: 1.82,
          color: '#DC2626',
        },
        participant_b: {
          name: 'Possum Golden Sweater',
          breed: 'Possum Sweater',
          weightKg: 2.36,
          legBand: 'BUL-POS-554',
          farm: 'Bulacan Valley Loft',
          handler: 'Rico Puno',
          odds: 1.98,
          color: '#2563EB',
        },
        scheduled_start: new Date(Date.now() - 7200000).toISOString(),
        status: 'RESULT_CONFIRMED',
        broadcast_room_id: 'livekit-room-match-004',
        proposed_result: 'MERON',
        confirmed_result: 'MERON',
        result_status: 'CONFIRMED',
        active_camera: 'Camera 1 — Main View',
        viewers_count: 0,
        created_by: operatorId,
        updated_by: ownerId,
        created_at: now,
        updated_at: now,
      },
    },
    broadcasts: {
      'bc_001': {
        id: 'bc_001',
        match_id: 'match_001',
        livekit_room_name: 'livekit-room-match-001',
        status: 'LIVE',
        active_program_source: 'Camera 1 — Main View',
        started_at: new Date(Date.now() - 1100000).toISOString(),
        ended_at: null,
        created_by: operatorId,
      },
    },
    broadcast_events: [
      {
        id: 'bce_001',
        broadcast_id: 'bc_001',
        event_type: 'stream_started',
        source_metadata: { source_name: 'Camera 1 — Main View', resolution: '1080p', fps: 30 },
        actor_id: operatorId,
        occurred_at: new Date(Date.now() - 1100000).toISOString(),
        details: { mode: 'Demo Multi-Camera Live' },
      },
      {
        id: 'bce_002',
        broadcast_id: 'bc_001',
        event_type: 'camera_switched',
        source_metadata: { source_name: 'Camera 2 — Side Pit Angle', resolution: '1080p', fps: 30 },
        actor_id: operatorId,
        occurred_at: new Date(Date.now() - 600000).toISOString(),
        details: { reason: 'Close-up spur and scale inspection' },
      },
      {
        id: 'bce_003',
        broadcast_id: 'bc_001',
        event_type: 'camera_switched',
        source_metadata: { source_name: 'Camera 1 — Main View', resolution: '1080p', fps: 30 },
        actor_id: operatorId,
        occurred_at: new Date(Date.now() - 300000).toISOString(),
        details: { reason: 'Switched back to program wide arena' },
      },
    ],
    wallets: {
      [bettorId]: {
        id: 'wal_bettor_003',
        user_id: bettorId,
        virtual_balance: 10000.0,
        created_at: now,
        updated_at: now,
      },
    },
    transactions: [
      {
        id: 'tx_001',
        wallet_id: 'wal_bettor_003',
        user_id: bettorId,
        transaction_type: 'INITIAL_CREDIT',
        amount: 10000.0,
        previous_balance: 0.0,
        resulting_balance: 10000.0,
        status: 'COMPLETED',
        idempotency_key: 'idemp-init-carlos-001',
        metadata: { notes: 'Welcome demonstration test credits (Non-cash / Non-redeemable)' },
        created_at: now,
      },
    ],
    result_reviews: [
      {
        id: 'rev_001',
        match_id: 'match_004',
        submitted_by: operatorId,
        reviewed_by: ownerId,
        proposed_result: 'MERON',
        confirmed_result: 'MERON',
        decision: 'APPROVED',
        reason: 'Fight concluded in Round 1 with clear countdown count-out. Verified by 2 licensed pit referees.',
        submitted_at: new Date(Date.now() - 7000000).toISOString(),
        reviewed_at: new Date(Date.now() - 6900000).toISOString(),
      },
    ],
    audit_logs: [
      {
        id: 'aud_001',
        actor_id: ownerId,
        actor_name: 'Maria Santos (Owner)',
        action: 'PLATFORM_INITIALIZATION',
        entity_type: 'SYSTEM',
        entity_id: 'SYSTEM_CONSOLE',
        previous_values: null,
        new_values: { mode: 'DEMO_NON_WAGERING', compliance_lock: true },
        reason: 'Initialized platform in strict compliance non-wagering demonstration mode.',
        created_at: now,
      },
      {
        id: 'aud_002',
        actor_id: operatorId,
        actor_name: 'Juan Del Rosario (Operator)',
        action: 'MATCH_BROADCAST_STARTED',
        entity_type: 'MATCH',
        entity_id: 'match_001',
        previous_values: { status: 'READY' },
        new_values: { status: 'LIVE', camera: 'Camera 1 — Main View' },
        reason: 'Referees cleared arena pit. Started program broadcast feed.',
        created_at: new Date(Date.now() - 1100000).toISOString(),
      },
    ],
    notifications: [
      {
        id: 'notif_001',
        user_id: bettorId,
        notification_type: 'INFO',
        title: 'Demo Credits Provisioned',
        message: '10,000 demonstration virtual credits have been loaded for testing the console. No real money can be wagered or withdrawn.',
        read_at: null,
        created_at: now,
      },
      {
        id: 'notif_002',
        user_id: bettorId,
        notification_type: 'MATCH',
        title: 'Match #1 is LIVE',
        message: 'Thunderbird Crimson Hatch vs Silver Cobalt Kelso has entered the octagon.',
        read_at: null,
        created_at: new Date(Date.now() - 1100000).toISOString(),
      },
    ],
    compliance_records: [
      {
        id: 'comp_001',
        authorization_type: 'AMUSEMENT_GAMING_LICENSING',
        issuing_authority: 'COMMISSION_ON_GAMING_DEMO_BRANCH',
        reference_number: 'DEMO-AUTH-2026-X990',
        status: 'PENDING_REVIEW',
        effective_date: '2026-01-01',
        expiry_date: '2026-12-31',
        verification_notes: 'CRITICAL COMPLIANCE GATE: Real-money gambling functionality is strictly disabled. Operating as software architecture preview and broadcast demonstration.',
        verified_by: null,
        verified_at: null,
        created_at: now,
      },
      {
        id: 'comp_002',
        authorization_type: 'BROADCAST_TECHNICAL_COMPLIANCE',
        issuing_authority: 'TELECOMMUNICATIONS_STANDARDS_BOARD',
        reference_number: 'NTC-BROADCAST-TEST-442',
        status: 'ACTIVE',
        effective_date: '2026-02-15',
        expiry_date: '2027-02-15',
        verification_notes: 'LiveKit WebRTC sub-second latency multi-camera broadcast protocol verified for technical evaluation.',
        verified_by: ownerId,
        verified_at: now,
        created_at: now,
      },
    ],
    system_settings: {
      demo_mode: true,
      legal_authorization_verified: false,
      faucet_refill_amount: 5000,
      max_demo_bet: 50000,
      allow_operator_signups: false,
    },
  };
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load database file, creating fresh initial data:', e);
    }
    const initial = getInitialDatabase();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error persisting database file:', e);
    }
  }

  // --- Auth & Profiles ---
  public getProfile(id: string): UserProfile | null {
    return this.data.profiles[id] || null;
  }

  public getProfileByUsername(username: string): UserProfile | null {
    const cleanUsername = username.toLowerCase().trim();
    for (const profile of Object.values(this.data.profiles)) {
      if (profile.username.toLowerCase() === cleanUsername) {
        return profile;
      }
    }
    return null;
  }

  public getAllProfiles(): UserProfile[] {
    return Object.values(this.data.profiles);
  }

  public verifyPassword(username: string, pass: string): boolean {
    const cleanUsername = username.toLowerCase().trim();
    const targetUser = this.getProfileByUsername(cleanUsername);
    if (!targetUser) return false;
    return this.data.passwords[targetUser.username] === pass;
  }

  public sanitizeProfile(profile: UserProfile): PublicUserProfile {
    return {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      role: profile.role,
      account_status: profile.account_status,
      created_at: profile.created_at,
    };
  }

  public registerUser(params: {
    name: string;
    username: string;
    password: string;
    withdrawalName: string;
    gcashNum: string;
    role?: UserRole;
  }): { profile: UserProfile; wallet: DemoWallet } {
    const cleanUsername = params.username.toLowerCase().trim();

    if (this.getProfileByUsername(cleanUsername)) {
      throw new Error(`Username "${params.username}" is already taken.`);
    }

    // GCash normalization & validation (Philippine standard: 09XXXXXXXXX or +639XXXXXXXXX, 11 digits)
    const normalizedGcash = this.normalizeGcash(params.gcashNum);
    if (!normalizedGcash) {
      throw new Error('Invalid GCash number format. Please provide a valid 11-digit mobile number (e.g., 09171234567).');
    }

    if (!params.name.trim() || !params.withdrawalName.trim()) {
      throw new Error('Name and Withdrawal Name are required fields.');
    }

    if (params.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const profile: UserProfile = {
      id: userId,
      name: params.name.trim(),
      username: cleanUsername,
      withdrawalName: params.withdrawalName.trim(),
      gcashNum: normalizedGcash,
      role: params.role || 'bettor',
      account_status: 'active',
      created_at: now,
      updated_at: now,
    };

    this.data.profiles[userId] = profile;
    this.data.passwords[cleanUsername] = params.password;

    // Create demonstration wallet automatically
    const walletId = `wal_${userId}`;
    const initialWallet: DemoWallet = {
      id: walletId,
      user_id: userId,
      virtual_balance: 10000.0,
      created_at: now,
      updated_at: now,
    };
    this.data.wallets[userId] = initialWallet;

    // Record initial demo transaction
    const initialTx: DemoTransaction = {
      id: `tx_${Date.now()}_init`,
      wallet_id: walletId,
      user_id: userId,
      transaction_type: 'INITIAL_CREDIT',
      amount: 10000.0,
      previous_balance: 0.0,
      resulting_balance: 10000.0,
      status: 'COMPLETED',
      idempotency_key: `init-${userId}-${Date.now()}`,
      metadata: { notes: 'Welcome demonstration test credits' },
      created_at: now,
    };
    this.data.transactions.unshift(initialTx);

    // Record audit log
    this.logAudit({
      actor_id: userId,
      actor_name: `${profile.name} (@${profile.username})`,
      action: 'USER_REGISTERED',
      entity_type: 'USER',
      entity_id: userId,
      previous_values: null,
      new_values: { username: cleanUsername, role: profile.role },
      reason: 'Standard bettor account registration',
    });

    this.persist();
    return { profile, wallet: initialWallet };
  }

  public updatePayoutDetails(
    userId: string,
    params: { withdrawalName: string; gcashNum: string; reason?: string }
  ): UserProfile {
    const profile = this.data.profiles[userId];
    if (!profile) throw new Error('User not found.');

    const normalizedGcash = this.normalizeGcash(params.gcashNum);
    if (!normalizedGcash) {
      throw new Error('Invalid GCash number format. Expected 11 digits (e.g. 09171234567).');
    }

    if (!params.withdrawalName.trim()) {
      throw new Error('Withdrawal name cannot be empty.');
    }

    const prev = {
      withdrawalName: profile.withdrawalName,
      gcashNum: profile.gcashNum,
    };

    profile.withdrawalName = params.withdrawalName.trim();
    profile.gcashNum = normalizedGcash;
    profile.updated_at = new Date().toISOString();

    this.logAudit({
      actor_id: userId,
      actor_name: `${profile.name} (@${profile.username})`,
      action: 'PAYOUT_DETAILS_UPDATED',
      entity_type: 'USER_PROFILE',
      entity_id: userId,
      previous_values: prev,
      new_values: {
        withdrawalName: profile.withdrawalName,
        gcashNum: profile.gcashNum,
      },
      reason: params.reason || 'User updated their demonstration payout profile.',
    });

    this.persist();
    return profile;
  }

  public updateUserRole(actorId: string, targetUserId: string, newRole: UserRole): UserProfile {
    const actor = this.data.profiles[actorId];
    if (!actor || actor.role !== 'owner') {
      throw new Error('Unauthorized. Only platform owners can assign or revoke roles.');
    }

    const target = this.data.profiles[targetUserId];
    if (!target) throw new Error('Target user not found.');

    if (actorId === targetUserId && newRole !== 'owner') {
      throw new Error('Owners cannot revoke their own owner role.');
    }

    const oldRole = target.role;
    target.role = newRole;
    target.updated_at = new Date().toISOString();

    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'ROLE_MODIFIED',
      entity_type: 'USER_ROLE',
      entity_id: targetUserId,
      previous_values: { role: oldRole },
      new_values: { role: newRole },
      reason: `Owner modified role from ${oldRole} to ${newRole}.`,
    });

    this.persist();
    return target;
  }

  public setAccountStatus(actorId: string, targetUserId: string, status: 'active' | 'suspended', reason: string): UserProfile {
    const actor = this.data.profiles[actorId];
    if (!actor || actor.role !== 'owner') {
      throw new Error('Unauthorized. Only owners can suspend or restore accounts.');
    }

    const target = this.data.profiles[targetUserId];
    if (!target) throw new Error('Target user not found.');

    if (target.role === 'owner' && status === 'suspended') {
      throw new Error('Cannot suspend another platform owner account.');
    }

    const oldStatus = target.account_status;
    target.account_status = status;
    target.updated_at = new Date().toISOString();

    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: status === 'suspended' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_RESTORED',
      entity_type: 'USER',
      entity_id: targetUserId,
      previous_values: { account_status: oldStatus },
      new_values: { account_status: status },
      reason,
    });

    this.persist();
    return target;
  }

  // --- Events & Matches ---
  public getAllEvents(): EventItem[] {
    return Object.values(this.data.events).sort(
      (a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime()
    );
  }

  public getEvent(id: string): EventItem | null {
    return this.data.events[id] || null;
  }

  public createEvent(actorId: string, eventData: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): EventItem {
    const actor = this.data.profiles[actorId];
    if (!actor || (actor.role !== 'operator' && actor.role !== 'owner')) {
      throw new Error('Unauthorized. Only operators or owners can create events.');
    }

    const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newEvent: EventItem = {
      ...eventData,
      id,
      created_by: actorId,
      created_at: now,
      updated_at: now,
    };

    this.data.events[id] = newEvent;
    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'EVENT_CREATED',
      entity_type: 'EVENT',
      entity_id: id,
      previous_values: null,
      new_values: { title: newEvent.title, scheduled_start: newEvent.scheduled_start },
      reason: 'Operator scheduled new arena event.',
    });

    this.persist();
    return newEvent;
  }

  public getAllMatches(): MatchItem[] {
    return Object.values(this.data.matches).sort((a, b) => a.match_number - b.match_number);
  }

  public getMatch(id: string): MatchItem | null {
    return this.data.matches[id] || null;
  }

  public createMatch(actorId: string, matchData: Omit<MatchItem, 'id' | 'created_at' | 'updated_at'>): MatchItem {
    const actor = this.data.profiles[actorId];
    if (!actor || (actor.role !== 'operator' && actor.role !== 'owner')) {
      throw new Error('Unauthorized. Operator or Owner role required.');
    }

    const id = `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const newMatch: MatchItem = {
      ...matchData,
      id,
      created_by: actorId,
      updated_by: actorId,
      created_at: now,
      updated_at: now,
    };

    this.data.matches[id] = newMatch;
    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'MATCH_CREATED',
      entity_type: 'MATCH',
      entity_id: id,
      previous_values: null,
      new_values: {
        match_number: newMatch.match_number,
        meron: newMatch.participant_a.name,
        wala: newMatch.participant_b.name,
      },
      reason: 'Created new match entry in event schedule.',
    });

    this.persist();
    return newMatch;
  }

  // Controlled Match State Machine:
  // DRAFT -> SCHEDULED -> READY -> LIVE -> PAUSED -> ENDED -> RESULT_PENDING_REVIEW -> RESULT_CONFIRMED, CANCELLED, ARCHIVED
  public transitionMatchStatus(
    actorId: string,
    matchId: string,
    newStatus: MatchStatus,
    reason: string
  ): MatchItem {
    const actor = this.data.profiles[actorId];
    if (!actor || (actor.role !== 'operator' && actor.role !== 'owner')) {
      throw new Error('Unauthorized. Only game operators and owners can transition match states.');
    }

    const match = this.data.matches[matchId];
    if (!match) throw new Error('Match not found.');

    const oldStatus = match.status;
    this.validateStateTransition(oldStatus, newStatus);

    match.status = newStatus;
    match.updated_by = actorId;
    match.updated_at = new Date().toISOString();

    // If starting live, update active broadcast
    if (newStatus === 'LIVE') {
      const bc = Object.values(this.data.broadcasts).find((b) => b.match_id === matchId);
      if (bc) {
        bc.status = 'LIVE';
        if (!bc.started_at) bc.started_at = new Date().toISOString();
      } else {
        const newBc: BroadcastSession = {
          id: `bc_${Date.now()}`,
          match_id: matchId,
          livekit_room_name: match.broadcast_room_id,
          status: 'LIVE',
          active_program_source: match.active_camera || 'Camera 1 — Main View',
          started_at: new Date().toISOString(),
          ended_at: null,
          created_by: actorId,
        };
        this.data.broadcasts[newBc.id] = newBc;
      }
    } else if (newStatus === 'ENDED' || newStatus === 'CANCELLED') {
      const bc = Object.values(this.data.broadcasts).find((b) => b.match_id === matchId);
      if (bc) {
        bc.status = 'ENDED';
        bc.ended_at = new Date().toISOString();
      }
    } else if (newStatus === 'PAUSED') {
      const bc = Object.values(this.data.broadcasts).find((b) => b.match_id === matchId);
      if (bc) bc.status = 'PAUSED';
    }

    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'MATCH_STATUS_TRANSITION',
      entity_type: 'MATCH',
      entity_id: matchId,
      previous_values: { status: oldStatus },
      new_values: { status: newStatus },
      reason,
    });

    this.persist();
    return match;
  }

  private validateStateTransition(current: MatchStatus, next: MatchStatus) {
    if (current === next) return;

    const allowedTransitions: Record<MatchStatus, MatchStatus[]> = {
      DRAFT: ['SCHEDULED', 'CANCELLED'],
      SCHEDULED: ['READY', 'DRAFT', 'CANCELLED'],
      READY: ['LIVE', 'SCHEDULED', 'CANCELLED'],
      LIVE: ['PAUSED', 'ENDED', 'CANCELLED'],
      PAUSED: ['LIVE', 'ENDED', 'CANCELLED'],
      ENDED: ['RESULT_PENDING_REVIEW', 'CANCELLED'],
      RESULT_PENDING_REVIEW: ['RESULT_CONFIRMED', 'ENDED', 'CANCELLED'],
      RESULT_CONFIRMED: ['ARCHIVED'],
      CANCELLED: ['ARCHIVED'],
      ARCHIVED: [],
    };

    const allowed = allowedTransitions[current] || [];
    if (!allowed.includes(next)) {
      throw new Error(`Invalid state transition: Cannot transition match from ${current} to ${next}.`);
    }
  }

  // --- Broadcasting & Multi-Camera ---
  public switchCamera(actorId: string, matchId: string, cameraName: string, reason?: string) {
    const actor = this.data.profiles[actorId];
    if (!actor || (actor.role !== 'operator' && actor.role !== 'owner')) {
      throw new Error('Unauthorized. Operator role required to switch program camera.');
    }

    const match = this.data.matches[matchId];
    if (!match) throw new Error('Match not found.');

    const oldCamera = match.active_camera || 'Camera 1 — Main View';
    match.active_camera = cameraName;
    match.updated_at = new Date().toISOString();

    const bc = Object.values(this.data.broadcasts).find((b) => b.match_id === matchId);
    if (bc) {
      bc.active_program_source = cameraName;
      this.data.broadcast_events.unshift({
        id: `bce_${Date.now()}`,
        broadcast_id: bc.id,
        event_type: 'camera_switched',
        source_metadata: { source_name: cameraName },
        actor_id: actorId,
        occurred_at: new Date().toISOString(),
        details: { previousCamera: oldCamera, newCamera: cameraName, reason },
      });
    }

    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'CAMERA_SWITCHED',
      entity_type: 'BROADCAST',
      entity_id: matchId,
      previous_values: { camera: oldCamera },
      new_values: { camera: cameraName },
      reason: reason || 'Operator switched active program video angle.',
    });

    this.persist();
    return { oldCamera, newCamera: cameraName };
  }

  public getBroadcastEvents(matchId?: string): BroadcastEventLog[] {
    if (!matchId) return this.data.broadcast_events;
    const bc = Object.values(this.data.broadcasts).find((b) => b.match_id === matchId);
    if (!bc) return [];
    return this.data.broadcast_events.filter((e) => e.broadcast_id === bc.id);
  }

  // --- Result Review Workflow ---
  public submitResultForReview(
    actorId: string,
    matchId: string,
    proposedResult: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED',
    reason: string
  ): ResultReview {
    const actor = this.data.profiles[actorId];
    if (!actor || (actor.role !== 'operator' && actor.role !== 'owner')) {
      throw new Error('Unauthorized.');
    }

    const match = this.data.matches[matchId];
    if (!match) throw new Error('Match not found.');

    if (match.status !== 'ENDED' && match.status !== 'RESULT_PENDING_REVIEW') {
      throw new Error(`Match must be ENDED before submitting result. Current status is ${match.status}.`);
    }

    match.proposed_result = proposedResult;
    match.status = 'RESULT_PENDING_REVIEW';
    match.result_status = 'PENDING_REVIEW';
    match.updated_at = new Date().toISOString();

    const reviewId = `rev_${Date.now()}`;
    const review: ResultReview = {
      id: reviewId,
      match_id: matchId,
      submitted_by: actorId,
      reviewed_by: null,
      proposed_result: proposedResult,
      confirmed_result: null,
      decision: 'PENDING',
      reason,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
    };

    this.data.result_reviews.unshift(review);

    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'RESULT_SUBMITTED_FOR_REVIEW',
      entity_type: 'MATCH_RESULT',
      entity_id: matchId,
      previous_values: null,
      new_values: { proposedResult, reason },
      reason: 'Operator submitted fight outcome for mandatory review.',
    });

    this.persist();
    return review;
  }

  public reviewAndConfirmResult(
    reviewerId: string,
    matchId: string,
    decision: 'APPROVED' | 'REJECTED',
    confirmedResult: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED',
    reason: string
  ): MatchItem {
    const reviewer = this.data.profiles[reviewerId];
    if (!reviewer || reviewer.role !== 'owner') {
      // Must be reviewed by owner or authorized senior reviewer
      throw new Error('Unauthorized. Only platform owners can approve or confirm match results.');
    }

    const match = this.data.matches[matchId];
    if (!match) throw new Error('Match not found.');

    if (match.status !== 'RESULT_PENDING_REVIEW') {
      throw new Error(`Cannot review match in status ${match.status}. Expected RESULT_PENDING_REVIEW.`);
    }

    const activeReview = this.data.result_reviews.find((r) => r.match_id === matchId && r.decision === 'PENDING');
    if (activeReview) {
      activeReview.reviewed_by = reviewerId;
      activeReview.decision = decision;
      activeReview.reviewed_at = new Date().toISOString();
      if (decision === 'APPROVED') {
        activeReview.confirmed_result = confirmedResult;
      }
    }

    if (decision === 'APPROVED') {
      match.confirmed_result = confirmedResult;
      match.status = 'RESULT_CONFIRMED';
      match.result_status = 'CONFIRMED';

      // Simulate settlement of demonstration bets on this match
      this.settleDemoTransactionsForMatch(matchId, confirmedResult);
    } else {
      match.status = 'ENDED';
      match.result_status = 'UNRESOLVED';
      match.proposed_result = null;
    }

    match.updated_by = reviewerId;
    match.updated_at = new Date().toISOString();

    this.logAudit({
      actor_id: reviewerId,
      actor_name: `${reviewer.name} (@${reviewer.username})`,
      action: decision === 'APPROVED' ? 'RESULT_CONFIRMED' : 'RESULT_REJECTED',
      entity_type: 'MATCH_RESULT',
      entity_id: matchId,
      previous_values: { status: 'RESULT_PENDING_REVIEW', proposed: match.proposed_result },
      new_values: { decision, confirmedResult, status: match.status },
      reason,
    });

    this.persist();
    return match;
  }

  // --- Demonstration Virtual Credit Module ---
  public getWallet(userId: string): DemoWallet {
    let wallet = this.data.wallets[userId];
    if (!wallet) {
      const now = new Date().toISOString();
      wallet = {
        id: `wal_${userId}`,
        user_id: userId,
        virtual_balance: 10000.0,
        created_at: now,
        updated_at: now,
      };
      this.data.wallets[userId] = wallet;
      this.persist();
    }
    return wallet;
  }

  public getTransactions(userId?: string): DemoTransaction[] {
    if (!userId) return this.data.transactions;
    return this.data.transactions.filter((tx) => tx.user_id === userId);
  }

  public placeDemoBet(params: {
    userId: string;
    matchId: string;
    selection: 'MERON' | 'WALA' | 'DRAW';
    amount: number;
    idempotencyKey: string;
  }): { transaction: DemoTransaction; newBalance: number } {
    // 1. Idempotency check: Guard against duplicate submission
    const existing = this.data.transactions.find((tx) => tx.idempotency_key === params.idempotencyKey);
    if (existing) {
      const wallet = this.getWallet(params.userId);
      return { transaction: existing, newBalance: wallet.virtual_balance };
    }

    if (params.amount <= 0) {
      throw new Error('Demonstration bet amount must be greater than zero.');
    }

    if (params.amount > this.data.system_settings.max_demo_bet) {
      throw new Error(`Max demo bet limit is ${this.data.system_settings.max_demo_bet} credits.`);
    }

    const match = this.data.matches[params.matchId];
    if (!match) throw new Error('Match not found.');

    if (match.status !== 'SCHEDULED' && match.status !== 'READY' && match.status !== 'LIVE') {
      throw new Error(`Demonstration betting is closed for this match (Status: ${match.status}).`);
    }

    const wallet = this.getWallet(params.userId);
    if (wallet.virtual_balance < params.amount) {
      throw new Error(`Insufficient demo balance. Available: ${wallet.virtual_balance.toFixed(2)} DEMO credits.`);
    }

    // Atomic server-side balance update
    const prevBalance = wallet.virtual_balance;
    const newBalance = Number((prevBalance - params.amount).toFixed(2));
    wallet.virtual_balance = newBalance;
    wallet.updated_at = new Date().toISOString();

    const odds =
      params.selection === 'MERON'
        ? match.participant_a.odds
        : params.selection === 'WALA'
        ? match.participant_b.odds
        : 8.0;

    const potentialPayout = Number((params.amount * odds).toFixed(2));

    const tx: DemoTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wallet_id: wallet.id,
      user_id: params.userId,
      match_id: params.matchId,
      transaction_type: 'DEMO_BET_PLACED',
      amount: params.amount,
      previous_balance: prevBalance,
      resulting_balance: newBalance,
      status: 'COMPLETED',
      idempotency_key: params.idempotencyKey,
      metadata: {
        selection: params.selection,
        potential_payout: potentialPayout,
        notes: `Simulated Demo Bet on ${params.selection} at odds ${odds}x`,
      },
      created_at: new Date().toISOString(),
    };

    this.data.transactions.unshift(tx);

    this.persist();
    return { transaction: tx, newBalance };
  }

  public refillDemoCredits(userId: string, idempotencyKey: string): { newBalance: number; transaction: DemoTransaction } {
    const existing = this.data.transactions.find((tx) => tx.idempotency_key === idempotencyKey);
    if (existing) {
      const wallet = this.getWallet(userId);
      return { newBalance: wallet.virtual_balance, transaction: existing };
    }

    const wallet = this.getWallet(userId);
    const refillAmount = this.data.system_settings.faucet_refill_amount;
    const prevBalance = wallet.virtual_balance;
    const newBalance = Number((prevBalance + refillAmount).toFixed(2));

    wallet.virtual_balance = newBalance;
    wallet.updated_at = new Date().toISOString();

    const tx: DemoTransaction = {
      id: `tx_${Date.now()}_refill`,
      wallet_id: wallet.id,
      user_id: userId,
      transaction_type: 'FAUCET_REFILL',
      amount: refillAmount,
      previous_balance: prevBalance,
      resulting_balance: newBalance,
      status: 'COMPLETED',
      idempotency_key: idempotencyKey,
      metadata: { notes: 'Free demo test credit refill (Non-redeemable)' },
      created_at: new Date().toISOString(),
    };

    this.data.transactions.unshift(tx);
    this.persist();
    return { newBalance, transaction: tx };
  }

  private settleDemoTransactionsForMatch(matchId: string, result: 'MERON' | 'WALA' | 'DRAW' | 'CANCELLED') {
    const bets = this.data.transactions.filter(
      (tx) => tx.match_id === matchId && tx.transaction_type === 'DEMO_BET_PLACED' && tx.status === 'COMPLETED'
    );

    for (const bet of bets) {
      const wallet = this.getWallet(bet.user_id);
      const isWinner = bet.metadata.selection === result;
      const isDraw = result === 'DRAW';
      const isCancelled = result === 'CANCELLED';

      if (isWinner && bet.metadata.potential_payout) {
        const payout = bet.metadata.potential_payout;
        const prev = wallet.virtual_balance;
        const next = Number((prev + payout).toFixed(2));
        wallet.virtual_balance = next;
        wallet.updated_at = new Date().toISOString();

        const winTx: DemoTransaction = {
          id: `tx_win_${bet.id}`,
          wallet_id: wallet.id,
          user_id: bet.user_id,
          match_id: matchId,
          transaction_type: 'DEMO_PAYOUT_WIN',
          amount: payout,
          previous_balance: prev,
          resulting_balance: next,
          status: 'COMPLETED',
          idempotency_key: `win-payout-${bet.id}`,
          metadata: { notes: `Won simulated bet on ${result}` },
          created_at: new Date().toISOString(),
        };
        this.data.transactions.unshift(winTx);
      } else if (isCancelled || (isDraw && bet.metadata.selection !== 'DRAW')) {
        // Refund on cancelled or draw (if not bet on draw)
        const prev = wallet.virtual_balance;
        const next = Number((prev + bet.amount).toFixed(2));
        wallet.virtual_balance = next;
        wallet.updated_at = new Date().toISOString();

        const refundTx: DemoTransaction = {
          id: `tx_refund_${bet.id}`,
          wallet_id: wallet.id,
          user_id: bet.user_id,
          match_id: matchId,
          transaction_type: 'DEMO_BET_REFUND',
          amount: bet.amount,
          previous_balance: prev,
          resulting_balance: next,
          status: 'COMPLETED',
          idempotency_key: `refund-${bet.id}`,
          metadata: { notes: `Refunded simulated bet due to match ${result}` },
          created_at: new Date().toISOString(),
        };
        this.data.transactions.unshift(refundTx);
      }
    }
  }

  // --- Audit Logs & Compliance ---
  public logAudit(item: Omit<AuditLogItem, 'id' | 'created_at'>): AuditLogItem {
    const id = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullLog: AuditLogItem = {
      ...item,
      id,
      created_at: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(fullLog);
    return fullLog;
  }

  public getAuditLogs(filters?: { actorId?: string; entityType?: string; action?: string }): AuditLogItem[] {
    let list = this.data.audit_logs;
    if (filters?.actorId) {
      list = list.filter((l) => l.actor_id === filters.actorId);
    }
    if (filters?.entityType) {
      list = list.filter((l) => l.entity_type === filters.entityType);
    }
    if (filters?.action) {
      list = list.filter((l) => l.action.toLowerCase().includes(filters.action!.toLowerCase()));
    }
    return list;
  }

  public getComplianceRecords(): ComplianceRecord[] {
    return this.data.compliance_records;
  }

  public updateComplianceRecord(
    actorId: string,
    id: string,
    updates: Partial<ComplianceRecord>
  ): ComplianceRecord {
    const actor = this.data.profiles[actorId];
    if (!actor || actor.role !== 'owner') {
      throw new Error('Unauthorized. Only platform owners can manage compliance records.');
    }

    const rec = this.data.compliance_records.find((r) => r.id === id);
    if (!rec) throw new Error('Compliance record not found.');

    const prev = { ...rec };
    Object.assign(rec, updates);

    // CRITICAL: Prevent self-authorizing real-money toggle without verified third-party legal document
    if (updates.status === 'ACTIVE' && this.data.system_settings.legal_authorization_verified === false) {
      rec.verification_notes += ' [NOTICE: Platform remains in non-wagering demo mode until regulatory review completes.]';
    }

    this.logAudit({
      actor_id: actorId,
      actor_name: `${actor.name} (@${actor.username})`,
      action: 'COMPLIANCE_RECORD_UPDATED',
      entity_type: 'COMPLIANCE',
      entity_id: id,
      previous_values: prev,
      new_values: rec as unknown as Record<string, unknown>,
      reason: 'Owner updated compliance status notes.',
    });

    this.persist();
    return rec;
  }

  // --- Notifications ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications.filter((n) => n.user_id === userId);
  }

  public markNotificationAsRead(userId: string, notifId: string): boolean {
    const n = this.data.notifications.find((notif) => notif.id === notifId && notif.user_id === userId);
    if (n) {
      n.read_at = new Date().toISOString();
      this.persist();
      return true;
    }
    return false;
  }

  // --- System Settings & Health ---
  public getSystemSettings() {
    return {
      ...this.data.system_settings,
      total_users: Object.keys(this.data.profiles).length,
      total_matches: Object.keys(this.data.matches).length,
      active_broadcasts: Object.values(this.data.broadcasts).filter((b) => b.status === 'LIVE').length,
    };
  }

  public updateSystemSettings(actorId: string, updates: Partial<DatabaseSchema['system_settings']>) {
    const actor = this.data.profiles[actorId];
    if (!actor || actor.role !== 'owner') {
      throw new Error('Unauthorized. Only owners can alter system settings.');
    }

    // Crucial legal requirement: Do NOT allow owner to unilaterally switch off demo mode
    if ('demo_mode' in updates && updates.demo_mode === false) {
      throw new Error(
        'LEGAL COMPLIANCE GATE VIOLATION: Real-money mode cannot be enabled. Statutory authorization and independent review have not been satisfied. Application is locked in DEMO_NON_WAGERING mode.'
      );
    }

    Object.assign(this.data.system_settings, updates);
    this.persist();
    return this.data.system_settings;
  }

  // Utility: Normalize Philippine GCash number
  private normalizeGcash(raw: string): string | null {
    if (!raw) return null;
    let cleaned = raw.replace(/\D/g, '');
    if (cleaned.startsWith('63') && cleaned.length === 12) {
      cleaned = '0' + cleaned.substring(2);
    }
    if (cleaned.length === 10 && cleaned.startsWith('9')) {
      cleaned = '0' + cleaned;
    }
    if (cleaned.length === 11 && cleaned.startsWith('09')) {
      return cleaned;
    }
    return null;
  }
}

// Global Singleton to maintain hot-reload in Next.js
declare global {
  var __sabong_db_instance: DatabaseManager | undefined;
}

export const getDB = (): DatabaseManager => {
  if (!global.__sabong_db_instance) {
    global.__sabong_db_instance = new DatabaseManager();
  }
  return global.__sabong_db_instance;
};
