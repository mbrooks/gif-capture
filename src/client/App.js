import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCamera, faCopy, faSpinner, faVideo
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WebcamCapture from './WebcamCapture';
import ViewImage from './ViewImage';
import firebase from './lib/firebase';
import log from './lib/log';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

library.add(faCamera);
library.add(faCopy);
library.add(faGithub);
library.add(faSpinner);
library.add(faVideo);

class App extends Component {
  componentDidMount() {
    firebase.auth().signInAnonymously().catch((err) => {
      log.error(err);
    });
  }

  render() {
    return (
      <div className="container">
        <Router>
          <div className="App">
            <p>&nbsp;</p>
            <Route path="/view/:id" component={ViewImage} />
            <Route exact path="/" component={WebcamCapture} />
            <div className="mt-5">
              <a href="https://github.com/mbrooks/gif-capture">
                <FontAwesomeIcon icon={faGithub} size="lg" />
                {' '}
                Github
              </a>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
