"use strict";var themeBtn=document.querySelector("#theme-btn");themeBtn.addEventListener("click",(function(){var e=document.body.getAttribute("class").includes("dark-theme")?setLightMode():setDarkMode();window.localStorage.setItem("todoAppTheme",e)}));var loadUserPreference=function(){return!!window.localStorage.getItem("todoAppTheme")&&("dark-theme"==window.localStorage.getItem("todoAppTheme")?setDarkMode():setLightMode(),!0)},loadPrefersColorScheme=function(){!window.matchMedia("(prefers-color-scheme: dark)").matches||setDarkMode(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",(function(e){loadUserPreference()||!e.matches||setDarkMode()}))},loadThemePreferences=function(){return loadUserPreference()||loadPrefersColorScheme()};function setLightMode(){return document.body.classList="light-theme",themeBtn.classList.remove("night"),"light-theme"}function setDarkMode(){return document.body.classList="dark-theme",document.body.classList.add("dark-bg"),themeBtn.classList="night","dark-theme"}loadThemePreferences();var inputForm=document.querySelector("#input-form"),inputCheckbox=document.querySelector("#input-checkbox"),inputTextfield=document.querySelector("#input-textfield");function checkInputText(){inputTextfield.value&&todoComponent.addTodoData(inputTextfield.value),setTimeout((function(){inputTextfield.value="",inputCheckbox.checked=!1}),200)}inputForm.addEventListener("submit",(function(e){e.preventDefault()})),inputCheckbox.addEventListener("click",(function(){checkInputText()})),inputTextfield.addEventListener("keypress",(function(e){"Enter"===e.key&&(inputCheckbox.checked=!0,checkInputText())}));var modal=document.querySelector(".modal"),modalOverlay=document.querySelector(".modal-overlay"),modalClose=document.querySelectorAll(".modal-close"),modalForm=document.querySelector("#modal-form"),modalTextarea=document.querySelector("#text-area"),saveUpdate=document.querySelector("#modal-save"),successMessage=document.querySelector("#success-message");modalForm.addEventListener("submit",(function(e){e.preventDefault()})),modalClose.forEach((function(e){e.addEventListener("click",(function(){modal.classList.remove("modal__show"),modalOverlay.classList.remove("modal-overlay")}))})),saveUpdate.addEventListener("click",(function(){successMessage.classList.remove("changes-invalid");var e=document.querySelector("#text-area").value;todoComponent.todoData.forEach((function(t){t.todoId==todoComponent.openModal&&(0!=e?(t.todoText=e,document.querySelector("#todo-ul .".concat(todoComponent.openModal," div")).innerText=e,successMessage.innerText="Changes saved!",successMessage.classList.add("changes-saved"),setTimeout((function(){modal.classList.remove("modal__show"),modalOverlay.classList.remove("modal-overlay")}),500)):(successMessage.innerText="Invalid input! Text field must not be empty..",successMessage.classList.add("changes-invalid")))}))}));var clearCompleted=document.querySelectorAll(".filter__clear"),filterAll=document.querySelector("#filter-all"),filterActive=document.querySelector("#filter-active"),filterCompleted=document.querySelector("#filter-completed");clearCompleted.forEach((function(e){e.addEventListener("click",(function(){todoComponent.clearCompleted()}))})),filterAll.addEventListener("click",(function(){todoComponent.filterAll(),filterAll.classList.add("filter__options--active"),filterActive.classList.remove("filter__options--active"),filterCompleted.classList.remove("filter__options--active")})),filterActive.addEventListener("click",(function(){todoComponent.filterActive(),filterActive.classList.add("filter__options--active"),filterAll.classList.remove("filter__options--active"),filterCompleted.classList.remove("filter__options--active")})),filterCompleted.addEventListener("click",(function(){todoComponent.filterCompleted(),filterActive.classList.remove("filter__options--active"),filterAll.classList.remove("filter__options--active"),filterCompleted.classList.add("filter__options--active")}));var todoFunctions={createListComponents:function(e,t){var o=this,i=document.querySelector("#todo-ul"),l=document.createElement("li"),c=document.createElement("form"),n=document.createElement("label"),s=document.createElement("input"),a=document.createElement("span"),d=document.createElement("div"),r=document.createElement("button");s.type="checkbox",s.ariaLabel="checkbox-li",n.append(s,a),c.appendChild(n),d.innerText=e,l.classList.add(t),r.setAttribute("aria-label","delete-li"),l.append(c,d,r),i.appendChild(l),[s,d,r].forEach((function(e){e.addEventListener("click",(function(){"input"===e.localName?o.completeItem(t):"div"===e.localName?o.editItem(t):"button"===e.localName&&o.removeItem(t)}))}))},markLiComplete:function(e){this.todoData.forEach((function(t){t.todoId==e&&(t.isCompleted=1!=t.isCompleted,document.querySelectorAll("#todo-ul li").forEach((function(t){t.getAttribute("class",e).includes(e)&&(t.classList.toggle("li-completed"),document.querySelector("#todo-ul .".concat(e," div")).classList.toggle("disable-edit"))})))}))},removeLi:function(e){var t=this;document.querySelectorAll("#todo-ul li").forEach((function(o){o.getAttribute("class",e).includes(e)&&(o.remove(),t.todoData.forEach((function(o,i){e==o.todoId&&t.todoData.splice(i,1)})))}))},updateLi:function(e){successMessage.classList.remove("changes-saved"),successMessage.classList.remove("changes-invalid"),modal.classList.toggle("modal__show"),modalOverlay.classList.toggle("modal-overlay__show"),this.openModal=e,this.todoData.forEach((function(t){t.todoId===e&&(modalTextarea.value=t.todoText)}))},itemCount:function(){var e=this;document.querySelectorAll(".item-count").forEach((function(t){t.innerText="".concat(e.todoData.length," items left")}))},clearCompleted:function(){var e=this,t=[],o=this.todoData.filter((function(e){if(!e.isCompleted)return e;t.push(e.todoId)}));this.todoData=o.slice(),t.forEach((function(t){e.removeItem(t)}))},filterAll:function(){document.querySelectorAll("#todo-ul li").forEach((function(e){e.classList.remove("hide-li")}))},filterActive:function(){document.querySelectorAll("#todo-ul li").forEach((function(e){e.getAttribute("class").includes("li-completed")?e.classList.add("hide-li"):e.classList.remove("hide-li")}))},filterCompleted:function(){document.querySelectorAll("#todo-ul li").forEach((function(e){e.getAttribute("class").includes("li-completed")?e.classList.remove("hide-li"):e.classList.add("hide-li")}))}},todoComponent={todoId:1,todoData:[],todoFunctions:todoFunctions,addTodoData:function(e){var t=this.todoId,o=this.todoData,i="list-item-"+t;this.todoFunctions.createListComponents.call(this,e,i),o.push({todoId:i,todoText:e,isCompleted:!1}),this.todoFunctions.itemCount.call(this),this.todoId+=1},completeItem:function(e){console.log(e),this.todoFunctions.markLiComplete.bind(this,e)(),this.todoFunctions.itemCount.call(this)},editItem:function(e){this.todoFunctions.updateLi.call(this,e),this.todoFunctions.itemCount.call(this)},removeItem:function(e){this.todoFunctions.removeLi.call(this,e),this.todoFunctions.itemCount.call(this)},clearCompleted:function(){this.todoFunctions.clearCompleted.call(this),this.todoFunctions.itemCount.call(this)},filterAll:function(){this.todoFunctions.filterAll.call(this)},filterActive:function(){this.todoFunctions.filterActive.call(this)},filterCompleted:function(){this.todoFunctions.filterCompleted.call(this)}};
//# sourceMappingURL=script.js.map