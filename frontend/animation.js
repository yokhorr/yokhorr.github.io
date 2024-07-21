//Фильтры____________________________________________________
const dropdowns = document.querySelectorAll('.dropdown');

// Итерируемся по каждому элементу .dropdown
dropdowns.forEach(dropdown => {
    // Получаем ссылки на элементы внутри .dropdown
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    // Добавляем обработчик клика на .select
    select.addEventListener('click', () => {
        // Переключаем классы для анимации
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    // Итерируемся по каждому элементу .menu li (варианту выбора)
    options.forEach(option => {
        // Добавляем обработчик клика на каждый вариант выбора
        option.addEventListener('click', () => {
            // Обновляем текст выбранного элемента
            selected.innerText = option.innerText;
            // Снимаем классы для закрытия выпадающего списка
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            // Снимаем класс 'active' со всех вариантов выбора
            options.forEach(option => {
                option.classList.remove('active');
            });

            // Добавляем класс 'active' к выбранному варианту
            option.classList.add('active');
        });
    });
});


//Логотип_____________________________________________________
// Получаем первый заголовок h1 на странице
const target = window.document.getElementsByTagName('h1')[0]

// Функция для добавления анимации мерцания к букве
const flickerLetter = letter => `<span style="animation: text-flicker-in-glow ${Math.random()*4}s linear both ">${letter}</span>`

// Функция для добавления случайного цвета к букве
const colorLetter = letter => `<span style="color: hsla(${Math.random()*360}, 100%, 80%, 1);">${letter}</span>`;

// Функция для создания мерцающего и разноцветного текста
const flickerAndColorText = text => 
  text
    // Разбиваем текст на отдельные буквы
    .split('')
    // Добавляем анимацию мерцания к каждой букве
    .map(flickerLetter)
    // Добавляем случайный цвет к каждой букве
    .map(colorLetter)
    // Объединяем буквы обратно в строку
    .join('');

// Функция для применения мерцающего и разноцветного текста к элементу
const neonGlory = target => target.innerHTML = flickerAndColorText(target.textContent);


// Применяем мерцающий и разноцветный текст к заголовку при загрузке страницы
neonGlory(target);

// Добавляем обработчик клика, чтобы при каждом клике по заголовку текст снова становился мерцающим и разноцветным
target.onclick = ({ target }) =>  neonGlory(target);


//Календарь___________________________________________________
const datePicker = document.getElementById('date-picker');
const today = new Date();
const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
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
  const dateItem = document.createElement('li');
  dateItem.classList.add('date-item');

  // Добавляем текст даты
  dateItem.textContent = date.getDate();

  // Добавляем день недели
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfWeekElement = document.createElement('span');
  dayOfWeekElement.classList.add('day-of-week');
  dayOfWeekElement.textContent = dayOfWeek;
  dateItem.appendChild(dayOfWeekElement);

  // Добавляем месяц только если это начало месяца или дата "1"
  if (index === 0 || date.getDate() === 1 && date.getMonth() !== currentMonth) {
    currentMonth = date.getMonth();
    const monthElement = document.createElement('span');
    monthElement.textContent = months[currentMonth];
    dateItem.appendChild(monthElement);
  }

  // Обработчик события для наведения курсора
  dateItem.addEventListener('mouseover', () => {
    // Если уже есть подсветка, удаляем ее
    if (lastHoveredItem) {
      lastHoveredItem.classList.remove('hovered');
    }

    // Подсвечиваем текущий элемент
    dateItem.classList.add('hovered');

    // Запоминаем текущий элемент
    lastHoveredItem = dateItem;
  });

  // Обработчик события для клика
  dateItem.addEventListener('click', () => {
    // Проверяем, есть ли у элемента класс "selected"
    if (dateItem.classList.contains('selected')) {
      // Удаляем класс "selected"
      dateItem.classList.remove('selected');
    } else {
      // Добавляем класс "selected"
      dateItem.classList.add('selected');
    }
  });

  datePicker.appendChild(dateItem);
});