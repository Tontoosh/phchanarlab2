import http from 'k6/http';
import { check, sleep } from 'k6';

// Use only the assignment's authorized practice host.
const TARGET = 'https://test.k6.io';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const response = http.get(TARGET);
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
