const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const darkModeToggle = document.getElementById("darkModeToggle");

document.addEventListener("DOMContentLoaded", loadTasks);

addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    addTaskToDOM(taskText, false, dueDate);
    saveTaskToLocalStorage(taskText, false, dueDate);

    taskInput.value = "";
    dueDateInput.value = "";
});

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

function addTaskToDOM(text, completed, dueDate) {
    const listItem = document.createElement("li");
    if (completed) listItem.classList.add("completed");

    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = `${text} ${dueDate ? `(Due: ${dueDate})` : ""}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        taskList.removeChild(listItem);
        removeTaskFromLocalStorage(text);
    });

    const toggleComplete = document.createElement("button");
    toggleComplete.textContent = completed ? "Undo" : "Done";
    toggleComplete.style.marginRight = "10px";
    toggleComplete.addEventListener("click", () => {
        listItem.classList.toggle("completed");
        toggleComplete.textContent = listItem.classList.contains("completed") ? "Undo" : "Done";
        updateTaskStatusInLocalStorage(text, listItem.classList.contains("completed"));
    });

    listItem.innerHTML = '';
    listItem.appendChild(toggleComplete);
    listItem.appendChild(taskTextSpan);
    listItem.appendChild(deleteBtn);
    taskList.appendChild(listItem);
}

function saveTaskToLocalStorage(text, completed, dueDate) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text, completed, dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(text) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskStatusInLocalStorage(text, completed) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task =>
        task.text === text ? { ...task, completed } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed, task.dueDate);
    });
}
