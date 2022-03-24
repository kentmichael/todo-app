'use strict';
/*
The page is loaded with the theme based on the user's
last preference (stored in the local storage). This
have a higher precedence over the system 
prefers-color-scheme. In initial load, the default theme 
is the user's system preference.
*/
const themeBtn = document.querySelector('#theme-btn');

themeBtn.addEventListener('click', () => {
  const currentMode = document.body.getAttribute('class');
  const userPreference = currentMode.includes('dark-theme') ? setLightMode() : setDarkMode();
  window.localStorage.setItem('todoAppTheme', userPreference);
});

const loadUserPreference = () => {
  if(window.localStorage.getItem('todoAppTheme')){
    const preferedTheme = window.localStorage.getItem('todoAppTheme');
    preferedTheme=='dark-theme' ? setDarkMode() : setLightMode();
    return true;
  }else {
    return false;
  }
};

const loadPrefersColorScheme = () => { 
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  darkMode ? setDarkMode() : 'Application default: light mode';
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => { 
    if(!loadUserPreference())
      event.matches ? setDarkMode() : 'setLightMode()';
  });
};

const loadThemePreferences = function(){
  return loadUserPreference() || loadPrefersColorScheme();
};

function setLightMode(){
  document.body.classList = 'light-theme';
  themeBtn.classList.remove('night');
  return 'light-theme';
}

function setDarkMode(){
  document.body.classList = 'dark-theme';
  document.body.classList.add('dark-bg');
  themeBtn.classList = 'night';
  return 'dark-theme';
}

loadThemePreferences();

/*
  Selecting the input components and adding
  event listeners to it.
*/

const inputForm = document.querySelector('#input-form');
const inputCheckbox = document.querySelector('#input-checkbox');
const inputTextfield = document.querySelector('#input-textfield');

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

inputCheckbox.addEventListener('click', () => {
  checkInputText();
});

inputTextfield.addEventListener('keypress', (event) => {
  if(event.key==='Enter'){
    inputCheckbox.checked = true;
    checkInputText();
  }
});

function checkInputText(){
  if(inputTextfield.value)
    todoComponent.addTodoData(inputTextfield.value);
  setTimeout(() => {
    inputTextfield.value = '';
    inputCheckbox.checked = false;
  }, 200);
}

/*
  Select the modal once, then the function
  to edit will display this once the event 'click'
  is provoked.
*/
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelectorAll('.modal-close');
const modalForm = document.querySelector('#modal-form');
const modalTextarea = document.querySelector('#text-area');
const saveUpdate = document.querySelector('#modal-save');
const successMessage = document.querySelector('#success-message');

modalForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

modalClose.forEach((element) => {
  element.addEventListener('click', () => {
    modal.classList.remove('modal__show');
    modalOverlay.classList.remove('modal-overlay');
  });
});

saveUpdate.addEventListener('click', () => {
  successMessage.classList.remove('changes-invalid');
  const textareaValue = document.querySelector('#text-area').value;
  todoComponent.todoData.forEach((element) => {
    if(element.todoId==todoComponent.openModal){
      if(textareaValue!=false){
        element.todoText = textareaValue;
        const div = document.querySelector(`#todo-ul .${todoComponent.openModal} div`);
        div.innerText = textareaValue;
        successMessage.innerText = 'Changes saved!';
        successMessage.classList.add('changes-saved');
        setTimeout(() => {
          modal.classList.remove('modal__show');
          modalOverlay.classList.remove('modal-overlay');
        }, 500);
      }else {
        successMessage.innerText = 'Invalid input! Text field must not be empty..';
        successMessage.classList.add('changes-invalid');
      }
    }
  });
});

/*
  Select filter options and add event listeners to each.
  Call to a function stored in todoFunctions.
*/
const clearCompleted = document.querySelectorAll('.filter__clear');
const filterAll = document.querySelector('#filter-all');
const filterActive = document.querySelector('#filter-active');
const filterCompleted = document.querySelector('#filter-completed');

clearCompleted.forEach((element) => {
  element.addEventListener('click', () => {
    todoComponent.clearCompleted();
  });
});

filterAll.addEventListener('click', () => {
  todoComponent.filterAll();
  filterAll.classList.add('filter__options--active');
  filterActive.classList.remove('filter__options--active');
  filterCompleted.classList.remove('filter__options--active');
});

filterActive.addEventListener('click', () => {
  todoComponent.filterActive();
  filterActive.classList.add('filter__options--active');
  filterAll.classList.remove('filter__options--active');
  filterCompleted.classList.remove('filter__options--active');
});

filterCompleted.addEventListener('click', () => {
  todoComponent.filterCompleted();
  filterActive.classList.remove('filter__options--active');
  filterAll.classList.remove('filter__options--active');
  filterCompleted.classList.add('filter__options--active');
});

/*
  Drag and drop the list items using SortableJS Library
*/

const ul = document.querySelector('#todo-ul');
new Sortable(ul, {
  animation: 150,
  ghostClass: 'blue-background-class'
});

