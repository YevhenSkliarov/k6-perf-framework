import { check, sleep } from 'k6';
import { register, login } from '../api/auth.ts';
import { createPizza } from '../api/pizza.ts';
import { uniqueUser } from '../utils/data.ts';

export function orderPizza(): void {
  const user = uniqueUser();

  const regRes = register(user);
  check(regRes, { 'register: 2xx': (r) => r.status >= 200 && r.status < 300 });

  const token = login(user);
  check(token, { 'login: got token': (t) => !!t });

  const pizzaRes = createPizza(token);
  check(pizzaRes, {
    'pizza: status 200': (r) => r.status === 200,
    'pizza: has id': (r) => typeof r.json('pizza.id') === 'number',
  });

  sleep(1); // think time
}