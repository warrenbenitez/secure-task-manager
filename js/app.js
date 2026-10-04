const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

function createButton(className, label) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = createButton("complete-btn", "Complete");
  const editBtn = createButton("edit-btn", "Edit");
  const removeBtn = createButton("remove-btn", "Remove");

  taskItem.appendChild(textSpan);
  taskItem.appendChild(completeBtn);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(removeBtn);

  return taskItem;
}

function generateTaskId() {
  taskCounter++;
  return "task-" + taskCounter;
}

function showMessage(message) {
  taskMessage.textContent = message;
}

function addTask(taskText) {
  const cleanText = taskText.trim();

  if (cleanText === "") {
    showMessage("Task cannot be empty");
    return;
  }

  const taskId = generateTaskId();
  const taskItem = createTaskElement(cleanText, taskId);
  taskList.appendChild(taskItem);

  taskInput.value = "";
  showMessage("");
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  taskItem.replaceChild(editInput, textSpan);
  editBtn.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  const newText = editInput.value.trim();

  if (newText === "") {
    showMessage("Task cannot be empty");
    return;
  }

  const newSpan = document.createElement("span");
  newSpan.classList.add("task-text");
  newSpan.textContent = newText;

  taskItem.replaceChild(newSpan, editInput);
  editBtn.textContent = "Edit";
  showMessage("");
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const allTasks = taskList.querySelectorAll(".task-item");
  const pendingTasks = taskList.querySelectorAll('.task-item[data-state="pending"]');
  const completedTasks = taskList.querySelectorAll('.task-item[data-state="completed"]');

  totalCount.textContent = allTasks.length;
  pendingCount.textContent = pendingTasks.length;
  completedCount.textContent = completedTasks.length;
}

function handleTaskListClick(event) {
  const clicked = event.target;
  const taskItem = clicked.closest(".task-item");

  if (!taskItem) {
    return;
  }

  if (clicked.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (clicked.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (clicked.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();

  samples.forEach(function (text) {
    const taskItem = createTaskElement(text, generateTaskId());
    fragment.appendChild(taskItem);
  });

  taskList.appendChild(fragment);
  updateTaskCounts();
}

taskList.addEventListener("click", handleTaskListClick);

addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();