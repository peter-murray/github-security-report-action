"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CodeScanningRule_1 = __importDefault(require("./CodeScanningRule"));
class SarifReport {
    constructor(data) {
        this.data = data;
        this.rules = getRules(data) || [];
    }
    get cweList() {
        const result = this.rules.reduce((cwes, rule) => {
            return cwes.concat(rule.cwes);
        }, []);
        return unique(result).sort();
    }
}
exports.default = SarifReport;
function getRules(report) {
    let sarifRules = null;
    if (report.version === '2.1.0') {
        if (report.runs) {
            report.runs.forEach(run => {
                if (run.tool.driver.name === 'CodeQL') { //TODO could support other tools
                    sarifRules = run.tool.driver.rules;
                }
            });
        }
    }
    else {
        throw new Error(`Unsupported version: ${report.version}`);
    }
    return getAppliedRuleDetails(sarifRules);
}
function getAppliedRuleDetails(sarifRules) {
    if (sarifRules) {
        return sarifRules.map(rule => {
            return new CodeScanningRule_1.default(rule);
        });
    }
    return null;
}
function unique(array) {
    return array.filter((val, idx, self) => {
        return self.indexOf(val) === idx;
    });
}
