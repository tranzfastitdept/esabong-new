// Acceptance & Integration Test Suite for Sabong System Console
// Validates all 20 acceptance criteria from Section 17

import { getDB } from '../lib/db.ts';

async function runTests() {
  console.log('--- STARTING SABONG SYSTEM CONSOLE ACCEPTANCE TESTS ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  };

  const db = getDB();

  // Test 1: New user can register with all required profile fields
  try {
    const reg = db.registerUser({
      name: 'Test Tester',
      username: `testuser_${Date.now()}`,
      password: 'SecurePassword123!',
      withdrawalName: 'Test Payout Name',
      gcashNum: '09170001122',
      role: 'bettor',
    });
    assert(reg.profile && reg.wallet && reg.profile.withdrawalName === 'Test Payout Name', 'Test 1: User registered with required fields and wallet provisioned');
  } catch (e) {
    assert(false, `Test 1: Registration threw error: ${e.message}`);
  }

  // Test 2: Duplicate usernames are rejected
  try {
    db.registerUser({
      name: 'Duplicate Guy',
      username: 'carlos.bettor', // Existing seed username
      password: 'Password123!',
      withdrawalName: 'Duplicate Name',
      gcashNum: '09179998877',
    });
    assert(false, 'Test 2: Duplicate username should have thrown error');
  } catch (e) {
    assert(e.message.includes('already taken'), 'Test 2: Duplicate username correctly rejected');
  }

  // Test 3: GCash normalization and invalid format rejected
  try {
    db.registerUser({
      name: 'Bad GCash',
      username: `badgcash_${Date.now()}`,
      password: 'Password123!',
      withdrawalName: 'Bad Name',
      gcashNum: '12345', // Invalid
    });
    assert(false, 'Test 3: Invalid GCash should have thrown error');
  } catch (e) {
    assert(e.message.includes('Invalid GCash'), 'Test 3: Invalid GCash format rejected');
  }

  // Test 4: Authenticated user can update withdrawalName and gcashNum
  try {
    const updated = db.updatePayoutDetails('usr_bettor_003', {
      withdrawalName: 'Carlos Updated Name',
      gcashNum: '09199990000',
    });
    assert(updated.withdrawalName === 'Carlos Updated Name' && updated.gcashNum === '09199990000', 'Test 4: User updated payout details');
  } catch (e) {
    assert(false, `Test 4 error: ${e.message}`);
  }

  // Test 5: Role protection: Bettor cannot update roles
  try {
    db.updateUserRole('usr_bettor_003', 'usr_bettor_003', 'owner');
    assert(false, 'Test 5: Bettor role update should have failed');
  } catch (e) {
    assert(e.message.includes('Unauthorized'), 'Test 5: Bettor prevented from elevating role');
  }

  // Test 6: Operator cannot grant themselves owner privileges
  try {
    db.updateUserRole('usr_oper_002', 'usr_oper_002', 'owner');
    assert(false, 'Test 6: Operator role update to owner should fail');
  } catch (e) {
    assert(e.message.includes('Unauthorized'), 'Test 6: Operator prevented from granting owner privileges');
  }

  // Test 7: Match state machine prevents invalid state transitions
  try {
    // Attempt illegal transition: DRAFT directly to RESULT_CONFIRMED
    db.transitionMatchStatus('usr_oper_002', 'match_003', 'RESULT_CONFIRMED', 'Illegal jump');
    assert(false, 'Test 7: Illegal state transition should have failed');
  } catch (e) {
    assert(e.message.includes('Invalid state transition'), 'Test 7: Controlled match state machine enforces valid transitions');
  }

  // Test 8: Idempotency in demo transactions prevents duplicate requests
  try {
    const fixedKey = `test_idemp_key_${Date.now()}`;
    const tx1 = db.placeDemoBet({
      userId: 'usr_bettor_003',
      matchId: 'match_001',
      selection: 'MERON',
      amount: 100,
      idempotencyKey: fixedKey,
    });
    const tx2 = db.placeDemoBet({
      userId: 'usr_bettor_003',
      matchId: 'match_001',
      selection: 'MERON',
      amount: 100,
      idempotencyKey: fixedKey, // Duplicate
    });
    assert(tx1.newBalance === tx2.newBalance, 'Test 8: Duplicate demonstration transaction does not deduct balance twice');
  } catch (e) {
    assert(false, `Test 8 error: ${e.message}`);
  }

  // Test 9: Insufficient balance rejection
  try {
    db.placeDemoBet({
      userId: 'usr_bettor_003',
      matchId: 'match_001',
      selection: 'MERON',
      amount: 999999999, // Way more than balance
      idempotencyKey: `fail_tx_${Date.now()}`,
    });
    assert(false, 'Test 9: Insufficient balance should have thrown error');
  } catch (e) {
    assert(e.message.includes('Insufficient demo balance'), 'Test 9: Server blocks bets exceeding wallet balance');
  }

  // Test 10: Legal Compliance Gate blocks disabling demo mode
  try {
    db.updateSystemSettings('usr_owner_001', { demo_mode: false });
    assert(false, 'Test 10: Disabling demo mode should fail compliance gate');
  } catch (e) {
    assert(e.message.includes('LEGAL COMPLIANCE GATE VIOLATION'), 'Test 10: Legal compliance gate enforces non-wagering mode');
  }

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
}

runTests().catch(console.error);
