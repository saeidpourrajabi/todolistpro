const inputText = document.querySelector(".input-text");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-ul");
const selected = document.querySelector(".selected");
const backdrop = document.querySelector(".backdrop");
const inputUpdateTodo = document.querySelector("#edit-todo");
const btnUpdate = document.querySelector("#update-todo");

let filterValue = "all";
let todoToEditId;

//events

btnUpdate.addEventListener("click", updateTodo);

document.addEventListener("DOMContentLoaded", () => {
  const todos = getAllTodos();
  creatTodos(todos);
});

todoForm.addEventListener("submit", addNewTodo);

selected.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

//functions

function addNewTodo(e) {
  e.preventDefault();

  if (!inputText.value) return alert("لطفا عنوان خود را وارد کنید !");
  let newTodo = {
    id: Date.now(),
    cratedAt: new Date().toISOString(),
    title: inputText.value,
    isCompleted: false,
  };

  saveTodo(newTodo);
  filterTodos();
}

function creatTodos(todos) {
  let result = [];
  todos.forEach((todo) => {
    result += `<li class="todo-li"><p class="text-input ${
      todo.isCompleted && "completed"
    }">${todo.title}</p>
    <p class="date-creat">${new Date(todo.cratedAt).toLocaleDateString(
      "fa-ir"
    )}</p>
      
      <button data-id=${todo.id} class="btn btn-hazf">🗑️✕</button>
      <button data-id=${todo.id} class="btn btn-complet">✅✓</button>
      <button data-id=${todo.id} class="btn btn-edit">📝</button>
      </li>`;
  });

  todoList.innerHTML = result;
  inputText.value = "";

  const btnRemove = [...document.querySelectorAll(".btn-hazf")];
  btnRemove.forEach((btn) => {
    btn.addEventListener("click", removetodo);
  });
  const btnCheck = [...document.querySelectorAll(".btn-complet")];
  btnCheck.forEach((btn) => {
    btn.addEventListener("click", checkTodo);
  });
  const edit = [...document.querySelectorAll(".btn-edit")];
  edit.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      backdrop.classList.remove("hidden");
      todoToEditId = Number(e.target.dataset.id);
      const todo = todos.find((t) => t.id === todoToEditId);
      const titleTodo = todo.title;
      inputUpdateTodo.value = titleTodo;
    });
  });

  const btnClose = [...document.querySelectorAll(".close-modal")];
  btnClose.forEach((btn) => {
    btn.addEventListener("click", () => {
      backdrop.classList.add("hidden");
    });
  });
}

function filterTodos() {
  const todos = getAllTodos();

  switch (filterValue) {
    case "all": {
      creatTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      creatTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      creatTodos(filteredTodos);
      break;
    }
    default:
      creatTodos(todos);
  }
}

function removetodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.id);
  todos = todos.filter((t) => t.id !== todoId);
  saveAlltodos(todos);
  filterTodos();
}

function checkTodo(e) {
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.id);
  const todosComp = todos.find((t) => t.id === todoId);
  todosComp.isCompleted = !todosComp.isCompleted;
  saveAlltodos(todos);
  filterTodos();
}

function updateTodo() {
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoToEditId);
  if (inputUpdateTodo.value === "")
    return alert("لطفا عنوان خود را ویرایش کنید !");

  todo.title = inputUpdateTodo.value;
  saveAlltodos(todos);
  filterTodos();
}

// local Storage

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAlltodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
