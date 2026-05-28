const todoListInput = document.querySelector(".todo-list-input");
const todoListBtn = document.querySelector(".todo-list-btn");
const todoListItems = document.querySelector(".todo-list-items");
const initItem = document.querySelector(".todo-list-item--empty");
const todoListForm = document.querySelector(".todo-list-form");

/**
 * @param {Event} e
 */
function addLiItem(e) {
  // prevent form submission (page reload in this case)
  e.preventDefault();

  // check if input is empty
  if (todoListInput.value === "") {
    return;
  }

  if (initItem) {
    initItem.classList.add("hidden");
  }

  const todoListItem = document.createElement("li");
  todoListItem.setAttribute("draggable", "true");
  todoListItem.classList.add("todo-list-item");
  todoListItem.innerHTML = `
    <button class="todo-list-btn todo-list-btn--check" type="button">
      Check
    </button>
    <span class="todo-list-item-text">${todoListInput.value}</span>
    <button class="todo-list-btn todo-list-btn--delete" type="button">
      Delete
    </button>
  `;
  todoListItems.appendChild(todoListItem);

  // reset input value
  todoListInput.value = "";
}

/**
 * @param {Event} e
 */
function handleLiClickBtn(e) {
  const target = e.target;
  const listItem = target.closest(".todo-list-item");

  if (!listItem) return; // If click is not inside a list item, do nothing

  // Handle Check Button Click
  if (target.classList.contains("todo-list-btn--check")) {
    listItem.classList.toggle("todo-list-item--done");
    target.classList.toggle("todo-list-btn--check-active");
  }

  // Handle Delete Button Click
  if (target.classList.contains("todo-list-btn--delete")) {
    listItem.remove();

    // show "No items" message again if list becomes empty
    const remainingTasks = todoListItems.querySelectorAll(
      ".todo-list-item[draggable=true]",
    );
    if (remainingTasks.length === 0) {
      initItem.classList.remove("hidden");
    }
  }
}

// Event listener on form submit
todoListBtn.addEventListener("click", (e) => addLiItem(e));

// Event delegation on list container to detect clicks on buttons
todoListItems.addEventListener("click", (e) => handleLiClickBtn(e));

/// DRAG AND DROP
todoListItems.addEventListener("dragstart", (e) => {
  const target = e.target;

  if (
    target.classList.contains("todo-list-item") &&
    target.getAttribute("draggable")
  ) {
    target.classList.add("dragging");
  }
});

todoListItems.addEventListener("dragend", (e) => {
  const target = e.target;

  if (
    target.classList.contains("todo-list-item") &&
    target.getAttribute("draggable")
  ) {
    target.classList.remove("dragging");
  }
});

todoListItems.addEventListener("dragover", (e) => {
  e.preventDefault();

  const draggable = document.querySelector(".dragging");
  if (!draggable) return;

  // get element that is under cursor where dragged element will be dropped
  const afterElement = getDragAfterElement(e.clientY);
  if (afterElement === null) {
    todoListItems.appendChild(draggable);
  } else {
    todoListItems.insertBefore(draggable, afterElement);
  }
});

function getDragAfterElement(y) {
  // All items not being dragged
  const draggableElements = [
    ...todoListItems.querySelectorAll(
      ".todo-list-item[draggable=true]:not(.dragging)",
    ),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();

      // Get vertical center of the element
      const offset = y - box.top - box.height / 2;

      // If mouse over the el (offset < 0) and closest so far
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}
