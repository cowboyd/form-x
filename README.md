# Form Ex Machina

A radically different, radically powerful library for representing
input form state.

[![npm version](https://badge.fury.io/js/i-form.svg)](https://badge.fury.io/js/i-form)
[![Build Status](https://travis-ci.org/cowboyd/i-form.js.svg?branch=master)](https://travis-ci.org/cowboyd/i-form.js)

Working with forms can be painful because there's soooooo much going
on. You're taking completely loosey goosey schema-less data, and then filtering
it, massaging it, and in an overall asynchronous fashion cajoling it
into a strongly typed object that is suitable for persistence to your
server. In other words, garbage in, gold out.

At any given point, there are all kinds of complex questions you want
to ask your form so that you can report what's going on to your
users. Here are some common ones that you may have encountered:

- Are there any outstanding edits?
- Can it be submitted? If not, why not?
- Is this form currently submitting?
- Are all of the fields valid?
- If not, which validations are failing?

And that's just the bar for entry. I got tired of answering the exact
same set of questions over and over and over again inside each of my
applications, and so I set out to build a library that would answer
all of these questions holistically.

_Form X_ models your form as a state machine that represents your
entire form state at every moment with a single object. Because you
have every minute piece of form state available at all times, you can
begin to answer even more advanced questions such as:

- which rules comprise a single validation?
- which rules are dependent on other rules?
- which validations are currently pending?
- which rules within a pending validation are currently running?

And that's just the beginning. Beyond that, there are all kinds of
edge-cases that just aren't solved by cobbling together a validation
library with a bunch of glue code.


### Just JavaScript

_Form X_ is implemented using simple JavaScript pojos, and has
_absolutely no dependency on any framework_.

All it does is _track_ your state based on what you tell it, so for
example, it will tell you which rules need to be run, but it will not
actually do the work of running them for you.

This can be be counterintuitive at first, because it's up to you to map
all of the events that actually transition the form from one
state to the next. The form's sole job is to _provide you with the
implications of the events you've told it about_. This allows you complete
latitude in how you'll represent the resulting state to the user.

FormX is built using `Form`, `Field`, `Validation`, and `Rule`
POJOS. Most of the time you'll be working with only the `Form`
constructor itself, but we'll introduce them in reverse order because
each object is built upon the next.

### Rule

Rule is the most basic unit of validation.


``` javascript
import { Rule } from 'form-x';

let rule = Rule.create({
  code(value) { return value > 5 }
  description: "Greater than 5"
});

// a rule starts out in an idle state.

rule.isIdle //=> true
rule.isTriggered //=> false
rule.isRunning //=> false
rule.isFulfilled //=> false
rule.isRejected //=> false
```

>Note: The `code` and `description` attributes that we associated with this
>rule are abritrary. They are an example of how the caller can "hang"
>whatever data it needs to actually run and execute the rule on the
>rule, but the `Rule` object itself only tracks the state of the rule.

An idle rule is not currently considering any input, but we can
"trigger" it by providing input.

``` javascript
let triggered = rule.setInput(6);

triggered.input //=> 6

triggered.isIdle //=> false
triggered.isTriggered //=> true
triggered.isRunning //=> true
triggered.isFulfilled //=> false
triggered.isRejected //=> false
```

This rule is triggered is considered triggered, but as mentioned it is
_up to the implementer_ to actually run the rule. The `Rule` object is
not responsible for performing the rule, only for containing
information about the current state of its execution.

Again, why have a separate state for triggered and running?
Because again, it is not actually running the rule. There may be some
delay between when it is decided that a rule needs to be run, and when
it is actually scheduled to be run. That is up to the discretion of
the user of the code. A naive implementation might run it immediately.

Calling the `run` method will indicate that we are actually running
the rule, which we can then either resolve or reject.

``` javascript
// indicate that this rule is now running.
let running = triggred.run();

running.isIdle //=> false
running.isTriggered //=> false
running.isRunning //=> true
running.isFulfilled //=> false
running.isRejected //=> false

let settled;
if (rule.code(rule.input)) {
  settled = rule.resove();
} else {
  settled = rule.reject(`#{rule.input} was not greater than 5`);
}

settled.isIdle //=> false
settled.isTriggered //=> true
settled.isRunning //=> false
settled.isFulfilled //=> true
settled.isRejected //=> false

```

In this way, we have an object that knows at every point what state
the rule is in. Here is the full state diagram for a rule.

![Figure of all Rule States and Transitions](https://cdn.rawgit.com/cowboyd/i-form.js/master/docs/rule-fsm.svg "The Rule State Machine")

### Validation

Validations build on the concept of rules. They act as an aggregator
for a set of rules and derive which rules are eligible for being run
at any given time. In order for a validation to pass, all of its rules
must be satisfied. Also, it also allows you to specifiy dependencies
between rules so that a rule will not even be eligible for triggering
until all of its antecedent rules are satisfied. Let's say we had a
rule for validating passwords. We want to check that:

1. it is long enough
2. it contains enough special characters
3. it is not within the last 3 passwords

Of course to check if the password was used as the last three
passwords we're going to have to consult the backend, which is going to
be asynchronous and consume more resources on both client and
sever. Because of this, we don't want to run this rule unless the
first two have already been satisfied. In ther words, rule three is
dependent on both rules one and two.

Let's model this validation using FormX.

``` javascript
let validation = Validation.create({
  rules: {
    longEnough: {
      description: "Must be at least 6 characters"
    },
    containsSpecialCharacters: {
      description: "Must contain at least one special character ($%&*!)"
    },
    notWithinLastThree: {
      description: ""
    }
  },
  dependencies: {
    notWithinLastThree: ['longEnough', 'containsSpecialCharacters']
  }
});

validation.isIdle //=> true
validation.isPending //=> false
validaiton.isFulfilled //=> false
validation.isRejected //=> false
```

Like rules, validations also begin in the in the `idle` state. Also
like rules, they only consider a single value at a time. To begin
validation, we set the input like we do for a rule. This will let us
know which rules have been triggered.

``` javascript
let pending = validation.setInput('123password!!');

validation.isIdle //=> false
validation.isPending //=> true
validaiton.isFulfilled //=> false
validation.isRejected //=> false

pending.rules.longEnough.isTriggred //=> true
pending.rules.containsSpecialCharacters.isTriggered //=> true
pending.rules.notWithinLastThree.isTriggered //> false

//rules are also partitioned by their state
pending.triggered //=> [Rule(longEnough), Rules(containsSpecialCharacters)]
pending.idle //=> [Rule(notWithinLastThree)]
```

As you can see, the rule that needs to talk to the server is still
idle at this point. To indicate that a rule is running, use the run
method:

``` javascript
pending = pending.run(pending.rules.longEnough);

pending.isPending //=> true

pending.rules.longEnough.isRunning //=> true
pending.rules.containsSpecialCharacters.isTriggered //=> true
pending.rules.notWithinLastThree.isTriggered //> false
```

Only when both antecedent rules are satisfied will our server rule be
triggered:

``` javascript
pending = pending.resolve(pending.rules.longEnough);
pending = pending.run(pending.rules.containsSpecialCharacters);

pending.rules.longEnough.isFulfilled //=> true
pending.rules.containsSpecialCharacters.isFulfilled //=> true
pending.rules.notWithinLastThree.isTriggered //> true
```

Finally, assuming that our last rule is satisfied, the validation
itself will be satisfied.

``` javascript

pending = pending.run(pending.rules.notWithinLastThree);
$.get(`/password-check/${pending.input}`)
  .then(() => pending.resolve(pending.rules.notWithinLastThree))
  .catch((reason) => pending.reject(pending.rules.notWithinLastThree, reason))
  .then(result => {
    result.isFulfilled //=> true
  })
```

For reference, Here is the full state diagram for `Validation`

![Figure of Validation States and Transitions](https://cdn.rawgit.com/cowboyd/i-form.js/master/docs/validation-fsm.svg "The Validation State Machine")

### Field

Field builds on Validation by acting as a bridge between it and the
form submission process. It indicates whether a field is "blocking"
the form from being submitted.

#### required fields.

Some fields are optional. Some aren't. For example, when
filling out the signup form for an account, most sites will require
you to enter in your email address. Sometimes they'll ask you
for your phone number too, but it's no big deal if you don't enter it.

We say then that the email address is _required_ and that the phone
number is _optional_. In other words, if the email address field is
empty, then the form cannot be submitted, but if the phone number
field is empty, then it can.

But.... and here's the wrinkle. If you _do_ decide to provide your
phone number, then it needs to be validated according to the normal
rules for phone numbers. `"Hullo World"` and `Math.PI` simply won't
do.

Therefore if a field is not required, it is OK if its validation is idle.

FormX does not treat value presence as just another validation rule,
but instead as a first class citizen, and it is something that can be
queried directly with the `field.isRequired` attribute.

#### deferred validation

Another property of fields is that they model _when_ validation
occurs. This is helpful because sometimes you want a field to be
accepting input, but you don't want to validate it just yet. If you're
implementing an HTML form for example, the convention is to not start
validating a field unitl *after* it first loses focus.

Before you transition a field to a validating state, it will simply
capture the input over and over in a noop. It's only once you begin
validating that rules will become triggered.

``` javascript
import { Field } from 'form-x';

let email = Field.create({
  required: true
  rules: {
    validEmail: {
      description: "Must be a valid email address"
    }
  }
});

email.isBlocking //=> true
email.validation.isIdle //=> true

email = email.setInput('hello');

email.validation.isIdle //=> true

email = email.validate();

email.validation.isIdle //=> false
email.rules.validEmail.isTriggered //=> true
email.isValid //=> false
```

The field wraps the transitions around rules running and resolving.

``` javascript

email = email.run(email.rules.validEmail)
email = email.resolve(email.rules.validEmail)
email.isValid //=> true
```

Here's the full state machine for Field.

![Figure of Field States and Transitions](https://cdn.rawgit.com/cowboyd/i-form.js/master/docs/field-fsm.svg "The Field State Machine")


### Form

The form is what ties it al

# Development

```
$ npm install
$ npm test
```
