# ContactJS 

Easily create contact forms and integrate them with your Full Help's help desk software. Conveniently converting form submissions into conversations that you can easily manage and reply to.

[See example contact form](https://htmlpreview.github.io/?https://github.com/FullHelp/contactjs/blob/master/examples/contact.html)

## Features

- Quick integration with [Full Help](https://www.fullhelp.com/) using the [Restful API](https://developers.fullhelp.com/)
- Handles field validations
- Events — perfect for showing custom success/error messages
- Flexibility — create and style your form however you want

## TL;DR

```html
<form id="fh-contactjs">
    <div class="alert alert-success alert-dismissible" id="sent-alert" role="alert" style="display: none;">
        <span class="message">We have received your message!</span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>

    <div class="form-group">
        <label>First name</label>
        <input type="text" name="first-name" id="first-name" class="form-control">
        <small id="first-name-field-error" class="form-text text-danger"></small>
    </div>
    
    <div class="form-group">
        <label>Last name</label>
        <input type="text" name="last-name" id="last-name" class="form-control">
        <small id="last-name-field-error" class="form-text text-danger"></small>
    </div>

    <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" id="email" class="form-control" required>
        <small id="email-field-error" class="form-text text-danger"></small>
    </div>
    
    <div class="form-group">
        <label>Subject</label>
        <input type="text" name="subject" id="subject" class="form-control">
        <small id="subject-field-error" class="form-text text-danger"></small>
    </div>
    
    <div class="form-group">
        <label>Message</label>
        <textarea name="message" id="message" cols="30" rows="10" class="form-control"></textarea>
        <small id="message-field-error" class="form-text text-danger"></small>
    </div>
    
    <button type="submit" class="btn btn-primary">Send</button>
</form>

<script>
    (function () {
        var ContactJs = new FullHelp.ContactJs({
            account: 6, // the ID of your Full Help instance account
            host: 'http://www.myhelpdesk.com/', // your Full Help's domain instance
            source: 'Form @ ' + window.location.host // Conversation source, e.g., "Form @ www.myhelpdesk.com"
        });
    })();
</script>
```

*Documentation is in-progress!*