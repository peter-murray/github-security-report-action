const github = require('@actions/github')
  , DataCollector = require('./DataCollector')
  , ReportTemplate = require('./reports/ReportTemplate')
  , pdfWriter = require('./reports/pdfWriter')
  , path = require('path')
;

const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
const collector = new DataCollector(octokit, 'octodemo/ghas-reporting');

collector.getPayload(path.join(__dirname, '..', 'samples', 'java', 'detailed'))
  .then(reportData => {
    const json = reportData.getJSONPayload();

    // console.log(JSON.stringify(json, null, 2));

    const templates = new ReportTemplate();
    const html = templates.render(json, 'summary.html')

    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, '..', 'summary.html'), html);

    pdfWriter.save(html, path.join(__dirname, '..', 'summary.pdf'));

  })
  .catch(err => {
    console.error(err);
  })
;