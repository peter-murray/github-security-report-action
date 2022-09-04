"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CodeScanningAlert_1 = __importDefault(require("./CodeScanningAlert"));
const CodeScanningResults_1 = __importDefault(require("./CodeScanningResults"));
class GitHubCodeScanning {
    constructor(octokit) {
        this.octokit = octokit;
    }
    getOpenCodeScanningAlerts(repo) {
        return getCodeScanning(this.octokit, repo, 'open');
    }
    getClosedCodeScanningAlerts(repo) {
        return getCodeScanning(this.octokit, repo, 'dismissed');
    }
}
exports.default = GitHubCodeScanning;
function getCodeScanning(octokit, repo, state) {
    const params = {
        owner: repo.owner,
        repo: repo.repo,
        state: state
    };
    return octokit.paginate('GET /repos/:owner/:repo/code-scanning/alerts', params)
        //@ts-ignore
        .then((alerts) => {
        const results = new CodeScanningResults_1.default();
        alerts.forEach((alert) => {
            results.addCodeScanningAlert(new CodeScanningAlert_1.default(alert));
        });
        return results;
    });
}
