import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const getContactsDuration = new Trend('get_contacts', true);
export const RateContentOK = new Rate('content_OK');
export const getDurationTrend = new Trend('get_duration')

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<5700'],
    http_req_failed: ['rate<0.12'],
  },
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 15 },
    { duration: '40s', target: 20 },

    { duration: '10s', target: 40 },
    { duration: '10s', target: 50 },
    { duration: '40s', target: 60 },

    { duration: '10s', target: 75 },
    { duration: '10s', target: 90 },
    { duration: '40s', target: 105 },

    { duration: '10s', target: 130 },
    { duration: '10s', target: 155 },
    { duration: '40s', target: 180 },

    { duration: '10s', target: 230 },
    { duration: '10s', target: 280 },
    { duration: '40s', target: 300 },
  ]
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const baseUrl = 'https://portal-homolog.engeplus.com.br/';

  const params = {};

  const OK = 200;

  const res = http.get(`${baseUrl}`, params);

  getContactsDuration.add(res.timings.duration);
  getDurationTrend.add(res.timings.duration);
  RateContentOK.add(res.status === OK);

  check(res, {
    'GET Contacts - Status 200': () => res.status === OK
  });
}
