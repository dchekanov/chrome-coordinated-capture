# Coordinated Capture

An extension for Google Chrome that allows page scripts to coordinate a recording of what is happening in a tab 
and to download the resulting video file. Comes with an API script to simplify communication.   

## Use case

1. Create a page with scripted animation.
2. Let page scripts to utilize methods provided by this extension to record the animation.
3. Get the resulting video file and use it as needed.

## Why

The tool was created because I needed to record a small dummy video for testing an HTML5 video player project and 
I couldn't find a way to do so without using ancient/buggy/bloated/ad-infested/overpriced software.

## How does it work

Chrome provides extensions a way to record what is happening in a tab: [chrome.tabCapture](https://developer.chrome.com/extensions/tabCapture).

[MediaRecorder API](https://developer.mozilla.org/en/docs/Web/API/MediaRecorder_API) provides a simple way to record media streams.

This extension is a bridge between your page scripts and those functionalities. 

Using that bridge, scripts can start, stop, pause/resume, and trigger downloading of the recording when they need to, 
and you don't need to fiddle with video editing software to crop it. 

## How to use

1. Install the extension.
2. Include the [./api.js](./api.js) file to the page that will coordinate the recording.
3. Use the API.

See [API docs](./docs/api.md) and the source code of [the demo](./examples/index.html).

## Notes

### Limitations

1. Simultaneus recording of multiple tabs is not supported.
2. I didn't implement any error handling - it was tedious enough to pass data between 3 isolated layers.
If something is not working, look into the console output of both the host page and of the extension background page.
You're welcome to add error handling and submit a PR.
3. Last tested with Chrome 52. Browser APIs are evolving over time and it might not work with newer versions.

### Security features

1. The extension does not provide a way to consume the recorded activity in any form except for by explicitly sending the file to download to the user who started the recording.
2. There is no way to start a recording without a user consent, which is given by clicking the toolbar button.
3. The recording is not interrupted on page reload, and can be controlled and downloaded after visiting other pages, but only from the same domain where it was started at.

### Tips

1. Add a small (~100 ms., varies) delay before calling `coordinatedCapture.stop()` so that the frame with the final state could have a chance to be recorded.

## License

[MIT](LICENSE)
