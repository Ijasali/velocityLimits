import moment from "moment";
import { Transaction } from "../models/transaction.models";
import { excludeTime } from "../utils/utils";
import { Store } from "./store";

describe('Store', ()=>{

    beforeEach(()=>{
        Store.clearCache();
    })


    it('should add amount to the Daily Total and increment the transaction count by one when loadAmount is called', ()=>{
        
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc()};
        let transaction2: Transaction = {id: 97, customerId:600, loadAmount:600, dateTime: moment.utc()};
        const day = JSON.stringify(excludeTime(transaction1.dateTime));

        Store.loadAmount(transaction1);
        Store.loadAmount(transaction2);

        const transactions = Store.getTransactionRecords();
        const ct = transactions[transaction1.customerId][day];

        expect(ct.dailyCount).toBe(2);
        expect(ct.dailyTotal).toBe(1100);
    })

    it('should return the total amount and total count of transacations made by a customer on a given day', ()=>{
        
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc()};
        let transaction2: Transaction = {id: 97, customerId:600, loadAmount:600, dateTime: moment.utc()};
        const day = JSON.stringify(excludeTime(transaction1.dateTime));

        Store.loadAmount(transaction1);
        Store.loadAmount(transaction2);
        
        const ct = Store.getCustomerHistoryForDay(transaction1.customerId, transaction1.dateTime);

        expect(ct.dailyCount).toBe(2);
        expect(ct.dailyTotal).toBe(1100);
    })

    it('should return the total amount of transacations made by a customer on a week given the date', ()=>{
        
        let transaction: Transaction = {id: 95, customerId:600, loadAmount:100, dateTime: moment.utc('2020-12-06T00:00:00Z')}; // will be ignored
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-07T00:00:00Z')};
        let transaction2: Transaction = {id: 97, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-08T13:00:00Z')};
        let transaction3: Transaction = {id: 98, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-09T06:00:00Z')};
        let transaction4: Transaction = {id: 99, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-10T09:00:00Z')};
        let transaction5: Transaction = {id: 100, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-11T22:00:00Z')};
        let transaction6: Transaction = {id: 101, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-13T23:59:59Z')};
        let transaction7: Transaction = {id: 102, customerId:600, loadAmount:500, dateTime: moment.utc('2020-12-14T00:00:00Z')}; // will be ignored
        
        Store.loadAmount(transaction);
        Store.loadAmount(transaction1);
        Store.loadAmount(transaction2);
        Store.loadAmount(transaction3);
        Store.loadAmount(transaction4);
        Store.loadAmount(transaction5);
        Store.loadAmount(transaction6);
        Store.loadAmount(transaction7);

        const ct = Store.getCustomerTransactionAmountForTheWeek(transaction1.customerId, transaction1.dateTime);

        expect(ct).toBe(3000);
        
    })


    it('should store transaction id for a customer', ()=>{
        
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc()};
        Store.recordTransactionId(transaction1);
        let transaction2: Transaction = {id: 97, customerId:600, loadAmount:500, dateTime: moment.utc()};
        Store.recordTransactionId(transaction2);
        const ct = Store.getTransactionRecords();
        expect(ct.transactionIds[600]).toEqual([96,97]);
    })

    it('should return all the transactions', ()=>{
        
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc()};
        Store.recordTransactionId(transaction1);
        let transaction2: Transaction = {id: 97, customerId:601, loadAmount:500, dateTime: moment.utc()};
        Store.recordTransactionId(transaction2);
        const ct = Store.getTransactionRecords();
        expect(ct.transactionIds[600]).toEqual([96]);
        expect(ct.transactionIds[601]).toEqual([97]);
    })

    it('should reset the transactions by calling clearCache', ()=>{
        
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc()};
        let transaction2: Transaction = {id: 97, customerId:601, loadAmount:500, dateTime: moment.utc()};
        Store.recordTransactionId(transaction1);
        Store.recordTransactionId(transaction2);
        Store.clearCache();
        const ct = Store.getTransactionRecords();
        expect(ct.transactionIds[600]).toBeFalsy()
        expect(ct.transactionIds[601]).toBeFalsy()
    })
    it('should return customer transactionsids by calling getCustomerTransactionIds', ()=>{
        
        let transaction1: Transaction = {id: 96, customerId:600, loadAmount:500, dateTime: moment.utc()};
        let transaction2: Transaction = {id: 97, customerId:601, loadAmount:500, dateTime: moment.utc()};
        Store.recordTransactionId(transaction1);
        Store.recordTransactionId(transaction2);

        const tr1 = Store.getCustomerTransactionIds(600);
        const tr2 = Store.getCustomerTransactionIds(601);
        expect(tr1).toEqual([96]);
        expect(tr2).toEqual([97]);
    })
})