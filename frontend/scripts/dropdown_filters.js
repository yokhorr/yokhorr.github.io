// Фильтры____________________________________________________

// Данные о городах и кинотеатрах
const cityToTheatres = {
  'Владивосток': ['Владивосток', 'Галактика', 'Иллюзион', 'Киномакс-Сапфир', 'Москва', 'Нептун', 'Океан IMAX', 'Уссури', 'Черёмушки'],
  'Артём': ['Шахтёр'],
  'Арсеньев': ['Космос'],
  'Уссурийск': ['Россия'],
  'Находка': ['8 планет', '8 планет ТЦ Клён'],
  'Спасск-Дальний': ['Аврора'],
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

  // Добавляем обработчик клика на весь документ
  document.addEventListener("click", (event) => {
    // Проверяем, находится ли клик вне .dropdown
    if (!dropdown.contains(event.target)) {
      // Закрываем меню, если оно открыто
      if (menu.classList.contains("menu-open")) {
        menu.classList.remove("menu-open");
        select.classList.remove("select-clicked");
        caret.classList.remove("caret-rotate");
      }
    }
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

// Массив для хранения выбранных опций в меню театра
const selectedOptionsTheatre = [];

// Функция для обновления списка кинотеатров
function updateTheatres(cityName) {
  theatreSelect.innerHTML = ''; // Очищаем список кинотеатров

  // Проверяем, есть ли кинотеатры в выбранном городе
  if (cityToTheatres[cityName]) {
    // Заполняем список кинотеатров для выбранного города
    cityToTheatres[cityName].forEach(theatre => {
      const li = document.createElement('li');
      li.textContent = theatre;
      theatreSelect.appendChild(li);
    });
  }
}

// Обработчик клика по выпадающему списку городов
cityMenu.addEventListener('click', (event) => {
  if (event.target.tagName !== 'LI') return; // was clicked menu, not an option

  const selectedCityName = event.target.textContent; // Получаем название выбранного города

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

  // Обновляем список кинотеатров для выбранного города
  updateTheatres(selectedCityName);
});

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

let defaultCity = "Владивосток";
if (localStorage.getItem('selectedCity') != null) {
  defaultCity = localStorage.getItem('selectedCity'); // Присваиваем новое значение 
}



// Находим все элементы li в меню городов
const cityListItems = cityMenu.querySelectorAll('li');

for (const item of cityListItems) {
  if (item.textContent.trim() === defaultCity) {
    selectedCity = item;
    break; // Прекращаем цикл, как только нашли элемент
  }
}

// Проверяем, что элемент найден
if (selectedCity) {
  selectedCity.classList.add('active');
  cityDropdown.querySelector('.selected').textContent = defaultCity;
  updateTheatres(defaultCity); 
}




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