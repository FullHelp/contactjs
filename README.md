# ContactJS 

Easily create contact forms and integrate them with your Full Help's help desk software. Conveniently converting form submissions into conversations that you can easily manage and reply to.

## TL;DR

```javascript
(function () {
    var formjs = new Formjs({
        account: 6, // the ID of your Full Help instance account
        host: 'http://www.myhelpdesk.com/', // your Full Help's domain instance
        source: 'Form @ ' + window.location.host // Conversation source, e.g., "Form @ www.myhelpdesk.com"
    });
})();
```

*Documentation is in-progress!*