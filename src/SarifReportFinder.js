const fs = require('fs')
  , path = require('path')
  , SarifReport = require('./SarifReport')
  ;

module.exports = class SarifReportFinder {

  constructor(dir) {
    this._dir = dir;
  }

  getSarifFiles() {
    const dir = this._dir
      , promises = []
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
          promises.push(loadFileContents(f).then(report => {return {file: f, payload: report}}));
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

function loadFileContents(file) {
  return fs.promises.open(file)
    .then(fileHandle => {
      return fileHandle.readFile()
        .then(content => {
          fileHandle.close();
          try {
            return JSON.parse(content.toString('utf8'));
          } catch (err) {
            throw new Error(`Failed ro parse JSON contents of SARIF file ${file}: ${err}`);
          }
        })
        .then(data => {
          return new SarifReport(data);
        })
    });
}

const tester = new module.exports('./samples/java/basic');
tester.getSarifFiles().then(results => {
  console.log(JSON.stringify(results, null, 2));
});