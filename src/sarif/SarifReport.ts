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
        const driver = run.tool.driver;

        // Limiting to CodeQL currently
        if (driver && driver.name === 'CodeQL') {
          const driverRules = run.tool.driver.rules;

          if (driverRules && driverRules.length > 0) {
            sarifRules.push(...driverRules);
          }

          const extensions = run.tool.extensions;
          if (extensions) {
            extensions.forEach(extension => {
              if (extension.rules) {
                sarifRules.push(...extension.rules);
              }
            })
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