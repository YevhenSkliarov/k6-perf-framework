export const STRICT_THRESHOLDS = {
  checks: ['rate>0.99'],
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500'],
  'http_req_duration{name:createPizza}': ['p(95)<800'],
};

export const RELAXED_THRESHOLDS = {
  checks: ['rate>0.95'],
  http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true }],
  http_req_duration: ['p(95)<1500'],
};