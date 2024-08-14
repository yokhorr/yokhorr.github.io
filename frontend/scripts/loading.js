/*----------------------------------------------------------------------------
 *  © 2024 Malyshev Nikita <nikita.malyshev0007@gmail.com>
 *
 *  This code is part of Vkadre project, a service for finding film shows.
 *  It is licensed under the AGPL-3.0,
 *  you may not use this file except in compliance with the license.
 *  
 *  License text: https://www.gnu.org/licenses/agpl-3.0.en.html
 *  About project: https://github.com/yokhorr/yokhorr.github.io
----------------------------------------------------------------------------*/


const wordContainerEl = document.querySelector("[data-word]");
const word = wordContainerEl.getAttribute("data-word");
const wordRepeatTimes = wordContainerEl.getAttribute("data-word-repeat");
const textColorsArray = wordContainerEl
    .getAttribute("data-text-colors")
    .split(",");

for (let i = 0; i < wordRepeatTimes; i++) {
    const wordEl = document.createElement("span");
    wordEl.className = "word";
    wordEl.style.setProperty("--word-index", i);
    wordEl.style.setProperty("--color", textColorsArray[i]);
    for (let j = 0; j < word.length; j++) {
        const charEl = document.createElement("span");
        charEl.className = "char";
        charEl.style.setProperty("--char-index", j);
        charEl.innerHTML = word[j];
        wordEl.appendChild(charEl);
    }
    wordContainerEl.appendChild(wordEl);
}
