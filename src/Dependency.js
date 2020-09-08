'use strict';

module.exports = class Dependency {

  constructor(data) {
    this._data = data;
  }

  get name() {
    return this.data.packageName;
  }

  get packageType() {
    return this.data.packageManager;
  }

  get version() {
    return this.data.requirements;
  }

  get data() {
    return this._data;
  }
}