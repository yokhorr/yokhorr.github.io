// Get the link element that loads the CSS file
const link = document.getElementById('theme');

// Define the URLs of the light and dark theme CSS files
const lightThemeUrl = 'style/about_light.css';
const darkThemeUrl = 'style/about_dark.css';

// Load the theme from local storage or set a default
let currentTheme = localStorage.getItem('theme') || 'dark';

// Set theme and switcher state based on the saved theme
if (currentTheme === 'light') {
    link.href = lightThemeUrl;
    document.getElementById('flexSwitchCheckChecked').checked = false;
} else {
    link.href = darkThemeUrl;
    document.getElementById('flexSwitchCheckChecked').checked = true;
}

let clicks = 0;

function easternEgg() {
    $("#myModal").modal("show");
}

// Function to switch between light and dark themes
function switchTheme() {
    if (++clicks === 3) {
        easternEgg();
    }
    if (currentTheme === 'dark') {
        link.href = lightThemeUrl;
        currentTheme = 'light';
    } else {
        link.href = darkThemeUrl;
        currentTheme = 'dark';
    }
    // Save the theme to local storage
    localStorage.setItem('theme', currentTheme);
}