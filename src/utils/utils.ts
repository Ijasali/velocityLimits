import moment from 'moment'; 
import { OutputResponse } from '../models/transaction.models';

// excludes the time from a date
export function excludeTime(d: moment.Moment) {
    return d.startOf('day');
}

//stringifies the output response
export function formatOutput(out: OutputResponse) {
    return JSON.stringify({
        id: out.id+'',
        customer_id: out.customerId+'',
        accepted: out.accepted
    })+'\n';

}