import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import RecordRTC from 'recordrtc';
import delay from 'delay';
import firebase from './lib/firebase';
import placeholderImage from './images/placeholderImage.png';
import log from './lib/log';

const WIDTH = 300;
const HEIGHT = 300;

function makeid(length=8) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function getFileBlob (url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.addEventListener('load', function() {
    cb(xhr.response);
  });
  xhr.send();
}

class WebcamCapture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: placeholderImage,
      constraints: { audio: false, video: { width: WIDTH, height: HEIGHT } }
    };

    this.handleStartClick = this.handleStartClick.bind(this);
  }

  handleStartClick() {
    const constraints = this.state.constraints;
    const photo = document.getElementById('photo');

    const getUserMedia = (params) => (
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
          photo.src = gifURL;
        }
      });
      recorder.startRecording();
      delay(5000).then(() => {
        recorder.stopRecording((gifURL) => {
          // upload file to firebase
          const imageId = makeid(24);
          const imageRef = firebase.storage().ref('posts').child(`${imageId}.gif`);
          getFileBlob(gifURL, blob => {
            imageRef.put(blob, { contentType: 'image/gif' }).then(() => {
              return imageRef.getDownloadURL();
            }).then((imageUrl) => {
              // URL of the image uploaded on Firebase storage
              log.info(`GIF uploaded to Firebase: ${imageUrl}`);
              this.props.history.push(`/view/${imageId}`);
            }).catch((err) => {
              log.error(err);
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
    const { imageUrl } = this.state;
    return (
      <div className="capture container">
        <div className="output">
          <img
            id="photo"
            className="shadow p-3 mb-5 bg-white rounded"
            alt="Your face"
            width={WIDTH}
            height={HEIGHT}
            src={imageUrl} />
        </div>
        <button
          className="btn btn-primary"
          id="handleStartClick"
          onClick={ this.handleStartClick }>
            Record Gif
        </button>
      </div>
    );
  }
}

WebcamCapture.propTypes = {
  history: PropTypes.object
};


export default withRouter(WebcamCapture);
