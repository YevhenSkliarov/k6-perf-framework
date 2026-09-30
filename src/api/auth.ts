import http from 'k6/http';
import { jsonParams } from '../utils/http.ts';
import { BASE_URL } from '../config/env.ts';
import type { User } from '../utils/data.ts';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export function register(user: User) {
  return http.post(`${BASE_URL}/api/users`, JSON.stringify(user), jsonParams('register'));
}

export function login(user: User): string {
  const res = http.post(
    `${BASE_URL}/api/users/token/login`,
    JSON.stringify(user),
    jsonParams('login'),
  );
  return res.json('token') as string;
}