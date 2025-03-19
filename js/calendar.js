let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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
    const calendarBody = document.getElementById('calendarBody');
    if (!calendarBody) {
        console.error("calendarBody element not found");
        return;
    }

    calendarBody.innerHTML = ''; // 清空现有日历
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    document.getElementById('monthDisplay').textContent = `${currentYear}年 ${currentMonth + 1}月`;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.textContent = '';
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.textContent = date;
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}
