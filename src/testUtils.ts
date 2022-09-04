import * as path from 'path';
import * as nock from 'nock';

const nockBack = nock.back;

export function getTestDirectoryFilePath(...filePath): string {
  const args = [__dirname, '..', '_tmp', ...filePath];
  return path.join(...args);
}

export function getSampleDataDirectory(...dir): string {
  const args = [__dirname, '..', 'samples', ...dir];
  return path.join(...args);
}

export function getSampleSarifDirectory(...dir): string {
  const args = [__dirname, '..', 'samples', 'sarif', ...dir];
  return path.join(...args);
}

export function getSampleReportJsonDirectory(...dir): string {
  const args = [__dirname, '..', 'samples', 'reportJson', ...dir];
  return path.join(...args);
}

export function getGitHubToken(): string {
  const token = process.env['GH_TOKEN'];

  if (!token) {
    throw new Error('GitHub Token was not set for environment variable "GH_TOKEN"');
  }
  return token;
}

export class NockUtils {

  private ctxMap: { [key: string]: Function } = {};

  private _currentContext: string | undefined;

  private _currentTest: string | undefined;

  constructor(name: string) {
    this._currentContext = name;

    nockBack.fixtures = path.join(__dirname, '..', 'nock');
    nockBack.setMode('record');
  }

  get currentContext() {
    return this._currentContext || 'default-context';
  }

  get currentTest() {
    return this._currentTest || 'default-test';
  }

  record(): void {
    nockBack.setMode('record');
  }

  reset(): void {
    nockBack.setMode('wild');
  }

  dryRun(): void {
    nockBack.setMode('dryrun');
  }

  beforeEachJest(testTitle: string) {
    const ctxMap = this.ctxMap;

    this._currentTest = testTitle;
    const currentTest = this.currentTest;

    nock.cleanAll();

    nockBack(this.getTestDataPath(), function (done) {
      ctxMap[currentTest] = done;
    });
  }

  afterEachJest() {
    const currentTest = this.currentTest
      , nockDone: Function | undefined = this.ctxMap[this.currentTest]
      ;

    if (nockDone) {
      nockDone();
      delete this.ctxMap[currentTest];
    }

    this._currentTest = undefined;
  }

  getTestDataPath() {
    return path.join(this.currentContext, this.currentTest);
  }
}

function cleanString(str: string): string {
  // Replace any invalid/tricky characters for a path string
  const myStr = str.replace(/[#\(\):'"<> ]/g, '');
  return myStr.toLowerCase();
}

// function getTestTitle(runnable: MochaSuite): string {
//   //TODO this needs cleaning up
//   if (runnable?.ctx.currentTest) {
//     return runnable.ctx.currentTest.fullTitle();
//     //@ts-ignore
//   } else if (runnable.ctx.test?.fullTitle()) {
//     //@ts-ignore
//     return ctx.test?.fullTitle();
//   } else {
//     return '';
//   }
// }

// function getTestPath(runnable: MochaRunnable) {
//   let parent: MochaRunnable = runnable.parent
//     , pathParts: string[] = []
//     ;

//   while (parent?.title) {
//     pathParts.unshift(cleanString(parent.title));
//     parent = parent.parent;
//   }

//   if (runnable.title) {
//     pathParts.push(cleanString(runnable.title));
//   }

//   return pathParts.join(path.sep);
// }
