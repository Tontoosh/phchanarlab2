import http from 'k6/http';
import { check, sleep } from 'k6';

// Use only the assignment's authorized practice host.
const TARGET = 'https://test.k6.io';

export const options = {
  vus: 5,
  duration: '1m',
};

export default function () {
  const response = http.get(TARGET);
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
