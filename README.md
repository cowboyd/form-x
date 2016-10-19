# Form Ex Machina

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

This can be be counterintuitive at first, because you have to map
all of the events that actually transition the form model from one
state to the other, but ultimately allows you to ultimate flexibility
and a single repository for the form state.

Take for example the basic unit of validation, the rule. The rule
state machine looks like this:



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


# Development

```
$ npm install
$ npm test
```
