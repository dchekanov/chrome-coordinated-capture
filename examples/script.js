var startButton = document.getElementById('start');
var pauseButton = document.getElementById('pause');
var resumeButton = document.getElementById('resume');
var stopButton = document.getElementById('stop');
var downloadButton = document.getElementById('download');

function allowToClickButton(button, invert) {
  if (invert === false) {
    button.setAttribute('disabled', '');
  } else {
    button.removeAttribute('disabled');
  }
}

function allowToStartRecording(invert) {
  allowToClickButton(startButton, invert);
}

function allowToPauseRecording(invert) {
  allowToClickButton(pauseButton, invert);
}

function allowToResumeRecording(invert) {
  allowToClickButton(resumeButton, invert);
}

function allowToStopRecording(invert) {
  allowToClickButton(stopButton, invert);
}

function allowToDownloadRecording(invert) {
  allowToClickButton(downloadButton, invert);
}

var coordinatedCapture = new CoordinatedCapture();

// monitor extension status
coordinatedCapture.on('extensionStatus', function(event) {
  allowToStartRecording(event.detail.status.enabled);

  if (event.detail.status.recording) {
    allowToStopRecording();
    allowToPauseRecording();
  }

  if (event.detail.status.paused) {
    allowToResumeRecording();
    allowToStopRecording();
  }
});

// allow to start recording
startButton.addEventListener('click', function() {
  coordinatedCapture
    .start()
    .then(function() {
      allowToStartRecording(false);
      allowToDownloadRecording(false);
      allowToPauseRecording();
      allowToStopRecording();
    })
    .catch(alert);
});

// allow to pause recording
pauseButton.addEventListener('click', function() {
  coordinatedCapture
    .pause()
    .then(function() {
      allowToPauseRecording(false);
      allowToResumeRecording();
    })
    .catch(alert);
});

// allow to resume recording
resumeButton.addEventListener('click', function() {
  coordinatedCapture
    .resume()
    .then(function() {
      allowToResumeRecording(false);
      allowToPauseRecording();
    })
    .catch(alert);
});

// allow to stop recording
stopButton.addEventListener('click', function() {
  coordinatedCapture
    .stop()
    .then(function() {
      allowToPauseRecording(false);
      allowToResumeRecording(false);
      allowToStopRecording(false);
      allowToStartRecording();
      allowToDownloadRecording();
    })
    .catch(alert);
});

// allow to download recorded video
downloadButton.addEventListener('click', function() {
  coordinatedCapture
    .download()
    .catch(alert);
});
