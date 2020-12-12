"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
var moment_1 = __importDefault(require("moment"));
var transaction_models_1 = require("../models/transaction.models");
var utils_1 = require("../utils/utils");
var Store = /** @class */ (function () {
    function Store() {
    }
    // returs the transaction records
    Store.getTransactionRecords = function () {
        return this.transactionRecord;
    };
    // empties the transaction records
    Store.clearCache = function () {
        this.transactionRecord = { transactionIds: {} };
    };
    // returs the totalAmount and totalCount of transaction made on a particular day
    Store.getCustomerHistoryForDay = function (customerId, date) {
        var day = JSON.stringify(utils_1.excludeTime(date));
        if (this.transactionRecord[customerId] && this.transactionRecord[customerId][day]) {
            return this.transactionRecord[customerId][day];
        }
        return { dailyTotal: 0, dailyCount: 0 };
    };
    // returns the total amount of transaction conducted in a week
    Store.getCustomerTransactionAmountForTheWeek = function (customerId, dateTime) {
        var startDate = moment_1.default(dateTime, "MM-DD-YYYY").startOf('isoWeek');
        var endDate = moment_1.default(dateTime, "MM-DD-YYYY").endOf('isoWeek');
        var sum = 0;
        if (this.transactionRecord[customerId]) {
            for (var day in this.transactionRecord[customerId]) {
                var mdate = moment_1.default.utc(day, 'YYYY-MM-DD');
                if (mdate >= startDate && mdate <= endDate) {
                    sum += this.transactionRecord[customerId][day].dailyTotal;
                }
            }
        }
        return sum;
    };
    // Add the new transaction amount to the dailyTotal and increment transaction count for that day by one
    Store.loadAmount = function (x) {
        var day = JSON.stringify(utils_1.excludeTime(x.dateTime));
        var customerId = x.customerId;
        if (!this.transactionRecord[customerId]) {
            this.transactionRecord[customerId] = {};
        }
        if (!this.transactionRecord[customerId][day]) {
            this.transactionRecord[customerId][day] = new transaction_models_1.TransactionSummary();
        }
        if (this.transactionRecord[customerId][day]) {
            this.transactionRecord[customerId][day].dailyCount += 1;
            this.transactionRecord[customerId][day].dailyTotal += x.loadAmount;
        }
    };
    Store.recordTransactionId = function (x) {
        var customerId = x.customerId;
        if (!this.transactionRecord.transactionIds[customerId]) {
            this.transactionRecord.transactionIds[customerId] = [];
        }
        this.transactionRecord.transactionIds[customerId].push(x.id);
    };
    // returs all the transactions done for a given customer
    Store.getCustomerTransactionIds = function (customerId) {
        return this.transactionRecord.transactionIds[customerId] ? this.transactionRecord.transactionIds[customerId] : [];
    };
    Store.transactionRecord = {
        transactionIds: {}
    };
    return Store;
}());
exports.Store = Store;
