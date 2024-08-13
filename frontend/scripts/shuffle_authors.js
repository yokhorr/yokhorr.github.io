function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let grid = document.getElementById("grid");
let cards = grid.getElementsByClassName("col-lg-3 col-md-6 col-12 mt-4 pt-2");
let cardsArray = Array.from(cards);
shuffle(cardsArray);
cardsArray.forEach(card => {
    grid.appendChild(card);
});
