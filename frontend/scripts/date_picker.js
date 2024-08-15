/*----------------------------------------------------------------------------
 *  © 2024 Malyshev Nikita <nikita.malyshev0007@gmail.com>
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

// Календарь
const datePicker = document.getElementById("dateSelect");
const today = new Date();
const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const months = [
    "Янв",
    "Февр",
    "Март",
    "Апр",
    "Май",
    "Июнь",
    "Июль",
    "Авг",
    "Сент",
    "Окт",
    "Нояб",
    "Дек",
];
let lastHoveredItem = null; // Храним ссылку на последний элемент, над которым наведен курсор

// Создаем массив дат
const dates = [];
for (let i = 0; i < 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
}

// Отрисовка календаря
let currentMonth = dates[0].getMonth(); // Храним текущий месяц

dates.forEach((date, index) => {
    const dateItem = document.createElement("li");
    dateItem.classList.add("date-item");

    // Добавляем текст даты
    dateItem.textContent = date.getDate();

    // Добавляем день недели
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfWeekElement = document.createElement("span");
    dayOfWeekElement.classList.add("day-of-week");
    dayOfWeekElement.textContent = dayOfWeek;
    dateItem.appendChild(dayOfWeekElement);

    // Добавляем месяц только если это начало месяца или дата "1"
    if (
        index === 0 ||
        (date.getDate() === 1 && date.getMonth() !== currentMonth)
    ) {
        currentMonth = date.getMonth();
        const monthElement = document.createElement("span");
        monthElement.textContent = months[currentMonth];
        dateItem.appendChild(monthElement);
    }

    // set month attribute for filtration purposes
    dateItem.setAttribute("data-month", currentMonth + 1);

    // Обработчик события для наведения курсора
    dateItem.addEventListener("mouseover", () => {
        // Если уже есть подсветка, удаляем ее
        if (lastHoveredItem) {
            lastHoveredItem.classList.remove("hovered");
        }

        // Подсвечиваем текущий элемент
        dateItem.classList.add("hovered");

        // Запоминаем текущий элемент
        lastHoveredItem = dateItem;
    });

    // Обработчик события для клика
    dateItem.addEventListener("click", () => {
        // Проверяем, есть ли у элемента класс "selected"
        if (dateItem.classList.contains("selected")) {
            // Удаляем класс "selected"
            dateItem.classList.remove("selected");
        } else {
            // Добавляем класс "selected"
            dateItem.classList.add("selected");
        }
    });

    datePicker.appendChild(dateItem);
});
