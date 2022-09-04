"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GitHubCodeScanning_1 = __importDefault(require("./codeScanning/GitHubCodeScanning"));
const GitHubDependencies_1 = __importDefault(require("./dependencies/GitHubDependencies"));
const SarifReportFinder_1 = __importDefault(require("./sarif/SarifReportFinder"));
const ReportData_1 = __importDefault(require("./templating/ReportData"));
class DataCollector {
    constructor(octokit, repo) {
        if (!octokit) {
            throw new Error('A GitHub Octokit client needs to be provided');
        }
        this.octokit = octokit;
        if (!repo) {
            throw new Error('A GitHub repository must be provided');
        }
        const parts = repo.split('/');
        this.repo = {
            owner: parts[0],
            repo: parts[1]
        };
    }
    getPayload(sarifReportDir) {
        const ghDeps = new GitHubDependencies_1.default(this.octokit), codeScanning = new GitHubCodeScanning_1.default(this.octokit), sarifFinder = new SarifReportFinder_1.default(sarifReportDir);
        return Promise.all([
            sarifFinder.getSarifFiles(),
            ghDeps.getAllDependencies(this.repo),
            ghDeps.getAllVulnerabilities(this.repo),
            codeScanning.getOpenCodeScanningAlerts(this.repo),
            codeScanning.getClosedCodeScanningAlerts(this.repo),
        ]).then(results => {
            const data = {
                github: this.repo,
                sarifReports: results[0],
                dependencies: results[1],
                vulnerabilities: results[2],
                codeScanningOpen: results[3],
                codeScanningClosed: results[4],
            };
            return new ReportData_1.default(data);
        });
    }
}
exports.default = DataCollector;
