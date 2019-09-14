const Events = require('./events');
const axios = require('axios');
const uuid = require('uuid');

const Formjs = class {

    /**
     * Create a new instance.
     * 
     * @param {Object} options The user options.
     */
    constructor(options = {}) {
        this.options = Object.assign({
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
        }, options);

        this.events = new Events;

        this.autoDiscoverForm();
        this.autoDiscoverFields();
        this.postOnFormSubmission();
    }

    /**
     * Automatically discover form.
     */
    autoDiscoverForm () {
        if (this.options.form) {
            return;
        }

        this.options.form = document.getElementById('fh-contactjs');
    }
    
    /**
     * Automatically discover any mandatory fields, like name, email, etc.
     */
    autoDiscoverFields () {
        if (! this.options.form) {
            return;
        }
    
        for (let key in this.options.fields) {
            if (key === 'firstName') {
                this.options.fields[key] = this.options.form.querySelector('#first-name')
            } else if (key === 'lastName') {
                this.options.fields[key] = this.options.form.querySelector('#last-name')
            } else if (! this.options.fields[key]) {
                this.options.fields[key] = this.options.form.querySelector(`#${key}`)
            }
        }
    }

    /**
     * Send form when the submit event is triggered.
     */
    postOnFormSubmission () {
        if (this.options.form) {
            this.options.form.addEventListener('submit', (e) => {
                this.sendForm()
                e.preventDefault();
            })
        }
    }

    /**
     * Sends the form.
     */
    sendForm () {
        let email = (this.options.fields.email || { value: null }).value;

        let payload = {
            subject: (this.options.fields.subject || { value: null }).value,
            channel: 'email',
            status: 'posted',
            first_name: (this.options.fields.firstName || { value: null }).value,
            last_name: (this.options.fields.lastName || { value: null }).value,
            to: email,
            interactions: [{
                type: 'customer',
                body: (this.options.fields.message || { value: null }).value,
                source: ((this.options.source && this.options.source.length) > 60 ? this.options.source.substring(0, 60) + '...' : this.options.source),
            }]
        };

        this.events.dispatch('sending', payload);

        axios.post(this.options.endpoints.conversations.replace(
            ':account', 
            this.options.account
        ), payload, {
            baseURL: this.options.host,
            headers: {
                Authorization: `Fingerprint ${email}:${uuid.v4()}`
            }
        }).then((response) => {
            this.events.dispatch('sent', {
                response,
            });
        }).catch((error) => {
            this.events.dispatch('error', error);

            if (error.response) {
                switch (error.response.status) {
                    case 422:
                        handleValidationErrors(
                            this.options.form, 
                            error.response.data
                        )
                    default:
                        handleError(error)
                        break;
                }
            }

        }).finally(() => {
            this.events.dispatch('finish');
        })
    }

    /**
     * Clear form input values.
     */
    clearForm () {
        this.options.form.reset();
    }
}

/**
 * Show validation errors to the user.
 * 
 * @param {HTMLFormElement} form The form we are working with.
 * @param {Object} data The validation error data.
 */
function handleValidationErrors(form, data) {
    for (let key in data.errors) {
        let fieldErrorElement = null

        try {
            switch (key) {
                case 'interactions.0.body':
                    fieldErrorElement = form.querySelector('#message-field-error');
                    break;
            
                case 'first_name':
                    fieldErrorElement = form.querySelector('#first-name-field-error');
                    break;
                    
                case 'last_name':
                    fieldErrorElement = form.querySelector('#last-name-field-error');
                    break;

                default:
                    fieldErrorElement = form.querySelector(`#${key}-field-error`);
                    break;
            }
        } catch (e) {
            console.error(`Validation error on field: ${key}. Message: ${data.errors[key]}`);
        }

        if (fieldErrorElement) {
            fieldErrorElement.textContent = data.errors[key][0];
        }
    }
}

/**
 * Handle different type of errors.
 * 
 * @param {Object} error The error object.
 */
function handleError (error) {
    if (error.response.error && error.response.error.code && error.response.error.message) {
        console.error(error.response.error.message, error.response.error.code)
    } else {
        throw error;
    }
}

module.exports = Formjs;