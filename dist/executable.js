"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportGenerator_1 = __importDefault(require("./ReportGenerator"));
const rest_1 = require("@octokit/rest");
const path_1 = __importDefault(require("path"));
const { program } = require('commander');
program.name('github-security-report');
program.version(require('../package.json').version);
program.requiredOption('-t, --token <token>', 'github access token');
program.requiredOption('-r --repository <repository>', 'github repository, owner/repo_name format');
program.option('-s --sarif-directory <sarifReportDirectory>', 'the SARIF report directory to load reports from', '../results');
program.option('-o --output-directory <outputDirectory>', 'output directory for summary report', '.');
program.option('--github-api-url <url>', 'GitHub API URL', 'https://api.github.com');
program.parse(process.argv);
const opts = program.opts();
const reportGenerateConfig = {
    repository: opts.repository,
    octokit: new rest_1.Octokit({ auth: opts.token, baseUrl: opts.url }),
    sarifReportDirectory: getPath(opts.sarifDirectory),
    outputDirectory: getPath(opts.outputDirectory),
    templating: {
        name: 'summary'
    }
};
function execute(reportGenerateConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const generator = new ReportGenerator_1.default(reportGenerateConfig);
            console.log(`Generating Security report for ${reportGenerateConfig.repository}...`);
            const file = yield generator.run();
            console.log(`Summary Report generated: ${file}`);
        }
        catch (err) {
            console.log(err.stack);
            console.error(err.message);
            console.error();
            program.help({ error: true });
        }
    });
}
execute(reportGenerateConfig);
function getPath(value) {
    if (path_1.default.isAbsolute(value)) {
        return value;
    }
    else {
        return path_1.default.normalize(path_1.default.join(process.cwd(), value));
    }
}
