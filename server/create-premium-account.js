/**
 * Sneakr.lab - Create Premium Test Account
 * Run: node create-premium-account.js
 */

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'sneakrlab.db');

async function createPremiumAccount() {
  try {
    const db = new Database(dbPath);
    
    // Test account credentials
    const email = 'premium@test.com';
    const password = 'Premium123!';
    const userId = randomUUID();
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert premium user
    const stmt = db.prepare(
      'INSERT INTO users (id, email, password_hash, role, subscription, subscription_date) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    stmt.run(userId, email, passwordHash, 'user', 'premium', new Date().toISOString());
    
    console.log('\n✅ Premium Account Created Successfully!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('💎 Tier: PREMIUM');
    console.log('\nUse these credentials to log in on your website.\n');
    
    db.close();
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log('\n⚠️  Account already exists with email: premium@test.com');
      console.log('📧 Email: premium@test.com');
      console.log('🔑 Password: Premium123!\n');
    } else {
      console.error('Error:', err.message);
    }
  }
}

createPremiumAccount();
