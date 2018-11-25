import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import log from './lib/log';

const WIDTH = 300;
const HEIGHT = 300;

function copyTextToClipboard() {
  const linkUrl = document.getElementById('linkUrl');
  linkUrl.select();
  document.execCommand('copy');
}

class ViewImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: '/images/placeholderImage.png',
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/gif-capture.appspot.com/o/posts%2F${id}.gif?alt=media`;
    log.info(imageUrl);
    this.setState({ imageUrl });
  }

  render() {
    const { history } = this.props;
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
            src={imageUrl}
          />
        </div>
        <div className="row">
          <div className="form-group col-md-3 " />
          <div className="form-group col-md-6 ">
            Share with others:
            {' '}
            <div className="input-group">
              <input
                id="linkUrl"
                className="form-control text-center"
                value={window.location.href}
                onFocus={() => copyTextToClipboard()}
                readOnly
              />
              <div className="input-group-append">
                <button type="button" className="input-group-text" onClick={() => copyTextToClipboard()}>
                  <FontAwesomeIcon icon="copy" size="lg" />
                </button>
              </div>
            </div>
          </div>
          <div className="form-group col-md-3 " />
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => history.push('/')}
        >
            Record Another GIF
        </button>
      </div>
    );
  }
}

export default withRouter(ViewImage);
