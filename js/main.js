import { verifyPassword, login, logout } from './auth.js';
import { loadSchedules, loadLogs, addSchedule, toggleComplete, deleteSchedule, filterSchedules, switchView } from './schedule.js';
import { openCustomDatePicker, closeCustomDatePicker, changeModalMonth, confirmRangeSelection, changeMonth } from './calendar.js';

document.addEventListener('DOMContentLoaded', function() {
    const passwordContainer = document.getElementById('passwordContainer');
    const loginContainer = document.getElementById('loginContainer');

    if (!passwordContainer || !loginContainer) {
        console.error("未找到 passwordContainer 或 loginContainer 元素");
        alert("页面加载出错，请刷新后重试！");
        return;
    }

    if (localStorage.getItem('accessVerified') === 'true') {
        console.log("已验证，显示登录界面");
        passwordContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    } else {
        console.log("未验证，显示密码输入界面");
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(tomorrowEnd.getHours() + 1);
    document.getElementById('datetimeDisplay').value = `${tomorrow.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })} 至 ${tomorrowEnd.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })}`;
    document.getElementById('datetimeDisplay').dataset.start = tomorrow.toISOString();
    document.getElementById('datetimeDisplay').dataset.end = tomorrowEnd.toISOString();

    // 绑定事件
    document.getElementById('verifyButton').addEventListener('click', verifyPassword);
    document.getElementById('loginButton').addEventListener('click', () => {
        login();
        loadSchedules();
        loadLogs();
    });
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('openDatePickerButton').addEventListener('click', openCustomDatePicker);
    document.getElementById('prevModalMonthButton').addEventListener('click', () => changeModalMonth(-1));
    document.getElementById('nextModalMonthButton').addEventListener('click', () => changeModalMonth(1));
    document.getElementById('confirmRangeButton').addEventListener('click', confirmRangeSelection);
    document.getElementById('cancelDatePickerButton').addEventListener('click', closeCustomDatePicker);
    document.getElementById('addScheduleButton').addEventListener('click', addSchedule);
    document.getElementById('filterUser').addEventListener('change', filterSchedules);
    document.getElementById('calendarViewBtn').addEventListener('click', () => switchView('calendar'));
    document.getElementById('timelineViewBtn').addEventListener('click', () => switchView('timeline'));
    document.getElementById('prevMonthButton').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonthButton').addEventListener('click', () => changeMonth(1));

    window.toggleComplete = toggleComplete;
    window.deleteSchedule = deleteSchedule;
});
