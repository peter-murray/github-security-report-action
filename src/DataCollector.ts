import {Octokit} from "@octokit/rest";
import GitHubCodeScanning from './codeScanning/GitHubCodeScanning';
import GitHubDependencies from './dependencies/GitHubDependencies';
import ReportData from './templating/ReportData';
import { CollectedData } from './templating/ReportTypes';
import { Repo } from "./github";


export default class DataCollector {

  readonly repo: Repo;

  readonly ref: string;

  readonly sarifId?: string;

  private readonly octokit;

  constructor(octokit: Octokit, repo: string, ref: string, sarifId?: string) {
    if (!octokit) {
      throw new Error('A GitHub Octokit client needs to be provided');
    }
    this.octokit = octokit;

    if (!repo) {
      throw new Error('A GitHub repository must be provided');
    }
    const parts = repo.split('/')
    this.repo = {
      owner: parts[0],
      repo: parts[1]
    }

    if (!ref) {
      throw new Error(`A repository ref must be provided`);
    }
    this.ref = ref;

    this.sarifId = sarifId;
  }

  getPayload(): Promise<ReportData> {
    const ghDeps = new GitHubDependencies(this.octokit)
      , codeScanning = new GitHubCodeScanning(this.octokit)
      , sarifId = this.sarifId
      , repo = this.repo
    ;

    function resolveCodeScanningAnalysis() {
      if (sarifId) {
        return codeScanning.getCodeScanningAnalaysisForSarifId(repo, sarifId);
      }
      return codeScanning.getLatestCodeQLCodeScanningAnalysis(repo);
    }

    return Promise.all([
      ghDeps.getAllDependencies(repo),
      ghDeps.getAllVulnerabilities(repo),
      resolveCodeScanningAnalysis(),
      codeScanning.getOpenCodeScanningAlerts(repo),
      codeScanning.getClosedCodeScanningAlerts(repo),
    ]).then(results => {
      const codeScanning = results[2];
      if (!codeScanning) {
        throw new Error('No code scanning analysis found!');
      }

      const data: CollectedData = {
        github: this.repo,
        dependencies: results[0],
        vulnerabilities: results[1],
        codeScanning: codeScanning,
        codeScanningOpen: results[3],
        codeScanningClosed: results[4],
      };

      return new ReportData(data);
    });
  }
}
