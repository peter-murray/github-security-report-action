const SarifReportFinder = require('./codeScanning/sarif/SarifReportFinder')
  , githubDependencies = require('./dependencies')
  , githubCodeScanning = require('./codeScanning')
  , ReportData = require('./ReportData')
  ;

module.exports = class DataCollector {

  constructor(octokit, repo) {
    if (!octokit) {
      throw new Error('A GitHub Octokit client needs to be provided');
    }
    this._octokit = octokit;

    if (!repo) {
      throw new Error('A GitHub repository must be provided');
    }

    const parts = repo.split('/')
    this._repo = {
      owner: parts[0],
      repo: parts[1]
    }
  }

  get githubClient() {
    return this._octokit;
  }

  get repo() {
    return this._repo.repo;
  }

  get owner() {
    return this._repo.owner;
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
      dependencies.getAllDependencies(this.owner, this.repo).then(deps => {
        return {dependencies: deps};
      }),
      dependencies.getAllVulnerabilities(this.owner, this.repo).then(vulns => {
        return {vulnerabilities: vulns};
      }),
      codeScanning.getOpenCodeScanningAlerts(this.owner, this.repo).then(open => {
        return {codeScanningOpen: open};
      }),
      codeScanning.getClosedCodeScanningAlerts(this.owner, this.repo).then(closed => {
        return {codeScanningClosed: closed};
      }),
    ]).then(results => {
      const data = {
        github: {
          owner: this.owner,
          repo: this.repo
        }
      };

      results.forEach(result => {
        Object.assign(data, result);
      });

      return new ReportData(data);
    });
  }
}
