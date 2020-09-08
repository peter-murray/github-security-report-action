const SarifReportFinder = require('./SarifReportFinder')
  , githubVulnerabilities = require('./githubDependencies')
  , githubCodeScanning = require('./githubCodeScanning')
  , SoftwareReport = require('./SoftwareReport')
  ;

module.exports = class DataCollector {

  constructor(github, context) {
    if (!github) {
      throw new Error('A github octokit client needs to be provided');
    }
    this._github = github;

    if (!context) {
      throw new Error('A GitHub Actions context is required');
    }
    this._context = context;

    // if (! isSpecified(organization)) {
    //   throw new Error('GitHub Organization name must be provided');
    // }
    // this._orgnaization = organization;
    //
    // if (! isSpecified(repository)) {
    //   throw new Error('GitHub Repoisotry name must be provided');
    // }
    // this._repository = repository;
  }

  get githubClient () {
    return this._github;
  }

  get repo () {
    return this._context.repo.repo;
  }

  get org () {
    return this._context.repo.owner;
  }

  generateSoftwareReport(sarifDir) {
    const sarifFinder = new SarifReportFinder(sarifDir)
      , vulnerabilities = githubVulnerabilities.create(this.githubClient)
      , codeScanning = githubCodeScanning.create(this.githubClient)
    ;

    //TODO we can and should configure the report to optionally load some of this data
    return Promise.all([
      sarifFinder.getSarifFiles(),
      vulnerabilities.getAllDependencies(this.org, this.repo),
      vulnerabilities.getAllVulnerabilities(this.org, this.repo),
      codeScanning.getOpenCodeScanningAlerts(this.org, this.repo),
      codeScanning.getClosedCodeScanningAlerts(this.org, this.repo),
    ])
      .then(results => {
        //TODO need to make this cater for multiple report files, as we are getting an array but software report only expects one currently
        // could adopt the merging approach that codeql-action uses when doing upload-report

        console.log(`Sarif Reports: ${results[0]}`);

        return new SoftwareReport({
          report: results[0][0],
          dependencies: results[1],
          vulnerabilities: results[2],
          openScans: results[3],
          closedScans: results[4],
        });
      });
  }
}

function isSpecified(value) {
  return !!value && `${value}`.trim().length > 0;
}

