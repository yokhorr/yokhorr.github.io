/*----------------------------------------------------------------------------
 *  © 2024 Busygin Mihail  <m1shabs1@yandex.ru>
 *  © 2024 Malyshev Nikita <nikita.malyshev0007@gmail.com>
 *
 *  This code is part of Vkadre project, a service for finding film shows.
 *  It is licensed under the AGPL-3.0,
 *  you may not use this file except in compliance with the license.
 *  
 *  License text: https://www.gnu.org/licenses/agpl-3.0.en.html
 *  About project: https://github.com/yokhorr/yokhorr.github.io
----------------------------------------------------------------------------*/

// Получаем первый заголовок h1 на странице
const target = window.document.getElementsByTagName("h1")[0];

// Функция для добавления анимации мерцания к букве
const flickerLetter = (letter) =>
    `<span style="animation: text-flicker-in-glow ${
        Math.random() * 4
    }s linear both ">${letter}</span>`;

// Функция для добавления случайного цвета к букве
const colorLetter = (letter) =>
    `<span style="color: hsla(${
        Math.random() * 360
    }, 100%, 80%, 1);">${letter}</span>`;

// Функция для создания мерцающего и разноцветного текста
const flickerAndColorText = (text) =>
    text
        // Разбиваем текст на отдельные буквы
        .split("")
        // Добавляем анимацию мерцания к каждой букве
        .map(flickerLetter)
        // Добавляем случайный цвет к каждой букве
        .map(colorLetter)
        // Объединяем буквы обратно в строку
        .join("");

// Функция для применения мерцающего и разноцветного текста к элементу
const neonGlory = (target) =>
    (target.innerHTML = flickerAndColorText(target.textContent));

// Применяем мерцающий и разноцветный текст к заголовку при загрузке страницы
neonGlory(target);

// Добавляем обработчик клика, чтобы при каждом клике по заголовку текст снова становился мерцающим и разноцветным
target.onclick = ({ target }) => neonGlory(target);
