"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var store_1 = require("../store/store");
var transaction_validators_1 = require("./transaction.validators");
describe('Transaction Validators', function () {
    describe('Same Day Transaction validations', function () {
        beforeEach(function () {
            store_1.Store.clearCache();
        });
        it('should return accepted as false the one transaction is over daily limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 5001, dateTime: moment_1.default('2020-12-11T00:00:00Z') };
            var expectedOutput = { id: transaction1.id, customerId: transaction1.customerId, accepted: false };
            var output = transaction_validators_1.isMaxLoadedFortheDay(transaction1);
            expect(output.id).toBe(expectedOutput.id);
            expect(output.customerId).toBe(expectedOutput.customerId);
            expect(output.accepted).toBe(expectedOutput.accepted);
        });
        it('should return accepted as false if multiple transactions on same day is over daily limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerHistoryForDay').and.returnValue({ dailyCount: 2, dailyTotal: 4000 });
            var output1 = transaction_validators_1.isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeFalsy();
        });
        it('should return accepted as false if multipple transactions on same day is over daily count', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerHistoryForDay').and.returnValue({ dailyCount: 3, dailyTotal: 100 });
            var output1 = transaction_validators_1.isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeFalsy();
        });
        it('should return accepted as true if one transaction is same as daily limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 5000, dateTime: moment_1.default('2020-12-11T00:00:00Z') };
            var expectedOutput = { id: transaction1.id, customerId: transaction1.customerId, accepted: true };
            var output = transaction_validators_1.isMaxLoadedFortheDay(transaction1);
            expect(output.id).toBe(expectedOutput.id);
            expect(output.customerId).toBe(expectedOutput.customerId);
            expect(output.accepted).toBe(expectedOutput.accepted);
        });
        it('should return accepted as true if multiple transactions on same day is below daily limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerHistoryForDay').and.returnValue({ dailyCount: 2, dailyTotal: 3000 });
            var output1 = transaction_validators_1.isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeTruthy();
        });
        it('should return accepted as true if multipple transactions on same day is below daily count', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerHistoryForDay').and.returnValue({ dailyCount: 2, dailyTotal: 100 });
            var output1 = transaction_validators_1.isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeTruthy();
        });
    });
    describe('Weekly Transaction Validations', function () {
        beforeEach(function () {
            store_1.Store.clearCache();
        });
        it('should return accepted as false if multipple transactions on same week is above weekly limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerTransactionAmountForTheWeek').and.returnValue(20000);
            var output1 = transaction_validators_1.isMaxLoadedFortheWeek(transaction1);
            expect(output1.accepted).toBeFalsy();
        });
        it('should return accepted as true if multipple transactions on same week is equal to weekly limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerTransactionAmountForTheWeek').and.returnValue(18000);
            var output1 = transaction_validators_1.isMaxLoadedFortheWeek(transaction1);
            expect(output1.accepted).toBeTruthy();
        });
        it('should return accepted as true if multipple transactions on same week is below weekly limit', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 1000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerTransactionAmountForTheWeek').and.returnValue(18000);
            var output1 = transaction_validators_1.isMaxLoadedFortheWeek(transaction1);
            expect(output1.accepted).toBeTruthy();
        });
    });
    describe('Transaction duplicate validation', function () {
        beforeEach(function () {
            store_1.Store.clearCache();
        });
        it('should return true if a transactions id is unique for a customer', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerTransactionIds').and.returnValue([2]);
            var output1 = transaction_validators_1.isUniqueTransaction(transaction1);
            expect(output1).toBeTruthy();
        });
        it('should return false if a transactions id is not unique for a customer', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 2000, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            spyOn(store_1.Store, 'getCustomerTransactionIds').and.returnValue([1]);
            var output1 = transaction_validators_1.isUniqueTransaction(transaction1);
            expect(output1).toBeFalsy();
        });
    });
    describe('Transaction validation pipeline', function () {
        beforeEach(function () {
            store_1.Store.clearCache();
        });
        it('should return accepted as false if any transactions didnt pass the validation', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 5001, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            var output1 = transaction_validators_1.validationPipeline(transaction1);
            expect(output1.accepted).toBeFalsy();
        });
        it('should return accepted as true if the transactions passes all the validations', function () {
            var transaction1 = { id: 1, customerId: 600, loadAmount: 200, dateTime: moment_1.default('2020-12-11T01:00:00Z') };
            var output1 = transaction_validators_1.validationPipeline(transaction1);
            expect(output1.accepted).toBeTruthy();
        });
    });
});
