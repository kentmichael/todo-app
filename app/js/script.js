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
Todo Component
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
  if(event.key==='Enter') checkInputText();
});

function checkInputText(){
  return inputTextfield ? todoComponent.addTodoData(inputTextfield.value) : false;
}

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
    label.append(input, span);
    form.appendChild(label);

    div.innerText = todoText;

    li.classList.add(listId);
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
    const successMessage = document.querySelector('#success-message');
    const modal = document.querySelector('.modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    successMessage.classList.remove('changes-saved');
    modal.classList.toggle('modal__show');
    modalOverlay.classList.toggle('modal-overlay__show');

    const modalClose = document.querySelectorAll('.modal-close');
    modalClose.forEach((element) => {
      element.addEventListener('click', () => {
        modal.classList = 'modal';
        modalOverlay.classList = 'modal-overlay';
      });
    });

    const modalForm = document.querySelector('#modal-form');
    modalForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    const modalTextarea = document.querySelector('#text-area');
    this.todoData.forEach((element) => {
      if(element.todoId===listId){
        modalTextarea.innerText = element.todoText;
        this.openModal = listId;
      }
        
    });

    const saveUpdate = document.querySelector('.modal-save');
    saveUpdate.addEventListener('click', (element) => {
      const textareaValue = document.querySelector('#text-area').value;
      console.log(listId);
      this.todoData.forEach((element) => {
        if(element.todoId===this.openModal){
          console.log(this.openModal);
          //if(textareaValue!=false){
            // element.todoText = textareaValue;
            // const div = document.querySelector(`#todo-ul .${listId} div`);
            // div.innerText = textareaValue;
            // successMessage.classList.add('changes-saved');
            // setTimeout(() => {
            //   modal.classList = 'modal';
            //   modalOverlay.classList = 'modal-overlay';
            // }, 500);
          // }else {
          //   this.removeItem(listId);
          //   modal.classList = 'modal';
          //   modalOverlay.classList = 'modal-overlay';
          // }
        }
      });
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
    this.todoId+=1;
  },
  completeItem(listId){
    const markComplete = this.todoFunctions.markLiComplete.bind(this, listId);
    markComplete();
  },
  editItem(listId){
    this.todoFunctions.updateLi.call(this, listId);
  },
  removeItem(listId){
    this.todoFunctions.removeLi.call(this, listId);
  }
}
