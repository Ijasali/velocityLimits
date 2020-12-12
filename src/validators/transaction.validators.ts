import moment from "moment";
import { OutputResponse, Transaction } from "../models/transaction.models";
import { Store } from "../store/store";
import { MAX_DAILY_COUNT, MAX_DAILY_LIMIT, MAX_WEEKLY_LIMIT } from "../utils/global.settings";


// validates if the tranaction for a day is not over the limit by amount or by count
export function isMaxLoadedFortheDay(transaction: Transaction): OutputResponse {
    const customerId = transaction.customerId;
    const dailyInfo = Store.getCustomerHistoryForDay(customerId,transaction.dateTime);  
    const currentDayTotal = dailyInfo.dailyTotal;
    const currentDayCount = dailyInfo.dailyCount
    if(currentDayTotal >= MAX_DAILY_LIMIT || (currentDayTotal+transaction.loadAmount) >MAX_DAILY_LIMIT || currentDayCount === MAX_DAILY_COUNT ) {
        return new OutputResponse(transaction.id, transaction.customerId,false);
    }
    return new OutputResponse(transaction.id, transaction.customerId,true);;
}


// Validats if the transaction is not over the limit set for a week
export function isMaxLoadedFortheWeek(transaction: Transaction) {
    const customerId = transaction.customerId;
    const weeklyLoadedAmount = Store.getCustomerTransactionAmountForTheWeek(customerId, transaction.dateTime);    
    if(weeklyLoadedAmount >= MAX_WEEKLY_LIMIT || (weeklyLoadedAmount+transaction.loadAmount) >MAX_WEEKLY_LIMIT ) {
        return new OutputResponse(transaction.id, transaction.customerId,false);
    }
    return new OutputResponse(transaction.id, transaction.customerId,true);
}


// checks if the tranasctionId is unique for a customer
export function isUniqueTransaction(transaction: Transaction) {
    const customerId = transaction.customerId;
    const transactions = Store.getCustomerTransactionIds(customerId);
    return transactions.indexOf(transaction.id) === -1; 
}


// Iterates through the validation functions and returs the output response
export function validationPipeline(transaction: Transaction) : OutputResponse {

    const responses = validators.map(fn => fn(transaction));
    const declined = responses.filter(x => !x.accepted);
    return declined?.length > 0 ? declined[0] : responses[0] ;
}

const validators = [isMaxLoadedFortheDay, isMaxLoadedFortheWeek];

