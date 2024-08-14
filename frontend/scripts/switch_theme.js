/*----------------------------------------------------------------------------
 *  © 2024 Solyanik Egor   <yokhor06@mail.ru>
 *
 *  This code is part of Vkadre project, a service for finding film shows.
 *  It is licensed under the AGPL-3.0,
 *  you may not use this file except in compliance with the license.
 *  
 *  License text: https://www.gnu.org/licenses/agpl-3.0.en.html
 *  About project: https://github.com/yokhorr/yokhorr.github.io
----------------------------------------------------------------------------*/


// Get the link element that loads the CSS file
const link = document.getElementById("theme");

// Define the URLs of the light and dark theme CSS files
const lightThemeUrl = "styles/about_light.css";
const darkThemeUrl = "styles/about_dark.css";

// Load the theme from local storage or set a default
let currentTheme = localStorage.getItem("theme") || "dark";

// Set theme and switcher state based on the saved theme
if (currentTheme === "light") {
    link.href = lightThemeUrl;
    document.getElementById("flexSwitchCheckChecked").checked = false;
} else {
    link.href = darkThemeUrl;
    document.getElementById("flexSwitchCheckChecked").checked = true;
}

// click counters for Easter eggs
let switchClicks = 0;
let egorClicks = 0;


// show modal for Easter egg
function EasterEgg() {
    $("#EasterEggModal").modal({
        backdrop: "static",  // prevent closing on click
        keyboard: false,  // prevent closing on ESC
    });
    $("#EasterEggModal").modal("show");
}


// Function to switch between light and dark themes
function switchTheme() {
    // count for Easter egg
    if (++switchClicks === 10) {
        link.href = lightThemeUrl;
        currentTheme = "light";
        EasterEgg();
    } else if (currentTheme === "dark") {
        link.href = lightThemeUrl;
        currentTheme = "light";
    } else {
        link.href = darkThemeUrl;
        currentTheme = "dark";
    }
    // Save the theme to local storage
    localStorage.setItem("theme", currentTheme);
}


// ct Easter egg
function ctEgg() {
    if (++egorClicks === 10) {
        document.getElementById("egor").src = "images/ct.gif";
    }
}
