// 确保 firebase 已通过 <script> 标签引入到全局
if (!window.firebase) {
    console.error("Firebase SDK not loaded. Please ensure Firebase scripts are included in index.html.");
    throw new Error("Firebase SDK not loaded");
}

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
        console.log("Signed in anonymously to Firebase (9.x compat mode)");
    })
    .catch((error) => {
        console.error("Anonymous auth failed:", error.code, error.message);
        alert("无法连接到数据库，请检查网络连接后重试！");
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

// 导出为 ES 模块
export { database, ref, set, get, remove, onValue };
