
import Vulnerability from '../dependencies/Vulnerability';
import DependencySet from '../dependencies/DependencySet';
import CodeScanningResults from '../codeScanning/CodeScanningResults';
import { Repo } from '../github';
import { GitHubSarifRule, SarifRuleJson } from '../codeScanning/GitHubSarifRule';
import { LatestAnalysisScanResults } from '../codeScanning/GitHubCodeScanning';


//TODO might no be valid now
export type CodeScanningRules = {
  [key: string]: GitHubSarifRule
}

export type CollectedData = {
  github: Repo
  vulnerabilities: Vulnerability[],
  dependencies: DependencySet[],
  codeScanning: LatestAnalysisScanResults,
  codeScanningOpen: CodeScanningResults,
  codeScanningClosed: CodeScanningResults,
}

export type JsonPayload = {
  github: Repo,
  metadata: {
    created: string,
  }
  sca: {
    dependencies: DependencySummary
    vulnerabilities: {
      total: number
      bySeverity: ServerityToVulnerabilities
    }
  },
  scanning: {
    rules: SarifRuleJson[],
    cwe: CWECoverage | {},
    results: CodeScanSummary
  }
}

export type DependencySummary = {
  manifests: {
    processed: Manifest[],
    unprocessed: Manifest[],
  },
  totalDependencies: number,
  dependencies: Dependencies
}

export type Manifest = {
  filename: string,
  path: string,
}

export type Dependencies = {
  [key: string]: Dependency[]
}

export type Dependency = {
  name: string,
  type: string,
  version: string
}

export type ServerityToVulnerabilities = {
  [key: string]: Vulnerability[]
}

export type AlertSummary = {
  tool: string | null,
  name: string,
  state: string,
  created: string,
  url: string,
  rule: {
    id: string
    details?: GitHubSarifRule
  }
}

export type SeverityToAlertSummary = {
  [key: string]: AlertSummary[]
}

export type CodeScanResults = {
  total: number,
  scans: SeverityToAlertSummary
}

export type CWECoverage = {
  cweToRules: {[key: string]: GitHubSarifRule[]},
  cwes: string[]
}

export type CodeScanSummary = {
  open: CodeScanResults,
  closed: CodeScanResults
}