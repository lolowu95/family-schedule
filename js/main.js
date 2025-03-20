import { verifyPassword, login, logout } from './auth.js';
import { loadSchedules, loadLogs, addSchedule, toggleComplete, deleteSchedule, filterSchedules, switchView, schedules as schedulesData } from './schedule.js';
import { openCustomDatePicker, closeCustomDatePicker, changeModalMonth, confirmRangeSelection, changeMonth, renderCalendar } from './calendar.js';

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
    const datetimeDisplay = document.getElementById('datetimeDisplay');
    if (datetimeDisplay) {
        datetimeDisplay.value = `${tomorrow.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        })} 至 ${tomorrowEnd.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        })}`;
        datetimeDisplay.dataset.start = tomorrow.toISOString();
        datetimeDisplay.dataset.end = tomorrowEnd.toISOString();
    }

    // 绑定事件
    const verifyButton = document.getElementById('verifyButton');
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyPassword);
    }

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            login();
            loadSchedules();
            loadLogs();
            // 登录后渲染日历
            const filterUser = document.getElementById('filterUser').value;
            let filteredSchedules = schedulesData || [];
            if (filterUser !== 'all') {
                filteredSchedules = filteredSchedules.filter(schedule => schedule.user === filterUser);
            }
            renderCalendar(filteredSchedules);
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    const openDatePickerButton = document.getElementById('openDatePickerButton');
    if (openDatePickerButton) {
        openDatePickerButton.addEventListener('click', openCustomDatePicker);
    }

    const prevModalMonthButton = document.getElementById('prevModalMonthButton');
    if (prevModalMonthButton) {
        prevModalMonthButton.addEventListener('click', () => changeModalMonth(-1));
    }

    const nextModalMonthButton = document.getElementById('nextModalMonthButton');
    if (nextModalMonthButton) {
        nextModalMonthButton.addEventListener('click', () => changeModalMonth(1));
    }

    const confirmRangeButton = document.getElementById('confirmRangeButton');
    if (confirmRangeButton) {
        confirmRangeButton.addEventListener('click', confirmRangeSelection);
    }

    const cancelDatePickerButton = document.getElementById('cancelDatePickerButton');
    if (cancelDatePickerButton) {
        cancelDatePickerButton.addEventListener('click', closeCustomDatePicker);
    }

    const addScheduleButton = document.getElementById('addScheduleButton');
    if (addScheduleButton) {
        addScheduleButton.addEventListener('click', addSchedule);
    }

    const filterUser = document.getElementById('filterUser');
    if (filterUser) {
        filterUser.addEventListener('change', filterSchedules);
    }

    const calendarViewBtn = document.getElementById('calendarViewBtn');
    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', () => {
            switchView('calendar');
            renderCalendar(schedulesData);
        });
    }

    const timelineViewBtn = document.getElementById('timelineViewBtn');
    if (timelineViewBtn) {
        timelineViewBtn.addEventListener('click', () => switchView('timeline'));
    }

    const prevMonthButton = document.getElementById('prevMonthButton');
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', () => changeMonth(-1));
    }

    const nextMonthButton = document.getElementById('nextMonthButton');
    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', () => changeMonth(1));
    }

    // 回车键支持
    const accessPassword = document.getElementById('accessPassword');
    if (accessPassword) {
        accessPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });
    }

    // 确保全局函数可用
    window.toggleComplete = toggleComplete;
    window.deleteSchedule = deleteSchedule;
    window.schedules = schedulesData; // 使 schedules 全局可用
});
