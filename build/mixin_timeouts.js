/*
  mixin_timeouts.js
  (c) 2011 Kevin Malakoff.
  Mixin.Timeouts is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/mixin/blob/master/LICENSE
  Dependencies: Mixin.Core
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!Mixin && (typeof exports !== 'undefined')) {
  this.Mixin = require('mixin_core').Mixin;
}
if (!Mixin) {
  throw new Error("Mixin.Timeouts: Dependency alert! Mixin is missing. Please ensure it is included");
}
Mixin.Timeouts || (Mixin.Timeouts = {});
Mixin.Timeouts._mixin_info = {
  mixin_name: 'Timeouts',
  initialize: function() {
    return Mixin.instanceData(this, 'Timeouts', {
      timeouts: {}
    });
  },
  destroy: function() {
    return this.killAllTimeouts();
  },
  mixin_object: {
    addTimeout: function(timeout_name, callback, wait) {
      var callback_args, instance_data, timeout;
      Mixin.Core._Validate.string(timeout_name, 'Mixin.Timeouts.addTimeout', 'timeout_name');
      Mixin.Core._Validate.callback(callback, 'Mixin.Timeouts.addTimeout', 'callback');
      if (wait === void 0) {
        throw new Error("Mixin.Timeouts: missing wait on '" + (_.classOf(this)) + "'");
      }
      if ((typeof wait !== 'number') || (wait < 0) || (Math.floor(wait) !== wait)) {
        throw new Error("Mixin.Timeouts: wait invalid on '" + (_.classOf(this)) + "'");
      }
      instance_data = Mixin.instanceData(this, 'Timeouts');
      if (this.hasTimeout(timeout_name)) {
        throw new Error("Mixin.Timeouts: timeout '" + timeout_name + "' already exists on '" + (_.classOf(this)) + "'");
      }
      callback_args = Array.prototype.slice.call(arguments, 3);
      timeout = setTimeout((__bind(function() {
        this.killTimeout(timeout_name);
        return callback.apply(this, callback_args);
      }, this)), wait);
      instance_data.timeouts[timeout_name] = timeout;
      return this;
    },
    hasTimeout: function(timeout_name) {
      var instance_data;
      instance_data = Mixin.instanceData(this, 'Timeouts');
      return timeout_name in instance_data.timeouts;
    },
    timeoutCount: function() {
      var count, instance_data, key, timeout, _ref;
      instance_data = Mixin.instanceData(this, 'Timeouts');
      count = 0;
      _ref = instance_data.timeouts;
      for (key in _ref) {
        timeout = _ref[key];
        count++;
      }
      return count;
    },
    timeouts: function() {
      var instance_data, key, result, timeout, _ref;
      instance_data = Mixin.instanceData(this, 'Timeouts');
      result = [];
      _ref = instance_data.timeouts;
      for (key in _ref) {
        timeout = _ref[key];
        result.push(key);
      }
      return result;
    },
    killTimeout: function(timeout_name) {
      var instance_data;
      instance_data = Mixin.instanceData(this, 'Timeouts');
      if (!this.hasTimeout(timeout_name)) {
        throw new Error("Mixin.Timeouts: timeout '" + timeout_name + "' does not exist. For a less-strict check, use killTimeoutIfExists");
      }
      this.killTimeoutIfExists(timeout_name);
      return this;
    },
    killTimeoutIfExists: function(timeout_name) {
      var instance_data, timeout;
      instance_data = Mixin.instanceData(this, 'Timeouts');
      timeout = instance_data.timeouts[timeout_name];
      if (timeout) {
        clearTimeout(timeout);
      }
      delete instance_data.timeouts[timeout_name];
      return this;
    },
    killAllTimeouts: function() {
      var callback, instance_data, timeout_name, _ref;
      instance_data = Mixin.instanceData(this, 'Timeouts');
      _ref = instance_data.timeouts;
      for (timeout_name in _ref) {
        callback = _ref[timeout_name];
        this.killTimeoutIfExists(timeout_name);
      }
      return this;
    }
  }
};
Mixin.registerMixin(Mixin.Timeouts._mixin_info);