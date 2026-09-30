import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export function buildSummary(data: Record<string, unknown>) {
  const profile = __ENV.PROFILE || 'smoke';
  const ts = new Date().toISOString().replace(/[:.]/g, '-');

  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    [`reports/${profile}-${ts}.json`]: JSON.stringify(data, null, 2),
  };
}