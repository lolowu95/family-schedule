import firebase from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js';
import 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';

const firebaseConfig = {
    apiKey: "AIzaSyCXv-VzsLyRZ6E4m7AnFUXv3_tVoedegSE",
    authDomain: "familidayli.firebaseapp.com",
    projectId: "familidayli",
    storageBucket: "familidayli.firebasestorage.app",
    messagingSenderId: "577012068660",
    appId: "1:577012068660:web:957bffcccfdc425fdb3561",
    databaseURL: "https://familidayli-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);
const auth = firebase.auth(app);

auth.signInAnonymously()
    .then(() => {
        console.log("Signed in anonymously to Firebase");
    })
    .catch((error) => {
        console.error("Anonymous auth failed:", error.code, error.message);
    });

const ref = (path) => database.ref(path);
const set = (ref, value) => ref.set(value);
const get = (ref) => ref.once('value').then(snapshot => snapshot);
const remove = (ref) => ref.remove();
const onValue = (ref, callback) => {
    ref.on('value', (snapshot) => {
        callback(snapshot);
    });
};

export { database, ref, set, get, remove, onValue };
