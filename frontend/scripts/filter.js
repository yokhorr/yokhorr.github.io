const banner = document.getElementById('banner');
const theEnd = document.getElementById('endButton');

let filterBox;
let card;

// Add the intersection method to the Set prototype
Set.prototype.intersection = function(setB) {
    const intersection = new Set();
    for (const elem of this) {
        if (setB.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
};

// show the banner "Not found" when no cards on the screen and hide the button "The end"
// and vice verca
function toggleBanner() {
    // number of visible cards
    cardsShown = document.querySelectorAll(".item").length - document.querySelectorAll(".item.hidden").length;
    console.log(cardsShown);

    if (cardsShown === 0) { // if no cards are visible
        console.log('Showing banner');
        banner.classList.remove("hidden"); // show banner
        theEnd.classList.add("hidden"); // hide button
    } else {               // if there are some cards
        banner.classList.add("hidden"); // hide banner
        theEnd.classList.remove("hidden"); // show button
    }
}

async function validateAll() {

    await Promise.all(Array.from(filterBox).map(async (card) => {
        validate(card);
    }));

    toggleBanner();
}

// when cards are generated
document.addEventListener("cardsGenerated", () => {
    // receive cards from the grid
    setTimeout(() => {
        const now = new Date();
        const milliseconds = now.getMilliseconds();
        console.log(`Heard cards generation in filter.js at ${now.toLocaleTimeString()} (${milliseconds} milliseconds)`);

        // get items to filter (items, not cards)
        filterBox = document.querySelectorAll(".item");

        // this script removes class .hidden from genres when a cards is hovered
        // .hidden at genres is needed to prevent animation when site is first loaded
        const cardsGeneratedNow = document.querySelectorAll('.card');
        // console.log(cardsGeneratedNow.length);
        cardsGeneratedNow.forEach((card) => {
            // console.log(card.parentElement.dataset["city"]);
            card.addEventListener('mouseenter', function() {
                card.lastElementChild.classList.remove('hidden');
            });
            // console.log(card.parentElement.dataset["city"]);
            if ((new Set(Array(card.parentElement.dataset["city"]))).intersection(criteriaArrays["citySelectSet"]).size) {
                card.parentElement.classList.remove('hidden');
            }

        });
        toggleBanner();
    }, 100);


    console.log('cards generated');
    
});

const criteriaArrays = {
    citySelectSet: new Set(localStorage.getItem("selectedCity") ? [localStorage.getItem("selectedCity")] : ["Владивосток"]),
    // citySelectSet: new Set(["Владивосток"]),
    genreSelectSet: new Set(),
    theatreSelectSet: new Set(),
    dateSelectSet: new Set(),
}
const criteriaArraysKeys = Object.keys(criteriaArrays);

const antiGenreSelectSet = new Set();
let ageSelectParam = 100;

const menus = [
    document.getElementById("theatreSelect"),
    document.getElementById("genreSelect"),
    document.getElementById("citySelect"),
];

// show or hide every card in accordance with all the filters
function validate(card) {

    const cardParameters = {
        cityCard: new Set(Array(card.dataset["city"])),
        genresCard: new Set(card.dataset["genres"].split(",")),
        theatreCard: new Set(Array(card.dataset["theatre"])),
        dateCard: new Set(Array(card.dataset["date"])),
    };
    const cardParametersKeys = Object.keys(cardParameters);

    // console.log(cardParameters);
    // console.log(criteriaArrays);
    // console.log(antiGenreSelectSet);
    // console.log(ageSelectParam);

    for (let i = 0; i < criteriaArraysKeys.length; i++) {
        if (criteriaArrays[criteriaArraysKeys[i]].size === 0) continue;
        if (!criteriaArrays[criteriaArraysKeys[i]].intersection(cardParameters[cardParametersKeys[i]]).size) {
                card.classList.add("hidden");
                return;
        }
        
        if (antiGenreSelectSet.intersection(cardParameters['genresCard']).size || parseInt(card.dataset["rating"]) >= ageSelectParam) {
            card.classList.add("hidden");
            return;
        }
    }

    card.classList.remove("hidden");
}

menus.forEach((menu) => {
    menu.addEventListener("click", (event) => {
        if (event.target.tagName !== "LI") return false;

        const criteriaSetName = event.target.parentElement.id + "Set";
        const option = event.target.textContent;
        const active = event.target.classList.contains("active");

        if (criteriaSetName === "citySelectSet") {
            criteriaArrays[criteriaSetName].clear();
            criteriaArrays[criteriaSetName].add(option);
            localStorage.setItem("selectedCity", option); // save selected city in local storage
            // when a city is selected (even if it is the same city) higlight on theatres menu is lost
            // so we need to clear it
            criteriaArrays['theatreSelectSet'].clear();
        } else {
            if (active) {
                criteriaArrays[criteriaSetName].delete(option);
            } else {
                criteriaArrays[criteriaSetName].add(option);
            }
        }

        validateAll();
    });
});

document.getElementById('antiGenreSelect').addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return false;
    const genre = event.target.textContent;
    const active = event.target.classList.contains("active");
    if (active) {
        antiGenreSelectSet.delete(genre);
    } else {
        antiGenreSelectSet.add(genre);
    }
    
    validateAll();
})

document.getElementById('ageSelect').addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return false;
    const ageText = event.target.textContent;
    let age = parseInt(ageText.match(/\d+/)[0]); // get only number
    if (ageText[ageText.length - 1] === "+") { // if older than 18
        age = 100; // 100 is more than any restriction
    }
    ageSelectParam = age;
    
    validateAll();
})

document.getElementById('dateSelect').addEventListener("click", (event) => {
    if (event.target.tagName !== "LI" && event.target.tagName !== "SPAN") return false; // was clicked neither day number nor day of the week
    let element = event.target;
    if (event.target.tagName === "SPAN") { // if clicked day of the week
        element = event.target.parentElement;
    }

        const day = element.firstChild.textContent.padStart(2, "0");
        const month = element.dataset['month'].padStart(2, "0");
        const date = `${day}.${month}`;
        const active = element.classList.contains("selected");
    
    if (active) {
        criteriaArrays['dateSelectSet'].add(date);
    } else {
        criteriaArrays['dateSelectSet'].delete(date);
    }

    validateAll();
})