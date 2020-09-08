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

    // TODO use promises here
    if (fs.lstatSync(dir).isDirectory()) {
      fs.readdirSync(dir)
        .filter(f => f.endsWith('.sarif'))
        .map(f => path.resolve(dir, f))
        .forEach(f => {
          promises.push(loadFileContents(f).then(report => {return {file: f, payload: report}}));
        });
    }

    return Promise.all(promises);
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