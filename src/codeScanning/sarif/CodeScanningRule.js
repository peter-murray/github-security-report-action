const CWE_REGEX = /external\/cwe\/(cwe-.*)/;

module.exports = class CodeScanningRule {

  constructor(sarifRule) {
    this._sarifRule = sarifRule;
    this._cwes = getCWEs(sarifRule.properties.tags);
  }

  get id() {
    return this._sarif.id;
  }

  get name() {
    return this._sarif.name;
  }

  get shortDescription() {
    return this._sarif.shortDescription.text;
  }

  get description() {
    return this._sarif.fullDescription.text;
  }

  get tags() {
    return this._sarif.properties.tags;
  }

  get cwes() {
    return this._cwes;
  }

  get severity() {
    return this._sarif.properties['problem.severity'];
  }

  get precision() {
    return this._sarif.properties.precision;
  }

  get kind() {
    return this._sarif.properties.kind;
  }

  get defaultConfigurationLevel() {
    return this._sarif.defaultConfiguration.level;
  }

  get _sarif() {
    return this._sarifRule;
  }
}

function getCWEs(tags) {
  const cwes = [];

  if (tags) {
    tags.forEach(tag => {
      const match = CWE_REGEX.exec(tag);
      if (match) {
        cwes.push(match[1]);
      }
    });
  }

  return cwes.sort();
}