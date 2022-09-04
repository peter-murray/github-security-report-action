interface Location {
  artifactLocation: {
    uri: string
  }
  region: string
}

export class PhysicalLocation {

  private _location: Location

  constructor(location: Location) {
    this._location = location;
  }

  get artifactLocation(): string {
    return this._location.artifactLocation.uri;
  }

  get region(): string {
    return this._location.region;
  }
}

interface Sarif {
  ruleId: string,
  ruleIndex: number,
  message: {
    text: string,
  },
  locations: Location[],
}

export default class CodeScanningResult {

  readonly locations: PhysicalLocation[] | null;

  private _sarif: Sarif

  constructor(sarifResult) {
    this._sarif = sarifResult;
    this.locations = extractLocations(sarifResult);
  }

  get ruleId() : string {
    return this._sarif.ruleId;
  }

  get ruleIndex(): number {
    return this._sarif.ruleIndex;
  }

  get message(): string {
    return this._sarif.message.text;
  }
}

function extractLocations(sarif: Sarif): PhysicalLocation[] | null {
  if (sarif && sarif.locations) {
    const results: PhysicalLocation[] = [];

    sarif.locations.forEach(location => {
      results.push(new PhysicalLocation(location));
    });

    return results;
  }
  return null;
}

