export type SarifData = {
  version: string,
  $schema: string,
  runs: SarifRun[],
}

export type SarifRun = {
  artifacts: SarifArtifact[],
  automationDetails: {
    id: string,
  },
  conversion: {
    tool: {
      driver: {
        name: string,
      }
    }
  },
  results: SarifResult[],
  tool: SarifTool,
  versionControlProvenance: SarifVersionControlProvenance[],
}

export type SarifArtifact = {
  location: {
    index: number,
    uri: string,
  }
}

export type SarifResult = {
  codeFlows: CodeFlow[],
  correlationGuid: string,
  level: string,
  locations: SarifLocation[],
  message: StringMessage
  partialFingerprints: {
    primaryLocationLineHash: string,
  },
  //TODO this might be more generic
  properties: {
    'github/alertNumber': number,
    'github/alertUrl': string,
  }
  relatedLocations: RelatedLocation[],
  rule: {
    id: string,
    toolComponent: {
      index: number
    }
    index: number
  }
  ruleId: string
}

export type CodeFlow = {
  threadFlows: {
    locations: ThreadFlowLocation[],
  }[]
}

export type ThreadFlowLocation = {
  location: SarifLocation & {
    message: StringMessage,
  }
}

export type StringMessage = {
  text: string,
}

export type RelatedLocation = SarifLocation & {
  id: number
  message: StringMessage
}

export type SarifLocation = {
  pyhsicalLocation: {
    artifactLocation: {
      index: number,
      uri: string,
    },
    region: {
      startColumn: number,
      startLine: number,
      endColumn: number,
      endLine: number,
    }
  }
}

export type SarifTool = {
  driver: {
    name: string,
    semanticVersion: string
  },
  extensions: SarifToolExtension[]
}

export type SarifVersionControlProvenance = {
  branch: string,
  repositoryURI: string,
  revisionId: string,
}

export type SarifToolExtension = {
  name: string,
  semanticVversion: string,
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
    queryURI: string,
    'security-secverity': string,

  },
  defaultConfiguration: {
    level: string,
  },
  help: {
    markdown: string,
    text: string,
  }
}