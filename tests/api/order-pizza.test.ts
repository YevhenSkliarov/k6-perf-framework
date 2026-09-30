import { getProfile } from '../../src/config/profiles.ts';
import { orderPizza } from '../../src/scenarios/orderPizza.ts';

export const options = getProfile();

export default function () {
  orderPizza();
}