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
const DataCollector_1 = __importDefault(require("./DataCollector"));
const Template_1 = __importDefault(require("./templating/Template"));
const pdfWriter_1 = require("./pdf/pdfWriter");
const path = __importStar(require("path"));
const io_1 = require("@actions/io");
class ReportGenerator {
    constructor(config) {
        this.config = config;
    }
    run() {
        const config = this.config;
        const collector = new DataCollector_1.default(config.octokit, config.repository);
        return collector.getPayload(config.sarifReportDirectory)
            .then(reportData => {
            const reportTemplate = new Template_1.default(config.templating.directory);
            return reportTemplate.render(reportData.getJSONPayload(), config.templating.name);
        })
            .then(html => {
            return io_1.mkdirP(config.outputDirectory)
                .then(() => {
                return pdfWriter_1.createPDF(html, path.join(config.outputDirectory, 'summary.pdf'));
            });
        });
    }
}
exports.default = ReportGenerator;
