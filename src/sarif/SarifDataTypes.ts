export type SarifReportData = {
  version: string,
  runs: SarifRun[],
}

export type SarifRun = {
  tool: {
    driver: {
      name: string,
      rules: SarifRule[]
    },
    extensions?: SarifExtension[]
  }
}

export type SarifExtension = {
  name: string,
  semanticVersion: string,
  locations: [{
    uri: string,
    description: {
      text: string,
    }
  }],
  notifications?: any[],
  rules?: SarifRule[]

}

export type SarifRule = {
  id: string,
  name: string,
  shortDescription: {
    text: string,
  },
  fullDescription: {
    text: string,
  },
  properties: {
    tags: string[],
    precision: string,
    kind: string,

  },
  defaultConfiguration: {
    level: string,
    enabled: boolean,
  },
  description: string,
  kind: string,
  precision: string,
  'problem.severity': string,
  'security-severity': string,
}
