/*----------------------------------------------------------------------------
 *  © 2024 Solyanik Egor   <yokhor06@mail.ru>
 *
 *  This code is part of Vkadre project, a service for finding film shows.
 *  It is licensed under the AGPL-3.0,
 *  you may not use this file except in compliance with the license.
 *  
 *  License text: https://www.gnu.org/licenses/agpl-3.0.en.html
 *  About project: https://github.com/yokhorr/yokhorr.github.io
 *  SPDX-License-Identifier: AGPL-3.0
----------------------------------------------------------------------------*/


const cities_translation = {
    Владивосток: "vladivostok",
    Артём: "artem",
    Арсеньев: "arsenyev",
    Уссурийск: "ussuriysk",
    Находка: "nakhodka",
    "Спасск-Дальний": "spassk",
    Врангель: "vrangel",
    Дальнегорск: "dalnegorsk",
    Партизанск: "partizansk",
    Черниговка: "chernigovka",
};

// when subcard is clicked, open link in new tab
document.addEventListener("cardsGenerated", () => {
    // delay is needed for proper work
    setTimeout(() => {
        const subcards = document.querySelectorAll(".subcard");
        subcards.forEach((subcard) => {
            subcard.addEventListener("click", (event) => {
                // delay is needed for proper work
                setTimeout(() => {
                    // get data directly from card
                    const filmId = subcard.parentElement.dataset["filmid"];  // what film to open
                    const city = subcard.parentElement.dataset["city"];  // in which city
                    const buyLink = subcard.parentElement.dataset["buylink"];  // link to buy tickets
                    let url;
                    // open page depending on wheter ticket button was pressed or not
                    if (event.target.tagName === "IMG") {
                        url = `https://kino.vl.ru/films/${filmId}?city=${cities_translation[city]}/#seanceId=${buyLink}`;
                    } else {
                        url = `https://kino.vl.ru/films/${filmId}?city=${cities_translation[city]}`;
                    }
                    window.open(url, "_blank");
                }, 100);
            });
        });
    }, 100);
});
