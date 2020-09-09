const core = require('@actions/core')
  , github = require('@actions/github')
  , DataCollector = require('./src/DataCollector')
  , ReportTemplate = require('./src/ReportTemplate')
  ;

async function run() {
  const token = getRequiredInputValue('token')
    , sarifReportDir = getRequiredInputValue('sarifReportDir')
    , octokit = github.getOctokit(token)
    , context = github.context
  ;

  try {
    const collector = new DataCollector(octokit, context)
      , report = await collector.generateSoftwareReport(sarifReportDir)
      , reportTemplate = new ReportTemplate() //TODO add support to set a different directory
    ;

    //TODO outputting this to console for testing, needs to be converted into a report
    // console.log(JSON.stringify(report.getPayload(), null, 2));
    reportTemplate.render(report.getPayload(), 'summary.html');

  } catch (err) {
    core.setFailed(err.message);
  }
}

run();

function getRequiredInputValue(key) {
  return core.getInput(key, {required: true});
}