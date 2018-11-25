import React, { Component } from 'react';
import { withRouter } from 'react-router';
import RecordRTC from 'recordrtc';
import delay from 'delay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import firebase from './lib/firebase';
import log from './lib/log';

const WIDTH = 300;
const HEIGHT = 300;

function makeid(length = 8) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function getFileBlob(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.addEventListener('load', () => {
    cb(xhr.response);
  });
  xhr.send();
}

class WebcamCapture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constraints: { audio: false, video: { width: WIDTH, height: HEIGHT } },
      imageUrl: '/images/placeholderImage.png',
      recordingGif: false,
    };

    this.handleStartClick = this.handleStartClick.bind(this);
  }

  handleStartClick() {
    const { history } = this.props;
    const { constraints } = this.state;
    this.setState({ recordingGif: true });

    const getUserMedia = params => (
      new Promise((successCallback, errorCallback) => {
        navigator.webkitGetUserMedia.call(navigator, params, successCallback, errorCallback);
      })
    );

    getUserMedia(constraints).then((stream) => {
      const recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 6,
        width: WIDTH,
        height: HEIGHT,
        onGifRecordingStarted: () => {
          // console.log('Recording Started!');
        },
        onGifPreview: (gifURL) => {
          this.setState({ imageUrl: gifURL });
        }
      });
      recorder.startRecording();
      delay(5000).then(() => {
        recorder.stopRecording((gifURL) => {
          // upload file to firebase
          const imageId = makeid(24);
          const imageRef = firebase.storage().ref('posts').child(`${imageId}.gif`);
          getFileBlob(gifURL, (blob) => {
            imageRef.put(blob, { contentType: 'image/gif' })
              .then(() => imageRef.getDownloadURL())
              .then((imageUrl) => {
                // URL of the image uploaded on Firebase storage
                log.info(`GIF uploaded to Firebase: ${imageUrl}`);
                this.setState({ recordingGif: false });
                history.push(`/view/${imageId}`);
              }).catch((err) => {
                log.error(err);
                this.setState({ recordingGif: false });
              });
          });
        });
        stream.stop();
      });
    }).catch((err) => {
      log.error(err);
    });
  }

  render() {
    const { imageUrl, recordingGif } = this.state;
    return (
      <div className="capture container">
        <div className="output">
          {recordingGif && (
          <img
            className="shadow p-3 mb-5 bg-white rounded"
            alt="Your face"
            width={WIDTH}
            height={HEIGHT}
            src={imageUrl}
          />
          )
          }
        </div>
        <button
          type="button"
          className="btn-lg btn-primary"
          id="handleStartClick"
          onClick={this.handleStartClick}
          disabled={recordingGif}
        >
          Record Gif
          {' '}
          <FontAwesomeIcon icon="camera" />
        </button>
      </div>
    );
  }
}

export default withRouter(WebcamCapture);
