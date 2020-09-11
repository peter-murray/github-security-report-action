module.exports = class CodeScanningResult {

  constructor(sarifResult) {
    this._sarifResult = sarifResult;
    this._locations = extractLocations(sarifResult);
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

  get locations() {
    return this._locations;
  }

  get _sarif() {
    return this._sarifResult;
  }
}

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