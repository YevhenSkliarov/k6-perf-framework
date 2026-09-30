import http from 'k6/http';
import { BASE_URL } from '../config/env.ts';
import { jsonParams } from '../utils/http.ts';

const url = (id?: number) => `${BASE_URL}/api/ratings${id ? `/${id}` : ''}`;

export const createRating = (token: string, pizzaId: number, stars: number) =>
  http.post(url(), JSON.stringify({ stars, pizza_id: pizzaId }), jsonParams('createRating', token));

export const getRating = (token: string, id: number) =>
  http.get(url(id), jsonParams('getRating', token));

export const updateRating = (token: string, id: number, stars: number) =>
  http.put(url(id), JSON.stringify({ stars }), jsonParams('updateRating', token));

export const deleteRating = (token: string, id: number) =>
  http.del(url(id), null, jsonParams('deleteRating', token));