import { database, ref, set, get, remove, onValue } from './firebase.js';

function loadSchedules() {
    console.log("loadSchedules called");
    const schedulesRef = ref('schedules');
    onValue(schedulesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log("Schedules loaded:", data);
            const timelineView = document.getElementById('timelineView');
            timelineView.innerHTML = ''; // 清空现有内容
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
        if (data) {
            console.log("Logs loaded:", data);
            const logsDiv = document.getElementById('logs');
            logsDiv.innerHTML = '';
            Object.entries(data).forEach(([id, log]) => {
                const logItem = document.createElement('div');
                logItem.textContent = `${log.timestamp}: ${log.message}`;
                logsDiv.appendChild(logItem);
            });
        } else {
            console.log("No logs found");
        }
    }, (error) => {
        console.error("Failed to load logs:", error);
    });
}

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
    }).catch((error) => {
        console.error("Failed to add schedule:", error);
    });
}

function deleteSchedule(id) {
    const scheduleRef = ref(`schedules/${id}`);
    remove(scheduleRef).then(() => {
        console.log("Schedule deleted");
    }).catch((error) => {
        console.error("Failed to delete schedule:", error);
    });
}

function filterSchedules() { /* 实现过滤逻辑 */ }
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
function toggleComplete() { /* 实现切换完成状态逻辑 */ }

export { addSchedule, loadSchedules, loadLogs, filterSchedules, switchView, toggleComplete, deleteSchedule };
