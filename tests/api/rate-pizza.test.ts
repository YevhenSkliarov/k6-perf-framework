import exec from 'k6/execution';
import { getProfile } from '../../src/config/profiles.ts';
import { ratePizza } from '../../src/scenarios/ratePizza.ts';
import { createUsers, type SetupData } from '../../src/setup/users.ts';
import { buildSummary } from '../../src/utils/summary.ts';

export function handleSummary(data: Record<string, unknown>) {
  return buildSummary(data);
}

export const options = getProfile();

export function setup(): SetupData {
  return createUsers(Number(__ENV.USERS) || 5);
}

export default function (data: SetupData) {
  const token = data.tokens[(exec.vu.idInTest - 1) % data.tokens.length];
  ratePizza(token);
}