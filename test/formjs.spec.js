const Formjs = require("../src/formjs");
const expect = require('expect');
const sinon = require('sinon');
const Axios = require("axios");
const uuidv4 = require('uuid/v4');

describe ('formjs.js', () => {

    it ('has default options', () => {
        const formjs = new Formjs();

        expect(formjs.options).toEqual({
            account: null,
            form: null,
            host: null,
            source: null,
            fields: {
                firstName: null,
                lastName: null,
                email: null,
                subject: null,
                message: null
            },
            endpoints: {
                conversations: '/api/v1/accounts/:account/conversations',
                conversationInteractions: '/api/v1/accounts/:account/conversations/:conversation/interactions',
                conversationInteractionAttachments: '/api/v1/accounts/:account/conversations/:conversation/interactions/:interaction/attachments'
            }
        });
    })

    it ('accepts user configuration', () => {
        const formElement = document.createElement('form');
        const firstNameInputElement = document.createElement('input')
        const lastNameInputElement = document.createElement('input')
        const emailInputElement = document.createElement('input')
        const subjectInputElement = document.createElement('input')
        const messageInputElement = document.createElement('textarea')

        formElement.appendChild(firstNameInputElement)
        formElement.appendChild(lastNameInputElement)
        formElement.appendChild(emailInputElement)
        formElement.appendChild(subjectInputElement)
        formElement.appendChild(messageInputElement)

        const options = {
            account: 123,
            form: formElement,
            host: 'https://www.example.org',
            source: 'the-source',
            fields: {
                firstName: firstNameInputElement,
                lastName: lastNameInputElement,
                email: emailInputElement,
                subject: subjectInputElement,
                message: messageInputElement
            },
            endpoints: {
                conversations: '/v2/accounts/:account/conversations',
                conversationInteractions: '/v2/accounts/:account/conversations/:conversation/interactions',
                conversationInteractionAttachments: '/v2/accounts/:account/conversations/:conversation/interactions/:interaction/attachments'
            }
        };

        const formjs = new Formjs(options);

        expect(formjs.options).toEqual(options);
    })

    it ('automatically discovers form by their id', () => {
        const formElement = document.createElement('form');

        formElement.setAttribute('id', 'fh-contactjs')

        document.body.appendChild(formElement)

        const formjs = new Formjs()

        expect(formjs.options.form).toEqual(formElement)
    })

    it ('automatically discovers mandatory fields by their ids', () => {
        const formElement = document.createElement('form');
        const firstNameInputElement = document.createElement('input')
        const lastNameInputElement = document.createElement('input')
        const emailInputElement = document.createElement('input')
        const subjectInputElement = document.createElement('input')
        const messageInputElement = document.createElement('textarea')

        firstNameInputElement.setAttribute('id', 'first-name')
        lastNameInputElement.setAttribute('id', 'last-name')
        emailInputElement.setAttribute('id', 'email')
        subjectInputElement.setAttribute('id', 'subject')
        messageInputElement.setAttribute('id', 'message')

        formElement.appendChild(firstNameInputElement)
        formElement.appendChild(lastNameInputElement)
        formElement.appendChild(emailInputElement)
        formElement.appendChild(subjectInputElement)
        formElement.appendChild(messageInputElement)

        const formjs = new Formjs({
            form: formElement
        });

        expect(formjs.options.fields.firstName).toEqual(firstNameInputElement)
        expect(formjs.options.fields.lastName).toEqual(lastNameInputElement)
        expect(formjs.options.fields.email).toEqual(emailInputElement)
        expect(formjs.options.fields.subject).toEqual(subjectInputElement)
        expect(formjs.options.fields.message).toEqual(messageInputElement)
    })

    it ('sends the data on form submission', () => {

        sinon.stub(Axios, 'post').resolves({
            data: { data: { id: 1 } }
        })

        sinon.stub(uuidv4, 'v4').returns('uuid-string')

        const formElement = document.createElement('form');
        const firstNameInputElement = document.createElement('input')
        const lastNameInputElement = document.createElement('input')
        const emailInputElement = document.createElement('input')
        const subjectInputElement = document.createElement('input')
        const messageInputElement = document.createElement('textarea')

        firstNameInputElement.setAttribute('id', 'first-name')
        lastNameInputElement.setAttribute('id', 'last-name')
        emailInputElement.setAttribute('id', 'email')
        subjectInputElement.setAttribute('id', 'subject')
        messageInputElement.setAttribute('id', 'message')

        firstNameInputElement.value = 'Jane';
        lastNameInputElement.value = 'Doe';
        emailInputElement.value = 'jane@example.org';
        subjectInputElement.value = 'Question about pricing';
        messageInputElement.value = 'Hi there. How does the pricing and refund works?';

        formElement.appendChild(firstNameInputElement)
        formElement.appendChild(lastNameInputElement)
        formElement.appendChild(emailInputElement)
        formElement.appendChild(subjectInputElement)
        formElement.appendChild(messageInputElement)

        const formjs = new Formjs({
            account: 123,
            form: formElement,
            host: 'http://www.example.org/',
            source: 'the-source',
        });

        const event = document.createEvent('HTMLEvents');
              event.initEvent('submit', true, true);
              event.eventName = 'submit';

        formElement.dispatchEvent(event)

        expect(Axios.post.called).toBeTruthy()
        expect(Axios.post.args[0]).toEqual([
            '/api/v1/accounts/123/conversations', {
                channel: 'email',
                status: 'posted',
                to: 'jane@example.org',
                first_name: 'Jane',
                last_name: 'Doe',
                subject: 'Question about pricing',
                interactions: [
                    {
                        type: 'customer',
                        body: 'Hi there. How does the pricing and refund works?',
                        source: 'the-source',
                    }
                ]
            }, {
                baseURL: 'http://www.example.org/',
                headers: {
                    Authorization: 'Fingerprint jane@example.org:uuid-string'
                }
            }
        ])
    })

    it ('shows validation errors', (done) => {

        Axios.post.restore();

        sinon.stub(console, 'error')

        sinon.stub(Axios, 'post').rejects({
            response: {
                status: 422,
                data: {
                    message: "The given data was invalid.",
                    errors: {
                        first_name: [
                            "The first name field error"
                        ],
                        last_name: [
                            "The last name field error"
                        ],
                        subject: [
                            "The subject field error"
                        ],
                        email: [
                            "The email field error"
                        ],
                        "interactions.0.body": [
                            "The message field error"
                        ],
                        "interactions.0.source-field-error": [
                            "This should be logged"
                        ]
                    }
                }
            }
        })

        const formElement = document.createElement('form');

        const firstNameInputError = document.createElement('div')
        const lastNameInputError = document.createElement('div')
        const subjectInputError = document.createElement('div')
        const emailInputError = document.createElement('div')
        const messageInputError = document.createElement('div')

        firstNameInputError.setAttribute('id', 'first-name-field-error')
        lastNameInputError.setAttribute('id', 'last-name-field-error')
        subjectInputError.setAttribute('id', 'subject-field-error')
        emailInputError.setAttribute('id', 'email-field-error')
        messageInputError.setAttribute('id', 'message-field-error')

        formElement.appendChild(firstNameInputError)
        formElement.appendChild(lastNameInputError)
        formElement.appendChild(subjectInputError)
        formElement.appendChild(emailInputError)
        formElement.appendChild(messageInputError)

        const formjs = new Formjs({
            form: formElement
        });

        const event = document.createEvent('HTMLEvents');
              event.initEvent('submit', true, true);
              event.eventName = 'submit';

        formElement.dispatchEvent(event)

        setTimeout(() => {
            try {
                expect(firstNameInputError.textContent).toBe('The first name field error');
                expect(lastNameInputError.textContent).toBe('The last name field error');
                expect(subjectInputError.textContent).toBe('The subject field error');
                expect(emailInputError.textContent).toBe('The email field error');
                expect(messageInputError.textContent).toBe('The message field error');

                expect(console.error.called).toBeTruthy();
                expect(console.error.args[0]).toEqual([
                    'Validation error on field: interactions.0.source-field-error. Message: This should be logged'
                ])

                done()
            } catch (e) {
                done(e)
            }
        })
    })

    it ('clears form', () => {
        const formElement = document.createElement('form');
        const firstNameInputElement = document.createElement('input')
        const lastNameInputElement = document.createElement('input')
        const emailInputElement = document.createElement('input')
        const subjectInputElement = document.createElement('input')
        const messageInputElement = document.createElement('textarea')

        firstNameInputElement.setAttribute('id', 'first-name')
        lastNameInputElement.setAttribute('id', 'last-name')
        emailInputElement.setAttribute('id', 'email')
        subjectInputElement.setAttribute('id', 'subject')
        messageInputElement.setAttribute('id', 'message')

        firstNameInputElement.value = 'Jane';
        lastNameInputElement.value = 'Doe';
        emailInputElement.value = 'jane@example.org';
        subjectInputElement.value = 'Question about pricing';
        messageInputElement.value = 'Hi there. How does the pricing and refund works?';

        formElement.appendChild(firstNameInputElement)
        formElement.appendChild(lastNameInputElement)
        formElement.appendChild(emailInputElement)
        formElement.appendChild(subjectInputElement)
        formElement.appendChild(messageInputElement)

        const formjs = new Formjs({
            form: formElement,
        });

        formjs.clearForm();

        expect(firstNameInputElement.value).toEqual('')
        expect(lastNameInputElement.value).toEqual('')
        expect(emailInputElement.value).toEqual('')
        expect(subjectInputElement.value).toEqual('')
        expect(messageInputElement.value).toEqual('')
    })

})