
import { FileService } from "./services/file.service";
import { Store } from "./store/store";
import { noop, of } from "rxjs";
import { concatMap } from 'rxjs/operators';
import { isUniqueTransaction, validationPipeline } from "./validators/transaction.validators";
import { Transaction } from "./models/transaction.models";
export class Main {
    fileService : FileService;

    constructor() {
        this.fileService = new FileService();
    }

    // init method subscribes to each transactions emited by the input file reader which is then validated and written back on an output file.
    init() {
        this.fileService.readEachTransaction().pipe(concatMap((x: Transaction) => {
            if(isUniqueTransaction(x)) {                                    // checks if the transactio id is unique for each customer
                const output =  validationPipeline(x);                      // checks for the daily and weekly limit validations
                if(output.accepted) {
                    Store.loadAmount(x);                                    // if passes the validation, increment the daily loaded amout and daily transaction count
                }
                Store.recordTransactionId(x);                               // record the transaction id for duplication check with future transactions
                return this.fileService.writeTransactionOutput(output);     // Trigger to write the output response into a file
            }
            return of();
        }))
        .subscribe(noop,noop,()=>{
            Store.clearCache();
        });
    }

}


const main = new Main();
main.init();

