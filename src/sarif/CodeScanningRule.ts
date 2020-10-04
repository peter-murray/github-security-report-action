import {SarifRule} from './SarifDataTypes';

const CWE_REGEX = /external\/cwe\/(cwe-.*)/;

export default class CodeScanningRule {

  private readonly sarifRule: SarifRule;

  readonly cwes: string[];

  constructor(sarifRule: SarifRule) {
    this.sarifRule = sarifRule;
    this.cwes = getCWEs(sarifRule.properties.tags);
  }

  get id(): string {
    return this.sarifRule.id;
  }

  get name() : string{
    return this.sarifRule.name;
  }

  get shortDescription(): string {
    return this.sarifRule.shortDescription.text;
  }

  get description(): string {
    return this.sarifRule.fullDescription.text;
  }

  get tags(): Array<string> {
    return this.sarifRule.properties.tags;
  }

  get severity(): string {
    return this.sarifRule.properties['problem.severity'];
  }

  get precision() : string{
    return this.sarifRule.properties.precision;
  }

  get kind() : string{
    return this.sarifRule.properties.kind;
  }

  get defaultConfigurationLevel(): string {
    return this.sarifRule.defaultConfiguration.level;
  }
}

function getCWEs(tags: string[]): string[] {
  const cwes: string[] = [];

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