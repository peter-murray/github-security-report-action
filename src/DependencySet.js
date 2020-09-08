'use strict';

const Dependency = require('./Dependency')

module.exports = class DependencySet {

  constructor(data) {
    this._data = data;
  }

  get filename() {
    return this.data.filename;
  }

  get count() {
    return this.data.dependenciesCount || 0;
  }

  get path() {
    return this.data.blobPath;
  }

  get isValid() {
    return this.parsable && !this.exceededMaxSize;
  }

  get parsable() {
    return this.data.parseable;
  }

  get exceededMaxSize() {
    return this.data.exceedsMaxSize;
  }

  get dependencies() {
    const deps = this.data.dependencies.edges;

    if (deps) {
      // console.log(JSON.stringify(deps));
      // console.log(JSON.stringify(deps[0], null, 2))
      return deps.map(dep => { return new Dependency(dep.node)} );
    }
    return [];
  }

  get data() {
    return this._data;
  }
}