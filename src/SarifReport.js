'use strict';

const CodeScanningRule = require('./CodeScanningRule');

module.exports = class SarifReport {

  constructor(data) {
    this._data = data;
    this._rules = getRules(data) || [];
  }

  get rules() {
    return this._rules;
  }

  get cweList() {
    const result = this.rules.reduce((cwes, rule) => {
      return cwes.concat(rule.cwes)
    }, []);
    return unique(result).sort();
  }
}

function getRules(report) {
  let sarifRules = null;

  //TODO could error on unknown version
  if (report.version === '2.1.0') {
    report.runs.forEach(run => {
      if (run.tool.driver.name === 'CodeQL') { //TODO ould support other tools
        sarifRules = run.tool.driver.rules;
      }
    });
  }

  return getAppliedRuleDetails(sarifRules);
}

function getAppliedRuleDetails(sarifRules) {
  if (sarifRules) {
    return sarifRules.map(rule => {
      return new CodeScanningRule(rule)
    });
  }
  return null;
}

function unique(array) {
  return array.filter((val, idx, self) => {
    return self.indexOf(val) === idx
  });
}