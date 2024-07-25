let filterBox;
let card;

function validateAll() {
    console.log(ageSelect);

    filterBox.forEach((card) => {
        validate(card);
    });

    console.log(document.querySelectorAll(".item").length - document.querySelectorAll(".hidden").length);
}

// when cards are generated
document.addEventListener("cardsGenerated", () => {
    filterBox = document.querySelectorAll(".item");
    console.log('cards generated');

    // Add the intersection method to the Set prototype
    Set.prototype.intersection = function(setB) {
        var intersection = new Set();
        for (var elem of this) {
            if (setB.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    };
});

const criteriaArrays = {
    citySelect: new Set(["Владивосток"]),
    genreSelect: new Set(),
    theatreSelect: new Set(),
    dateSelect: new Set(),
}
const criteriaArraysKeys = Object.keys(criteriaArrays);

var antiGenreSelect = new Set();
var ageSelect = 100;

const menus = [
    document.getElementById("theatreSelect"),
    document.getElementById("genreSelect"),
    document.getElementById("citySelect"),
];

function validate(card) {

    const cardParameters = {
        cityCard: new Set(Array(card.dataset["city"])),
        genresCard: new Set(card.dataset["genres"].split(",")),
        theatreCard: new Set(Array(card.dataset["theatre"])),
        dateCard: new Set(Array(card.dataset["date"])),
    };
    const cardParametersKeys = Object.keys(cardParameters);

    for (let i = 0; i < criteriaArraysKeys.length; i++) {
        // console.log('wow');
        if (criteriaArrays[criteriaArraysKeys[i]].size === 0) continue;
        if (!criteriaArrays[criteriaArraysKeys[i]].intersection(cardParameters[cardParametersKeys[i]]).size) {
                card.classList.add("hidden");
                return;
        }
        
        if (antiGenreSelect.intersection(cardParameters['genresCard']).size || parseInt(card.dataset["rating"]) >= ageSelect) {
            card.classList.add("hidden");
            return;
        }
    }

    card.classList.remove("hidden");
}

menus.forEach((menu) => {
    menu.addEventListener("click", (event) => {
        if (event.target.tagName !== "LI") return false;

        const criteria = event.target.parentElement.id;
        const option = event.target.textContent;
        const active = event.target.classList.contains("active");

        if (criteria === "citySelect") {
            criteriaArrays[criteria].clear();
            if (active) {
                criteriaArrays[criteria].add(option);
            }
            // when a city is selected (even if it is the same city) higlight on theatres menu is lost
            // so 
            criteriaArrays['theatreSelect'].clear();
        } else {
            if (active) {
                criteriaArrays[criteria].add(option);
            } else {
                criteriaArrays[criteria].delete(option);
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
        antiGenreSelect.add(genre);
    } else {
        antiGenreSelect.delete(genre);
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
    ageSelect = age;
    
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
        criteriaArrays['dateSelect'].add(date);
    } else {
        criteriaArrays['dateSelect'].delete(date);
    }

    validateAll();
})