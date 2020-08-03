import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDSJertMlPv- fYp8_w0mBmst2Cnjm_msQI',
  authDomain: 'customerinvoicing-e34ff.firebaseapp.com',
  databaseURL: 'https://customerinvoicing-e34ff.firebaseio.com',
  projectId: 'customerinvoicing-e34ff',
  storageBucket: 'gs://customerinvoicing-e34ff.appspot.com',
  messagingSenderId: '323828960943',
  appId: 'insert yours: 1:1234:web:ee873bd1234c0deb7eba61ce',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };