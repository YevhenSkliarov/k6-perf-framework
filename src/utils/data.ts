import exec from 'k6/execution';

export interface User {
  username: string;
  password: string;
}

export function uniqueUser(): User {
  const id = `${exec.vu.idInTest}_${exec.vu.iterationInScenario}_${Date.now()}`;
  return { username: `user_${id}`, password: 'secret123' };
}