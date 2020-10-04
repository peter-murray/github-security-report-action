import * as path from 'path';
import * as fs from 'fs';
import SarifReport from './SarifReport';

export type SarifFile = {
  file: string,
  payload: SarifReport
}

export default class SarifReportFinder {

  private readonly dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  getSarifFiles(): Promise<SarifFile[]> {
    const dir = this.dir
      , promises: Promise<SarifFile>[] = []
    ;

    if (!fs.existsSync(dir)) {
      throw new Error(`Path does not exist: ${dir}`);
    }

    console.log(`Processing: ${dir}`);
    if (fs.lstatSync(dir).isDirectory()) {
      console.log(`  is a directory`);

      const files = fs.readdirSync(dir) // TODO use promises here
        .filter(f => f.endsWith('.sarif'))
        .map(f => path.resolve(dir, f));

      console.log(`Matched Files: ${JSON.stringify(files)}`);
      if (files) {
        files.forEach(f => {
          promises.push(loadFileContents(f));
        });
      }
    }

    if (promises.length > 0) {
      return Promise.all(promises);
    } else {
      return Promise.resolve([]);
    }
  }
}

function loadFileContents(file: string): Promise<SarifFile> {
  return fs.promises.open(file, 'r')
    .then(fileHandle => {
      return fileHandle.readFile()
        .then(content => {
          fileHandle.close();
          try {
            return JSON.parse(content.toString('utf8'));
          } catch (err) {
            throw new Error(`Failed to parse JSON from SARIF file '${file}': ${err}`);
          }
        })
        .then(data => {
          return {
            file: file,
            payload: new SarifReport(data),
          };
        })
    });
}