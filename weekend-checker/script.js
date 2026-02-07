const holidays2026 = [
    '01/01/2026', '02/01/2026', '03/01/2026', '04/01/2026', 
    '05/01/2026', '06/01/2026', '07/01/2026', '08/01/2026',
    '23/02/2026',
    '08/03/2026', '09/03/2026',
    '01/05/2026',
    '04/05/2026',
    '09/05/2026', '11/05/2026',
    '12/06/2026',
    '04/11/2026'
];

const dateInput = document.getElementById('dateInput');
const checkButton = document.getElementById('checkButton');
const popupOverlay = document.getElementById('popupOverlay');
const popupText = document.getElementById('popupText');
const popupClose = document.getElementById('popupClose');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

const HISTORY_KEY = 'weekend_checker_history';

function loadHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(value) {
    const history = loadHistory();
    const timestamp = new Date().toLocaleString('ru-RU');
    history.push({ value, timestamp });
    saveHistory(history);
    displayHistory();
}

function displayHistory() {
    const history = loadHistory();
    
    if (history.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    historyList.innerHTML = '';
    
    history.slice().reverse().forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="history-value">${item.value}</span>
            <span class="history-time">${item.timestamp}</span>
        `;
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    displayHistory();
}

displayHistory();

function validateDateFormat(dateString) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) {
        return { valid: false, message: 'Неверный формат ввода' };
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    if (year > 2026) {
        return { valid: true, day, month, year, isFutureYear: true };
    }
    
    if (year !== 2026) {
        return { valid: false, message: 'Год должен быть 2026' };
    }
    
    if (month < 1 || month > 12) {
        return { valid: false, message: 'Неверный месяц' };
    }
    
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return { valid: false, message: 'Неверный день' };
    }
    
    return { valid: true, day, month, year };
}

function isWeekend(day, month, year) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

function isHoliday(dateString) {
    return holidays2026.includes(dateString);
}

function formatInput(value) {
    let cleaned = value.replace(/[^\d/]/g, '');
    
    if (cleaned.length >= 2 && cleaned.charAt(2) !== '/') {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 5 && cleaned.charAt(5) !== '/') {
        cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
    }
    
    return cleaned.slice(0, 10);
}

dateInput.addEventListener('input', function(e) {
    if (dateInput.classList.contains('error')) {
        dateInput.classList.remove('error');
    }
});

checkButton.addEventListener('click', function() {
    const dateValue = dateInput.value.trim();
    
    if (!dateValue) {
        dateInput.classList.add('error');
        return;
    }
    
    addToHistory(dateValue);
    
    const validation = validateDateFormat(dateValue);
    
    if (!validation.valid) {
        dateInput.classList.add('error');
        return;
    }
    
    dateInput.classList.remove('error');
    
    if (validation.isFutureYear) {
        popupText.textContent = 'Ура, выходной!';
        popupText.className = 'popup-text weekend';
        popupOverlay.classList.add('active');
        return;
    }
    
    const { day, month, year } = validation;
    const isWeekendDay = isWeekend(day, month, year);
    const isHolidayDay = isHoliday(dateValue);
    
    if (isWeekendDay || isHolidayDay) {
        popupText.textContent = 'Ура, выходной!';
        popupText.className = 'popup-text weekend';
    } else {
        popupText.textContent = 'Увы, работать';
        popupText.className = 'popup-text workday';
    }
    
    popupOverlay.classList.add('active');
});

dateInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkButton.click();
    }
});

popupClose.addEventListener('click', function() {
    popupOverlay.classList.remove('active');
});

popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        popupOverlay.classList.remove('active');
    }
});

clearHistoryBtn.addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите очистить всю историю?')) {
        clearHistory();
    }
});
