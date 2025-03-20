import { verifyPassword, login, logout } from './auth.js';
import { addSchedule, loadSchedules, loadLogs, filterSchedules, switchView, toggleComplete, deleteSchedule } from './schedule.js';
import { openDatePicker, closeDatePicker, changeModalMonth, confirmRangeSelection, changeMonth, renderCalendar } from './calendar.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");

    // 隐藏加载提示
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }

    // 初始化日期选择器默认值
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    const datetimeDisplay = document.getElementById('datetimeDisplay');
    if (datetimeDisplay) {
        datetimeDisplay.value = `${tomorrow.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        })} 至 ${tomorrowEnd.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        })}`;
        datetimeDisplay.dataset.start = tomorrow.toISOString();
        datetimeDisplay.dataset.end = tomorrowEnd.toISOString();
    } else {
        console.error("datetimeDisplay element not found");
    }

    // 检查是否已验证
    const passwordContainer = document.getElementById('passwordContainer');
    const loginContainer = document.getElementById('loginContainer');

    if (!passwordContainer || !loginContainer) {
        console.error("passwordContainer or loginContainer element not found");
        return;
    }

    if (localStorage.getItem('accessVerified') === 'true') {
        console.log("Access verified, showing login container");
        passwordContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    } else {
        console.log("Access not verified, showing password container");
        passwordContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    }

    // 绑定事件
    const verifyButton = document.getElementById('verifyButton');
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyPassword);
    } else {
        console.error("verifyButton element not found");
    }

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            login();
            loadSchedules();
            loadLogs();
            renderCalendar();
        });
    } else {
        console.error("loginButton element not found");
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error("logoutButton element not found");
    }

    const openDatePickerButton = document.getElementById('openDatePickerButton');
    if (openDatePickerButton) {
        openDatePickerButton.addEventListener('click', openDatePicker);
    } else {
        console.error("openDatePickerButton element not found");
    }

    const cancelDatePickerButton = document.getElementById('cancelDatePickerButton');
    if (cancelDatePickerButton) {
        cancelDatePickerButton.addEventListener('click', closeDatePicker);
    } else {
        console.error("cancelDatePickerButton element not found");
    }

    const confirmRangeButton = document.getElementById('confirmRangeButton');
    if (confirmRangeButton) {
        confirmRangeButton.addEventListener('click', confirmRangeSelection);
    } else {
        console.error("confirmRangeButton element not found");
    }

    const addScheduleButton = document.getElementById('addScheduleButton');
    if (addScheduleButton) {
        addScheduleButton.addEventListener('click', addSchedule);
    } else {
        console.error("addScheduleButton element not found");
    }

    const filterUser = document.getElementById('filterUser');
    if (filterUser) {
        filterUser.addEventListener('change', filterSchedules);
    } else {
        console.error("filterUser element not found");
    }

    const calendarViewBtn = document.getElementById('calendarViewBtn');
    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', () => {
            switchView('calendar');
            renderCalendar();
        });
    } else {
        console.error("calendarViewBtn element not found");
    }

    const timelineViewBtn = document.getElementById('timelineViewBtn');
    if (timelineViewBtn) {
        timelineViewBtn.addEventListener('click', () => switchView('timeline'));
    } else {
        console.error("timelineViewBtn element not found");
    }

    // 使用事件委托绑定月份切换按钮
    document.addEventListener('click', function(event) {
        if (event.target.id === 'prevMonthButton') {
            console.log("prevMonthButton clicked");
            changeMonth(-1);
        } else if (event.target.id === 'nextMonthButton') {
            console.log("nextMonthButton clicked");
            changeMonth(1);
        } else if (event.target.id === 'prevModalMonthButton') {
            changeModalMonth(-1);
        } else if (event.target.id === 'nextModalMonthButton') {
            changeModalMonth(1);
        }
    });

    // 回车键提交密码
    const accessPassword = document.getElementById('accessPassword');
    if (accessPassword) {
        accessPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });
    } else {
        console.error("accessPassword element not found");
    }

    window.toggleComplete = toggleComplete;
    window.deleteSchedule = deleteSchedule;
});
