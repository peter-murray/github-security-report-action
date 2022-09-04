import Dependency from './Dependency';

import { DependencySetData } from './DependencyTypes';

export default class DependencySet {

  private readonly data: DependencySetData;

  constructor(data: DependencySetData) {
    this.data = data;
  }

  get filename(): string {
    return this.data.node.filename;
  }

  get count(): number {
    return this.data.node.dependenciesCount || 0;
  }

  get path(): string {
    return this.data.node.blobPath;
  }

  get isValid(): boolean {
    return this.parsable && !this.exceededMaxSize;
  }

  get parsable(): boolean {
    return this.data.node.parseable;
  }

  get exceededMaxSize(): boolean {
    return this.data.node.exceedsMaxSize;
  }

  get dependencies(): Dependency[] {
    const deps = this.data.node.dependencies.edges;

    if (deps) {
      return deps.map(dep => {
        return new Dependency(dep);
      });
    }
    return [];
  }
}