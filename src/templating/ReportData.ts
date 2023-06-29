import Vulnerability from '../dependencies/Vulnerability';
import DependencySet from '../dependencies/DependencySet';
import CodeScanningResults from '../codeScanning/CodeScanningResults';
// import CodeScanningRule from '../sarif/GitHubSarifRule';
import {
  AlertSummary,
  CodeScanningRules, CodeScanResults, CodeScanSummary,
  CollectedData,
  CWECoverage, Dependencies,
  DependencySummary,
  JsonPayload, Manifest,
  ServerityToVulnerabilities, SeverityToAlertSummary
} from './ReportTypes';
import { Repo } from '../github';
import { GitHubSarifReport } from '../sarif/GitHubSarifReport';
import { LatestAnalysisScanResults } from '../codeScanning/GitHubCodeScanning';
import { GitHubSarifRule, SarifRuleJson } from '../sarif/GitHubSarifRule';

export default class ReportData {

  private readonly data: CollectedData;

  private readonly sarifReport: GitHubSarifReport;

  constructor(data: CollectedData) {
    this.data = data || {};
    this.sarifReport = new GitHubSarifReport(this.data?.codeScanning?.sarif || {});
  }

  get githubRepo(): Repo {
    return this.data.github || {};
  }

  get vulnerabilities(): Vulnerability[] {
    return this.data.vulnerabilities || [];
  }

  get dependencies(): DependencySet[] {
    return this.data.dependencies || [];
  }

  get openDependencyVulnerabilities(): Vulnerability[] {
    return this.vulnerabilities.filter(vuln => {
      return !vuln.isDismissed;
    });
  }

  get closedDependencyVulnerabilities(): Vulnerability[] {
    return this.vulnerabilities.filter(vuln => {
      return vuln.isDismissed;
    });
  }

  get openCodeScanResults(): CodeScanningResults {
    return this.data.codeScanningOpen || {};
  }

  get closedCodeScanResults(): CodeScanningResults {
    return this.data.codeScanningClosed || {};
  }

  get codeScanningReport(): GitHubSarifReport {
    return this.sarifReport;
  }

  // get codeScanningRules(): {[key: string]: GitHubSarifRule} {
  //   const result = {};

  //   this.codeScanningReport.rules.forEach(rule => {
  //     result[rule.id] = rule;
  //   });

  //   return result;
  // }
  get codeScanningRules(): GitHubSarifRule[] {
    return this.codeScanningReport.rules;
  }

  getJSONPayload(): JsonPayload {
    const data = {
      github: this.githubRepo,
      metadata: {
        created: new Date().toISOString(),
      },
      sca: {
        dependencies: this.getDependencySummary(),
        vulnerabilities: {
          total: this.openDependencyVulnerabilities.length,
          bySeverity: this.getVulnerabilitiesBySeverity()
        },
      },
      scanning: {
        rules: this.getCodeScanningRules() || [],
        cwe: this.getCWECoverage() || {},
        results: this.getCodeScanSummary(),
      }
    };
    return data;
  }

  getCodeScanningRules(): SarifRuleJson[] {
    return this.codeScanningRules.map(rule => {
      return rule.toJSON();
    });
  }

  getCWECoverage(): CWECoverage | undefined {
    const rules = this.codeScanningRules;

    if (rules) {
      const result: { [key: string]: GitHubSarifRule[] } = {};

      rules.forEach(rule => {
        const cwes = rule.cwes;
        if (cwes) {
          cwes.forEach(cwe => {
            if (!result[cwe]) {
              result[cwe] = [];
            }
            result[cwe].push(rule);
          });
        }
      });

      return {
        cweToRules: result,
        cwes: Object.keys(result)
      };
    }

    return undefined;
  }


  getDependencySummary(): DependencySummary {
    const unprocessed: Manifest[] = []
      , processed: Manifest[] = []
      , dependencies: Dependencies = {}
      ;

    let totalDeps = 0;

    this.dependencies.forEach(depSet => {
      totalDeps += depSet.count;

      const manifest = {
        filename: depSet.filename,
        path: depSet.path
      };

      if (depSet.isValid) {
        processed.push(manifest);
      } else {
        unprocessed.push(manifest);
      }

      const identifiedDeps = depSet.dependencies;
      if (identifiedDeps) {
        identifiedDeps.forEach(dep => {
          const type = dep.packageType.toLowerCase();

          if (!dependencies[type]) {
            dependencies[type] = [];
          }

          dependencies[type].push({
            name: dep.name,
            type: dep.packageType,
            version: dep.version,
          });
        });
      }
    });

    return {
      manifests: {
        processed: processed,
        unprocessed: unprocessed,
      },
      totalDependencies: totalDeps,
      dependencies: dependencies
    };
  }

  getVulnerabilitiesBySeverity(): ServerityToVulnerabilities {
    const result = {};

    // Obtain third party artifacts ranked by severity
    const vulnerabilities = this.openDependencyVulnerabilities;
    vulnerabilities.forEach(vulnerability => {
      const severity = vulnerability.severity.toLowerCase();

      if (!result[severity]) {
        result[severity] = [];
      }
      result[severity].push(vulnerability);
    });

    return result;
  }

  getCodeScanSummary(): CodeScanSummary {
    const open = this.openCodeScanResults
      , closed = this.closedCodeScanResults
      , rules = this.codeScanningRules
      ;

    const data = {
      open: generateAlertSummary(open, rules),
      closed: generateAlertSummary(closed, rules),
    };

    return data;
  }
}

function generateAlertSummary(open: CodeScanningResults, rules: GitHubSarifRule[]): CodeScanResults {
  const result: SeverityToAlertSummary = {};
  let total = 0;

  open.getCodeQLScanningAlerts().forEach(codeScanAlert => {
    const severity = codeScanAlert.severity
      , matchedRule = rules ? rules[codeScanAlert.ruleId] : null
      ;

    const summary: AlertSummary = {
      tool: codeScanAlert.toolName,
      name: codeScanAlert.ruleDescription,
      state: codeScanAlert.state,
      created: codeScanAlert.created,
      url: codeScanAlert.url,
      rule: {
        id: codeScanAlert.ruleId,
      }
    };

    if (matchedRule) {
      summary.rule.details = matchedRule;
    }

    if (!result[severity]) {
      result[severity] = [];
    }
    result[severity].push(summary);
    total++;
  });

  return {
    total: total,
    scans: result
  };
}

// function getRuleData(rule: CodeScanningRule): RuleData {
//   return {
//     name: rule.name,
//     //TODO maybe id?
//     severity: rule.severity,
//     precision: rule.precision,
//     kind: rule.kind,
//     shortDescription: rule.shortDescription,
//     description: rule.description,
//     tags: rule.tags,
//     cwe: rule.cwes,
//   };
// }

//TODO this was not used
// function getVulnerability(vuln) {
//   if (!vuln) {
//     return null;
//   }
//
//   const data = {
//     created: vuln.created,
//     published: vuln.publishedAt,
//     severity: vuln.severity,
//     vulnerability: vuln.vulnerability,
//     advisory: vuln.advisory,
//     source: vuln.source,
//     link: vuln.link,
//   };
//
//   if (vuln.isDismissed()) {
//     data.dismissed = vuln.dismissedBy;
//   }
//
//   return data;
// }