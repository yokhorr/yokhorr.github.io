// Фильтры____________________________________________________

// Данные о городах и кинотеатрах
const cityToTheatres = {
  'Владивосток': ['Владивосток', 'Галактика', 'Иллюзион', 'Киномакс-Сапфир', 'Москва', 'Нептун', 'Океан IMAX', 'Уссури', 'Черёмушки'],
  'Артём': ['Шахтер'],
  'Арсеньев': ['Космос'],
  'Уссурийск': ['Россия'],
  'Находка': ['8 планет', '8 планет ТЦ Клён'],
  'Спасск': ['Аврора'],
  'Врангель': ['Каскад'],
  'Дальнегорск': ['Брусника'],
  'Партизанск': ['Кристалл'],
  'Черниговка': ['Импульс']
};

// Получаем все элементы .dropdown
const dropdowns = document.querySelectorAll(".dropdown");

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
});

// Получаем элементы для выпадающего списка городов и кинотеатров
const cityDropdown = document.getElementById('cityDropdown');
const theatreDropdown = document.getElementById('theatreDropdown');
const theatreSelect = document.getElementById('theatreSelect');
const cityMenu = cityDropdown.querySelector('.menu');
const theatreMenu = theatreDropdown.querySelector('.menu');

let selectedCity = null; // Переменная для хранения выбранного города
let selectedTheatre = null; // Переменная для хранения выбранного кинотеатра


// Обработчик клика по выпадающему списку городов
cityMenu.addEventListener('click', (event) => {
  const selectedCityName = event.target.textContent; // Получаем название выбранного города
  theatreSelect.innerHTML = ''; // Очищаем список кинотеатров

  // Проверяем, есть ли кинотеатры в выбранном городе
  if (cityToTheatres[selectedCityName]) {
    // Заполняем список кинотеатров для выбранного города
    cityToTheatres[selectedCityName].forEach(theatre => {
      const li = document.createElement('li');
      li.textContent = theatre;
      theatreSelect.appendChild(li);
    });
  }

  // Проверяем, был ли клик по элементу списка
  if (event.target.tagName === 'LI') {
    // Удаляем класс 'active' с предыдущего выбранного элемента
    if (selectedCity) {
      selectedCity.classList.remove('active');
    }
    
      selectedCity = event.target;
      selectedCity.classList.add('active');
      cityMenu.classList.toggle("menu-open");

      // Обновляем текст выбранного города
      cityDropdown.querySelector('.selected').textContent = selectedCity.textContent;

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


// Массив для хранения выбранных опций в меню театра
const selectedOptionsTheatre = [];

// Добавляем обработчик событий для меню театра
theatreMenu.addEventListener('click', (event) => {
  // Проверяем, был ли клик по элементу списка (LI)
  if (event.target.tagName === 'LI') {
    // Находим индекс выбранного элемента в массиве
    const index = selectedOptionsTheatre.indexOf(event.target);

    // Если элемент уже выбран, удаляем его из массива и убираем класс 'active'
    if (index !== -1) {
      selectedOptionsTheatre.splice(index, 1);
      event.target.classList.remove('active');
    } else { // Иначе, добавляем элемент в массив и добавляем класс 'active'
      selectedOptionsTheatre.push(event.target);
      event.target.classList.add('active');
    }
  }
});



// Получаем элементы для выпадающего списка жанров и антижанров
const genreDropdown = document.getElementById('genreDropdown');
const antiGenreDropdown = document.getElementById('antiGenreDropdown');
const genreSelect = document.getElementById('genreSelect');
const antiGenreSelect = document.getElementById('antiGenreSelect');
const genreMenu = genreDropdown.querySelector('.menu');
const antiGenreMenu = antiGenreDropdown.querySelector('.menu');

// Добавляем обработчик событий для меню жанров
genreMenu.addEventListener('click', (event) => {
  // Проверяем, был ли клик по элементу списка (LI)
  if (event.target.tagName === 'LI') {
    // Находим индекс выбранного элемента в массиве
    const index = selectedOptionsTheatre.indexOf(event.target);

    // Если элемент уже выбран, удаляем его из массива и убираем класс 'active'
    if (index !== -1) {
      selectedOptionsTheatre.splice(index, 1);
      event.target.classList.remove('active');
      // Показывать элемент в списке антижанров
      antiGenreMenu.querySelectorAll('li').forEach(item => {
        if (item.textContent === event.target.textContent) {
          item.style.display = 'block';
        }
      });
    } else { // Иначе, добавляем элемент в массив и добавляем класс 'active'
      selectedOptionsTheatre.push(event.target);
      event.target.classList.add('active');
      // Скрываем элемент в списке антижанров
      antiGenreMenu.querySelectorAll('li').forEach(item => {
        if (item.textContent === event.target.textContent) {
          item.style.display = 'none';
        }
      });
    }
  }
});

// Добавляем обработчик событий для меню антижанров
antiGenreMenu.addEventListener('click', (event) => {
  // Проверяем, был ли клик по элементу списка (LI)
  if (event.target.tagName === 'LI') {
    // Находим индекс выбранного элемента в массиве
    const index = selectedOptionsTheatre.indexOf(event.target);

    // Если элемент уже выбран, удаляем его из массива и убираем класс 'active'
    if (index !== -1) {
      selectedOptionsTheatre.splice(index, 1);
      event.target.classList.remove('active');
      // Показывать элемент в списке жанров
      genreMenu.querySelectorAll('li').forEach(item => {
        if (item.textContent === event.target.textContent) {
          item.style.display = 'block';
        }
      });
    } else { // Иначе, добавляем элемент в массив и добавляем класс 'active'
      selectedOptionsTheatre.push(event.target);
      event.target.classList.add('active');
      // Скрываем элемент в списке жанров
      genreMenu.querySelectorAll('li').forEach(item => {
        if (item.textContent === event.target.textContent) {
          item.style.display = 'none';
        }
      });
    }
  }
});


// Получаем элементы для выпадающего списка возраста
const ageDropdown = document.getElementById('ageDropdown');
const ageSelect = document.getElementById('ageSelect');
const ageMenu = ageDropdown.querySelector('.menu');

let selectedAge = null; // Переменная для хранения выбранного возростного ограничения


// Обработчик клика по выпадающему списку городов
ageMenu.addEventListener('click', (event) => {

  // Проверяем, был ли клик по элементу списка
  if (event.target.tagName === 'LI') {
    // Удаляем класс 'active' с предыдущего выбранного элемента
    if (selectedAge) {
      selectedAge.classList.remove('active');
    }
    
    selectedAge = event.target;
    selectedAge.classList.add('active');
      ageMenu.classList.toggle("menu-open");

      // Обновляем текст выбранного города
      ageDropdown.querySelector('.selected').textContent = selectedAge.textContent;

    // Скрываем выпадающий список
    ageMenu.classList.remove('active');

    // Возвращаем изначальный цвет всем элементам в списке городов
    ageMenu.querySelectorAll('li').forEach(li => {
      if (li !== selectedAge) {
        li.classList.remove('active');
      }
    });
  }
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
const datePicker = document.getElementById('dateSelect');
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

  dateItem.setAttribute("data-month", currentMonth + 1);

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


//Кнопка_____________________________________________
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Добавьте плавную прокрутку
  });
}

const endButton = document.querySelector('.btn');
endButton.addEventListener('click', scrollToTop);