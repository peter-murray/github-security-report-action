const ReportTemplate = require('./ReportTemplate');

const reporting = new ReportTemplate();
reporting.render({dependencies: {deps: {totalDependencies: 100}}}, 'summary.html');