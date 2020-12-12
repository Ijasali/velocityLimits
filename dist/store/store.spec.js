"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var utils_1 = require("../utils/utils");
var store_1 = require("./store");
describe('Store', function () {
    beforeEach(function () {
        store_1.Store.clearCache();
    });
    it('should add amount to the Daily Total and increment the transaction count by one when loadAmount is called', function () {
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        var transaction2 = { id: 97, customerId: 600, loadAmount: 600, dateTime: moment_1.default.utc() };
        var day = JSON.stringify(utils_1.excludeTime(transaction1.dateTime));
        store_1.Store.loadAmount(transaction1);
        store_1.Store.loadAmount(transaction2);
        var transactions = store_1.Store.getTransactionRecords();
        var ct = transactions[transaction1.customerId][day];
        expect(ct.dailyCount).toBe(2);
        expect(ct.dailyTotal).toBe(1100);
    });
    it('should return the total amount and total count of transacations made by a customer on a given day', function () {
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        var transaction2 = { id: 97, customerId: 600, loadAmount: 600, dateTime: moment_1.default.utc() };
        var day = JSON.stringify(utils_1.excludeTime(transaction1.dateTime));
        store_1.Store.loadAmount(transaction1);
        store_1.Store.loadAmount(transaction2);
        var ct = store_1.Store.getCustomerHistoryForDay(transaction1.customerId, transaction1.dateTime);
        expect(ct.dailyCount).toBe(2);
        expect(ct.dailyTotal).toBe(1100);
    });
    it('should return the total amount of transacations made by a customer on a week given the date', function () {
        var transaction = { id: 95, customerId: 600, loadAmount: 100, dateTime: moment_1.default.utc('2020-12-06T00:00:00Z') }; // will be ignored
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-07T00:00:00Z') };
        var transaction2 = { id: 97, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-08T13:00:00Z') };
        var transaction3 = { id: 98, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-09T06:00:00Z') };
        var transaction4 = { id: 99, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-10T09:00:00Z') };
        var transaction5 = { id: 100, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-11T22:00:00Z') };
        var transaction6 = { id: 101, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-13T23:59:59Z') };
        var transaction7 = { id: 102, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc('2020-12-14T00:00:00Z') }; // will be ignored
        store_1.Store.loadAmount(transaction);
        store_1.Store.loadAmount(transaction1);
        store_1.Store.loadAmount(transaction2);
        store_1.Store.loadAmount(transaction3);
        store_1.Store.loadAmount(transaction4);
        store_1.Store.loadAmount(transaction5);
        store_1.Store.loadAmount(transaction6);
        store_1.Store.loadAmount(transaction7);
        var ct = store_1.Store.getCustomerTransactionAmountForTheWeek(transaction1.customerId, transaction1.dateTime);
        expect(ct).toBe(3000);
    });
    it('should store transaction id for a customer', function () {
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        store_1.Store.recordTransactionId(transaction1);
        var transaction2 = { id: 97, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        store_1.Store.recordTransactionId(transaction2);
        var ct = store_1.Store.getTransactionRecords();
        expect(ct.transactionIds[600]).toEqual([96, 97]);
    });
    it('should return all the transactions', function () {
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        store_1.Store.recordTransactionId(transaction1);
        var transaction2 = { id: 97, customerId: 601, loadAmount: 500, dateTime: moment_1.default.utc() };
        store_1.Store.recordTransactionId(transaction2);
        var ct = store_1.Store.getTransactionRecords();
        expect(ct.transactionIds[600]).toEqual([96]);
        expect(ct.transactionIds[601]).toEqual([97]);
    });
    it('should reset the transactions by calling clearCache', function () {
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        var transaction2 = { id: 97, customerId: 601, loadAmount: 500, dateTime: moment_1.default.utc() };
        store_1.Store.recordTransactionId(transaction1);
        store_1.Store.recordTransactionId(transaction2);
        store_1.Store.clearCache();
        var ct = store_1.Store.getTransactionRecords();
        expect(ct.transactionIds[600]).toBeFalsy();
        expect(ct.transactionIds[601]).toBeFalsy();
    });
    it('should return customer transactionsids by calling getCustomerTransactionIds', function () {
        var transaction1 = { id: 96, customerId: 600, loadAmount: 500, dateTime: moment_1.default.utc() };
        var transaction2 = { id: 97, customerId: 601, loadAmount: 500, dateTime: moment_1.default.utc() };
        store_1.Store.recordTransactionId(transaction1);
        store_1.Store.recordTransactionId(transaction2);
        var tr1 = store_1.Store.getCustomerTransactionIds(600);
        var tr2 = store_1.Store.getCustomerTransactionIds(601);
        expect(tr1).toEqual([96]);
        expect(tr2).toEqual([97]);
    });
});
