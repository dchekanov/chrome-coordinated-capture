var extensionStatus = {
  enabled: false,
  recording: false,
  paused: false
};

var captureOptions = {
  video: true,
  videoConstraints: {
    mandatory: {
      // providing max resolution improves quality
      maxWidth: screen.width,
      maxHeight: screen.height
    }
  }
};

var recordedChunks = [];
var mediaRecorder;
var uuid;

/**
 * Genererates uniq ID for a recording.
 * @see {@link http://stackoverflow.com/a/8809472/1910379}
 * @returns {string}
 */
function generateUUID() {
  var d = new Date().getTime();

  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); // use high-precision timer if available
  }

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;

    d = Math.floor(d / 16);

    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return uuid;
}

/**
 * Sends a message to the content script of the active tab.
 * @param message
 */
function notifyContentScript(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

/**
 * Notifies content script of the current status.
 */
function announceStatus() {
  notifyContentScript({
    event: {
      name: 'extensionStatus',
      data: {
        status: extensionStatus
      }
    }
  });
}

/**
 * Gets the active tab id.
 * @param callback
 */
function getCurrentTabId(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    callback(tabs[0].id);
  });
}

/**
 * Changes extension status.
 * @param isEnabled
 */
function setExtensionStatus(isEnabled) {
  getCurrentTabId(function(tabId) {
    extensionStatus.enabled = isEnabled;

    chrome.browserAction.setTitle({
      title: isEnabled ? 'Disable' : 'Enable',
      tabId: tabId
    });

    chrome.browserAction.setIcon({
      path: isEnabled ? 'images/ready.png' : 'images/disabled.png',
      tabId: tabId
    });

    notifyContentScript({
      event: {
        name: (isEnabled ? 'enabled' : 'disabled')
      }
    });

    announceStatus();
  });
}

// listen for commands from the content script
chrome.runtime.onMessage.addListener(function(message) {
  switch (message.command) {
    case 'start':
      if (message.parameter) {
        var constraints = message.parameter.split('x');

        if (constraints.length == 2) {
          captureOptions.videoConstraints.mandatory = {
            maxWidth: constraints[0],
            maxHeight: constraints[1]
          };
        }
      }

      chrome.tabCapture.capture(captureOptions, function(stream) {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function(event) {
          if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.start();
        uuid = generateUUID();

        notifyContentScript({
          event: {
            name: 'started',
            data: {
              uuid: uuid
            }
          }
        });

        getCurrentTabId(function(tabId) {
          chrome.browserAction.setIcon({
            path: 'images/recording.png',
            tabId: tabId
          });
        });

        extensionStatus.recording = true;
        announceStatus();
      });

      break;
    case 'pause':
      if (message.parameter != uuid) return;

      mediaRecorder.pause();

      notifyContentScript({
        event: {
          name: 'paused'
        }
      });

      getCurrentTabId(function(tabId) {
        chrome.browserAction.setIcon({
          path: extensionStatus.enabled ? 'images/ready.png' : 'images/disabled.png',
          tabId: tabId
        });
      });

      extensionStatus.paused = true;
      announceStatus();

      break;
    case 'resume':
      if (message.parameter != uuid) return;

      mediaRecorder.resume();

      notifyContentScript({
        event: {
          name: 'resumed'
        }
      });

      getCurrentTabId(function(tabId) {
        chrome.browserAction.setIcon({
          path: 'images/recording.png',
          tabId: tabId
        });
      });

      extensionStatus.paused = false;
      announceStatus();

      break;
    case 'stop':
      if (message.parameter != uuid) return;

      mediaRecorder.stream.getTracks()[0].stop();

      notifyContentScript({
        event: {
          name: 'stopped'
        }
      });

      getCurrentTabId(function(tabId) {
        chrome.browserAction.setIcon({
          path: extensionStatus.enabled ? 'images/ready.png' : 'images/disabled.png',
          tabId: tabId
        });
      });

      extensionStatus.recording = false;
      extensionStatus.paused = false;
      announceStatus();

      break;
    case 'download':
      if (message.parameter != uuid) return;

      var blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });

      var url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url: url,
        filename: 'recording.webm'
      });

      notifyContentScript({
        event: {
          name: 'downloading'
        }
      });
      break;
    case 'getStatus':
      announceStatus();
      break;
  }
});

// handle toolbar button click
chrome.browserAction.onClicked.addListener(function() {
  setExtensionStatus(!extensionStatus.enabled);
});

// mark as disabled when page changes
chrome.tabs.onUpdated.addListener(function() {
  chrome.tabCapture.getCapturedTabs(function(tabs) {
    if (!tabs.length) extensionStatus.recording = false;

    setExtensionStatus(false);

    getCurrentTabId(function(tabId) {
      if (extensionStatus.recording) {
        chrome.browserAction.setIcon({
          path: 'images/recording.png',
          tabId: tabId
        });
      }
    });
  });
});
