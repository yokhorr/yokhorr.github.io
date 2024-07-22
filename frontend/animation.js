//Фильтры____________________________________________________
const dropdowns = document.querySelectorAll(".dropdown");

const filterNames = new Map();
const keys = ["citySelect", "genreSelect", "theatreSelect"];
const values = ["Город", "Жанр", "Кинотеатр"];

for (let i = 0; i < keys.length; i++) {
    filterNames.set(keys[i], values[i]);
}

// Итерируемся по каждому элементу .dropdown
dropdowns.forEach((dropdown) => {
    // Получаем ссылки на элементы внутри .dropdown
    const select = dropdown.querySelector(".select");
    const caret = dropdown.querySelector(".caret");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

    // Массив для хранения выбранных вариантов
    const selectedOptions = [];
    // Добавляем обработчик клика на .select
    select.addEventListener("click", () => {
        // Переключаем классы для анимации
        select.classList.toggle("select-clicked");
        caret.classList.toggle("caret-rotate");
        menu.classList.toggle("menu-open");
    });

    // Итерируемся по каждому элементу .menu li (варианту выбора)
    options.forEach((option) => {
        // Добавляем обработчик клика на каждый вариант выбора
        option.addEventListener("click", () => {
            // Проверяем, выбран ли уже этот вариант
            if (option.classList.contains("active")) {
                // Если выбран, удаляем из массива и снимаем класс
                const index = selectedOptions.indexOf(option.innerText);
                if (index > -1) {
                    selectedOptions.splice(index, 1);
                    option.classList.remove("active");
                }
            } else {
                // Если не выбран, добавляем в массив и добавляем класс
                selectedOptions.push(option.innerText);
                option.classList.add("active");
            }

            // Обновляем текст выбранного элемента
            if (selectedOptions.length > 0) {
                selected.innerText = selectedOptions.join(", ");
            } else {
                // Если нет выбранных вариантов, показываем начальный текст
                selected.innerText = filterNames.get(option.parentElement.id);
            }

            // Снимаем классы для закрытия выпадающего списка
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");
        });
    });
});

//Логотип_____________________________________________________
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

//Календарь___________________________________________________
const datePicker = document.getElementById("dateSelect");
const today = new Date();
const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const months = [
    "Янв",
    "Фев",
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
for (let i = 0; i < 18; i++) {
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


// Получаем элементы DOM
const cityDropdown = document.getElementById('cityDropdown');
const citySelect = cityDropdown.querySelector('.select');
const cityMenu = cityDropdown.querySelector('.menu');
let selectedCity = null;

cityDropdown.addEventListener('click', () => {
  cityMenu.classList.toggle('active');
});

cityMenu.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    // Удаляем класс 'active' с предыдущего выбранного элемента
    if (selectedCity) {
      selectedCity.classList.remove('active');
    }

    // Проверяем, выбран ли элемент повторно
    if (event.target === selectedCity) {
      // Если да, то просто удаляем класс 'active' и обнуляем selectedCity
      selectedCity = null;
      cityDropdown.querySelector('.selected').textContent = 'Выбрать';
    } else {
      // Если нет, то добавляем класс 'active' к новому выбранному элементу
      selectedCity = event.target;
      selectedCity.classList.add('active');

// Обновляем текст выбранного города
      cityDropdown.querySelector('.selected').textContent = selectedCity.textContent;
    }

    // Скрываем выпадающий список
    cityMenu.classList.remove('active');

    // Возвращаем изначальный цвет всем элементам в списке городов
    cityMenu.querySelectorAll('li').forEach(li => {
      if (li !== selectedCity) {
        li.classList.remove('active'); 
      }
    });
  }
});
