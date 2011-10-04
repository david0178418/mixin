var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  module("Mixin.Flags");
  test("TEST DEPENDENCY MISSING", function() {
    return Mixin.Flags;
  });
  test("Use case: no initialization flags and basic usage", function() {
    var ClassWithFlags, flags, instance;
    ClassWithFlags = (function() {
      function ClassWithFlags() {
        Mixin["in"](this, 'Flags');
      }
      return ClassWithFlags;
    })();
    instance = new ClassWithFlags();
    equal(instance.flags(), 0, 'default is flags 0');
    flags = instance.flags(1 << 0 | 1 << 1);
    equal(flags, 1 << 0 | 1 << 1, 'flags are now 1<<0|1<<1');
    equal(instance.flags(), 1 << 0 | 1 << 1, 'flags are now 1<<0|1<<1');
    equal(instance.hasFlags(1 << 0), true, 'flags bit 1<<0');
    equal(instance.hasFlags(1 << 1), true, 'flags bit 1<<1');
    equal(instance.hasFlags(1 << 2), false, 'flags bit 1<<2');
    flags = instance.resetFlags(1 << 0);
    equal(flags, 1 << 1, 'flags are now 1<<1');
    equal(instance.flags(), 1 << 1, 'flags are now 1<<1');
    equal(instance.hasFlags(1 << 0), false, 'flags bit 1<<0');
    equal(instance.hasFlags(1 << 1), true, 'flags bit 1<<1');
    equal(instance.hasFlags(1 << 2), false, 'flags bit 1<<2');
    flags = instance.setFlags(1 << 3 | 1 << 4);
    equal(flags, 1 << 1 | 1 << 3 | 1 << 4, 'flags are now 1<<1|1<<3|1<<4');
    equal(instance.flags(), 1 << 1 | 1 << 3 | 1 << 4, 'flags are now 1<<1|1<<3|1<<4');
    equal(instance.hasFlags(1 << 0), false, 'flags bit 1<<0');
    equal(instance.hasFlags(1 << 1), true, 'flags bit 1<<1');
    equal(instance.hasFlags(1 << 2), false, 'flags bit 1<<2');
    equal(instance.hasFlags(1 << 3), true, 'flags bit 1<<3');
    return equal(instance.hasFlags(1 << 4), true, 'flags bit 1<<4');
  });
  test("Use case: initialization flags", function() {
    var ClassWithInitialzationFlags, instance;
    ClassWithInitialzationFlags = (function() {
      function ClassWithInitialzationFlags() {
        Mixin["in"](this, 'Flags', 3);
      }
      return ClassWithInitialzationFlags;
    })();
    instance = new ClassWithInitialzationFlags();
    return equal(instance.flags(), 3, 'flags are initialized with 3');
  });
  return test("Use case: flags and change callback", function() {
    var ClassWithFlagsAndCallback, instance;
    ClassWithFlagsAndCallback = (function() {
      function ClassWithFlagsAndCallback() {
        this.change_count = 0;
        Mixin["in"](this, 'Flags', 0, __bind(function() {
          return this.change_count++;
        }, this));
      }
      return ClassWithFlagsAndCallback;
    })();
    instance = new ClassWithFlagsAndCallback();
    equal(instance.change_count, 0, 'no changes yet');
    instance.flags(0);
    equal(instance.change_count, 0, 'no changes yet');
    instance.flags(1 << 1 | 1 << 2);
    equal(instance.flags(), 1 << 1 | 1 << 2, 'flags are now 1<<1|1<<2');
    equal(instance.change_count, 1, '1 change');
    instance.flags(1 << 1 | 1 << 2);
    equal(instance.flags(), 1 << 1 | 1 << 2, 'flags are 1<<1|1<<2 still');
    equal(instance.change_count, 1, '1 change still');
    instance.setFlags(1 << 3);
    equal(instance.flags(), 1 << 1 | 1 << 2 | 1 << 3, 'flags are now 1<<1|1<<2|1<<3');
    equal(instance.change_count, 2, '2 changes');
    instance.setFlags(1 << 2);
    equal(instance.flags(), 1 << 1 | 1 << 2 | 1 << 3, 'flags are 1<<1|1<<2|1<<3 still');
    equal(instance.change_count, 2, '2 changes still');
    instance.resetFlags(1 << 4);
    equal(instance.flags(), 1 << 1 | 1 << 2 | 1 << 3, 'flags are 1<<1|1<<2|1<<3 still');
    equal(instance.change_count, 2, '2 changes still');
    instance.resetFlags(1 << 1);
    equal(instance.flags(), 1 << 2 | 1 << 3, 'flags are 1<<2|1<<3');
    equal(instance.change_count, 3, '3 changes');
    instance.resetFlags(1 << 1);
    equal(instance.flags(), 1 << 2 | 1 << 3, 'flags are 1<<2|1<<3 still');
    return equal(instance.change_count, 3, '3 changes still');
  });
});