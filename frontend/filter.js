let filterBox;

// when cards are generated
document.addEventListener("cardsGenerated", () => {
    filterBox = document.querySelectorAll(".item");
    console.log('cards generated');
});

const criteriaArrays = {
    citySelect: new Set(),
    genreSelect: new Set(),
    theatreSelect: new Set(),
    dateSelect: new Set(),
}
const criteriaArraysKeys = Object.keys(criteriaArrays);


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
        if (criteriaArrays[criteriaArraysKeys[i]].size === 0) continue;
        if (!criteriaArrays[criteriaArraysKeys[i]].intersection(cardParameters[cardParametersKeys[i]]).size) {
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
        } else {
            if (active) {
                criteriaArrays[criteria].add(option);
            } else {
                criteriaArrays[criteria].delete(option);
            }
        }

        console.log(criteriaArrays);

        filterBox.forEach((card) => {
            validate(card);
        });

        console.log(document.querySelectorAll(".item").length
            - document.querySelectorAll(".hidden").length);
    });
});

document.getElementById('dateSelect').addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return false;
    
    const day = event.target.firstChild.textContent.padStart(2, "0");
    const month = event.target.dataset['month'].padStart(2, "0");
    const date = `${day}.${month}`;
    const active = event.target.classList.contains("selected");

    if (active) {
        criteriaArrays['dateSelect'].add(date);
    } else {
        criteriaArrays['dateSelect'].delete(date);
    }

    console.log(criteriaArrays);

    filterBox.forEach((card) => {
        validate(card);
    });

    console.log(document.querySelectorAll(".item").length
            - document.querySelectorAll(".hidden").length);
})