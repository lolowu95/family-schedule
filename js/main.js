import { verifyPassword, login, logout } from './auth.js';
import { addSchedule, loadSchedules, loadLogs, filterSchedules, switchView, toggleComplete, deleteSchedule } from './schedule.js';
import { openDatePicker, closeDatePicker, changeModalMonth, confirmRangeSelection, changeMonth, renderCalendar } from './calendar.js';

document.addEventListener('DOMContentLoaded', function() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    document.getElementById('datetimeDisplay').value = `${tomorrow.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    })} 至 ${tomorrowEnd.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    })}`;
    document.getElementById('datetimeDisplay').dataset.start = tomorrow.toISOString();
    document.getElementById('datetimeDisplay').dataset.end = tomorrowEnd.toISOString();

    if (localStorage.getItem('accessVerified') === 'true') {
        document.getElementById('passwordContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    }

    // 绑定事件
    document.getElementById('verifyButton').addEventListener('click', verifyPassword);
    document.getElementById('loginButton').addEventListener('click', () => {
        login();
        loadSchedules();
        loadLogs();
    });
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('openDatePickerButton').addEventListener('click', openDatePicker);
    document.getElementById('cancelDatePickerButton').addEventListener('click', closeDatePicker);
    document.getElementById('confirmRangeButton').addEventListener('click', confirmRangeSelection);
    document.getElementById('addScheduleButton').addEventListener('click', addSchedule);
    document.getElementById('filterUser').addEventListener('change', filterSchedules);
    document.getElementById('calendarViewBtn').addEventListener('click', () => {
        switchView('calendar');
        renderCalendar(); // 确保切换到日历视图时渲染日历
    });
    document.getElementById('timelineViewBtn').addEventListener('click', () => switchView('timeline'));

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
    document.getElementById('accessPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    window.toggleComplete = toggleComplete;
    window.deleteSchedule = deleteSchedule;
});
