function verifyPassword() {
    console.log("verifyPassword called");
    const passwordInput = document.getElementById('accessPassword');
    const passwordError = document.getElementById('passwordError');
    const passwordContainer = document.getElementById('passwordContainer');
    const loginContainer = document.getElementById('loginContainer');

    if (!passwordInput || !passwordError || !passwordContainer || !loginContainer) {
        console.error("Required DOM elements not found in verifyPassword");
        alert("页面加载出错，请刷新后重试！");
        return;
    }

    const password = passwordInput.value.trim();
    console.log("Entered password:", password);

    // 更正后的硬编码密码
    const correctPassword = 'wxl641812';

    if (password === correctPassword) {
        console.log("Password correct, switching to login container");
        localStorage.setItem('accessVerified', 'true');
        passwordContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        passwordError.style.display = 'none';
        passwordInput.value = ''; // 清空密码输入框
    } else {
        console.log("Password incorrect");
        passwordError.textContent = '密码错误，请重试！';
        passwordError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function login() {
    console.log("login called");
    const username = document.getElementById('username').value;
    const loginContainer = document.getElementById('loginContainer');
    const scheduleForm = document.getElementById('scheduleForm');
    const scheduleList = document.getElementById('scheduleList');
    const logList = document.getElementById('logList');
    const logoutButton = document.getElementById('logoutButton');

    if (!username) {
        alert('请选择一个用户！');
        return;
    }

    localStorage.setItem('currentUser', username);
    loginContainer.style.display = 'none';
    scheduleForm.style.display = 'block';
    scheduleList.style.display = 'block';
    logList.style.display = 'block';
    logoutButton.style.display = 'block';
}

function logout() {
    console.log("logout called");
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessVerified');
    location.reload();
}

export { verifyPassword, login, logout };
