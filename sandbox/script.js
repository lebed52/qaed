// === QA Sandbox JavaScript ===

// ========== FORMS ==========

// Registration Form
document
  .getElementById("registration-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    const result = document.getElementById("reg-result");
    result.classList.remove("hidden");
    result.innerHTML = `<strong>✅ Форма отправлена!</strong><br>Данные: ${JSON.stringify(
      data,
      null,
      2
    )}`;
  });

// Validation Form
document
  .getElementById("validation-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("val-username").value;
    const email = document.getElementById("val-email").value;
    const password = document.getElementById("val-password").value;
    const confirm = document.getElementById("val-confirm").value;

    let isValid = true;

    // Username validation
    const userMsg = document.getElementById("val-username-msg");
    if (username.length < 5) {
      userMsg.textContent = "✗ Минимум 5 символов";
      userMsg.className = "validation-msg error";
      isValid = false;
    } else {
      userMsg.textContent = "✓ OK";
      userMsg.className = "validation-msg success";
    }

    // Email validation
    const emailMsg = document.getElementById("val-email-msg");
    if (!email.includes("@")) {
      emailMsg.textContent = "✗ Должен содержать @";
      emailMsg.className = "validation-msg error";
      isValid = false;
    } else {
      emailMsg.textContent = "✓ OK";
      emailMsg.className = "validation-msg success";
    }

    // Password validation
    const passMsg = document.getElementById("val-password-msg");
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    if (password.length < 8 || !hasLetters || !hasNumbers) {
      passMsg.textContent = "✗ Мин. 8 символов, буквы и цифры";
      passMsg.className = "validation-msg error";
      isValid = false;
    } else {
      passMsg.textContent = "✓ OK";
      passMsg.className = "validation-msg success";
    }

    // Confirm validation
    const confMsg = document.getElementById("val-confirm-msg");
    if (password !== confirm) {
      confMsg.textContent = "✗ Пароли не совпадают";
      confMsg.className = "validation-msg error";
      isValid = false;
    } else {
      confMsg.textContent = "✓ OK";
      confMsg.className = "validation-msg success";
    }

    const result = document.getElementById("val-result");
    result.classList.remove("hidden");
    if (isValid) {
      result.className = "result-box success";
      result.innerHTML = "✅ Все поля заполнены корректно!";
    } else {
      result.className = "result-box error";
      result.innerHTML = "❌ Исправьте ошибки в форме";
    }
  });

// Dynamic Form Fields
let emailCount = 1;
let phoneCount = 1;

function addField(type) {
  const container = document.getElementById(`${type}-fields`);
  const count = type === "email" ? ++emailCount : ++phoneCount;
  const div = document.createElement("div");
  div.className = "field-row";
  div.setAttribute("data-field", `${type}-${count}`);
  div.innerHTML = `
        <input type="${type === "email" ? "email" : "tel"}" 
               placeholder="${
                 type === "email" ? "email@example.com" : "+7 (999) 123-45-67"
               }" 
               data-testid="${type}-${count}">
        <button type="button" class="btn-remove" data-testid="remove-${type}-${count}" onclick="removeField('${type}-${count}')">✕</button>
    `;
  container.appendChild(div);
}

function removeField(fieldId) {
  const field = document.querySelector(`[data-field="${fieldId}"]`);
  if (field) field.remove();
}

document
  .getElementById("dynamic-form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("dyn-name").value;
    const emails = Array.from(document.querySelectorAll("#email-fields input"))
      .map((i) => i.value)
      .filter((v) => v);
    const phones = Array.from(document.querySelectorAll("#phone-fields input"))
      .map((i) => i.value)
      .filter((v) => v);

    const result = document.getElementById("dyn-result");
    result.classList.remove("hidden");
    result.innerHTML = `<strong>✅ Данные:</strong><br>Имя: ${name}<br>Emails: ${emails.join(
      ", "
    )}<br>Телефоны: ${phones.join(", ")}`;
  });

// ========== TABLES ==========

