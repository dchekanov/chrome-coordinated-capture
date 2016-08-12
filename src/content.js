var namespace = 'CoordinatedCapture';

// listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message) {
  // and pass them to page scripts
  var eventName = namespace + '.' + message.event.name;

  var event = new CustomEvent(eventName, {
    detail: message.event.data
  });

  window.dispatchEvent(event);
});

// listen for commands from page scripts
window.addEventListener('message', function(event) {
  // pass commands encoded like 'CoordinatedCapture.command('parameter')' to the background page
  var re = new RegExp(namespace + '\.(\\w+)\\(\'(.*)\'\\)');
  var matched = event.data.match(re);

  if (!matched) return;

  var command = matched[1];
  var parameter = matched[2];

  chrome.runtime.sendMessage({command: command, parameter: parameter});
});
