export default class Logger {
    constructor (ns) {
        this.ns = ns;
    }

    log (message) {
        this.emit('log', message);
    }

    info (message) {
        this.emit('info', message);
    }

    error (message) {
        // Bell!
        console.log('\u0007');

        this.emit('error', message);
    }

    warn (message) {
        this.emit('warn', message);
    }

    emit (method, message) {
        console[method].call(null, `[${this.prettyMethod(method)}: ${this.ns}] ${message}`);
    }

    prettyMethod (method) {
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
}
