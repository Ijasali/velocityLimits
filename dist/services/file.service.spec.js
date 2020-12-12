"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var rxjs_1 = require("rxjs");
var file_service_1 = require("./file.service");
var lineReader = require('line-reader');
describe('File Service', function () {
    var fileService;
    beforeEach(function () {
        fileService = new file_service_1.FileService();
    });
    it('should read file line by line upon calling readEachTransaction() method', function () {
        var fakeTransaction1 = { id: 6, customerId: 600, loadAmount: 500, dateTime: moment_1.default() };
        spyOn(lineReader, 'eachLine').and.returnValue(rxjs_1.of(fakeTransaction1));
        fileService.readEachTransaction().subscribe(function (x) {
            expect(x).toBe(fakeTransaction1);
        });
    });
    it('should write output response to a file upon calling writeTransactionOutput() method', function () {
        var out = { id: 61, customerId: 600, accepted: true };
        spyOn(fileService, 'writeTransactionOutput').and.returnValue(rxjs_1.of('success'));
        fileService.writeTransactionOutput(out).subscribe(function (x) {
            expect(x).toBe('success');
        });
    });
});
