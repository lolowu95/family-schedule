let currentMonth = new Date();
let modalCurrentMonth = new Date();
let modalIsSelecting = false;
let modalSelectedStart = null;
let modalSelectedEnd = null;

function openCustomDatePicker() {
    const modal = document.getElementById('datePickerModal');
    modalCurrentMonth = new Date();
    modalIsSelecting = false;
    modalSelectedStart = null;
    modalSelectedEnd = null;
    renderModalCalendar();
    modal.style.display = 'block';
}

function closeCustomDatePicker() {
    const modal = document.getElementById('datePickerModal');
    modal.style.display = 'none';
    modalIsSelecting = false;
    modalSelectedStart = null;
    modalSelectedEnd = null;
    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
}

function changeModalMonth(delta) {
    modalCurrentMonth.setMonth(modalCurrentMonth.getMonth() + delta);
    renderModalCalendar();
}

function renderModalCalendar() {
    const calendarGrid = document.getElementById('modalCalendarGrid');
    const calendarMonth = document.getElementById('modalCalendarMonth');
    calendarGrid.innerHTML = '';

    calendarMonth.textContent = `${modalCurrentMonth.getFullYear()}年 ${modalCurrentMonth.getMonth() + 1}月`;

    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    const firstDayOfMonth = new Date(modalCurrentMonth.getFullYear(), modalCurrentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(modalCurrentMonth.getFullYear(), modalCurrentMonth.getMonth() + 1, 0);
    const today = new Date();

    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(modalCurrentMonth.getFullYear(), modalCurrentMonth.getMonth(), day);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.dataset.date = `${modalCurrentMonth.getFullYear()}-${String(modalCurrentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        dayDiv.innerHTML = `<strong>${day}</strong>`;
        calendarGrid.appendChild(dayDiv);
    }

    calendarGrid.addEventListener('mousedown', startSelection);
    calendarGrid.addEventListener('mouseover', updateSelection);
    calendarGrid.addEventListener('mouseup', endSelection);
}

function startSelection(e) {
    if (e.target.closest('.calendar-day') && !e.target.closest('.calendar-day').classList.contains('empty') && !e.target.closest('.calendar-day').classList.contains('header')) {
        modalIsSelecting = true;
        modalSelectedStart = e.target.closest('.calendar-day').dataset.date;
        modalSelectedEnd = modalSelectedStart;
        highlightRange();
    }
}

function updateSelection(e) {
    if (modalIsSelecting && e.target.closest('.calendar-day') && !e.target.closest('.calendar-day').classList.contains('empty') && !e.target.closest('.calendar-day').classList.contains('header')) {
        modalSelectedEnd = e.target.closest('.calendar-day').dataset.date;
        highlightRange();
    }
}

function endSelection() {
    modalIsSelecting = false;
}

function highlightRange() {
    const allDays = document.querySelectorAll('#modalCalendarGrid .calendar-day');
    allDays.forEach(day => day.classList.remove('selected'));
    let startIdx = -1;
    let endIdx = -1;
    allDays.forEach((day, index) => {
        if (day.dataset.date === modalSelectedStart) startIdx = index;
        if (day.dataset.date === modalSelectedEnd) endIdx = index;
    });
    if (startIdx > -1 && endIdx > -1) {
        const min = Math.min(startIdx, endIdx);
        const max = Math.max(startIdx, endIdx);
        for (let i = min; i <= max; i++) {
            if (!allDays[i].classList.contains('empty') && !allDays[i].classList.contains('header')) {
                allDays[i].classList.add('selected');
            }
        }
    }
}

function confirmRangeSelection() {
    if (!modalSelectedStart || !modalSelectedEnd) {
        alert('请选择一个日期范围！');
        return;
    }
    let startDate = new Date(modalSelectedStart + 'T00:00:00');
    let endDate = new Date(modalSelectedEnd + 'T23:59:59');
    if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
    }
    const now = new Date();
    if (startDate < now) {
        alert('开始时间不能早于当前时间！');
        return;
    }
    document.getElementById('datetimeDisplay').value = `${startDate.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })} 至 ${endDate.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })}`;
    document.getElementById('datetimeDisplay').dataset.start = startDate.toISOString();
    document.getElementById('datetimeDisplay').dataset.end = endDate.toISOString();
    closeCustomDatePicker();
}

function changeMonth(delta) {
    currentMonth.setMonth(currentMonth.getMonth() + delta);
}

function renderCalendar(filteredSchedules) {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');
    calendarGrid.innerHTML = '';

    calendarMonth.textContent = `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`;

    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const today = new Date();

    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        if (currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        dayDiv.innerHTML = `<strong>${day}</strong>`;

        filteredSchedules.forEach(schedule => {
            const startDate = new Date(schedule.startDatetime);
            const endDate = new Date(schedule.endDatetime);
            const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const currentDateEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

            if (startDate <= currentDateEnd && endDate >= currentDateStart) {
                const isSystem = schedule.user === '系统';
                const avatar = isSystem ? { color: '#95a5a6', initial: '节' } : {
                    '吴乐乐': { color: '#e74c3c', initial: '吴' },
                    '冯妈妈': { color: '#3498db', initial: '冯' },
                    '张宝宝': { color: '#2ecc71', initial: '张' },
                    '懒宝': { color: '#f1c40f', initial: '懒' }
                }[schedule.user] || { color: '#95a5a6', initial: schedule.user[0] };

                const startFormatted = startDate.toLocaleString('zh-CN', {
                    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                });
                const endFormatted = endDate.toLocaleString('zh-CN', {
                    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                });

                const eventDiv = document.createElement('div');
                eventDiv.className = `calendar-event ${schedule.completed ? 'completed' : ''}`;
                eventDiv.innerHTML = `
                    <div class="time-range">${startFormatted} - ${endFormatted}</div>
                    <div class="avatar" style="background-color: ${avatar.color}">${avatar.initial}</div>
                    <span>${schedule.event}</span>
                    <input type="checkbox" class="checkbox" ${schedule.completed ? 'checked' : ''} onchange="toggleComplete('${schedule.id}', this)">
                    ${!isSystem ? `<button class="delete-btn" onclick="deleteSchedule('${schedule.id}', '${schedule.event}', '${startDate.toLocaleString('zh-CN')} 至 ${endDate.toLocaleString('zh-CN')}')"><i class="fas fa-trash-alt"></i></button>` : ''}
                `;
                dayDiv.appendChild(eventDiv);
            }
        });

        calendarGrid.appendChild(dayDiv);
    }
}

function renderTimeline(filteredSchedules) {
    const timeline = document.getElementById('timelineView');
    timeline.innerHTML = '';

    filteredSchedules.sort((a, b) => a.startDatetime - b.startDatetime);

    filteredSchedules.forEach((schedule) => {
        const startDate = schedule.startDatetime;
        const endDate = schedule.endDatetime;

        const startFormatted = startDate.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            weekday: 'long'
        });
        const endFormatted = endDate.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            weekday: 'long'
        });

        const isSystem = schedule.user === '系统';
        const avatar = isSystem ? { color: '#95a5a6', initial: '节' } : {
            '吴乐乐': { color: '#e74c3c', initial: '吴' },
            '冯妈妈': { color: '#3498db', initial: '冯' },
            '张宝宝': { color: '#2ecc71', initial: '张' },
            '懒宝': { color: '#f1c40f', initial: '懒' }
        }[schedule.user] || { color: '#95a5a6', initial: schedule.user[0] };

        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${schedule.completed ? 'completed' : ''}`;
        timelineItem.innerHTML = `
            <div class="avatar" style="background-color: ${avatar.color}">${avatar.initial}</div>
            <div class="content">
                <div class="date-time">${startFormatted} 至 ${endFormatted}</div>
                <div class="event">事件: ${schedule.event}</div>
                <div class="added-by">添加者: ${schedule.user}</div>
            </div>
            <input type="checkbox" class="checkbox" ${schedule.completed ? 'checked' : ''} onchange="toggleComplete('${schedule.id}', this)">
            ${!isSystem ? `<button class="delete-btn" onclick="deleteSchedule('${schedule.id}', '${schedule.event}', '${startFormatted} 至 ${endFormatted}')"><i class="fas fa-trash-alt"></i> 删除</button>` : ''}
        `;
        timeline.appendChild(timelineItem);
    });
}

export {
    openCustomDatePicker,
    closeCustomDatePicker,
    changeModalMonth,
    confirmRangeSelection,
    changeMonth,
    renderCalendar,
    renderTimeline
};
