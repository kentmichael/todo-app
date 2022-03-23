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