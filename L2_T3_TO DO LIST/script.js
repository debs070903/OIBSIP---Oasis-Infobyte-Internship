document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.querySelector(".todo-input");
  const addButton = document.querySelector(".add-button");
  const todosContainer = document.querySelector(".todos");
  const filters = document.querySelectorAll(".filter");
  const deleteAllButton = document.querySelector(".delete-all");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  addButton.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });
  filters.forEach((filter) => filter.addEventListener("click", filterTodos));
  deleteAllButton.addEventListener("click", deleteAllTodos);

  function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
      const todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
      };
      todos.push(todo);
      saveTodos();
      renderTodos(todos);
      todoInput.value = "";
    }
  }

  function renderTodos(filteredTodos) {
    todosContainer.innerHTML = "";
    filteredTodos.forEach((todo) => {
      const todoElement = document.createElement("li");
      todoElement.classList.add("todo");
      if (todo.completed) {
        todoElement.classList.add("completed");
      }
      todoElement.innerHTML = `
          <span class="todo-text">${todo.text}</span>
          <button class="complete-button"><i class="fa fa-check-circle"></i></button>
          <button class="delete-button"><i class="fa fa-trash"></i></button>
        `;
      todosContainer.appendChild(todoElement);

      const completeButton = todoElement.querySelector(".complete-button");
      completeButton.addEventListener("click", () => toggleComplete(todo.id));

      const deleteButton = todoElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));
    });
  }

  function toggleComplete(id) {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    saveTodos();
    renderTodos(todos);
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos(todos);
  }

  function filterTodos(e) {
    const filter = e.target.getAttribute("data-filter");
    if (filter === "completed") {
      renderTodos(todos.filter((todo) => todo.completed));
    } else if (filter === "pending") {
      renderTodos(todos.filter((todo) => !todo.completed));
    } else {
      renderTodos(todos);
    }
  }

  function deleteAllTodos() {
    todos = [];
    saveTodos();
    renderTodos(todos);
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  renderTodos(todos);
});
