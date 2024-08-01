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
  if (event.target.tagName !== 'LI') return; // was clicked menu, not an option

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