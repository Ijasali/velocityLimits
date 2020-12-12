"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPipeline = exports.isUniqueTransaction = exports.isMaxLoadedFortheWeek = exports.isMaxLoadedFortheDay = void 0;
var transaction_models_1 = require("../models/transaction.models");
var store_1 = require("../store/store");
var global_settings_1 = require("../utils/global.settings");
// validates if the tranaction for a day is not over the limit by amount or by count
function isMaxLoadedFortheDay(transaction) {
    var customerId = transaction.customerId;
    var dailyInfo = store_1.Store.getCustomerHistoryForDay(customerId, transaction.dateTime);
    var currentDayTotal = dailyInfo.dailyTotal;
    var currentDayCount = dailyInfo.dailyCount;
    if (currentDayTotal >= global_settings_1.MAX_DAILY_LIMIT || (currentDayTotal + transaction.loadAmount) > global_settings_1.MAX_DAILY_LIMIT || currentDayCount === global_settings_1.MAX_DAILY_COUNT) {
        return new transaction_models_1.OutputResponse(transaction.id, transaction.customerId, false);
    }
    return new transaction_models_1.OutputResponse(transaction.id, transaction.customerId, true);
    ;
}
exports.isMaxLoadedFortheDay = isMaxLoadedFortheDay;
// Validats if the transaction is not over the limit set for a week
function isMaxLoadedFortheWeek(transaction) {
    var customerId = transaction.customerId;
    var weeklyLoadedAmount = store_1.Store.getCustomerTransactionAmountForTheWeek(customerId, transaction.dateTime);
    if (weeklyLoadedAmount >= global_settings_1.MAX_WEEKLY_LIMIT || (weeklyLoadedAmount + transaction.loadAmount) > global_settings_1.MAX_WEEKLY_LIMIT) {
        return new transaction_models_1.OutputResponse(transaction.id, transaction.customerId, false);
    }
    return new transaction_models_1.OutputResponse(transaction.id, transaction.customerId, true);
}
exports.isMaxLoadedFortheWeek = isMaxLoadedFortheWeek;
// checks if the tranasctionId is unique for a customer
function isUniqueTransaction(transaction) {
    var customerId = transaction.customerId;
    var transactions = store_1.Store.getCustomerTransactionIds(customerId);
    return transactions.indexOf(transaction.id) === -1;
}
exports.isUniqueTransaction = isUniqueTransaction;
// Iterates through the validation functions and returs the output response
function validationPipeline(transaction) {
    var responses = validators.map(function (fn) { return fn(transaction); });
    var declined = responses.filter(function (x) { return !x.accepted; });
    return (declined === null || declined === void 0 ? void 0 : declined.length) > 0 ? declined[0] : responses[0];
}
exports.validationPipeline = validationPipeline;
var validators = [isMaxLoadedFortheDay, isMaxLoadedFortheWeek];
