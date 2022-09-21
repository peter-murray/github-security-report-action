import CodeScanningRule from "./CodeScanningRule";
import {SarifReportData, SarifRule} from './SarifDataTypes';

export default class SarifReport {

  private readonly data: SarifReportData;

  readonly rules: CodeScanningRule[];

  constructor(data: SarifReportData) {
    this.data = data;
    this.rules = getRules(data) || [];
  }

  get cweList(): string[] {
    const result = this.rules.reduce((cwes: string[], rule) => {
      return cwes.concat(rule.cwes)
    }, []);
    return unique(result).sort();
  }
}


function getRules(report: SarifReportData) {
  let sarifRules: SarifRule[] = [];

  if (report.version === '2.1.0') {
    if (report.runs) {
      report.runs.forEach(run => {
        if (run.tool.driver.name === 'CodeQL') { //TODO could support other tools
          if (run.tool.driver.rules && run.tool.driver.rules.length > 0) {
            sarifRules = run.tool.driver.rules;
            return;
          }

          // Fallback for when the rules are defined in the extensions:
          if (run.tool.extensions) {
            console.log("Running fallback...");
            run.tool.extensions.forEach(extension => {
              console.log("Pushing extension rules...");
              sarifRules.push(...extension.rules);
            });
            console.log("Added rules defined in extensions!");
          }
        }
      });
    }
  } else {
    throw new Error(`Unsupported version: ${report.version}`)
  }

  return getAppliedRuleDetails(sarifRules);
}


function getAppliedRuleDetails(sarifRules: SarifRule[] | null): CodeScanningRule[] | null {
  if (sarifRules) {
    return sarifRules.map(rule => {
      return new CodeScanningRule(rule)
    });
  }

  return null;
}


function unique(array: string[]): string[] {
  return array.filter((val, idx, self) => {
    return self.indexOf(val) === idx
  });
}
