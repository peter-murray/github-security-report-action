"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CWE_REGEX = /external\/cwe\/(cwe-.*)/;
class CodeScanningRule {
    constructor(sarifRule) {
        this.sarifRule = sarifRule;
        this.cwes = getCWEs(sarifRule.properties.tags);
    }
    get id() {
        return this.sarifRule.id;
    }
    get name() {
        return this.sarifRule.name;
    }
    get shortDescription() {
        return this.sarifRule.shortDescription.text;
    }
    get description() {
        return this.sarifRule.fullDescription.text;
    }
    get tags() {
        return this.sarifRule.properties.tags;
    }
    get severity() {
        return this.sarifRule.properties['problem.severity'];
    }
    get precision() {
        return this.sarifRule.properties.precision;
    }
    get kind() {
        return this.sarifRule.properties.kind;
    }
    get defaultConfigurationLevel() {
        return this.sarifRule.defaultConfiguration.level;
    }
}
exports.default = CodeScanningRule;
function getCWEs(tags) {
    const cwes = [];
    if (tags) {
        tags.forEach(tag => {
            const match = CWE_REGEX.exec(tag);
            if (match) {
                // @ts-ignore
                cwes.push(match[1]);
            }
        });
    }
    return cwes.sort();
}
