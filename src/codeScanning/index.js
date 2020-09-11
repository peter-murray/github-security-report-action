'use strict';

const CodeScanningResult = require('./CodeScanningAlert')

module.exports.create = octokit => {
  return new GitHubCodeScanning(octokit);
}

class GitHubCodeScanning {

  constructor(octokit) {
    this._octokit = octokit;
  }

  getOpenCodeScanningAlerts(owner, repo) {
    return getCodeScanning(this.octokit, owner, repo, 'open');
  }

  getClosedCodeScanningAlerts(owner, repo) {
    return getCodeScanning(this.octokit, owner, repo, 'closed');
  }

  get octokit() {
    return this._octokit;
  }
}

function getCodeScanning(octokit, owner, repo, state) {
  return  octokit.codeScanning.listAlertsForRepo({
      owner: owner,
      repo: repo,
      state: state
    }).then(alerts => {
      const results = {};

      alerts.data.forEach(scan => {
        const tool = scan.tool.name;

        if (!results[tool]) {
          results[tool] = [];
        }

        results[tool].push(new CodeScanningResult(scan));
      });

      return results;
    });
}