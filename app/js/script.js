const themeBtn = document.querySelector('#theme-btn');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('dark-bg');
  themeBtn.classList.toggle('night');
})