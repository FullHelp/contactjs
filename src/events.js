module.exports = class Events {
    constructor () {
        this.listeners = {}
    }

    listen (event, callback) {
        if (! this.listeners[event]) {
            this.listeners[event] = [callback]
        } else {
            this.listeners[event].push(callback)
        }
    }

    dispatch (event, payload) {
        if (this.listeners[event] && this.listeners[event].length) {
            for (let i = 0; i < this.listeners[event].length; i++) {
                if (typeof this.listeners[event][i] === 'function') {
                    this.listeners[event][i](payload);
                };
            }
        }
    }

    forget (event, callback) {
        if (this.listeners[event] && this.listeners[event].length) {
            for (let i = 0; i < this.listeners[event].length; i++) {
                if (this.listeners[event][i] === callback) {
                    this.listeners[event].splice(i, 1);
                }
            }
        }
    }

    forgetAllEventListeners (event) {
        if (this.listeners[event]) {
            delete this.listeners[event];
        }
    }

    forgetAllEvents () {
        this.listeners = [];
    }
}