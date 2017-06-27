Number.prototype.toFixedDown = function (digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

parseExpression = (sensorValue) => {
    const valuePattern = /^(\w+)\((.*|)\)$/;
    const valueMatch = valuePattern.exec(sensorValue);
    return valueMatch;
}

log = (fun, msg) => {
    if (global._debug || fun === 'error') {
        console[fun](msg);
    }
}

convertAllAttToString = payload => {
    for (let p in payload) {
        if (payload.hasOwnProperty(p)) {
            if (typeof payload[p] === 'object') {                
                convertAllAttToString(payload[p]);
            } else {                
                payload[p] = String(payload[p]);
            }
        }
    }
    return payload;
}

isNumber = value => {
    return /^(\d*)$/.test(value);
}

module.exports = {
    parseExpression,
    log,
    convertAllAttToString,
    isNumber
}