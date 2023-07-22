import { SarifRule } from "./SarifData";

const CWE_REGEX = /external\/cwe\/(cwe-.*)/;


export type SarifRuleJson = {
  id: string,
  name: string,
  shortDescription: string,
  description: string,
  tags: string[],
  queryURI: string,
  severity: string,
  precision: string,
  helpText: string,
  helpMarkdown: string,
  isReliability: boolean,
  isSecurity: boolean,
  defaultConfigurationLevel: string,
  cwes: string[],
}


/* TODO Interesting tags that have been seen that might be worth having isXXX() functions
security
reliability
lines-of-code
summary
telemetry
*/

export class GitHubSarifRule {

  private readonly sarifRule: SarifRule;

  readonly cwes: string[];

  constructor(sarifRule: SarifRule) {
    this.sarifRule = sarifRule;
    this.cwes = getCWEs(sarifRule.properties.tags);
  }

  get id(): string {
    return this.sarifRule.id;
  }

  get name(): string {
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

  get queryURI(): string {
    return this.sarifRule.properties.queryURI;
  }

  get severity(): string {
    return this.sarifRule.properties['security-severity'];
  }

  get precision(): string {
    return this.sarifRule.properties.precision;
  }

  get helpText(): string {
    return this.sarifRule.help?.text || '';
  }

  get helpMarkdown(): string {
    return this.sarifRule.help?.markdown || '';
  }

  get isReliability(): boolean {
    return this.sarifRule.properties.tags.indexOf('reliability') >= 0;
  }

  get isSecurity(): boolean {
    return this.sarifRule.properties.tags.indexOf('security') >= 0;
  }

  get defaultConfigurationLevel(): string {
    return this.sarifRule.defaultConfiguration.level;
  }

  toJSON(): SarifRuleJson {
    return {
      id: this.id,
      name: this.name,
      shortDescription: this.shortDescription,
      description: this.description,
      tags: this.tags,
      queryURI: this.queryURI,
      severity: this.severity,
      precision: this.precision,
      helpText: this.helpText,
      helpMarkdown: this.helpMarkdown,
      isReliability: this.isReliability,
      isSecurity: this.isSecurity,
      defaultConfigurationLevel: this.defaultConfigurationLevel,
      cwes: this.cwes,
    }
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