import moment from "moment";
import { Observable, of } from "rxjs";
import { Main } from "./main";
import { OutputResponse, Transaction } from "./models/transaction.models";
import { Store } from "./store/store";

describe("Main program", function() {
    let main: Main;
   
    beforeEach(()=>{
        main = new Main();
        Store.clearCache();
    })
    it("should start reading from a file upon init", function() {
        let fakeTransaction: Transaction = {id: 1, customerId:100, loadAmount:500, dateTime: moment()};
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(of(fakeTransaction));

        main.init();

        main.fileService.readEachTransaction().subscribe( x =>{
            expect(x).toBe(fakeTransaction);
        })
    });

    it("should write output response to a file if transaction is being read with a unique id for each customer", function() {
        let fakeTransaction: Transaction = {id: 2, customerId:200, loadAmount:500, dateTime: moment()};
        const out = new OutputResponse(fakeTransaction.id,fakeTransaction.customerId,true);
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(of(fakeTransaction));
        spyOn(main.fileService, 'writeTransactionOutput').and.returnValue(of('success'));


        main.init();
        
       
        expect(main.fileService.writeTransactionOutput).toHaveBeenCalledWith(out)

    });



    it("should not write to file if duplicate transaction id for the same customer ", function() {
        let fakeTransaction1: Transaction = {id: 3, customerId:300, loadAmount:500, dateTime: moment()};
        let fakeTransaction2: Transaction = {id: 3, customerId:300, loadAmount:1000, dateTime: moment()};
        const out = new OutputResponse(fakeTransaction1.id,fakeTransaction1.customerId,true);
        const out2 = new OutputResponse(fakeTransaction2.id,fakeTransaction2.customerId,false);
        const writeFileSpy = spyOn(main.fileService, 'writeTransactionOutput').and.returnValue(of('success'));
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(of(fakeTransaction1,fakeTransaction2));

        main.init();

        expect(writeFileSpy).toHaveBeenCalledOnceWith(out);
        expect(writeFileSpy).not.toHaveBeenCalledOnceWith(out2);
      
    });


    it("should write to file if new transaction is read with unique transaction id for the same customer ", function() {
        let fakeTransaction1: Transaction = {id: 4, customerId:400, loadAmount:500, dateTime: moment()};
        let fakeTransaction2: Transaction = {id: 5, customerId:400, loadAmount:1000, dateTime: moment()};
        const writeFileSpy = spyOn(main.fileService, 'writeTransactionOutput').and.returnValue(of('success'));
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(of(fakeTransaction1,fakeTransaction2));

        main.init();

        expect(writeFileSpy).toHaveBeenCalledTimes(2);
      
    });

    it("should record the transaction id after reading each transaction ", function() {
        let fakeTransaction1: Transaction = {id: 6, customerId:600, loadAmount:500, dateTime: moment()};
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(of(fakeTransaction1));
        spyOn(Store, 'recordTransactionId').and.returnValue();
        main.init();

        expect(Store.recordTransactionId).toHaveBeenCalledWith(fakeTransaction1);
      
    });

    it("should call loadAmount if a valid Transaction ", function() {
        let fakeTransaction1: Transaction = {id: 7, customerId:700, loadAmount:500, dateTime: moment()};
        spyOn(main.fileService, 'readEachTransaction').and.returnValue(of(fakeTransaction1));
        spyOn(Store, 'loadAmount').and.returnValue();
        main.init();

        expect(Store.loadAmount).toHaveBeenCalledWith(fakeTransaction1);
      
    });

  });