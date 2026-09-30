import type { RefinedResponse, ResponseType } from 'k6/http';

export const is2xx = (r: RefinedResponse<ResponseType>) => r.status >= 200 && r.status < 300;