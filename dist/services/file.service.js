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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
var fs = __importStar(require("fs"));
var rxjs_1 = require("rxjs");
var transaction_models_1 = require("../models/transaction.models");
var global_settings_1 = require("../utils/global.settings");
var utils_1 = require("../utils/utils");
var lineReader = require('line-reader');
var FileService = /** @class */ (function () {
    function FileService() {
        fs.unlink(global_settings_1.OUTPUT_FILE, rxjs_1.noop); //removes the output file during intial load
    }
    // returns an observable which will emit each transaction read from the input file
    FileService.prototype.readEachTransaction = function () {
        return new rxjs_1.Observable(function (observer) {
            lineReader.eachLine(global_settings_1.INPUT_FILE, function (line, last) {
                var t = new transaction_models_1.Transaction(JSON.parse(line));
                observer.next(t);
                if (last) {
                    observer.complete();
                }
            });
        });
    };
    // returns an observable which will emit 'success' after successfully writing the output response to a file
    FileService.prototype.writeTransactionOutput = function (out) {
        var data = utils_1.formatOutput(out);
        return new rxjs_1.Observable(function (observer) {
            fs.appendFile(global_settings_1.OUTPUT_FILE, data, function (err) {
                if (err) {
                    observer.error(err);
                }
                else {
                    observer.next('success');
                    observer.complete();
                }
            });
        });
    };
    return FileService;
}());
exports.FileService = FileService;
