const fs = require('fs');

const reportPath = 'report.json';
const readmePath = 'README.md';

const extractMetrics = () => {
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    const metrics = {
        'Total Requests': data.metrics.http_reqs.count,
        'Average Response Time (ms)': data.metrics.http_req_duration.avg.toFixed(2),
        'P95 Response Time (ms)': data.metrics.http_req_duration['p(95)'].toFixed(2),
        'Error Rate (%)': (data.metrics.http_req_failed.rate * 100).toFixed(2),
    };

    return metrics;
};

const updateReadme = (metrics) => {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    const metricsSection = `
### K6 Metrics

| Metric                  | Value     |
|-------------------------|-----------|
| Total Requests          | ${metrics['Total Requests']} |
| Average Response Time   | ${metrics['Average Response Time (ms)']} ms |
| P95 Response Time       | ${metrics['P95 Response Time (ms)']} ms |
| Error Rate              | ${metrics['Error Rate (%)']}% |
`;

    readmeContent = readmeContent.replace(/### K6 Metrics[\s\S]*$/, metricsSection);

    fs.writeFileSync(readmePath, readmeContent, 'utf8');
};

const metrics = extractMetrics();
updateReadme(metrics);
console.log('README updated with K6 metrics!');
