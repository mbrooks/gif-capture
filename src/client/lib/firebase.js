import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';

const config = {
  apiKey: 'AIzaSyBLWT7a2mS6EwCGlE0JV6a82hf3WuNNIz0',
  authDomain: 'gif-capture.firebaseapp.com',
  databaseURL: 'https://gif-capture.firebaseio.com',
  projectId: 'gif-capture',
  storageBucket: 'gif-capture.appspot.com',
  messagingSenderId: '627290977204'
};
firebase.initializeApp(config);
export default firebase;
