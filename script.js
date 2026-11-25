[25.11.2026 17:47] 𝙰𝚔𝚖𝚊𝚕𝚘𝚟: const content = document.getElementById("content");

const toastElement = document.getElementById("toast");

let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let selectedMinutes = 25;

// Уведомление
function toast(message) {
    toastElement.textContent = message;
    toastElement.classList.add("show");

    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 2500);
}

// Безопасное отображение текста
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
        const symbols = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return symbols[character];
    });
}

// Дата
document.getElementById("today").textContent =
    new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    }).format(new Date());

// Создание карточки
function card(icon, title, description, page) {
    return 
        <div class="card">
            <div class="card-icon">${icon}</div>

            <h3>${title}</h3>

            <p>${description}</p>

            <a class="card-link" href="#${page}">
                Открыть раздел →
            </a>
        </div>
    ;
}

// Задачи
function getTasks() {
    return JSON.parse(localStorage.getItem("gh_tasks") || "[]");
}

function saveTasks(tasks) {
    localStorage.setItem("gh_tasks", JSON.stringify(tasks));
}

// Заметки
function getNotes() {
    return JSON.parse(localStorage.getItem("gh_notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("gh_notes", JSON.stringify(notes));
}

// Главная
function homePage() {
    return `
        <section class="page">

            <div class="hero">

                <div class="eyebrow">
                    ТВОЯ ТОЧКА СТАРТА ✨
                </div>

                <h1>
                    Делай день<br>
                    чуть лучше.
                </h1>

                <p>
                    Учись, планируй, развивайся и помогай другим.
                    Все полезные инструменты — в одном пространстве.
                </p>

                <a href="#tasks" class="btn">
                    Начать с задач →
                </a>

                <div class="hero-stats">

                    <div>
                        <strong id="homeTasks">0</strong>
                        <small>задач выполнено</small>
                    </div>

                    <div>
                        <strong id="homeNotes">0</strong>
                        <small>заметок сохранено</small>
                    </div>

                    <div>
                        <strong>∞</strong>
                        <small>возможностей</small>
                    </div>

                </div>

            </div>

            <div class="section-head">
                <h2>Твоё пространство</h2>
                <p>Выбери полезный раздел</p>
            </div>

            <div class="cards">

                ${card("📚", "Учёба",
                    "Разбирайся в сложных темах.",
                    "study")}

                ${card("✅", "Мои задачи",
                    "Планируй день и достигай целей.",
                    "tasks")}

                ${card("⏳", "Фокус",
                    "Сосредоточься на важных делах.",
                    "focus")}

                ${card("📝", "Заметки",
                    "Сохраняй мысли и идеи.",
                    "notes")}

                ${card("⚡", "Инструменты",
                    "Используй полезные помощники.",
                    "tools")}

                ${card("💚", "Добрые дела",
                    "Делай окружающий мир лучше.",
                    "kindness")}

            </div>

            <div class="section-head">
                <h2>Мысль дня</h2>
            </div>

            <div class="card quote">
                Не обязательно менять весь мир
                за один день.
                Иногда достаточно помочь одному человеку.
            </div>
[25.11.2026 17:47] 𝙰𝚔𝚖𝚊𝚕𝚘𝚟: </section>
    ;
}

// Учёба
function studyPage() {
    return 
        <section class="page">

            <div class="section-head">
                <h2>Учёба без стресса 📚</h2>
                <p>Развивай знания каждый день.</p>
            </div>

            <div class="cards">

                ${card("🧠", "Объяснение темы",
                    "Объясни сложную тему простыми словами.",
                    "study")}

                ${card("✍️", "Повторение",
                    "Повторяй материал небольшими частями.",
                    "study")}

                ${card("🎯", "Учебная цель",
                    "Поставь маленькую цель на сегодня.",
                    "study")}

            </div>

            <div class="section-head">
                <h2>Мой учебный план</h2>
            </div>

            <div class="card">

                <form id="studyForm">

                    <input
                        class="input"
                        id="subject"
                        placeholder="Предмет"
                        required
                    >

                    <br><br>

                    <input
                        class="input"
                        id="studyGoal"
                        placeholder="Что нужно изучить?"
                        required
                    >

                    <br><br>

                    <button class="btn">
                        Добавить в задачи
                    </button>

                </form>

            </div>

        </section>
    ;
}

// Страница задач
function tasksPage() {
    return 
        <section class="page">

            <div class="section-head">
                <h2>Мои задачи ✓</h2>
                <p>Каждый шаг приближает тебя к цели.</p>
            </div>

            <div class="card">

                <form id="taskForm">

                    <div class="form-row">

                        <input
                            class="input"
                            id="taskInput"
                            placeholder="Что нужно сделать?"
                            maxlength="180"
                            required
                        >

                        <button class="btn">
                            + Добавить
                        </button>

                    </div>

                </form>

                <div class="section-head">
                    <h2 id="taskProgress">0 из 0 выполнено</h2>
                </div>

                <div class="progress-track">
                    <div
                        class="progress-bar"
                        id="taskBar"
                        style="width:0"
                    ></div>
                </div>

                <div class="task-list" id="taskList"></div>

            </div>

        </section>
    ;
}

// Страница заметок
function notesPage() {
    return 
        <section class="page">

            <div class="section-head">
                <h2>Мои заметки 📝</h2>
                <p>Сохраняй свои идеи.</p>
            </div>

            <div class="card">

                <form id="noteForm">

                    <input
                        class="input"
                        id="noteTitle"
                        placeholder="Название заметки"
                        maxlength="90"
                        required
                    >

                    <br><br>

                    <textarea
                        class="textarea"
                        id="noteBody"
                        placeholder="Напиши свою заметку..."
                        required
                    ></textarea>

                    <br><br>

                    <button class="btn">
                        Сохранить
                    </button>

                </form>

            </div>

            <div class="note-grid" id="noteGrid"></div>

        </section>
    ;
}

// Фокус-таймер
function focusPage() {
    return 
        <section class="page">
[25.11.2026 17:47] 𝙰𝚔𝚖𝚊𝚕𝚘𝚟: <div class="section-head">
                <h2>Фокус-таймер ⏳</h2>
                <p>Работай спокойно и сосредоточенно.</p>
            </div>

            <div class="card timer-card">

                <div class="timer-ring" id="timerRing">

                    <div class="timer-inner">

                        <div>

                            <div
                                class="timer-number"
                                id="timerDisplay"
                            >
                                25:00
                            </div>

                            <p id="timerStatus">
                                Готов начать
                            </p>

                        </div>

                    </div>

                </div>

                <button class="btn secondary" data-min="5">
                    5 минут
                </button>

                <button class="btn secondary" data-min="15">
                    15 минут
                </button>

                <button class="btn secondary" data-min="25">
                    25 минут
                </button>

                <br><br>

                <button class="btn" id="timerStart">
                    ▶ Начать
                </button>

                <button class="btn secondary" id="timerReset">
                    ↺ Сброс
                </button>

            </div>

        </section>
    ;
}

// Инструменты
function toolsPage() {
    return 
        <section class="page">

            <div class="section-head">
                <h2>Полезные инструменты ⚡</h2>
                <p>Помощники для повседневной жизни.</p>
            </div>

            <div class="cards">

                <div class="card">

                    <div class="card-icon">🔢</div>

                    <h3>Калькулятор</h3>

                    <input
                        class="input"
                        id="calcInput"
                        placeholder="Например: 15 + 25"
                    >

                    <br><br>

                    <button class="btn small" id="calcBtn">
                        Рассчитать
                    </button>

                    <div
                        class="tool-output"
                        id="calcOutput"
                    ></div>

                </div>

                <div class="card">

                    <div class="card-icon">🔤</div>

                    <h3>Счётчик слов</h3>

                    <textarea
                        class="textarea"
                        id="wordInput"
                        placeholder="Вставь текст..."
                    ></textarea>

                    <div
                        class="tool-output"
                        id="wordOutput"
                    >
                        0 слов
                    </div>

                </div>

                <div class="card">

                    <div class="card-icon">💡</div>

                    <h3>Идея дня</h3>

                    <button class="btn small" id="ideaBtn">
                        Получить идею
                    </button>

                    <div
                        class="tool-output"
                        id="ideaOutput"
                    ></div>

                </div>

            </div>

        </section>
    ;
}

// Добрые дела
function kindnessPage() {
    return 
        <section class="page">

            <div class="hero">

                <div class="eyebrow">
                    ДОБРО — ЭТО ДЕЙСТВИЕ
                </div>

                <h1>
                    Сделай мир<br>
                    добрее. 💚
                </h1>

                <p>
                    Иногда простое внимание
                    значит больше, чем кажется.
                </p>

                <button class="btn" id="kindButton">
                    Получить доброе дело
                </button>

                <div
                    class="tool-output"
                    id="kindOutput"
                ></div>

            </div>
[25.11.2026 17:47] 𝙰𝚔𝚖𝚊𝚕𝚘𝚟: <div class="section-head">
                <h2>Идеи добрых дел</h2>
            </div>

            <div class="cards">

                ${card("💬", "Поддержи",
                    "Скажи человеку доброе слово.",
                    "kindness")}

                ${card("🌱", "Позаботься",
                    "Помоги ухаживать за растением.",
                    "kindness")}

                ${card("📖", "Поделись знаниями",
                    "Помоги кому-нибудь разобраться в теме.",
                    "kindness")}

                ${card("🙏", "Поблагодари",
                    "Скажи спасибо тому, кто тебе помог.",
                    "kindness")}

            </div>

        </section>
    ;
}

// О проекте
function aboutPage() {
    return 
        <section class="page">

            <div class="hero">

                <div class="eyebrow">
                    НАША ИДЕЯ
                </div>

                <h1>
                    Интернет<br>
                    может быть полезным.
                </h1>

                <p>
                    Goodly Hub — пространство,
                    созданное для учёбы,
                    развития и добрых дел.
                </p>

            </div>

            <div class="section-head">
                <h2>Наши принципы</h2>
            </div>

            <div class="cards">

                ${card("🌟", "Польза",
                    "Каждая функция помогает людям.",
                    "about")}

                ${card("🔒", "Приватность",
                    "Твои задачи и заметки сохраняются локально.",
                    "about")}

                ${card("📱", "Доступность",
                    "Сайт подходит для компьютеров и телефонов.",
                    "about")}

            </div>

            <div class="card">

                <h3>Будущее Goodly Hub</h3>

                <p>
                    В дальнейшем можно добавить настоящий
                    AI-помощник, регистрацию пользователей,
                    облачное сохранение и дополнительные
                    полезные разделы.
                </p>

            </div>

        </section>
    ;
}

// Переключение страниц
function renderPage() {
    const page = location.hash.replace("#", "") || "home";

    const pageFunctions = {
        home: homePage,
        study: studyPage,
        tasks: tasksPage,
        notes: notesPage,
        focus: focusPage,
        tools: toolsPage,
        kindness: kindnessPage,
        about: aboutPage
    };

    content.innerHTML =
        (pageFunctions[page] || homePage)();

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + page
        );
    });

    document.getElementById("sidebar").classList.remove("open");

    if (page === "tasks") renderTasks();
    if (page === "notes") renderNotes();
    if (page === "home") updateHome();
    if (page === "focus") updateTimer();
    if (page === "study") setupStudy();
    if (page === "tools") setupTools();
    if (page === "kindness") setupKindness();
}

// Отображение задач
function renderTasks() {
    const list = document.getElementById("taskList");
    if (!list) return;

    const tasks = getTasks();

    if (tasks.length === 0) {
        list.innerHTML =
            '<div class="empty">Пока задач нет. Добавь первую ✨</div>';
    } else {
        list.innerHTML = tasks.map((task, index) => 
            <div class="task-item ${task.done ? "done" : ""}">

                <input
                    type="checkbox"
                    data-task="${index}"
                    ${task.done ? "checked" : ""}
                >

                <span class="task-text">
                    ${escapeHTML(task.text)}
                </span>

                <button
                    class="delete-btn"
                    data-delete-task="${index}"
                >
                    ×
                </button>

            </div>
        `).join("");
    }
[25.11.2026 17:47] 𝙰𝚔𝚖𝚊𝚕𝚘𝚟: const completed = tasks.filter(task => task.done).length;

    document.getElementById("taskProgress").textContent =
        ${completed} из ${tasks.length} выполнено;

    document.getElementById("taskBar").style.width =
        tasks.length ? completed / tasks.length * 100 + "%" : "0%";
}

