import { initializeApp } from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
import { getDatabase, ref, set, get, remove, onValue } from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js';

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// 匿名登录
signInAnonymously(auth)
    .then(() => {
        console.log("Signed in anonymously to Firebase");
    })
    .catch((error) => {
        console.error("Anonymous auth failed:", error.code, error.message);
    });

export { database, ref, set, get, remove, onValue };
