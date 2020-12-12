"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var file_service_1 = require("./services/file.service");
var store_1 = require("./store/store");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var transaction_validators_1 = require("./validators/transaction.validators");
var Main = /** @class */ (function () {
    function Main() {
        this.fileService = new file_service_1.FileService();
    }
    // init method subscribes to each transactions emited by the input file reader which is then validated and written back on an output file.
    Main.prototype.init = function () {
        var _this = this;
        this.fileService.readEachTransaction().pipe(operators_1.concatMap(function (x) {
            if (transaction_validators_1.isUniqueTransaction(x)) { // checks if the transactio id is unique for each customer
                var output = transaction_validators_1.validationPipeline(x); // checks for the daily and weekly limit validations
                if (output.accepted) {
                    store_1.Store.loadAmount(x); // if passes the validation, increment the daily loaded amout and daily transaction count
                }
                store_1.Store.recordTransactionId(x); // record the transaction id for duplication check with future transactions
                return _this.fileService.writeTransactionOutput(output); // Trigger to write the output response into a file
            }
            return rxjs_1.of();
        }))
            .subscribe(rxjs_1.noop, rxjs_1.noop, function () {
            store_1.Store.clearCache();
        });
    };
    return Main;
}());
exports.Main = Main;
var main = new Main();
main.init();
