import firebase from 'firebase'

// const config = {
//     apiKey: 'AIzaSyAC9ZSyvTxU2o5W0jcL0hDvzS4utLuicE8',
//     authDomain: 'flutterchatdemo.firebaseapp.com',
//     databaseURL: 'https://flutterchatdemo.firebaseio.com',
//     projectId: 'flutterchatdemo',
//     storageBucket: 'flutterchatdemo.appspot.com',
//     messagingSenderId: '347976604232'
// }

var config = {
    apiKey: "AIzaSyDHEYqWl5zDK0X9Ce5rxiiOQKxk43ZpKWc",
    authDomain: "chartapp-cf69e.firebaseapp.com",
    databaseURL: "https://chartapp-cf69e.firebaseio.com",
    projectId: "chartapp-cf69e",
    storageBucket: "chartapp-cf69e.appspot.com",
    messagingSenderId: "327191530228",
    appId: "1:327191530228:web:f88197cdd95c21b69d2ca1",
    measurementId: "G-DCSWLPMMP3"
  };

firebase.initializeApp(config)
// firebase.firestore().settings({
//     timestampsInSnapshots: true
// })

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
