import moment from 'moment'; 
import { TransactionRecord, Transaction, TransactionSummary } from '../models/transaction.models';
import { excludeTime } from '../utils/utils';

export class Store {


    private static transactionRecord: TransactionRecord= {
         transactionIds:{}
    };

    // returs the transaction records
    public static getTransactionRecords() {
        return this.transactionRecord;
    }

    // empties the transaction records
    public static clearCache() {
        this.transactionRecord = { transactionIds:{}};
    }

    // returs the totalAmount and totalCount of transaction made on a particular day
    public static getCustomerHistoryForDay(customerId: number, date: moment.Moment) {
        const day = JSON.stringify(excludeTime(date));
        if(this.transactionRecord[customerId] && this.transactionRecord[customerId][day]) {
            return this.transactionRecord[customerId][day];
        }
        return {dailyTotal:0 , dailyCount:0 };
    }


    // returns the total amount of transaction conducted in a week
    public static getCustomerTransactionAmountForTheWeek(customerId: number, dateTime: moment.Moment): number {
        const startDate = moment(dateTime, "MM-DD-YYYY").startOf('isoWeek');
        const endDate = moment(dateTime, "MM-DD-YYYY").endOf('isoWeek');
        let sum = 0;
        if(this.transactionRecord[customerId] ) {
            
            for (let day in this.transactionRecord[customerId]) {
                const mdate = moment.utc(day,'YYYY-MM-DD');
                if( mdate  >= startDate && mdate <=endDate) {
                    sum+= this.transactionRecord[customerId][day].dailyTotal;
                }
            }
        }
        return sum
    }

    // Add the new transaction amount to the dailyTotal and increment transaction count for that day by one
    public static loadAmount(x: Transaction){
        const day = JSON.stringify(excludeTime(x.dateTime));
        const customerId = x.customerId;

        if(!this.transactionRecord[customerId]) {
            this.transactionRecord[customerId] = {};
        }

        if(!this.transactionRecord[customerId][day]) {
            this.transactionRecord[customerId][day] = new TransactionSummary();
        }

        if(this.transactionRecord[customerId][day]) {
            this.transactionRecord[customerId][day].dailyCount +=1;
            this.transactionRecord[customerId][day].dailyTotal +=x.loadAmount;
            
        } 
     }

     public static recordTransactionId(x: Transaction) {
        const customerId = x.customerId;
        if(!this.transactionRecord.transactionIds[customerId]) {
            this.transactionRecord.transactionIds[customerId] =[];
        }
        this.transactionRecord.transactionIds[customerId].push(x.id);
     }
     
     // returs all the transactions done for a given customer
     public static getCustomerTransactionIds(customerId: number): number[] {
  
       return this.transactionRecord.transactionIds[customerId] ? this.transactionRecord.transactionIds[customerId] : [];
     }

}