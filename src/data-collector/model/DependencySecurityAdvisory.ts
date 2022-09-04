import { QuerySecurityVulnerabilityResultNodeSecurityAdvisory } from "../dependencies/graphql-queries";


export class DependencySecurityAdvisoryIdentifier {
  readonly type: string;
  readonly value: string;

  constructor(data: {type: string, value: string}) {
    this.type = data.type;
    this.value = data.value;
  }
}

export class DependencySecurityAdvisory {

  private readonly data: QuerySecurityVulnerabilityResultNodeSecurityAdvisory

  constructor(data: QuerySecurityVulnerabilityResultNodeSecurityAdvisory) {
    this.data = data;
  }

  get databaseId(): number {
    return this.data.databaseId;
  }

  get id(): string {
    return this.data.id;
  }

  get summary(): string {
    return this.data.summary;
  }

  //TODO constrain this
  get severity(): string {
    return this.data.severity;
  }

  get description(): string {
    return this.data.description;
  }

  get githubSecurityAdvisoryId(): string {
    return this.data.ghsaId;
  }

  get identifiers(): DependencySecurityAdvisoryIdentifier[] | undefined {
    if (this.data.identifiers) {
      return this.data.identifiers.map(identifier => { return new DependencySecurityAdvisoryIdentifier(identifier)});
    }

    return undefined;
  }

  get permalink(): string {
    return this.data.permalink;
  }

  //TODO this is timestamp, could perform conversion to Date.
  get published(): string {
    return this.data.publishedAt;
  }
}