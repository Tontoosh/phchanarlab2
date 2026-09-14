import http from 'k6/http';
import { check, sleep } from 'k6';

// Intentionally strict demonstration threshold; 50 ms is far below the 289.66 ms baseline.
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<50'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const response = http.get('https://test.k6.io');
  check(response, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
