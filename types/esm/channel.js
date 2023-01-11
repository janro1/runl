import { isLambdaError, isLambdaResponse, isWithRequestNumber } from './types.js';
import { deserializeError } from './utils/error.js';
export class Channel {
    cp;
    requestNumber;
    timeout;
    resolve;
    reject;
    constructor(cp, requestNumber) {
        this.cp = cp;
        this.requestNumber = requestNumber;
    }
    send = (data) => {
        this.cp.send(JSON.stringify(data));
    };
    waitForMessage = (resolve, reject, timeout) => {
        this.resolve = resolve;
        this.reject = reject;
        this.timeout = setTimeout(() => reject({ error: 'lambda timeout' }), timeout);
        this.cp.on('message', this.receive);
    };
    close = () => {
        this.cp.off('message', this.receive);
    };
    receive = (data) => {
        if (!isWithRequestNumber(data)) {
            return;
        }
        if (data.requestNumber !== this.requestNumber) {
            return;
        }
        if (isLambdaError(data)) {
            if (this.timeout)
                clearTimeout(this.timeout);
            if (this.reject)
                this.reject(deserializeError(data.error));
        }
        if (isLambdaResponse(data)) {
            if (this.timeout)
                clearTimeout(this.timeout);
            if (this.resolve)
                this.resolve(data.result);
        }
    };
}
