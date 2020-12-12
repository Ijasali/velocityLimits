import moment from "moment";
import { OutputResponse, Transaction } from "../models/transaction.models";
import { Store } from "../store/store";
import { isMaxLoadedFortheDay, isMaxLoadedFortheWeek, isUniqueTransaction, validationPipeline } from "./transaction.validators";

describe('Transaction Validators', ()=> {
    describe('Same Day Transaction validations', ()=> {
    
        beforeEach(()=>{
            Store.clearCache();
        });

        it('should return accepted as false the one transaction is over daily limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:5001, dateTime: moment('2020-12-11T00:00:00Z')};
            const expectedOutput: OutputResponse = {id: transaction1.id, customerId:transaction1.customerId, accepted: false};
            const output =  isMaxLoadedFortheDay(transaction1);
            expect(output.id).toBe(expectedOutput.id);
            expect(output.customerId).toBe(expectedOutput.customerId);
            expect(output.accepted).toBe(expectedOutput.accepted);
        })
        it('should return accepted as false if multiple transactions on same day is over daily limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerHistoryForDay').and.returnValue({dailyCount:2, dailyTotal:4000});
            
            const output1 = isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeFalsy();
        
        })
        it('should return accepted as false if multipple transactions on same day is over daily count', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerHistoryForDay').and.returnValue({dailyCount:3, dailyTotal:100});

            const output1 = isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeFalsy();
        
        })
        it('should return accepted as true if one transaction is same as daily limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:5000, dateTime: moment('2020-12-11T00:00:00Z')};
            const expectedOutput: OutputResponse = {id: transaction1.id, customerId:transaction1.customerId, accepted: true};
            const output =  isMaxLoadedFortheDay(transaction1);
            expect(output.id).toBe(expectedOutput.id);
            expect(output.customerId).toBe(expectedOutput.customerId);
            expect(output.accepted).toBe(expectedOutput.accepted);
        })


        it('should return accepted as true if multiple transactions on same day is below daily limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerHistoryForDay').and.returnValue({dailyCount:2, dailyTotal:3000});
            
            const output1 = isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeTruthy();
        
        })


        it('should return accepted as true if multipple transactions on same day is below daily count', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerHistoryForDay').and.returnValue({dailyCount:2, dailyTotal:100});

            const output1 = isMaxLoadedFortheDay(transaction1);
            expect(output1.accepted).toBeTruthy();
        
        })

    })

    describe('Weekly Transaction Validations', ()=>{
        beforeEach(()=>{
            Store.clearCache();
        });

        it('should return accepted as false if multipple transactions on same week is above weekly limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerTransactionAmountForTheWeek').and.returnValue(20000);

            const output1 = isMaxLoadedFortheWeek(transaction1);
            expect(output1.accepted).toBeFalsy();
        
        })

        it('should return accepted as true if multipple transactions on same week is equal to weekly limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerTransactionAmountForTheWeek').and.returnValue(18000);
            const output1 = isMaxLoadedFortheWeek(transaction1);
            expect(output1.accepted).toBeTruthy();
        
        })
        
        it('should return accepted as true if multipple transactions on same week is below weekly limit', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:1000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerTransactionAmountForTheWeek').and.returnValue(18000);
            const output1 = isMaxLoadedFortheWeek(transaction1);
            expect(output1.accepted).toBeTruthy();
        
        })

    })

    describe('Transaction duplicate validation', ()=>{
        beforeEach(()=>{
            Store.clearCache();
        });

        it('should return true if a transactions id is unique for a customer', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerTransactionIds').and.returnValue([2]);

            const output1 = isUniqueTransaction(transaction1);
            expect(output1).toBeTruthy();
        
        })
        it('should return false if a transactions id is not unique for a customer', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:2000, dateTime: moment('2020-12-11T01:00:00Z')};
            spyOn(Store, 'getCustomerTransactionIds').and.returnValue([1]);

            const output1 = isUniqueTransaction(transaction1);
            expect(output1).toBeFalsy();
        
        })
    })

    describe('Transaction validation pipeline', ()=>{
        beforeEach(()=>{
            Store.clearCache();
        });
    
        it('should return accepted as false if any transactions didnt pass the validation', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:5001, dateTime: moment('2020-12-11T01:00:00Z')};
            const output1 = validationPipeline(transaction1)
            expect(output1.accepted).toBeFalsy();
        
        })
        it('should return accepted as true if the transactions passes all the validations', () => {
            let transaction1: Transaction  = {id: 1, customerId:600, loadAmount:200, dateTime: moment('2020-12-11T01:00:00Z')};
            const output1 = validationPipeline(transaction1)
            expect(output1.accepted).toBeTruthy();
        
        })
    });
})