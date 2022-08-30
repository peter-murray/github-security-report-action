"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeScanningResults {
    constructor() {
        this.data = [];
    }
    addCodeScanningAlert(alert) {
        this.data.push(alert);
    }
    getTools() {
        const result = [];
        this.data.forEach(alert => {
            const toolName = alert.toolName;
            if (toolName && result.indexOf(toolName) === -1) {
                result.push(toolName);
            }
        });
        return result;
    }
    getCodeQLScanningAlerts() {
        return this.data.filter(value => {
            //TODO this is now reporting CodeQL command-line toolchain as the name of the tool!
            // Need to follow up on this with GHAS team on what to expect in the future.
            return `${value.toolName}`.toLowerCase().startsWith('codeql');
        });
    }
}
exports.default = CodeScanningResults;
