import { GitHubSarifRule } from "./GitHubSarifRule";
import { SarifData } from "./SarifData";

export class GitHubSarifReport {

  private readonly data: SarifData;

  readonly rules: GitHubSarifRule[];

  constructor(data: SarifData) {
    this.data = data;
    this.rules = getRules(data) || [];
  }

  get cweList(): string[] {
    const result = this.rules.reduce((cwes: string[], rule) => {
      return cwes.concat(rule.cwes)
    }, []);
    return unique(result).sort();
  }
}

function getRules(data: SarifData): GitHubSarifRule[] | undefined {
  let sarifRules: GitHubSarifRule[] = [];

  if (data.version === '2.1.0') {
    if (data.runs && data.runs.length > 0) {
      data.runs.forEach(run => {
        if (run.tool.driver.name === 'CodeQL') { //TODO could support other tools
          run.tool.extensions.forEach(extension => {
            if (extension.rules) {
              extension.rules.forEach(rule => {
                sarifRules.push(new GitHubSarifRule(rule));
              });
            }
          });
        }
      });
    }
  } else {
    throw new Error(`Unsupported version: ${data.version}`)
  }

  return sarifRules;
}

function unique(array: string[]): string[] {
  return array.filter((val, idx, self) => {
    return self.indexOf(val) === idx
  });
}