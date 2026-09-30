import { expect } from 'https://jslib.k6.io/k6-testing/0.6.1/index.js';
import { register, login } from '../api/auth.ts';
import { is2xx } from '../utils/checks.ts';

export interface SetupData {
  tokens: string[];
}

export function createUsers(count: number): SetupData {
  const tokens: string[] = [];
  const runId = Date.now();

  for (let i = 0; i < count; i++) {
    const user = { username: `setup_${runId}_${i}`, password: 'secret123' };

    expect(is2xx(register(user))).toBe(true);
    const token = login(user);
    expect(token).toBeTruthy();

    tokens.push(token);
  }
  return { tokens };
}