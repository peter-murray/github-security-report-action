import { DependencySetDependencyData } from './DependencyTypes';

export default class Dependency {

  private readonly data: DependencySetDependencyData;

  constructor(data: DependencySetDependencyData) {
    this.data = data;
  }

  get name(): string {
    return this.data.node.packageName;
  }

  get packageType(): string {
    return this.data.node.packageManager;
  }

  get version(): string {
    return this.data.node.requirements;
  }
}