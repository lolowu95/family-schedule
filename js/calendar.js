let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let modalMonth = currentMonth;
let modalYear = currentYear;
let selectedStartDate = null;
let selectedEndDate = null;

function changeMonth(direction) {
    console.log("changeMonth called with direction:", direction);
    console.log("Before change - currentMonth:", currentMonth, "currentYear:", currentYear);

    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    console.log("After change - currentMonth:", currentMonth, "currentYear:", currentYear);
    renderCalendar();
}

function renderCalendar() {
    console.log("renderCalendar called");
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');

    if (!calendarGrid || !calendarMonth) {
        console.error("calendarGrid or calendarMonth element not found");
        return;
    }

    calendarGrid.innerHTML = '';
    calendarMonth.textContent = `${currentYear}年 ${currentMonth + 1}月`;

    // 添加日历头部（星期）
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // 计算当月第一天是星期几
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 添加空白格子
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'empty';
        calendarGrid.appendChild(emptyCell);
    }

    // 添加日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        calendarGrid.appendChild(dayCell);
    }
}

function changeModalMonth(direction) {
    modalMonth += direction;
    if (modalMonth > 11) {
        modalMonth = 0;
        modalYear++;
    } else if (modalMonth < 0) {
        modalMonth = 11;
        modalYear--;
    }
    renderModalCalendar();
}

function renderModalCalendar() {
    const modalCalendarGrid = document.getElementById('modalCalendarGrid');
    const modalCalendarMonth = document.getElementById('modalCalendarMonth');
    if (!modalCalendarGrid || !modalCalendarMonth) {
        console.error("modalCalendarGrid or modalCalendarMonth element not found");
        return;
    }

    modalCalendarGrid.innerHTML = '';
    modalCalendarMonth.textContent = `${modalYear}年 ${modalMonth + 1}月`;

    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'header';
        dayHeader.textContent = day;
        modalCalendarGrid.appendChild(dayHeader);
    });

    const firstDay = new Date(modalYear, modalMonth, 1).getDay();
    const daysInMonth = new Date(modalYear, modalMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'empty';
        modalCalendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.dataset.date = `${modalYear}-${modalMonth + 1}-${day}`;
        dayCell.addEventListener('click', selectDate);
        modalCalendarGrid.appendChild(dayCell);
    }
}

function selectDate(event) {
    const date = event.target.dataset.date;
    if (!date) return;

    const selectedDate = new Date(date);
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        selectedStartDate = selectedDate;
        selectedEndDate = null;
        event.target.style.backgroundColor = '#3498db';
    } else if (selectedStartDate && !selectedEndDate) {
        if (selectedDate < selectedStartDate) {
            selectedEndDate = selectedStartDate;
            selectedStartDate = selectedDate;
        } else {
            selectedEndDate = selectedDate;
        }
        highlightRange();
    }
}

function highlightRange() {
    const cells = document.querySelectorAll('#modalCalendarGrid div:not(.header):not(.empty)');
    cells.forEach(cell => {
        cell.style.backgroundColor = '';
        const cellDate = cell.dataset.date ? new Date(cell.dataset.date) : null;
        if (cellDate && selectedStartDate && selectedEndDate) {
            if (cellDate >= selectedStartDate && cellDate <= selectedEndDate) {
                cell.style.backgroundColor = '#a1c4fd';
            }
        } else if (cellDate && selectedStartDate && cellDate.getTime() === selectedStartDate.getTime()) {
            cell.style.backgroundColor = '#3498db';
        }
    });
}

function openDatePicker() {
    modalMonth = currentMonth;
    modalYear = currentYear;
    selectedStartDate = null;
    selectedEndDate = null;
    document.getElementById('datePickerModal').style.display = 'block';
    renderModalCalendar();
}

function closeDatePicker() {
    document.getElementById('datePickerModal').style.display = 'none';
}

function confirmRangeSelection() {
    if (selectedStartDate && selectedEndDate) {
        document.getElementById('datetimeDisplay').value = `${selectedStartDate.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        })} 至 ${selectedEndDate.toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        })}`;
        document.getElementById('datetimeDisplay').dataset.start = selectedStartDate.toISOString();
        document.getElementById('datetimeDisplay').dataset.end = selectedEndDate.toISOString();
        closeDatePicker();
    } else {
        alert('请选择开始和结束日期！');
    }
}

export { changeMonth, renderCalendar, changeModalMonth, renderModalCalendar, openDatePicker, closeDatePicker, confirmRangeSelection };
