// 引入 Firebase SDK
import firebase from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
import 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
import 'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js';

// 用户提供的 Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCXv-VzsLyRZ6E4m7AnFUXv3_tVoedegSE",
    authDomain: "familidayli.firebaseapp.com",
    projectId: "familidayli",
    storageBucket: "familidayli.firebasestorage.app",
    messagingSenderId: "577012068660",
    appId: "1:577012068660:web:957bffcccfdc425fdb3561",
    databaseURL: "https://familidayli-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// 初始化 Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);
const auth = firebase.auth(app);

// 匿名登录
auth.signInAnonymously()
    .then(() => {
        console.log("Signed in anonymously to Firebase");
    })
    .catch((error) => {
        console.error("Anonymous auth failed:", error.code, error.message);
    });

// 导出 Firebase Realtime Database 方法
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
