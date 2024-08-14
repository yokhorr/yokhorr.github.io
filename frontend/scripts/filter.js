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


const banner = document.getElementById("banner"); // "Not found"
const theEnd = document.getElementById("endButton");

// all cards to sort
let filterBox;
let card;

// Add the intersection method to the Set prototype
Set.prototype.intersection = function (setB) {
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
    cardsShown = document.querySelectorAll(".item").length
        - document.querySelectorAll(".item.hidden").length;

    if (cardsShown === 0) { // if no cards are visible
        console.log('Showing banner');
        banner.classList.remove("hidden"); // show banner
        theEnd.classList.add("hidden"); // hide button
    } else {
        // if there are some cards
        banner.classList.add("hidden"); // hide banner
        theEnd.classList.remove("hidden"); // show button
    }
}


// check all cards to be hidden or unhidden
async function validateAll() {
    await Promise.all(
        Array.from(filterBox).map(async (card) => {
            validate(card);
        })
    );

    toggleBanner();
}

// when cards are generated
document.addEventListener("cardsGenerated", () => {
    // receive cards from the grid
    // delay is needed after cards generation for proper work
    setTimeout(() => {
        // get items to filter (items, not cards)
        filterBox = document.querySelectorAll(".item");

        const cardsGeneratedNow = document.querySelectorAll(".card");
        cardsGeneratedNow.forEach((card) => {
            // remove class .hidden from genres when a cards is hovered
            // .hidden at genres is needed to prevent animation when site is first loaded
            card.addEventListener("mouseenter", function () {
                card.lastElementChild.classList.remove("hidden");
            });

            // show up cards matching default city
            if (
                new Set(Array(card.parentElement.dataset["city"])).intersection(
                    criteriaArrays["citySelectSet"]
                ).size
            ) {
                card.parentElement.classList.remove("hidden");
            }
        });
        toggleBanner();
    }, 100);
});

// array of chosen criterias
const criteriaArrays = {
    // set previously chosen city or vladivostok if none was chosen
    citySelectSet: new Set(
        [localStorage.getItem("selectedCity")] || ["Владивосток"]
    ),
    genreSelectSet: new Set(),
    theatreSelectSet: new Set(),
    dateSelectSet: new Set(),
};
const criteriaArraysKeys = Object.keys(criteriaArrays);

const antiGenreSelectSet = new Set();  // chosen antiGenres
let ageSelectParam = 100;  // chosen age (100 = all)

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

    // loop through all criterias to chech if the card meets every of them
    for (let i = 0; i < criteriaArraysKeys.length; i++) {
        // if no criteria was chosen, just skip, it meets then
        if (criteriaArrays[criteriaArraysKeys[i]].size === 0) continue;

        // at least one genre, theatre, date or city that required was chosen
        if (
            !criteriaArrays[criteriaArraysKeys[i]].intersection(
                cardParameters[cardParametersKeys[i]]
            ).size
        ) {
            // if not, the card is hidden
            // also disable tag animation; will be back enabled when hovered
            card.getElementsByClassName("hiddenDetails")[0].classList.add(
                "hidden"
            ); 
            card.classList.add("hidden");
            return;
        }
    }

    // also check that card doesn't have forbidden genre
    // and it's age restriction is no more than user chosen age
    if (
        antiGenreSelectSet.intersection(cardParameters["genresCard"]).size
        || parseInt(card.dataset["rating"]) >= ageSelectParam
    ) {
        card.classList.add("hidden");
        return;
    }

    // unhide card, since it meets all criterias
    card.classList.remove("hidden");
}

// a try to automate clicking and filtration
// though other clicks should be handled separately
menus.forEach((menu) => {
    menu.addEventListener("click", (event) => {
        // was clicked not menu entry
        if (event.target.tagName !== "LI") return false;

        // what menu was clicked, what option was chosen, is it now active
        const criteriaSetName = event.target.parentElement.id + "Set";
        const option = event.target.textContent;
        const active = event.target.classList.contains("active");

        if (criteriaSetName === "citySelectSet") {
            criteriaArrays[criteriaSetName].clear();
            criteriaArrays[criteriaSetName].add(option);
            // save selected city in local storage
            localStorage.setItem("selectedCity", option);
            // when a city is selected (even if it is the same city)
            // higlight on theatres menu is lost
            // so we need to clear it
            criteriaArrays["theatreSelectSet"].clear();
        } else {
            // add or delete criteria from active
            if (active) {
                criteriaArrays[criteriaSetName].delete(option);
            } else {
                criteriaArrays[criteriaSetName].add(option);
            }
        }

        validateAll();
    });
});

// click handler for antiGenre
document
    .getElementById("antiGenreSelect")
    .addEventListener("click", (event) => {
        // was clicked not menu entry
        if (event.target.tagName !== "LI") return false;

        const genre = event.target.textContent;
        const active = event.target.classList.contains("active");
        if (active) {
            antiGenreSelectSet.delete(genre);
        } else {
            antiGenreSelectSet.add(genre);
        }

        validateAll();
    });

// click handler for age
document.getElementById("ageSelect").addEventListener("click", (event) => {
    // was clicked not menu entry
    if (event.target.tagName !== "LI") return false;

    const ageText = event.target.textContent;
    let age = parseInt(ageText.match(/\d+/)[0]); // get only number
    if (ageText[ageText.length - 1] === "+") {
        // if older than 18
        // 100 is more than any restriction
        age = 100;
    }
    ageSelectParam = age;

    validateAll();
});

// click handler for date
document.getElementById("dateSelect").addEventListener("click", (event) => {
    // was clicked neither day number nor day of the week
    if (event.target.tagName !== "LI" && event.target.tagName !== "SPAN")
        return false;

    let element = event.target;
    if (event.target.tagName === "SPAN") {
        // if clicked day of the week
        element = event.target.parentElement;
    }

    const day = element.firstChild.textContent.padStart(2, "0");
    const month = element.dataset["month"].padStart(2, "0");
    const date = `${day}.${month}`;
    const active = element.classList.contains("selected");

    if (active) {
        criteriaArrays["dateSelectSet"].add(date);
    } else {
        criteriaArrays["dateSelectSet"].delete(date);
    }

    validateAll();
});
