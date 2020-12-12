import moment from 'moment'; 


export class Transaction {
    id: number ;
    customerId: number;
    loadAmount: number;
    dateTime: moment.Moment;
    constructor(transaction: any) {
        this.id = parseInt(transaction?.id);
        this.customerId = parseInt(transaction?.customer_id);
        this.loadAmount =  Number(transaction?.load_amount.replace(/[^0-9.-]+/g,""));
        this.dateTime = moment.utc(transaction?.time); 
    }
}

export class TransactionSummary {
    dailyCount: number;
    dailyTotal: number;
    constructor() {
        this.dailyCount = 0;
        this.dailyTotal = 0;
    }
}

export interface TransactionRecord{

    [customerId:number]: {
        [day: string] : TransactionSummary,
    }
    transactionIds: {
        [customerId: number]: number[]
    }
}

export class OutputResponse {
    id: number;
    customerId: number;
    accepted: boolean;
    constructor(id:number, customerId: number, accepted: boolean) {
        this.id = id;
        this.customerId = customerId;
        this.accepted = accepted;
    }

}