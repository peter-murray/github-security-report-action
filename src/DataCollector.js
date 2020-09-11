const SarifReportFinder = require('./codeScanning/sarif/SarifReportFinder')
  , githubDependencies = require('./dependencies')
  , githubCodeScanning = require('./codeScanning')
  , ReportData = require('./ReportData')
  ;

module.exports = class DataCollector {

  constructor(octokit, context) {
    if (!octokit) {
      throw new Error('A GitHub Octokit client needs to be provided');
    }
    this._octokit = octokit;

    if (!context) {
      throw new Error('A GitHub Actions context is required');
    }
    this._context = context;
  }

  get githubClient() {
    return this._octokit;
  }

  get repo() {
    return this._context.repo.repo;
  }

  get org() {
    return this._context.repo.owner;
  }

  getPayload(sarifReportDir) {
    const sarifFinder = new SarifReportFinder(sarifReportDir)
      , dependencies = githubDependencies.create(this.githubClient)
      , codeScanning = githubCodeScanning.create(this.githubClient)
    ;

    return Promise.all([
      sarifFinder.getSarifFiles().then(sarif => {
        return {sarifReports: sarif};
      }),
      dependencies.getAllDependencies(this.org, this.repo).then(deps => {
        return {dependencies: deps};
      }),
      dependencies.getAllVulnerabilities(this.org, this.repo).then(vulns => {
        return {vulnerabilities: vulns};
      }),
      codeScanning.getOpenCodeScanningAlerts(this.org, this.repo).then(open => {
        return {codeScanningOpen: open};
      }),
      codeScanning.getClosedCodeScanningAlerts(this.org, this.repo).then(closed => {
        return {codeScanningClosed: closed};
      }),
    ]).then(results => {
      const data = {};

      results.forEach(result => {
        Object.assign(data, result);
      });

      return new ReportData(data);
    });
  }
}
