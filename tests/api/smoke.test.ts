import http from 'k6/http';
import { BASE_URL } from '../../src/config/env.ts';
import { expect } from 'https://jslib.k6.io/k6-testing/0.6.1/index.js';

export const options = {
  vus: 1,
  iterations: 3,
  thresholds: { checks: ['rate==1.0'] },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  expect(res.status).toBe(200);
  expect(res.body).toContain('QuickPizza');
}