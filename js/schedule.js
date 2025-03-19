import { schedulesRef, logsRef } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { renderTimeline, renderCalendar } from './calendar.js';

let schedules = [];
let logs = [];
let currentView = 'timeline';

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

function loadSchedules() {
    console.log("加载日程数据");
    if (!schedulesRef) {
        console.error("schedulesRef 未定义，Firebase 初始化可能失败");
        alert("无法加载日程，Firebase 初始化失败！");
        return;
    }
    schedulesRef.on('value', (snapshot) => {
        schedules = [];
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(key => {
                const schedule = data[key];
                if (isValidDate(schedule.startDatetime) && isValidDate(schedule.endDatetime)) {
                    schedules.push({
                        id: key,
                        startDatetime: new Date(schedule.startDatetime),
                        endDatetime: new Date(schedule.endDatetime),
                        event: schedule.event,
                        user: schedule.user,
                        completed: schedule.completed
                    });
                } else {
                    console.error(`Invalid date for schedule ${key}:`, schedule);
                }
            });
        }
        loadHolidays();
        filterSchedules();
    }, (error) => {
        console.error('加载数据失败:', error);
        alert('加载日程失败，请检查网络或 Firebase 配置！');
    });
}

function loadHolidays() {
    const now = new Date();
    const holidays = [
        { start: '2025-01-01T00:00:00.000Z', end: '2025-01-01T23:59:59.000Z', event: '元旦' },
        { start: '2025-01-28T00:00:00.000Z', end: '2025-01-28T23:59:59.000Z', event: '春节前夕' },
        { start: '2025-01-29T00:00:00.000Z', end: '2025-02-04T23:59:59.000Z', event: '春节' },
        { start: '2025-02-14T00:00:00.000Z', end: '2025-02-14T23:59:59.000Z', event: '情人节' },
        { start: '2025-04-04T00:00:00.000Z', end: '2025-04-04T23:59:59.000Z', event: '清明节' },
        { start: '2025-05-01T00:00:00.000Z', end: '2025-05-01T23:59:59.000Z', event: '劳动节' },
        { start: '2025-06-01T00:00:00.000Z', end: '2025-06-01T23:59:59.000Z', event: '儿童节' },
        { start: '2025-06-30T00:00:00.000Z', end: '2025-06-30T23:59:59.000Z', event: '端午节' },
        { start: '2025-10-01T00:00:00.000Z', end: '2025-10-07T23:59:59.000Z', event: '国庆节' },
        { start: '2025-10-06T00:00:00.000Z', end: '2025-10-06T23:59:59.000Z', event: '中秋节' }
    ];
    holidays.forEach(holiday => {
        const startDate = new Date(holiday.start);
        const endDate = new Date(holiday.end);
        if (startDate >= now && !schedules.some(s => s.startDatetime.getTime() === startDate.getTime() && s.event === holiday.event)) {
            schedules.push({
                startDatetime: startDate,
                endDatetime: endDate,
                event: holiday.event,
                user: '系统',
                completed: false
            });
            schedulesRef.push({
                startDatetime: startDate.toISOString(),
                endDatetime: endDate.toISOString(),
                event: holiday.event,
                user: '系统',
                completed: false
            });
        }
    });
}

function filterSchedules() {
    const filterUser = document.getElementById('filterUser').value;
    let filteredSchedules = schedules;

    if (filterUser !== 'all') {
        filteredSchedules = filteredSchedules.filter(schedule => schedule.user === filterUser);
    }

    if (currentView === 'calendar') {
        renderCalendar(filteredSchedules);
    } else {
        renderTimeline(filteredSchedules);
    }
}

function addSchedule() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录！');
        return;
    }
    const startDatetime = document.getElementById('datetimeDisplay').dataset.start;
    const endDatetime = document.getElementById('datetimeDisplay').dataset.end;
    const event = document.getElementById('event').value.trim();

    if (!startDatetime || !endDatetime || !event) {
        alert('请填写所有必填写！');
        return;
    }

    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);
    const now = new Date();
    if (startDate < now) {
        alert('开始时间不能早于当前时间！');
        return;
    }

    const newSchedule = {
        startDatetime: startDate.toISOString(),
        endDatetime: endDate.toISOString(),
        event: event,
        user: currentUser,
        completed: false
    };
    schedulesRef.push(newSchedule).then(() => {
        logAction('添加日程', `事件: ${event}, 时间: ${startDate.toLocaleString('zh-CN')} 至 ${endDate.toLocaleString('zh-CN')}`);
        document.getElementById('datetimeDisplay').value = '';
        document.getElementById('datetimeDisplay').dataset.start = '';
        document.getElementById('datetimeDisplay').dataset.end = '';
        document.getElementById('event').value = '';
    });
}

function toggleComplete(id, checkbox) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录！');
        return;
    }
    schedulesRef.child(id).update({ completed: checkbox.checked }).then(() => {
        const schedule = schedules.find(s => s.id === id);
        logAction('标记日程', `事件: ${schedule.event}, 状态: ${checkbox.checked ? '已完成' : '未完成'}`);
    });
}

function deleteSchedule(id, event, datetime) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录！');
        return;
    }
    schedulesRef.child(id).remove().then(() => {
        logAction('删除日程', `事件: ${event}, 时间: ${datetime}`);
    });
}

function logAction(action, details) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const timestamp = new Date().toISOString();
    const logEntry = {
        user: currentUser,
        action: action,
        details: details,
        timestamp: timestamp
    };
    logsRef.push(logEntry).catch((error) => {
        console.error("记录日志失败:", error);
    });
}

function loadLogs() {
    logsRef.on('value', (snapshot) => {
        logs = [];
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(key => {
                logs.push({
                    id: key,
                    user: data[key].user,
                    action: data[key].action,
                    details: data[key].details,
                    timestamp: new Date(data[key].timestamp)
                });
            });
        }
        renderLogs();
    }, (error) => {
        console.error('加载日志失败:', error);
        if (error.code === 'PERMISSION_DENIED') {
            alert('加载日志失败，请检查 Firebase 规则，当前用户无权限访问 /logs 节点。');
        } else {
            alert('加载日志失败，请检查网络或 Firebase 配置: ' + error.message);
        }
    });
}

function renderLogs() {
    const logsContainer = document.getElementById('logs');
    logsContainer.innerHTML = '';
    logs.sort((a, b) => b.timestamp - a.timestamp);
    logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `${log.timestamp.toLocaleString('zh-CN')} - ${log.user} ${log.action}: ${log.details}`;
        logsContainer.appendChild(logItem);
    });
}

function switchView(view) {
    currentView = view;
    const calendarView = document.getElementById('calendarView');
    const timelineView = document.getElementById('timelineView');
    const calendarBtn = document.getElementById('calendarViewBtn');
    const timelineBtn = document.getElementById('timelineViewBtn');

    if (view === 'calendar') {
        calendarView.style.display = 'block';
        timelineView.style.display = 'none';
        calendarBtn.classList.add('active');
        timelineBtn.classList.remove('active');
        renderCalendar(schedules);
    } else {
        calendarView.style.display = 'none';
        timelineView.style.display = 'block';
        calendarBtn.classList.remove('active');
        timelineBtn.classList.add('active');
        renderTimeline(schedules);
    }
    filterSchedules();
}

export { loadSchedules, loadLogs, addSchedule, toggleComplete, deleteSchedule, filterSchedules, switchView, schedules };