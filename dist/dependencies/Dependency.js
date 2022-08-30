"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dependency {
    constructor(data) {
        this.data = data;
    }
    get name() {
        return this.data.node.packageName;
    }
    get packageType() {
        return this.data.node.packageManager;
    }
    get version() {
        return this.data.node.requirements;
    }
}
exports.default = Dependency;
