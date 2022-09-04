"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dependency_1 = __importDefault(require("./Dependency"));
class DependencySet {
    constructor(data) {
        this.data = data;
    }
    get filename() {
        return this.data.node.filename;
    }
    get count() {
        return this.data.node.dependenciesCount || 0;
    }
    get path() {
        return this.data.node.blobPath;
    }
    get isValid() {
        return this.parsable && !this.exceededMaxSize;
    }
    get parsable() {
        return this.data.node.parseable;
    }
    get exceededMaxSize() {
        return this.data.node.exceedsMaxSize;
    }
    get dependencies() {
        const deps = this.data.node.dependencies.edges;
        if (deps) {
            return deps.map(dep => {
                return new Dependency_1.default(dep);
            });
        }
        return [];
    }
}
exports.default = DependencySet;
