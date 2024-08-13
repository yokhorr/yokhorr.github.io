const cities_translation = {
    "Владивосток": "vladivostok",
    "Артём": "artem",
    "Арсеньев": "arsenyev",
    "Уссурийск": "ussuriysk",
    "Находка": "nakhodka",
    "Спасск-Дальний": "spassk",
    "Врангель": "vrangel",
    "Дальнегорск": "dalnegorsk",
    "Партизанск": "partizansk",
    "Черниговка": "chernigovka",
}


document.addEventListener("cardsGenerated", () => {
    setTimeout(() => { // delay of 100ms to prevent running code before generation completes
        // const now = new Date();
        // const milliseconds = now.getMilliseconds();
        // console.log(`Heard cards generation in film_link at ${now.toLocaleTimeString()} (${milliseconds} milliseconds)`);

        const subcards = document.querySelectorAll('.subcard');
        console.log(subcards);
        subcards.forEach((subcard) => {
            subcard.addEventListener('click', (event) => {
                setTimeout(() => {
                    const filmId = subcard.parentElement.dataset["filmid"];
                    const city = subcard.parentElement.dataset["city"];
                    const buyLink = subcard.parentElement.dataset["buylink"];
                    let url;
                    if (event.target.tagName === "IMG") {
                        url = `https://kino.vl.ru/films/${filmId}?city=${cities_translation[city]}/#seanceId=${buyLink}`
                    } else {
                        url = `https://kino.vl.ru/films/${filmId}?city=${cities_translation[city]}`;
                    }
                    window.open(url, "_blank");
                }, 100);
            });
        });
    }, 100);
})
