export function addTask(taskObj, taskList) {
  const li = document.createElement("li");
  li.textContent = `${taskObj.task} ${taskObj.time ? " @ " + taskObj.time : ""}`;
  taskList.appendChild(li);

  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(saved));
}

export function listTasks(taskList) {
  taskList.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach(t => addTask(t, taskList));
}

export function clearTasks(taskList) {
  localStorage.removeItem("tasks");
  taskList.innerHTML = "";
}
