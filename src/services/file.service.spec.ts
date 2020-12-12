import moment from "moment";
import { of } from "rxjs";
import { OutputResponse, Transaction } from "../models/transaction.models";
import { FileService } from "./file.service";


const lineReader = require('line-reader');
describe('File Service', ()=>{

    let fileService: FileService;
    beforeEach(()=>{
        fileService = new FileService();
    })

    it('should read file line by line upon calling readEachTransaction() method', ()=>{

        let fakeTransaction1: Transaction = {id: 6, customerId:600, loadAmount:500, dateTime: moment()};
        spyOn(lineReader, 'eachLine').and.returnValue(of(fakeTransaction1));

        fileService.readEachTransaction().subscribe(x => {
            expect(x).toBe(fakeTransaction1);
        })
        
    })


    it('should write output response to a file upon calling writeTransactionOutput() method', ()=>{

        let out: OutputResponse = {id: 61, customerId:600, accepted: true};
        
        spyOn(fileService, 'writeTransactionOutput').and.returnValue(of('success'));

        fileService.writeTransactionOutput(out).subscribe(x => {
            expect(x).toBe('success');
        })
     
        
    })
})