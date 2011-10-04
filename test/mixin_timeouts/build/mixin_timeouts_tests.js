var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  module("Mixin.Timeouts");
  test("TEST DEPENDENCY MISSING", function() {
    return Mixin.Timeouts.Timeouts;
  });
  test("Use case: setup errors", function() {
    var TimeoutErrors, instance;
    TimeoutErrors = (function() {
      function TimeoutErrors() {
        Mixin["in"](this, 'Timeouts');
      }
      return TimeoutErrors;
    })();
    instance = new TimeoutErrors();
    raises((function() {
      return instance.addTimeout();
    }), Error, "Mixin.Timeouts: missing timeout_name on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout(0);
    }), Error, "Mixin.Timeouts: timeout_name invalid on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout({});
    }), Error, "Mixin.Timeouts: timeout_name invalid on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout([]);
    }), Error, "Mixin.Timeouts: timeout_name invalid on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout(instance);
    }), Error, "Mixin.Timeouts: timeout_name invalid on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout(TimeoutErrors);
    }), Error, "Mixin.Timeouts: timeout_name invalid on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName');
    }), Error, "Mixin.Timeouts: missing callback on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', 0);
    }), Error, "Mixin.Timeouts: callback invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', {});
    }), Error, "Mixin.Timeouts: callback invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', []);
    }), Error, "Mixin.Timeouts: callback invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', instance);
    }), Error, "Mixin.Timeouts: callback invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', TimeoutErrors);
    }), Error, "Mixin.Timeouts: callback invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}));
    }), Error, "Mixin.Timeouts: missing wait for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}), -2);
    }), Error, "Mixin.Timeouts: wait invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}), 0.101);
    }), Error, "Mixin.Timeouts: wait invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}), {});
    }), Error, "Mixin.Timeouts: wait invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}), []);
    }), Error, "Mixin.Timeouts: wait invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}), instance);
    }), Error, "Mixin.Timeouts: wait invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    raises((function() {
      return instance.addTimeout('TimeoutName', (function() {}), TimeoutErrors);
    }), Error, "Mixin.Timeouts: wait invalid for timeout 'TimeoutName' on 'TimeoutErrors'");
    instance.addTimeout('AddTwiceOops', (function() {}), 10);
    return raises((function() {
      return instance.addTimeout('AddTwiceOops', (function() {}), 10);
    }), Error, "Mixin.Timeouts: timeout 'AddTwiceOops' already exists on 'TimeoutErrors'");
  });
  test("Use case: one time timeout", function() {
    var ClassWithMemberTimeout, call_count, instance1, instance2, instance3;
    stop();
    call_count = 0;
    ClassWithMemberTimeout = (function() {
      function ClassWithMemberTimeout() {
        Mixin["in"](this, 'Timeouts');
        this.addTimeout('SomeTimeout', (__bind(function() {
          return this.callOnceAndDestroy();
        }, this)), 50);
      }
      ClassWithMemberTimeout.prototype.destroy = function() {
        return Mixin.out(this, 'Timeouts');
      };
      ClassWithMemberTimeout.prototype.callOnceAndDestroy = function() {
        call_count++;
        return this.destroy();
      };
      return ClassWithMemberTimeout;
    })();
    instance1 = new ClassWithMemberTimeout();
    equal(instance1.timeoutCount(), 1, '1 timeout');
    deepEqual(instance1.timeouts(), ['SomeTimeout'], 'SomeTimeout timeout');
    instance2 = new ClassWithMemberTimeout();
    equal(instance2.timeoutCount(), 1, '1 timeout');
    deepEqual(instance2.timeouts(), ['SomeTimeout'], 'SomeTimeout timeout');
    instance3 = new ClassWithMemberTimeout();
    equal(instance3.timeoutCount(), 1, '1 timeout');
    deepEqual(instance3.timeouts(), ['SomeTimeout'], 'SomeTimeout timeout');
    instance3.destroy();
    return setTimeout((function() {
      equal(call_count, 2, 'timeout was called twice');
      return start();
    }), 100);
  });
  test("Use case: thrice-called timeout", function() {
    var ClassWithMemberThriceTimeout, instance;
    stop();
    ClassWithMemberThriceTimeout = (function() {
      function ClassWithMemberThriceTimeout() {
        Mixin["in"](this, 'Timeouts');
        this.call_count = 0;
        this.addTimeout('SomeTimeout', (__bind(function() {
          return this.callThriceAndDestroy();
        }, this)), 20);
      }
      ClassWithMemberThriceTimeout.prototype.destroy = function() {
        return Mixin.out(this, 'Timeouts');
      };
      ClassWithMemberThriceTimeout.prototype.callThriceAndDestroy = function() {
        this.call_count++;
        if (this.call_count < 3) {
          return this.addTimeout('SomeTimeout', (__bind(function() {
            return this.callThriceAndDestroy();
          }, this)), 20);
        } else {
          return this.destroy();
        }
      };
      return ClassWithMemberThriceTimeout;
    })();
    instance = new ClassWithMemberThriceTimeout();
    equal(instance.timeoutCount(), 1, '1 timeout');
    deepEqual(instance.timeouts(), ['SomeTimeout'], 'SomeTimeout timeout');
    return setTimeout((function() {
      Mixin.out(instance, 'Timeouts');
      equal(instance.call_count, 3, 'timeout was called three times');
      return start();
    }), 100);
  });
  test("Use case: killing timeouts", function() {
    var TimeoutKiller, call_and_call_again, call_count, call_interval, instance;
    stop();
    TimeoutKiller = (function() {
      function TimeoutKiller() {}
      return TimeoutKiller;
    })();
    instance = new TimeoutKiller();
    call_interval = 40;
    call_count = 0;
    call_and_call_again = __bind(function() {
      call_count++;
      return instance.addTimeout('CallAgain', call_and_call_again, call_interval);
    }, this);
    Mixin["in"](instance, 'Timeouts');
    equal(instance.timeoutCount(), 0, 'no timeouts');
    deepEqual(instance.timeouts(), [], 'no timeouts by name');
    instance.addTimeout('TryToCallAgain1', call_and_call_again, call_interval);
    instance.addTimeout('TryToCallAgain2', call_and_call_again, call_interval);
    equal(instance.timeoutCount(), 2, '2 timeouts');
    equal(instance.hasTimeout('TryToCallAgain1'), true, 'has TryToCallAgain1 timeout');
    equal(instance.hasTimeout('TryToCallAgain2'), true, 'has TryToCallAgain1 timeout');
    instance.killAllTimeouts();
    equal(instance.timeoutCount(), 0, 'no timeouts');
    deepEqual(instance.timeouts(), [], 'no timeouts by name');
    equal(instance.hasTimeout('TryToCallAgain1'), false, 'does not have TryToCallAgain1 timeout');
    equal(instance.hasTimeout('TryToCallAgain2'), false, 'does not have TryToCallAgain2 timeout');
    instance.addTimeout('CallAgain', call_and_call_again, call_interval);
    instance.addTimeout('TryToCallAgain', call_and_call_again, call_interval);
    equal(instance.timeoutCount(), 2, '2 timeouts');
    equal(instance.hasTimeout('CallAgain'), true, 'has CallAgain timeout');
    equal(instance.hasTimeout('TryToCallAgain'), true, 'has TryToCallAgain timeout');
    instance.killTimeout('TryToCallAgain');
    equal(instance.timeoutCount(), 1, '1 timeouts');
    equal(instance.hasTimeout('CallAgain'), true, 'has CallAgain timeout');
    equal(instance.hasTimeout('TryToCallAgain'), false, 'has TryToCallAgain timeout');
    raises((__bind(function() {
      return instance.killTimeout('Nope');
    }, this)), Error, "Mixin.Timeouts: timeout 'Nope' does not exist. For a less-strict check, use killTimeoutIfExists");
    ok(instance.killTimeoutIfExists('Nope') === instance, 'no assertion to kill a non-existent timeout with killTimeoutIfExists');
    return setTimeout((function() {
      Mixin.out(instance, 'Timeouts');
      equal(call_count, 2, 'timeout was called 2 times');
      return start();
    }), 100);
  });
  return test("Use case: chaining", function() {
    var TimeoutChainer, call_count, call_me, instance;
    stop();
    TimeoutChainer = (function() {
      function TimeoutChainer() {
        Mixin["in"](this, 'Timeouts');
      }
      return TimeoutChainer;
    })();
    instance = new TimeoutChainer();
    call_count = 0;
    call_me = __bind(function() {
      return call_count++;
    }, this);
    instance.addTimeout('Chain1', call_me, 40).killTimeout('Chain1');
    equal(instance.timeoutCount(), 0, '0 timeouts');
    equal(instance.hasTimeout('Chain1'), false, 'does not have Chain1 timeout');
    instance.addTimeout('Chain1', call_me, 40).addTimeout('Chain2', call_me, 40).addTimeout('ChainCalled1', call_me, 40);
    equal(instance.timeoutCount(), 3, '3 timeouts');
    equal(instance.hasTimeout('Chain1'), true, 'does have Chain1 timeout');
    equal(instance.hasTimeout('Chain2'), true, 'does have Chain2 timeout');
    instance.killTimeout('Chain1').killTimeout('Chain2');
    equal(instance.timeoutCount(), 1, '1 timeouts');
    equal(instance.hasTimeout('Chain1'), false, 'does not have Chain1 timeout');
    equal(instance.hasTimeout('Chain2'), false, 'does not have Chain2 timeout');
    equal(instance.hasTimeout('ChainCalled1'), true, 'does have ChainCalled1 timeout');
    instance.addTimeout('ChainCalled2', call_me, 40).addTimeout('ChainCalled3', call_me, 60);
    return setTimeout((function() {
      Mixin.out(instance, 'Timeouts');
      equal(call_count, 3, 'timeout was called 3 times');
      return start();
    }), 100);
  });
});