import React, { Component } from 'react';
import PropTypes from 'prop-types';
import log from './lib/log';

const WIDTH = 300;
const HEIGHT = 300;

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
      </div>
    );
  }
}

ViewImage.propTypes = {
  match: PropTypes.object.isRequired
};

export default ViewImage;