// Добавление задачи
content.addEventListener("submit", function(event) {

    if (event.target.id === "taskForm") {
        event.preventDefault();

        const input = document.getElementById("taskInput");
        const text = input.value.trim();

        if (!text) return;

        const tasks = getTasks();

        tasks.push({
            text: text,
            done: false
        });

        saveTasks(tasks);
        input.value = "";

        renderTasks();
        toast("Задача добавлена!");
    }

    if (event.target.id === "studyForm") {
        event.preventDefault();

        const subject = document.getElementById("subject").value;
        const goal = document.getElementById("studyGoal").value;

        const tasks = getTasks();

        tasks.push({
            text: subject + ": " + goal,
            done: false
        });

        saveTasks(tasks);

        toast("Учебная цель добавлена!");
        event.target.reset();
    }

    if (event.target.id === "noteForm") {
        event.preventDefault();

        const title = document.getElementById("noteTitle").value;
        const body = document.getElementById("noteBody").value;

        const notes = getNotes();

        notes.push({
            title: title,
            body: body
        });

        saveNotes(notes);

        renderNotes();

        event.target.reset();

        toast("Заметка сохранена!");
    }

});

// Выполнение и удаление задач
content.addEventListener("change", function(event) {

    if (event.target.dataset.task !== undefined) {
        const index = Number(event.target.dataset.task);
        const tasks = getTasks();

        tasks[index].done = event.target.checked;

        saveTasks(tasks);
        renderTasks();
    }

});

