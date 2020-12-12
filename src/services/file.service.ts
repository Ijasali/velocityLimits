import * as fs from 'fs';
import { noop, Observable } from 'rxjs';
import { OutputResponse, Transaction } from '../models/transaction.models';
import { INPUT_FILE, OUTPUT_FILE } from '../utils/global.settings';
import { formatOutput } from '../utils/utils';
const lineReader = require('line-reader');

export class FileService {

    constructor(){
      fs.unlink(OUTPUT_FILE,noop); //removes the output file during intial load
    }

    // returns an observable which will emit each transaction read from the input file
    readEachTransaction(): Observable<Transaction> {
      return new Observable(observer => {
            lineReader.eachLine(INPUT_FILE, (line:string,last: boolean) => {
               const t = new Transaction(JSON.parse(line));
                observer.next(t);
                if(last) {
                    observer.complete();
                }
             });
        })
    }

  // returns an observable which will emit 'success' after successfully writing the output response to a file
    writeTransactionOutput(out: OutputResponse): Observable<any> {
        const data = formatOutput(out);
        return new Observable(observer => {
            fs.appendFile(OUTPUT_FILE, data,  (err) => {
                if (err) {
                  observer.error(err);
                } else {
                  observer.next('success');
                  observer.complete();
                }
              })

        });
        
    }

}

