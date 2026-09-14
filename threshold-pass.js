import http from 'k6/http';
import { check, sleep } from 'k6';

// Current baseline p95: 291.09 ms; latency SLO is p(95) < 436.64 ms.
export const options = {
  vus: 30,
  duration: '60s',
  thresholds: {
    http_req_duration: ['p(95)<436.64'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const response = http.get('https://test.k6.io');
  check(response, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