// Sortable Table
let sortDirection = {};
document.querySelectorAll(".sortable-header").forEach((header) => {
  header.addEventListener("click", function () {
    const column = this.dataset.sort;
    const table = document.getElementById("sortable-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    sortDirection[column] = !sortDirection[column];

    const columnIndex = { id: 0, name: 1, age: 2, salary: 3 }[column];

    rows.sort((a, b) => {
      let aVal = a.cells[columnIndex].textContent;
      let bVal = b.cells[columnIndex].textContent;

      if (column === "salary") {
        aVal = parseInt(aVal.replace(/\D/g, ""));
        bVal = parseInt(bVal.replace(/\D/g, ""));
      } else if (column === "age" || column === "id") {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      }

      if (sortDirection[column]) {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

// Filterable Table
const filterSearch = document.getElementById("filter-search");
const filterStatus = document.getElementById("filter-status");

function filterTable() {
  const searchTerm = filterSearch?.value.toLowerCase() || "";
  const statusFilter = filterStatus?.value || "";
  const table = document.getElementById("filterable-table");
  const rows = table?.querySelectorAll("tbody tr") || [];
  let visibleCount = 0;

  rows.forEach((row) => {
    const name = row.cells[1].textContent.toLowerCase();
    const status = row.dataset.status;

    const matchesSearch = name.includes(searchTerm);
    const matchesStatus = !statusFilter || status === statusFilter;

    if (matchesSearch && matchesStatus) {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });

  const info = document.getElementById("filter-info");
  if (info)
    info.textContent = `Показано: ${visibleCount} из ${rows.length} записей`;
}

filterSearch?.addEventListener("input", filterTable);
filterStatus?.addEventListener("change", filterTable);

// Paginated Table
const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: "$1,299" },
  { id: 2, name: "Mouse", category: "Accessories", price: "$29" },
  { id: 3, name: "Keyboard", category: "Accessories", price: "$89" },
  { id: 4, name: "Monitor", category: "Electronics", price: "$399" },
  { id: 5, name: "Headphones", category: "Audio", price: "$199" },
  { id: 6, name: "Webcam", category: "Accessories", price: "$79" },
  { id: 7, name: "Microphone", category: "Audio", price: "$149" },
  { id: 8, name: "USB Hub", category: "Accessories", price: "$39" },
  { id: 9, name: "SSD 1TB", category: "Storage", price: "$89" },
  { id: 10, name: "RAM 16GB", category: "Components", price: "$59" },
  { id: 11, name: "GPU", category: "Components", price: "$599" },
  { id: 12, name: "CPU", category: "Components", price: "$349" },
  { id: 13, name: "Case", category: "Components", price: "$99" },
  { id: 14, name: "PSU", category: "Components", price: "$79" },
  { id: 15, name: "Cooling Fan", category: "Components", price: "$29" },
  { id: 16, name: "Mousepad", category: "Accessories", price: "$19" },
  { id: 17, name: "Desk Lamp", category: "Accessories", price: "$45" },
  { id: 18, name: "Chair", category: "Furniture", price: "$299" },
  { id: 19, name: "Desk", category: "Furniture", price: "$199" },
  { id: 20, name: "Monitor Stand", category: "Accessories", price: "$49" },
];

let currentPage = 1;
let pageSize = 5;

function renderPaginatedTable() {
  const tbody = document.getElementById("paginated-body");
  if (!tbody) return;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageProducts = products.slice(start, end);

  tbody.innerHTML = pageProducts
    .map(
      (p) => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price}</td>
        </tr>
    `
    )
    .join("");

  const totalPages = Math.ceil(products.length / pageSize);
  document.getElementById("pagination-info").textContent = `Показано ${
    start + 1
  }-${Math.min(end, products.length)} из ${products.length} записей`;

  // Update page numbers
  const pageNumbers = document.getElementById("page-numbers");
  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn-page ${i === currentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderPaginatedTable();
    };
    pageNumbers.appendChild(btn);
  }

  // Update navigation buttons
  document.querySelector('[data-testid="page-first"]').disabled =
    currentPage === 1;
  document.querySelector('[data-testid="page-prev"]').disabled =
    currentPage === 1;
  document.querySelector('[data-testid="page-next"]').disabled =
    currentPage === totalPages;
  document.querySelector('[data-testid="page-last"]').disabled =
    currentPage === totalPages;
}

document
  .querySelector('[data-testid="page-first"]')
  ?.addEventListener("click", () => {
    currentPage = 1;
    renderPaginatedTable();
  });
document
  .querySelector('[data-testid="page-prev"]')
  ?.addEventListener("click", () => {
    currentPage--;
    renderPaginatedTable();
  });
document
  .querySelector('[data-testid="page-next"]')
  ?.addEventListener("click", () => {
    currentPage++;
    renderPaginatedTable();
  });
document
  .querySelector('[data-testid="page-last"]')
  ?.addEventListener("click", () => {
    currentPage = Math.ceil(products.length / pageSize);
    renderPaginatedTable();
  });

document.getElementById("page-size")?.addEventListener("change", function () {
  pageSize = parseInt(this.value);
  currentPage = 1;
  renderPaginatedTable();
});

// ========== MODALS ==========

function openModal(modalId) {
  document.getElementById(modalId)?.classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove("active");
}

function openDynamicModal(type) {
  const modal = document.getElementById("dynamic-modal");
  const content = document.getElementById("dynamic-modal-content");

  const configs = {
    success: {
      icon: "✅",
      title: "Успех!",
      message: "Операция выполнена успешно.",
      class: "success",
    },
    error: {
      icon: "❌",
      title: "Ошибка!",
      message: "Что-то пошло не так.",
      class: "danger",
    },
    warning: {
      icon: "⚠️",
      title: "Внимание!",
      message: "Пожалуйста, обратите внимание.",
      class: "warning",
    },
  };

  const config = configs[type];
  content.innerHTML = `
        <div class="modal-header">
            <h3>${config.icon} ${config.title}</h3>
            <button class="modal-close" onclick="closeModal('dynamic-modal')">✕</button>
        </div>
        <div class="modal-body">
            <p>${config.message}</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-${config.class}" onclick="closeModal('dynamic-modal')">Закрыть</button>
        </div>
    `;

  modal.classList.add("active");
}

// Close modal on backdrop click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("active");
    }
  });
});

// ========== DRAG & DROP ==========

// Simple Drag & Drop
const dndItems = document.querySelectorAll(".dnd-item");
const dndLists = document.querySelectorAll(".dnd-list");

dndItems.forEach((item) => {
  item.addEventListener("dragstart", function () {
    this.classList.add("dragging");
  });

  item.addEventListener("dragend", function () {
    this.classList.remove("dragging");
  });
});

dndLists.forEach((list) => {
  list.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("drag-over");
  });

  list.addEventListener("dragleave", function () {
    this.classList.remove("drag-over");
  });

  list.addEventListener("drop", function (e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    const dragging = document.querySelector(".dnd-item.dragging");
    if (dragging) this.appendChild(dragging);
  });
});

// Sortable List
const sortableList = document.getElementById("sortable-list");
if (sortableList) {
  let draggedItem = null;

  sortableList.querySelectorAll(".sortable-item").forEach((item) => {
    item.addEventListener("dragstart", function () {
      draggedItem = this;
      this.classList.add("dragging");
    });

    item.addEventListener("dragend", function () {
      draggedItem = null;
      this.classList.remove("dragging");
    });

    item.addEventListener("dragover", function (e) {
      e.preventDefault();
      if (this !== draggedItem) {
        const rect = this.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          sortableList.insertBefore(draggedItem, this);
        } else {
          sortableList.insertBefore(draggedItem, this.nextSibling);
        }
      }
    });
  });
}

// Kanban Board
const kanbanCards = document.querySelectorAll(".kanban-card");
const kanbanColumns = document.querySelectorAll(".kanban-items");

kanbanCards.forEach((card) => {
  card.addEventListener("dragstart", function () {
    this.classList.add("dragging");
  });

  card.addEventListener("dragend", function () {
    this.classList.remove("dragging");
  });
});

kanbanColumns.forEach((column) => {
  column.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  column.addEventListener("drop", function (e) {
    e.preventDefault();
    const dragging = document.querySelector(".kanban-card.dragging");
    if (dragging) this.appendChild(dragging);
  });
});

// ========== DYNAMIC CONTENT ==========

function showDelayedElements() {
  const container = document.getElementById("delayed-container");
  container.classList.add("hidden");
  setTimeout(() => {
    container.classList.remove("hidden");
  }, 2000);
}

function loadAjaxData() {
  const loader = document.getElementById("ajax-loader");
  const data = document.getElementById("ajax-data");

  loader.classList.remove("hidden");
  data.classList.add("hidden");

  setTimeout(() => {
    loader.classList.add("hidden");
    data.classList.remove("hidden");
    data.innerHTML = `
            <h4>📊 Загруженные данные:</h4>
            <ul>
                <li>Пользователь: Иван Петров</li>
                <li>Email: ivan@example.com</li>
                <li>Роль: Администратор</li>
                <li>Дата регистрации: ${new Date().toLocaleDateString()}</li>
            </ul>
        `;
  }, 3000);
}

// Infinite Scroll
let scrollItemCount = 5;
const scrollContainer = document.getElementById("infinite-scroll");

scrollContainer?.addEventListener("scroll", function () {
  if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
    loadMoreItems();
  }
});

function loadMoreItems() {
  if (scrollItemCount >= 50) return;

  for (let i = 0; i < 5; i++) {
    scrollItemCount++;
    const item = document.createElement("div");
    item.className = "scroll-item";
    item.textContent = `📄 Элемент ${scrollItemCount}`;
    scrollContainer.appendChild(item);
  }

  document.getElementById(
    "scroll-count"
  ).textContent = `Загружено: ${scrollItemCount} элементов`;
}

// ========== ALERTS ==========

function showAlert() {
  alert("Это простой alert! 🎉");
  showAlertResult("Alert был показан");
}

function showConfirm() {
  const result = confirm("Вы уверены? Нажмите OK или Cancel");
  showAlertResult(`Confirm результат: ${result ? "OK" : "Cancel"}`);
}

function showPrompt() {
  const result = prompt("Введите ваше имя:", "Гость");
  showAlertResult(`Prompt результат: ${result || "Отменено"}`);
}

function showAlertResult(text) {
  const result = document.getElementById("alert-result");
  result.classList.remove("hidden");
  result.textContent = text;
}

// ========== FORM CONTROLS ==========

// Checkboxes
function toggleAllCheckboxes() {
  const selectAll = document.getElementById("cb-all");
  document.querySelectorAll(".skill-cb").forEach((cb) => {
    cb.checked = selectAll.checked;
  });
}

function showSelectedSkills() {
  const skills = Array.from(document.querySelectorAll(".skill-cb:checked")).map(
    (cb) => cb.nextElementSibling?.textContent || cb.dataset.testid
  );

  const result = document.getElementById("skills-result");
  result.classList.remove("hidden");
  result.textContent = skills.length
    ? `Выбрано: ${skills.join(", ")}`
    : "Ничего не выбрано";
}

// Radio Buttons
function showSelectedRadios() {
  const payment =
    document.querySelector('input[name="payment"]:checked')?.value ||
    "не выбрано";
  const plan =
    document.querySelector('input[name="plan"]:checked')?.value || "не выбрано";

  const result = document.getElementById("radio-result");
  result.classList.remove("hidden");
  result.innerHTML = `Оплата: ${payment}<br>План: ${plan}`;
}

// Dropdowns
function showSelectedDropdowns() {
  const country =
    document.getElementById("select-country")?.value || "не выбрано";
  const tool = document.getElementById("select-tool")?.value || "не выбрано";
  const languages = Array.from(
    document.getElementById("select-multi")?.selectedOptions || []
  ).map((opt) => opt.value);

  const result = document.getElementById("select-result");
  result.classList.remove("hidden");
  result.innerHTML = `Страна: ${country}<br>Инструмент: ${tool}<br>Языки: ${
    languages.join(", ") || "не выбрано"
  }`;
}

// Sliders
function updateSlider(type) {
  const slider = document.getElementById(`slider-${type}`);
  const value = slider.value;

  if (type === "temp") {
    document.getElementById("temp-value").textContent = value;
  } else {
    document.getElementById(`${type}-value`).textContent = value;
  }
}

// Progress Animation
function startProgress() {
  const progress = document.getElementById("animated-progress");
  const text = document.getElementById("progress-text");
  let width = 0;

  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      width++;
      progress.style.width = width + "%";
      text.textContent = `Анимированный прогресс: ${width}%`;
    }
  }, 50);
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
}

// Color Picker
document.getElementById("color-picker")?.addEventListener("input", function () {
  document.getElementById("color-value").textContent = this.value;
});

// ========== ADVANCED ==========

// Context Menu
const contextArea = document.getElementById("context-area");
const contextMenu = document.getElementById("context-menu");

contextArea?.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  contextMenu.style.left = e.pageX + "px";
  contextMenu.style.top = e.pageY + "px";
  contextMenu.classList.remove("hidden");
});

document.addEventListener("click", function () {
  contextMenu?.classList.add("hidden");
});

function contextAction(action) {
  const result = document.getElementById("context-result");
  result.classList.remove("hidden");
  result.textContent = `Действие: ${action}`;
  contextMenu.classList.add("hidden");
}

// New Window/Tab
function openNewTab() {
  window.open("new-tab.html", "_blank");
}

function openNewWindow() {
  window.open("new-tab.html", "_blank", "width=400,height=300");
}

// Keyboard Events
document.addEventListener("keydown", function (e) {
  const result = document.getElementById("keyboard-result");

  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    result.classList.remove("hidden");
    result.textContent = "💾 Ctrl+S: Сохранено!";
  }

  if (e.ctrlKey && e.key === "Enter") {
    result.classList.remove("hidden");
    result.textContent = "📤 Ctrl+Enter: Отправлено!";
  }

  if (e.key === "Escape") {
    result.classList.remove("hidden");
    result.textContent = "❌ Escape: Закрыто!";
    document
      .querySelectorAll(".modal.active")
      .forEach((m) => m.classList.remove("active"));
  }
});

// ========== UI COMPONENTS ==========

// Accordion
function toggleAccordion(button) {
  const item = button.parentElement;
  item.classList.toggle("active");
}

// Tabs
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-pane")
    .forEach((pane) => pane.classList.remove("active"));

  document
    .querySelector(`[data-testid="tab-${tabId === "js" ? "js" : tabId}"]`)
    ?.classList.add("active");
  document.getElementById(`tab-${tabId}`)?.classList.add("active");
}

// Carousel
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");

function updateCarousel() {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
  document.getElementById("carousel-info").textContent = `Слайд ${
    currentSlide + 1
  } из ${slides.length}`;
}

function changeSlide(direction) {
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

// Autocomplete
const languages = [
  "Python",
  "JavaScript",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "TypeScript",
  "PHP",
  "Scala",
  "R",
  "Perl",
];

function handleAutocomplete() {
  const input = document.getElementById("autocomplete-input");
  const list = document.getElementById("autocomplete-list");
  const value = input.value.toLowerCase();

  if (!value) {
    list.classList.add("hidden");
    return;
  }

  const matches = languages.filter((lang) =>
    lang.toLowerCase().includes(value)
  );

  if (matches.length) {
    list.innerHTML = matches
      .map(
        (lang) =>
          `<div class="autocomplete-item" onclick="selectAutocomplete('${lang}')">${lang}</div>`
      )
      .join("");
    list.classList.remove("hidden");
  } else {
    list.classList.add("hidden");
  }
}

function selectAutocomplete(value) {
  document.getElementById("autocomplete-input").value = value;
  document.getElementById("autocomplete-list").classList.add("hidden");
}

// Rating
let currentRating = 0;

function setRating(value) {
  currentRating = value;
  const stars = document.querySelectorAll(".star");
  stars.forEach((star, i) => {
    star.textContent = i < value ? "★" : "☆";
    star.classList.toggle("active", i < value);
  });
  document.getElementById("rating-value").textContent = `${value}/5`;
}

// OTP Input
function handleOTP(input, index) {
  if (input.value.length === 1 && index < 6) {
    const next = document.querySelector(`[data-testid="otp-${index + 1}"]`);
    if (next) next.focus();
  }

  // Check if all filled
  const inputs = document.querySelectorAll(".otp-input");
  const code = Array.from(inputs)
    .map((i) => i.value)
    .join("");

  if (code.length === 6) {
    const result = document.getElementById("otp-result");
    result.classList.remove("hidden");
    result.textContent = `✅ Код введен: ${code}`;
  }
}

// Double Click
let dblClickCount = 0;
document
  .getElementById("dblclick-area")
  ?.addEventListener("dblclick", function () {
    dblClickCount++;
    document.getElementById(
      "dblclick-count"
    ).textContent = `Двойных кликов: ${dblClickCount}`;
    this.style.background = `hsl(${dblClickCount * 30}, 50%, 30%)`;
  });

// Copy to Clipboard
function copyToClipboard() {
  const text = document.getElementById("copy-text").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const result = document.getElementById("copy-result");
    result.classList.remove("hidden");
    result.textContent = "✅ Скопировано в буфер обмена!";
    setTimeout(() => result.classList.add("hidden"), 2000);
  });
}

// Shadow DOM
const shadowHost = document.getElementById("shadow-host");
if (shadowHost) {
  const shadow = shadowHost.attachShadow({ mode: "open" });
  shadow.innerHTML = `
        <style>
            .shadow-container {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                padding: 1.5rem;
                border-radius: 12px;
                border: 1px solid #475569;
            }
            h3 { color: #f1f5f9; margin-bottom: 0.5rem; }
            p { color: #94a3b8; margin-bottom: 1rem; }
            button {
                background: #6366f1;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
            }
            button:hover { background: #4f46e5; }
            .count { color: #94a3b8; margin-top: 0.5rem; }
        </style>
        <div class="shadow-container">
            <h3>🔒 Shadow DOM Element</h3>
            <p>Этот элемент находится внутри Shadow DOM</p>
            <button id="shadow-btn">Кликни на меня!</button>
            <div class="count">Кликов: <span id="shadow-count">0</span></div>
        </div>
    `;

  let shadowClicks = 0;
  shadow.getElementById("shadow-btn").addEventListener("click", function () {
    shadowClicks++;
    shadow.getElementById("shadow-count").textContent = shadowClicks;
  });
}

// Date Picker
function showSelectedDates() {
  const date = document.getElementById("date-input")?.value || "не выбрано";
  const datetime =
    document.getElementById("datetime-input")?.value || "не выбрано";
  const time = document.getElementById("time-input")?.value || "не выбрано";

  const result = document.getElementById("date-result");
  result.classList.remove("hidden");
  result.innerHTML = `Дата: ${date}<br>Дата и время: ${datetime}<br>Время: ${time}`;
}

// ========== SPECIAL SCENARIOS (inspired by the-internet.herokuapp.com) ==========

// A/B Testing - random content
function initABTest() {
  const container = document.getElementById("ab-test-container");
  if (!container) return;

  const variant = Math.random() > 0.5 ? "A" : "B";

  if (variant === "A") {
    container.className = "ab-container ab-variant-a";
    container.innerHTML = `
            <h4 data-testid="ab-heading">🅰️ Вариант A</h4>
            <p data-testid="ab-text">Вы видите контент варианта A. Обновите страницу для другого варианта.</p>
            <p>Это используется для A/B тестирования в реальных приложениях.</p>
        `;
  } else {
    container.className = "ab-container ab-variant-b";
    container.innerHTML = `
            <h4 data-testid="ab-heading">🅱️ Вариант B</h4>
            <p data-testid="ab-text">Вы видите контент варианта B. Обновите страницу для другого варианта.</p>
            <p>A/B тестирование помогает определить лучший вариант интерфейса.</p>
        `;
  }
}

// Form Authentication (Login)
document.getElementById("login-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const flash = document.getElementById("login-flash");

  if (username === "admin" && password === "admin123") {
    flash.className = "flash-message success";
    flash.innerHTML = "✅ Вы успешно вошли в систему!";
  } else {
    flash.className = "flash-message error";
    flash.innerHTML =
      "❌ Неверные учетные данные. Попробуйте: admin / admin123";
  }
  flash.classList.remove("hidden");
});

// Challenging DOM - shuffling IDs
function shuffleChallengingDOM() {
  const buttons = document.querySelectorAll('[data-testid^="challenge-btn"]');
  const randomIds = [
    "btn-" + Math.random().toString(36).substr(2, 5),
    "btn-" + Math.random().toString(36).substr(2, 5),
    "btn-" + Math.random().toString(36).substr(2, 5),
  ];

  buttons.forEach((btn, i) => {
    btn.id = randomIds[i];
    btn.className = `btn btn-${
      ["primary", "success", "warning", "danger", "info"][
        Math.floor(Math.random() * 5)
      ]
    }`;
  });

  document.getElementById(
    "challenge-info"
  ).textContent = `ID изменились! Новые ID: ${randomIds.join(", ")}`;
}

function initChallengingTable() {
  const tbody = document.getElementById("challenge-tbody");
  if (!tbody) return;

  const data = [
    ["Iuvaret", "Apeirian", "Adipisci", "Definiebas", "Consequuntur"],
    ["Sit", "Moved", "Ferri", "Modus", "Repudiandae"],
    ["Incorruptae", "Phaedrum", "Ancillae", "Tamquam", "Voluptates"],
  ];

  tbody.innerHTML = data
    .map(
      (row, i) => `
        <tr>
            ${row.map((cell) => `<td>${cell}</td>`).join("")}
            <td>
                <a href="#" onclick="return false" data-testid="edit-row-${i}">edit</a>
                <a href="#" onclick="return false" data-testid="delete-row-${i}">delete</a>
            </td>
        </tr>
    `
    )
    .join("");
}

// Disappearing Elements
function initDisappearingElements() {
  const nav = document.getElementById("disappearing-nav");
  if (!nav) return;

  const items = ["Home", "About", "Contact Us", "Portfolio", "Gallery"];
  const shouldShow = items.map(() => Math.random() > 0.3);

  nav.innerHTML = items
    .filter((_, i) => shouldShow[i])
    .map(
      (item) =>
        `<a href="#" data-testid="nav-${item
          .toLowerCase()
          .replace(" ", "-")}">${item}</a>`
    )
    .join("");
}

// Entry Ad
function showEntryAd() {
  openModal("entry-ad-modal");
}

// Exit Intent
function showExitIntent() {
  openModal("exit-intent-modal");
}

// Exit Intent on mouse leave (optional - triggered on mouseleave from document)
document.addEventListener("mouseleave", function (e) {
  if (e.clientY < 0 && !sessionStorage.getItem("exitIntentShown")) {
    // Uncomment to enable auto exit intent:
    // showExitIntent();
    // sessionStorage.setItem('exitIntentShown', 'true');
  }
});

// Floating Menu
function toggleFloatingMenu() {
  document.getElementById("floating-menu")?.classList.toggle("hidden");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Geolocation
function getGeolocation() {
  const result = document.getElementById("geo-result");
  result.classList.remove("hidden");

  if (!navigator.geolocation) {
    result.innerHTML = "❌ Геолокация не поддерживается браузером";
    return;
  }

  result.innerHTML = "⏳ Получение координат...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      result.innerHTML = `
                📍 <strong>Координаты получены:</strong><br>
                Широта: ${position.coords.latitude}<br>
                Долгота: ${position.coords.longitude}<br>
                Точность: ${position.coords.accuracy}м
            `;
    },
    (error) => {
      result.innerHTML = `❌ Ошибка: ${error.message}`;
    }
  );
}

// Toast Notifications
function showToast(type) {
  const container = document.getElementById("toast-container");

  const messages = {
    success: [
      "✓ Действие успешно выполнено!",
      "✓ Изменения сохранены!",
      "✓ Операция завершена!",
    ],
    error: [
      "✕ Произошла ошибка!",
      "✕ Действие не удалось!",
      "✕ Что-то пошло не так!",
    ],
    info: [
      "ℹ Обратите внимание",
      "ℹ Новое сообщение",
      "ℹ Информация обновлена",
    ],
    warning: ["⚠ Внимание!", "⚠ Будьте осторожны!", "⚠ Требуется проверка"],
  };

  if (type === "random") {
    type = ["success", "error", "info", "warning"][
      Math.floor(Math.random() * 4)
    ];
  }

  const messageList = messages[type] || messages.info;
  const message = messageList[Math.floor(Math.random() * messageList.length)];

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("data-testid", `toast-message-${Date.now()}`);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Status Codes
function showStatusCode(code) {
  const result = document.getElementById("status-result");
  result.classList.remove("hidden");

  const statuses = {
    200: { text: "OK - Запрос выполнен успешно", class: "success" },
    301: {
      text: "Moved Permanently - Ресурс перемещён на новый URL",
      class: "",
    },
    404: { text: "Not Found - Ресурс не найден", class: "" },
    500: {
      text: "Internal Server Error - Внутренняя ошибка сервера",
      class: "error",
    },
  };

  const status = statuses[code];
  result.className = `result-box ${status.class}`;
  result.innerHTML = `<strong>HTTP ${code}</strong>: ${status.text}`;
}

// Typos
function initTypos() {
  const paragraph = document.getElementById("typo-paragraph");
  if (!paragraph) return;

  const texts = [
    "Sometmies you'll see a typo, other times you won't.", // typo: Sometmies
    "Sometimes you'll see a typo, other times you wont.", // typo: wont
    "Sometimes you'll see a typo, other times you won't.", // correct
    "Somtimes you'll see a typo, other times you won't.", // typo: Somtimes
  ];

  paragraph.textContent = texts[Math.floor(Math.random() * texts.length)];
}

// ========== INITIALIZATION ==========

document.addEventListener("DOMContentLoaded", function () {
  renderPaginatedTable();
  initABTest();
  initChallengingTable();
  initDisappearingElements();
  initTypos();
  shuffleChallengingDOM();

  console.log("🧪 QA Sandbox loaded successfully!");
  console.log("📚 Inspired by: the-internet.herokuapp.com & aqa-proka4.org");
});
