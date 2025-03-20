import { ref, set, remove, onValue } from './firebase.js';

function addSchedule() {
    const datetimeDisplay = document.getElementById('datetimeDisplay');
    const eventInput = document.getElementById('event');
    const start = datetimeDisplay.dataset.start;
    const end = datetimeDisplay.dataset.end;
    const event = eventInput.value.trim();
    const user = localStorage.getItem('currentUser');

    if (!start || !end || !event || !user) {
        alert('请填写所有字段！');
        return;
    }

    const scheduleId = Date.now().toString();
    const scheduleRef = ref(`schedules/${scheduleId}`);
    set(scheduleRef, {
        start,
        end,
        event,
        user,
        completed: false
    }).then(() => {
        console.log("Schedule added");
        eventInput.value = '';
        // 记录日志
        const logRef = ref(`logs/${Date.now()}`);
        set(logRef, {
            timestamp: new Date().toLocaleString('zh-CN'),
            message: `${user} 添加了日程：${event}（${start} 至 ${end}）`
        });
    }).catch((error) => {
        console.error("Failed to add schedule:", error);
    });
}

function loadSchedules() {
    console.log("loadSchedules called");
    const schedulesRef = ref('schedules');
    onValue(schedulesRef, (snapshot) => {
        const data = snapshot.val();
        const timelineView = document.getElementById('timelineView');
        timelineView.innerHTML = ''; // 清空现有内容
        if (data) {
            console.log("Schedules loaded:", data);
            Object.entries(data).forEach(([id, schedule]) => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                item.innerHTML = `
                    <span>${schedule.start} 至 ${schedule.end} - ${schedule.event} (${schedule.user})</span>
                    <button onclick="deleteSchedule('${id}')">删除</button>
                `;
                timelineView.appendChild(item);
            });
        } else {
            console.log("No schedules found");
            timelineView.innerHTML = '<p>暂无日程</p>';
        }
    }, (error) => {
        console.error("Failed to load schedules:", error);
    });
}

function loadLogs() {
    console.log("loadLogs called");
    const logsRef = ref('logs');
    onValue(logsRef, (snapshot) => {
        const data = snapshot.val();
        const logsDiv = document.getElementById('logs');
        logsDiv.innerHTML = '';
        if (data) {
            console.log("Logs loaded:", data);
            Object.entries(data).forEach(([id, log]) => {
                const logItem = document.createElement('div');
                logItem.textContent = `${log.timestamp}: ${log.message}`;
                logsDiv.appendChild(logItem);
            });
        } else {
            console.log("No logs found");
            logsDiv.innerHTML = '<p>暂无日志</p>';
        }
    }, (error) => {
        console.error("Failed to load logs:", error);
    });
}

function deleteSchedule(id) {
    const scheduleRef = ref(`schedules/${id}`);
    remove(scheduleRef).then(() => {
        console.log("Schedule deleted");
        const user = localStorage.getItem('currentUser');
        const logRef = ref(`logs/${Date.now()}`);
        set(logRef, {
            timestamp: new Date().toLocaleString('zh-CN'),
            message: `${user} 删除了日程（ID: ${id}）`
        });
    }).catch((error) => {
        console.error("Failed to delete schedule:", error);
    });
}

function filterSchedules() {
    const filterUser = document.getElementById('filterUser').value;
    const timelineView = document.getElementById('timelineView');
    const schedulesRef = ref('schedules');
    onValue(schedulesRef, (snapshot) => {
        const data = snapshot.val();
        timelineView.innerHTML = '';
        if (data) {
            const filtered = Object.entries(data).filter(([id, schedule]) => {
                return !filterUser || schedule.user === filterUser;
            });
            if (filtered.length > 0) {
                filtered.forEach(([id, schedule]) => {
                    const item = document.createElement('div');
                    item.className = 'timeline-item';
                    item.innerHTML = `
                        <span>${schedule.start} 至 ${schedule.end} - ${schedule.event} (${schedule.user})</span>
                        <button onclick="deleteSchedule('${id}')">删除</button>
                    `;
                    timelineView.appendChild(item);
                });
            } else {
                timelineView.innerHTML = '<p>暂无日程</p>';
            }
        } else {
            timelineView.innerHTML = '<p>暂无日程</p>';
        }
    });
}

function switchView(view) {
    const calendarView = document.getElementById('calendarView');
    const timelineView = document.getElementById('timelineView');
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const timelineViewBtn = document.getElementById('timelineViewBtn');

    if (view === 'calendar') {
        calendarView.style.display = 'block';
        timelineView.style.display = 'none';
        calendarViewBtn.classList.add('active');
        timelineViewBtn.classList.remove('active');
    } else {
        calendarView.style.display = 'none';
        timelineView.style.display = 'block';
        calendarViewBtn.classList.remove('active');
        timelineViewBtn.classList.add('active');
    }
}

function toggleComplete() {
    // 占位函数，未实现
    console.log("toggleComplete called");
}

export { addSchedule, loadSchedules, loadLogs, filterSchedules, switchView, toggleComplete, deleteSchedule };
