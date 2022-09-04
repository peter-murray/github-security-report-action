import { QuerySecurityVulnerabilityResultNodeSecurityVulnerability } from "../dependencies/graphql-queries";

export class DependencySecurityVulnerability {

  private readonly data: QuerySecurityVulnerabilityResultNodeSecurityVulnerability;

  constructor (data: QuerySecurityVulnerabilityResultNodeSecurityVulnerability) {
    this.data = data;
  }

  get packageEcosystem(): string {
    return this.data.package.ecosystem;
  }

  get packageName(): string {
    return this.data.package.name;
  }

  //TODO constrain this
  get severity(): string {
    return this.data.severity;
  }

  get versionRange(): string {
    return this.data.vulnerableVersionRange;
  }
}