"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReportData {
    constructor(data) {
        this.data = data || {};
    }
    get githubRepo() {
        return this.data.github || {};
    }
    get vulnerabilities() {
        return this.data.vulnerabilities || [];
    }
    get dependencies() {
        return this.data.dependencies || [];
    }
    get openDependencyVulnerabilities() {
        return this.vulnerabilities.filter(vuln => {
            return !vuln.isDismissed;
        });
    }
    get closedDependencyVulnerabilities() {
        return this.vulnerabilities.filter(vuln => {
            return vuln.isDismissed;
        });
    }
    get openCodeScanResults() {
        return this.data.codeScanningOpen || {};
    }
    get closedCodeScanResults() {
        return this.data.codeScanningClosed || {};
    }
    get sarifReports() {
        return this.data.sarifReports || [];
    }
    get codeScanningRules() {
        const result = {};
        this.sarifReports.forEach(report => {
            // Each report is an object of {file, payload} keys
            const rules = report.payload.rules;
            if (rules) {
                rules.forEach(rule => {
                    result[rule.id] = rule;
                });
            }
        });
        return result;
    }
    getJSONPayload() {
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
                rules: this.getAppliedCodeScanningRules(),
                cwe: this.getCWECoverage() || {},
                results: this.getCodeScanSummary(),
            }
        };
        return data;
    }
    getCWECoverage() {
        const rules = this.getAppliedCodeScanningRules();
        if (rules) {
            const result = {};
            rules.forEach(rule => {
                const cwes = rule.cwe;
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
        return null;
    }
    getDependencySummary() {
        const unprocessed = [], processed = [], dependencies = {};
        let totalDeps = 0;
        this.dependencies.forEach(depSet => {
            totalDeps += depSet.count;
            const manifest = {
                filename: depSet.filename,
                path: depSet.path
            };
            if (depSet.isValid) {
                processed.push(manifest);
            }
            else {
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
    getVulnerabilitiesBySeverity() {
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
    getAppliedCodeScanningRules() {
        const rules = this.codeScanningRules;
        if (rules) {
            return Object.values(rules).map(rule => {
                return getRuleData(rule);
            });
        }
        return [];
    }
    getCodeScanSummary() {
        const open = this.openCodeScanResults, closed = this.closedCodeScanResults, rules = this.codeScanningRules;
        const data = {
            open: generateAlertSummary(open, rules),
            closed: generateAlertSummary(closed, rules),
        };
        return data;
    }
}
exports.default = ReportData;
function generateAlertSummary(open, rules) {
    const result = {};
    let total = 0;
    open.getCodeQLScanningAlerts().forEach(codeScanAlert => {
        const severity = codeScanAlert.severity, matchedRule = rules ? rules[codeScanAlert.ruleId] : null;
        const summary = {
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
function getRuleData(rule) {
    return {
        name: rule.name,
        //TODO maybe id?
        severity: rule.severity,
        precision: rule.precision,
        kind: rule.kind,
        shortDescription: rule.shortDescription,
        description: rule.description,
        tags: rule.tags,
        cwe: rule.cwes,
    };
}
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
