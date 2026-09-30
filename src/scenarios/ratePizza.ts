import { check, group, sleep } from 'k6';
import { createPizza } from '../api/pizza.ts';
import { createRating, getRating, updateRating, deleteRating } from '../api/ratings.ts';
import { is2xx } from '../utils/checks.ts';

export function ratePizza(token: string): void {
  let pizzaId = 0;
  let ratingId = 0;

  group('01 create pizza', () => {
    const res = createPizza(token);
    check(res, { 'pizza: 2xx': is2xx });
    pizzaId = res.json('pizza.id') as number;
  });

  group('02 rating CRUD', () => {
    const created = createRating(token, pizzaId, 5);
    check(created, { 'rating create: 2xx': is2xx });
    ratingId = created.json('id') as number;

    check(updateRating(token, ratingId, 3), { 'rating update: 2xx': is2xx });
    check(getRating(token, ratingId), {
      'rating get: stars updated': (r) => r.json('stars') === 3,
    });
    check(deleteRating(token, ratingId), { 'rating delete: 2xx': is2xx });
  });

  sleep(1);
}