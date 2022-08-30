"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const SarifReport_1 = __importDefault(require("./SarifReport"));
class SarifReportFinder {
    constructor(dir) {
        this.dir = dir;
    }
    getSarifFiles() {
        const dir = this.dir, promises = [];
        if (!fs.existsSync(dir)) {
            throw new Error(`SARIF Finder, path "${dir}", does not exist.`);
        }
        console.log(`SARIF File Finder, processing: ${dir}`);
        if (fs.lstatSync(dir).isDirectory()) {
            console.log(`  is a directory, looking for files`);
            const files = fs.readdirSync(dir) // TODO use promises here
                .filter(f => f.endsWith('.sarif'))
                .map(f => path.resolve(dir, f));
            console.log(`  SARIF files detected: ${JSON.stringify(files)}`);
            if (files) {
                files.forEach(f => {
                    promises.push(loadFileContents(f));
                });
            }
        }
        if (promises.length > 0) {
            return Promise.all(promises);
        }
        else {
            return Promise.resolve([]);
        }
    }
}
exports.default = SarifReportFinder;
function loadFileContents(file) {
    return fs.promises.open(file, 'r')
        .then(fileHandle => {
        return fileHandle.readFile()
            .then(content => {
            fileHandle.close();
            try {
                return JSON.parse(content.toString('utf8'));
            }
            catch (err) {
                throw new Error(`Failed to parse JSON from SARIF file '${file}': ${err}`);
            }
        })
            .then(data => {
            return {
                file: file,
                payload: new SarifReport_1.default(data),
            };
        });
    });
}
