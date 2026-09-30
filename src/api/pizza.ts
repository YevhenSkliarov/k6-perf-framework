import http from 'k6/http';
import { BASE_URL } from '../config/env.ts';
import { jsonParams } from '../utils/http.ts';

const DEFAULT_RESTRICTIONS = {
  maxCaloriesPerSlice: 1000,
  mustBeVegetarian: false,
  minNumberOfToppings: 2,
  maxNumberOfToppings: 5,
};

export function createPizza(token: string, restrictions = DEFAULT_RESTRICTIONS) {
  return http.post(
    `${BASE_URL}/api/pizza`,
    JSON.stringify(restrictions),
    jsonParams('createPizza', token),
  );
}