import type { Options } from 'k6/options';
import { BASE_URL } from './env.ts';

const STRICT_THRESHOLDS = {
  checks: ['rate>0.99'],
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500'],
  'http_req_duration{name:createPizza}': ['p(95)<800'],
};

const RELAXED_THRESHOLDS = {
  checks: ['rate>0.95'],
  http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true }],
  http_req_duration: ['p(95)<1500'],
};

const profiles: Record<string, Options> = {
  smoke: {
    vus: 1,
    iterations: 1,
    thresholds: {
      checks: ['rate==1.0'],
      http_req_failed: ['rate==0'],
    },
  },
  load: {
    stages: [
      { duration: '30s', target: 10 }, 
      { duration: '1m', target: 10 }, 
      { duration: '30s', target: 0 },
    ],
    thresholds: STRICT_THRESHOLDS,
  },
  stress: {
    stages: [
      { duration: '30s', target: 20 },
      { duration: '1m', target: 20 },
      { duration: '30s', target: 50 },
      { duration: '1m', target: 50 },
      { duration: '30s', target: 100 },
      { duration: '1m', target: 100 },
      { duration: '30s', target: 0 },
    ],
    thresholds: RELAXED_THRESHOLDS,
  },
  spike: {
    stages: [
      { duration: '10s', target: 5 },
      { duration: '10s', target: 100 },
      { duration: '30s', target: 100 },
      { duration: '10s', target: 5 },   
      { duration: '30s', target: 5 },   
      { duration: '10s', target: 0 },
    ],
    thresholds: RELAXED_THRESHOLDS,
  },
  soak: {
    stages: [
      { duration: '1m', target: 10 },
      { duration: '10m', target: 10 }, // у реальному проєкті години, не хвилини
      { duration: '1m', target: 0 },
    ],
    thresholds: STRICT_THRESHOLDS,
  },
};

export function getProfile(): Options {
  const name = __ENV.PROFILE || 'smoke';
  const profile = profiles[name];
  if (!profile) {
    throw new Error(`Unknown PROFILE "${name}". Available: ${Object.keys(profiles).join(', ')}`);
  }
  if (name !== 'smoke' && !BASE_URL.includes('localhost')) {
    throw new Error(`Profile "${name}" is allowed only against localhost`);
  }
  return profile;
}