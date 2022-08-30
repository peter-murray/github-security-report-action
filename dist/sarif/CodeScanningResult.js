"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalLocation = void 0;
class PhysicalLocation {
    constructor(location) {
        this._location = location;
    }
    get artifactLocation() {
        return this._location.artifactLocation.uri;
    }
    get region() {
        return this._location.region;
    }
}
exports.PhysicalLocation = PhysicalLocation;
class CodeScanningResult {
    constructor(sarifResult) {
        this._sarif = sarifResult;
        this.locations = extractLocations(sarifResult);
    }
    get ruleId() {
        return this._sarif.ruleId;
    }
    get ruleIndex() {
        return this._sarif.ruleIndex;
    }
    get message() {
        return this._sarif.message.text;
    }
}
exports.default = CodeScanningResult;
function extractLocations(sarif) {
    if (sarif && sarif.locations) {
        const results = [];
        sarif.locations.forEach(location => {
            results.push(new PhysicalLocation(location));
        });
        return results;
    }
    return null;
}