/*
  Created two objects, one that contains all the
  functionality of the component (todoFunctions) and the second
  object (todoComponent) contains the data of the component.
  todoComponent will just borrow the functions from the 
  todoFunctions by applying Call and Bind.
*/
const todoFunctions = {
  createListComponents(todoText, listId){
    const ul = document.querySelector('#todo-ul');
    const li = document.createElement('li');
    const form = document.createElement('form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const div = document.createElement('div');
    const button = document.createElement('button');

    input.type = 'checkbox';
    input.ariaLabel = 'checkbox-li';
    label.append(input, span);
    form.appendChild(label);

    div.innerText = todoText;

    li.classList.add(listId);
    button.setAttribute('aria-label', 'delete-li');
    li.append(form, div, button);
    ul.appendChild(li);

    const listen = [input, div, button];
    listen.forEach((element) => {
      element.addEventListener('click', () => {
        if(element.localName==='input') this.completeItem(listId);
        else if(element.localName==='div') this.editItem(listId);
        else if(element.localName==='button') this.removeItem(listId);
      });
    });
  },
  markLiComplete(listId){
    this.todoData.forEach((object) => {
      if(object.todoId==listId){
        object.isCompleted = object.isCompleted==true ? false: true;
        const allListItem = document.querySelectorAll('#todo-ul li');
        allListItem.forEach((element) => {
          if(element.getAttribute('class', listId).includes(listId)){
            element.classList.toggle('li-completed');
            const div = document.querySelector(`#todo-ul .${listId} div`);
            div.classList.toggle('disable-edit');
          }
        });
      }
    });
  },
  removeLi(listId){
    const allListItem = document.querySelectorAll('#todo-ul li');
    allListItem.forEach((element) => {
      if(element.getAttribute('class', listId).includes(listId)){
        element.remove();
        this.todoData.forEach((object, idx) => {
          if(listId==object.todoId)
            this.todoData.splice(idx, 1);
        });
      }
    });
  },
  updateLi(listId){
    successMessage.classList.remove('changes-saved');
    successMessage.classList.remove('changes-invalid');
    modal.classList.toggle('modal__show');
    modalOverlay.classList.toggle('modal-overlay__show');
    this.openModal = listId;
    this.todoData.forEach((element) => {
      if(element.todoId===listId){
        modalTextarea.value = element.todoText;
      }
    });
  },
  itemCount(){
    const span = document.querySelectorAll('.item-count');
    span.forEach((element) => {
      element.innerText = `${this.todoData.length} items left`;
    });
  },
  clearCompleted(){
    const completedTodo = [];
    const pendingTodo = this.todoData.filter((element) => {
      if(!element.isCompleted){
        return element;
      }else{
        completedTodo.push(element.todoId);
      }
    });
    this.todoData = pendingTodo.slice();
    completedTodo.forEach((element) => {
      this.removeItem(element);
    });
  },
  filterAll(){
    const listItems = document.querySelectorAll('#todo-ul li');
    listItems.forEach((element) => {
      element.classList.remove('hide-li');
    });
  },
  filterActive(){
    const listItems = document.querySelectorAll('#todo-ul li');
    listItems.forEach((element) => {
      if(element.getAttribute('class').includes('li-completed')){
        element.classList.add('hide-li');
      }else{
        element.classList.remove('hide-li');
      }
    });
  },
  filterCompleted(){
    const listItems = document.querySelectorAll('#todo-ul li');
    listItems.forEach((element) => {
      if(!element.getAttribute('class').includes('li-completed')){
        element.classList.add('hide-li');
      }else{
        element.classList.remove('hide-li');
      }
    });
  }
}

const todoComponent = {
  todoId: 1,
  todoData: [],
  todoFunctions,
  addTodoData(todoText){
    const {todoId, todoData} = this;
    const listId = 'list-item-'+todoId;
    this.todoFunctions.createListComponents.call(this, todoText, listId);
    todoData.push({
      todoId: listId,
      todoText,
      isCompleted: false
    });
    this.todoFunctions.itemCount.call(this);
    this.todoId+=1;
  },
  completeItem(listId){
    const markComplete = this.todoFunctions.markLiComplete.bind(this, listId);
    markComplete();
    this.todoFunctions.itemCount.call(this);
  },
  editItem(listId){
    this.todoFunctions.updateLi.call(this, listId);
    this.todoFunctions.itemCount.call(this);
  },
  removeItem(listId){
    this.todoFunctions.removeLi.call(this, listId);
    this.todoFunctions.itemCount.call(this);
  },
  clearCompleted(){
    this.todoFunctions.clearCompleted.call(this);
    this.todoFunctions.itemCount.call(this);
  },
  filterAll(){
    this.todoFunctions.filterAll.call(this);
  },
  filterActive(){
    this.todoFunctions.filterActive.call(this);
  },
  filterCompleted(){
    this.todoFunctions.filterCompleted.call(this);
  }
}