// theme
const theme = document.getElementById('theme-toggle');
const root  = document.documentElement;

theme.addEventListener('click', () => {
    root.classList.toggle('dark');
});