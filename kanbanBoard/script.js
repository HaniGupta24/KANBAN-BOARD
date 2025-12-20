let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];

let dragElement = null;

/* ---------- LOAD FROM LOCAL STORAGE ---------- */
function addTask(title, desc, column) {
    const div = document.createElement("div");
    div.classList.add("task");  
    div.setAttribute("draggable", "true");
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    column.appendChild(div);

    div.addEventListener("dragstart", () => {
        dragElement = div;
    });
const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
    });
        return div;
}

function updateTaskCount() {
    columns.forEach(col => {
        const tasksInCol = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        if (count) count.innerText = tasksInCol.length;

        tasksData[col.id] = Array.from(tasksInCol).map(t => ({
            title: t.querySelector("h2").innerText,
            desc: t.querySelector("p").innerText
        }));
    });

    localStorage.setItem("tasksIncol", JSON.stringify(tasksData));
}

if (localStorage.getItem("tasksIncol")) {
    tasksData = JSON.parse(localStorage.getItem("tasksIncol"));

    for (const col in tasksData) {
        const column = document.querySelector(`#${col}`); // ✅ FIX
        tasksData[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });
    }
    updateTaskCount();
}

/* ---------- COLUMN DRAG EVENTS ---------- */
function addDragEvemtsOnColumn(column) {
    column.addEventListener("dragenter", e => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", e => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", e => {
        e.preventDefault();
    });

    column.addEventListener("drop", e => {
        e.preventDefault();
        if (!dragElement) return;

        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateTaskCount();
    });
}

addDragEvemtsOnColumn(todo);
addDragEvemtsOnColumn(progress);
addDragEvemtsOnColumn(done);

/* ---------- MODAL CODE ---------- */
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

/* ---------- ADD TASK ---------- */
addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    const div = addTask(taskTitle, taskDesc, todo); // ✅ FIX
    updateTaskCount();

    div.addEventListener("dragstart", () => { // ✅ FIX
        dragElement = div;
    });

    modal.classList.remove("active");
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
}); 
const themeToggle = document.querySelector("#theme-toggle");

/* Load saved theme */
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.innerText = "🌙 Dark";
} else {
    themeToggle.innerText = "☀️ Light";
}

/* Toggle theme */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        themeToggle.innerText = "🌙 Dark";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.innerText = "☀️ Light";
    }
});
