const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');


    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });
    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
            option.forEach(option => {
                option.classList.remove('active');
            });

            option.classList.add('active');
        });
    });
});



const target = window.document.getElementsByTagName('h1')[0]

const flickerLetter = letter => `<span style="animation: text-flicker-in-glow ${Math.random()*4}s linear both ">${letter}</span>`
const colorLetter = letter => `<span style="color: hsla(${Math.random()*360}, 100%, 80%, 1);">${letter}</span>`;
const flickerAndColorText = text => 
  text
    .split('')
    .map(flickerLetter)
    .map(colorLetter)
    .join('');
const neonGlory = target => target.innerHTML = flickerAndColorText(target.textContent);


neonGlory(target);
target.onclick = ({ target }) =>  neonGlory(target);

const datePicker = document.getElementById('date-picker');
const today = new Date();
const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
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
