const themeObject = (function() {
    const root = document.documentElement;
    currTheme = 'light';
    root.classList.add(currTheme);

    return {
        root: root,
        currTheme: currTheme
    }
})();

const toggleThemeBtn = document.getElementById('toggle-theme').addEventListener('click', toggleTheme);

function toggleTheme() {
    themeObject.currTheme = themeObject.currTheme === 'light' ? 'dark' : 'light';
    themeObject.root.classList = themeObject.currTheme;

    const darkIcons = Array.from(document.getElementsByClassName('dark-icon'));
    const lightIcons = Array.from(document.getElementsByClassName('light-icon'));

    if (themeObject.currTheme === 'light') {
        darkIcons.forEach(icon => icon.classList.add('hidden'));
        lightIcons.forEach(icon => icon.classList.remove('hidden'));
    } else {
        lightIcons.forEach(icon => icon.classList.add('hidden'));
        darkIcons.forEach(icon => icon.classList.remove('hidden'));
    }
}