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
    const subcards = document.querySelectorAll('.subcard');
    subcards.forEach((subcard) => {
        subcard.addEventListener('click', () => {
            const filmId = subcard.parentElement.dataset["filmid"];
            const city = subcard.parentElement.dataset["city"];
            const url = `https://kino.vl.ru/films/${filmId}?city=${cities_translation[city]}`;
            window.open(url, "_blank");
        });
    });
})
