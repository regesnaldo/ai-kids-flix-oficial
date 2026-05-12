import { compare, hash, hashSync } from 'bcryptjs';
import { createHash } from 'crypto';

const BCRYPT_ROUNDS = 12;

function isSha256Hash(password: string): boolean {
  return /^[a-f0-9]{64}$/i.test(password);
}

function sha256Hash(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export function hashPasswordSync(password: string): string {
  return hashSync(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (isSha256Hash(storedHash)) {
    return sha256Hash(password) === storedHash;
  }
  return compare(password, storedHash);
}

export function needsMigration(storedHash: string): boolean {
  return isSha256Hash(storedHash);
}