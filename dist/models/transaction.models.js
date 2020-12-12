"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputResponse = exports.TransactionSummary = exports.Transaction = void 0;
var moment_1 = __importDefault(require("moment"));
var Transaction = /** @class */ (function () {
    function Transaction(transaction) {
        this.id = parseInt(transaction === null || transaction === void 0 ? void 0 : transaction.id);
        this.customerId = parseInt(transaction === null || transaction === void 0 ? void 0 : transaction.customer_id);
        this.loadAmount = Number(transaction === null || transaction === void 0 ? void 0 : transaction.load_amount.replace(/[^0-9.-]+/g, ""));
        this.dateTime = moment_1.default.utc(transaction === null || transaction === void 0 ? void 0 : transaction.time);
    }
    return Transaction;
}());
exports.Transaction = Transaction;
var TransactionSummary = /** @class */ (function () {
    function TransactionSummary() {
        this.dailyCount = 0;
        this.dailyTotal = 0;
    }
    return TransactionSummary;
}());
exports.TransactionSummary = TransactionSummary;
var OutputResponse = /** @class */ (function () {
    function OutputResponse(id, customerId, accepted) {
        this.id = id;
        this.customerId = customerId;
        this.accepted = accepted;
    }
    return OutputResponse;
}());
exports.OutputResponse = OutputResponse;
