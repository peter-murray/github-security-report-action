export type SarifReportData = {
  version: string,
  runs: SarifRun[],
}

export type SarifRun = {
  tool: {
    driver: {
      name: string,
      rules: SarifRule[]
    }
  }
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
  }
}