content.addEventListener("click", function(event) {

    const deleteIndex = event.target.dataset.deleteTask;

    if (deleteIndex !== undefined) {
        const tasks = getTasks();

        tasks.splice(Number(deleteIndex), 1);

        saveTasks(tasks);
        renderTasks();

        toast("Задача удалена");
    }

});

// Заметки
function renderNotes() {
    const grid = document.getElementById("noteGrid");
    if (!grid) return;

    const notes = getNotes();

    grid.innerHTML = notes.length
        ? notes.map((note, index) => 
            <div class="note">

                <button
                    class="delete-btn"
                    data-delete-note="${index}"
                >
                    ×
                </button>

                <h3>${escapeHTML(note.title)}</h3>

                <p>${escapeHTML(note.body)}</p>

            </div>
        ).join("")
        : '<div class="empty">Пока нет заметок</div>';
}

content.addEventListener("click", function(event) {

    const index = event.target.dataset.deleteNote;

    if (index !== undefined) {
        const notes = getNotes();

        notes.splice(Number(index), 1);

        saveNotes(notes);
        renderNotes();

        toast("Заметка удалена");
    }

});

// Статистика главной
function updateHome() {
    const tasks = getTasks();
    const notes = getNotes();

    const taskCount = document.getElementById("homeTasks");
    const noteCount = document.getElementById("homeNotes");

    if (taskCount) {
        taskCount.textContent =
            tasks.filter(task => task.done).length;
    }

    if (noteCount) {
        noteCount.textContent = notes.length;
    }
}