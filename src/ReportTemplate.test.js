const path = require('path')
  , fs = require('fs')
  , ReportTemplate = require('./ReportTemplate')
;

const reporting = new ReportTemplate();

// reporting.render({dependencies: {deps: {totalDependencies: 100}}}, 'summary.html');

const data = require(path.join(__dirname, '..', 'samples', 'summary', 'small.json'));
const fileContent = reporting.render(data, 'summary.html')
// fs.writeFileSync(path.join(__dirname, '..', 'output.html'), fileContent);

const pdf = require('html-pdf');
pdf.create(fileContent).toFile(path.join(__dirname, '..', 'output.pdf'), function (err, res) {
  console.log(JSON.stringify(res));
});