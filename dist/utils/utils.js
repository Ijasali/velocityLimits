"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutput = exports.excludeTime = void 0;
// excludes the time from a date
function excludeTime(d) {
    return d.startOf('day');
}
exports.excludeTime = excludeTime;
//stringifies the output response
function formatOutput(out) {
    return JSON.stringify({
        id: out.id + '',
        customer_id: out.customerId + '',
        accepted: out.accepted
    }) + '\n';
}
exports.formatOutput = formatOutput;
