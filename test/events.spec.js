const Events = require("../src/events");
const expect = require("expect");
const sinon = require("sinon");

describe ('events.js', () => {
    it ('registers event listeners', () => {
        const events = new Events;

        const callback = sinon.stub()

        events.listen('something', callback)

        expect(events.listeners).toEqual({
            something: [
                callback
            ]
        })
    })

    it ('dispatches an event', () => {
        const events = new Events;

        const callbackOne = sinon.stub()
        const callbackTwo = sinon.stub()

        events.listen('something', callbackOne)
        events.listen('something', callbackTwo)

        const payloadOne = {}
        const payloadTwo = {}

        events.dispatch('something', payloadOne)
        events.dispatch('something', payloadTwo)

        expect(events.listeners.something[0].called).toBeTruthy()
        expect(events.listeners.something[1].called).toBeTruthy()
    })

    it ('unsubscribes an event listener', () => {
        const events = new Events;

        const callbackOne = sinon.stub()
        const callbackTwo = sinon.stub()

        events.listen('something', callbackOne)
        events.listen('something', callbackTwo)

        events.forget('something', callbackOne)

        expect(events.listeners).toEqual({
            something: [
                callbackTwo
            ]
        })
    })

    it ('unsubscribes all event listeners of an event', () => {
        const events = new Events;

        const callbackOne = sinon.stub()
        const callbackTwo = sinon.stub()

        events.listen('something', callbackOne)
        events.listen('something', callbackTwo)
        events.listen('another-event', callbackOne)

        events.forgetAllEventListeners('something')

        expect(events.listeners).toEqual({
            'another-event': [callbackOne]
        })
    })

    it ('unsubscribes all events', () => {
        const events = new Events;

        const callbackOne = sinon.stub()
        const callbackTwo = sinon.stub()

        events.listen('something', callbackOne)
        events.listen('something', callbackTwo)
        events.listen('another-event', callbackOne)

        events.forgetAllEvents()

        expect(events.listeners).toEqual([])
    })
})