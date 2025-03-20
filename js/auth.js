import { auth } from './firebase.js';

let currentUser = null;

function verifyPassword() {
    console.log("verifyPassword 函数被调用");
    const inputPasswordElement = document.getElementById('accessPassword');
    const passwordErrorElement = document.getElementById('passwordError');
    const passwordContainerElement = document.getElementById('passwordContainer');
    const loginContainerElement = document.getElementById('loginContainer');

    if (!inputPasswordElement || !passwordErrorElement || !passwordContainerElement || !loginContainerElement) {
        console.error("未找到必要的 DOM 元素：", {
            inputPasswordElement,
            passwordErrorElement,
            passwordContainerElement,
            loginContainerElement
        });
        alert("页面加载出错，请刷新后重试！");
        return;
    }

    const inputPassword = inputPasswordElement.value;
    console.log("输入的密码:", inputPassword);
    const encodedCorrectPassword = 'd3hsNjQxODEy'; // 一层 Base64 编码
    const decodedCorrectPassword = atob(encodedCorrectPassword);
    console.log("正确的密码:", decodedCorrectPassword);

    if (inputPassword === decodedCorrectPassword) {
        try {
            localStorage.setItem('accessVerified', 'true');
            console.log("密码验证成功，设置 accessVerified 为 true");
        } catch (error) {
            console.error("设置 localStorage 失败:", error);
            alert("无法保存验证状态，请检查浏览器设置！");
            return;
        }
        passwordContainerElement.style.display = 'none';
        loginContainerElement.style.display = 'block';
        passwordErrorElement.style.display = 'none';
    } else {
        passwordErrorElement.style.display = 'block';
        console.log("密码错误");
    }
}

function login() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('请选择一个用户！');
        console.log("未选择用户");
        return;
    }

    auth.signInAnonymously().then(() => {
        currentUser = username;
        console.log("当前用户:", currentUser);
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('scheduleForm').style.display = 'block';
        document.getElementById('scheduleList').style.display = 'block';
        document.getElementById('logList').style.display = 'block';
    }).catch((error) => {
        console.error("登录失败:", error);
        alert("登录失败: " + error.message);
    });
}

function logout() {
    auth.signOut().then(() => {
        currentUser = null;
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('scheduleForm').style.display = 'none';
        document.getElementById('scheduleList').style.display = 'none';
        document.getElementById('logList').style.display = 'none';
        document.getElementById('username').value = '';
        console.log("已登出");
    }).catch((error) => {
        console.error("登出失败:", error);
        alert("登出失败: " + error.message);
    });
}

function getCurrentUser() {
    return currentUser;
}

export { verifyPassword, login, logout, getCurrentUser };
