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
let db, schedulesRef, logsRef, auth;

try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.database();
    schedulesRef = db.ref('schedules');
    logsRef = db.ref('logs');
    console.log("Firebase 初始化成功");

    // 匿名登录
    auth.signInAnonymously().then(() => {
        console.log("匿名登录成功");
    }).catch((error) => {
        console.error("匿名登录失败:", error);
        alert("匿名登录失败，可能需要检查 Firebase 规则: " + error.message);
    });
} catch (error) {
    console.error("Firebase 初始化失败:", error);
    alert("Firebase 初始化失败: " + error.message);
}

export { db, schedulesRef, logsRef, auth };