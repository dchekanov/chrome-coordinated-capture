/**
 * @file An API to simplify communication with the Coordinated Capture extension
 * @author Dmitry Chekanov <d.chekanov@gmail.com>
 * @licence MIT
 */

/**
 * Creates a new instance.
 * @constructor
 */
CoordinatedCapture = function() {
  this.namespace = 'CoordinatedCapture';
  this.uuid = localStorage.getItem(this.namespace + 'Uuid');
};

/**
 * Sends a command to the extension.
 * @param {string} command
 * @protected
 * @param {string} [parameter] - a value to pass on
 */
CoordinatedCapture.prototype.sendCommand = function(command, parameter) {
  window.postMessage(this.namespace + '.' + command + '(\'' + parameter + '\')', location.origin);
};

/**
 * Sends a command to the extension and awaits for an event in response.
 * @param {...(string)} var_args - a mandatory command name followed by an optional parameter and mandatory event name
 * @protected
 * @returns {Promise}
 */
CoordinatedCapture.prototype.sendCommandAndWaitForEvent = function(var_args) {
  var command = arguments[0];
  var parameter = arguments.length == 3 ? arguments[1] : undefined;
  var eventName = arguments.length == 3 ? arguments[2] : arguments[1];

  return new Promise(function(resolve, reject) {
    function resolver(event) {
      resolve(event.detail);
      this.off(eventName, resolver);
    }

    this.on(eventName, resolver.bind(this));
    this.sendCommand(command, parameter);
  }.bind(this));
};

/**
 * Gets extension status.
 * @returns {Promise}
 */
CoordinatedCapture.prototype.getStatus = function() {
  return this
    .sendCommandAndWaitForEvent('getStatus', 'extensionStatus')
    .then(function(eventData) {
      return eventData.status;
    });
};

/**
 * Starts recording.
 * @param {string} [resolution] - 'WIDTHxHEIGHT'; if not specified, equals to the screen resolution
 * @returns {Promise}
 */
CoordinatedCapture.prototype.start = function(resolution) {
  resolution = resolution || window.innerWidth + 'x' + window.innerHeight;

  return this
    .sendCommandAndWaitForEvent('start', resolution, 'started')
    .then(function(response) {
      this.uuid = response.uuid;
      localStorage.setItem(this.namespace + 'Uuid', response.uuid);
    }.bind(this));
};

/**
 * Pauses recording.
 * @returns {Promise}
 */
CoordinatedCapture.prototype.pause = function() {
  return this.sendCommandAndWaitForEvent('pause', this.uuid, 'paused');
};

/**
 * Resumes recording.
 * @returns {Promise}
 */
CoordinatedCapture.prototype.resume = function() {
  return this.sendCommandAndWaitForEvent('resume', this.uuid, 'resumed');
};

/**
 * Stops recording.
 * @returns {Promise}
 */
CoordinatedCapture.prototype.stop = function() {
  return this.sendCommandAndWaitForEvent('stop', this.uuid, 'stopped');
};

/**
 * Downloads the result.
 * @returns {Promise}
 */
CoordinatedCapture.prototype.download = function() {
  return this.sendCommandAndWaitForEvent('download', this.uuid, 'downloading');
};

/**
 * Binds a hanler to an event fired by the extension.
 * @param {('enabled'|'disabled'|'extensionStatus'|'started'|'stopped'|'paused'|'resumed')} eventName
 * @param {Function} handler
 */
CoordinatedCapture.prototype.on = function(eventName, handler) {
  window.addEventListener(this.namespace + '.' + eventName, function(event) {
    handler(event);
  });
};

/**
 * Unbinds a previously bound handler.
 * @param {('enabled'|'disabled'|'extensionStatus'|'started'|'stopped'|'paused'|'resumed')} eventName
 * @param {Function} handler
 */
CoordinatedCapture.prototype.off = function(eventName, handler) {
  window.removeEventListener(this.namespace + '.' + eventName, handler);
};

if (typeof module != 'undefined' && module.exports) module.exports = CoordinatedCapture;
