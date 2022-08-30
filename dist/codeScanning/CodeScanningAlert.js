"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeScanningAlert {
    constructor(data) {
        this.data = data;
    }
    get id() {
        return this.data.number;
    }
    get url() {
        return this.data.html_url;
    }
    get created() {
        return this.data.created_at;
    }
    get dismissed() {
        if (!this.data.dismissed_at) {
            return null;
        }
        const result = {
            at: this.data.dismissed_at,
            reason: this.data.dismissed_reason,
        };
        if (this.data.dismissed_by) {
            result.by = {
                login: this.data.dismissed_by.login,
                type: this.data.dismissed_by.type,
                id: this.data.dismissed_by.id,
            };
        }
        return result;
    }
    get severity() {
        // return this.rule ? this.rule.severity : null;
        return this.rule.severity;
    }
    get state() {
        return this.data.state;
    }
    get rule() {
        return this.data.rule;
    }
    get ruleId() {
        return this.rule.id;
    }
    get ruleDescription() {
        return this.rule.description;
    }
    get toolName() {
        return this.data.tool ? this.data.tool.name : null;
    }
    get toolVersion() {
        return this.data.tool ? this.data.tool.version : null;
    }
}
exports.default = CodeScanningAlert;
