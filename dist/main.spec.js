"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var rxjs_1 = require("rxjs");
var main_1 = require("./main");
var transaction_models_1 = require("./models/transaction.models");
var store_1 = require("./store/store");
describe("Main program", function () {
    var main;
    beforeEach(function () {
        main = new main_1.Main();
        store_1.Store.clearCache();
    });
    it("should start reading from a file upon init", function () {
        var fakeTransaction = { id: 1, customerId: 100, loadAmount: 500, dateTime: moment_1.default() };
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(rxjs_1.of(fakeTransaction));
        main.init();
        main.fileService.readEachTransaction().subscribe(function (x) {
            expect(x).toBe(fakeTransaction);
        });
    });
    it("should write output response to a file if transaction is being read with a unique id for each customer", function () {
        var fakeTransaction = { id: 2, customerId: 200, loadAmount: 500, dateTime: moment_1.default() };
        var out = new transaction_models_1.OutputResponse(fakeTransaction.id, fakeTransaction.customerId, true);
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(rxjs_1.of(fakeTransaction));
        spyOn(main.fileService, 'writeTransactionOutput').and.returnValue(rxjs_1.of('success'));
        main.init();
        expect(main.fileService.writeTransactionOutput).toHaveBeenCalledWith(out);
    });
    it("should not write to file if duplicate transaction id for the same customer ", function () {
        var fakeTransaction1 = { id: 3, customerId: 300, loadAmount: 500, dateTime: moment_1.default() };
        var fakeTransaction2 = { id: 3, customerId: 300, loadAmount: 1000, dateTime: moment_1.default() };
        var out = new transaction_models_1.OutputResponse(fakeTransaction1.id, fakeTransaction1.customerId, true);
        var out2 = new transaction_models_1.OutputResponse(fakeTransaction2.id, fakeTransaction2.customerId, false);
        var writeFileSpy = spyOn(main.fileService, 'writeTransactionOutput').and.returnValue(rxjs_1.of('success'));
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(rxjs_1.of(fakeTransaction1, fakeTransaction2));
        main.init();
        expect(writeFileSpy).toHaveBeenCalledOnceWith(out);
        expect(writeFileSpy).not.toHaveBeenCalledOnceWith(out2);
    });
    it("should write to file if new transaction is read with unique transaction id for the same customer ", function () {
        var fakeTransaction1 = { id: 4, customerId: 400, loadAmount: 500, dateTime: moment_1.default() };
        var fakeTransaction2 = { id: 5, customerId: 400, loadAmount: 1000, dateTime: moment_1.default() };
        var writeFileSpy = spyOn(main.fileService, 'writeTransactionOutput').and.returnValue(rxjs_1.of('success'));
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(rxjs_1.of(fakeTransaction1, fakeTransaction2));
        main.init();
        expect(writeFileSpy).toHaveBeenCalledTimes(2);
    });
    it("should record the transaction id after reading each transaction ", function () {
        var fakeTransaction1 = { id: 6, customerId: 600, loadAmount: 500, dateTime: moment_1.default() };
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(rxjs_1.of(fakeTransaction1));
        spyOn(store_1.Store, 'recordTransactionId').and.returnValue();
        main.init();
        expect(store_1.Store.recordTransactionId).toHaveBeenCalledWith(fakeTransaction1);
    });
    it("should call loadAmount if a valid Transaction ", function () {
        var fakeTransaction1 = { id: 7, customerId: 700, loadAmount: 500, dateTime: moment_1.default() };
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(rxjs_1.of(fakeTransaction1));
        spyOn(store_1.Store, 'loadAmount').and.returnValue();
        main.init();
        expect(store_1.Store.loadAmount).toHaveBeenCalledWith(fakeTransaction1);
    });
});
