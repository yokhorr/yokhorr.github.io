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

    // Массив для хранения выбранных вариантов
    const selectedOptions = [];

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
            // Проверяем, выбран ли уже этот вариант
            if (option.classList.contains('active')) {
                // Если выбран, удаляем из массива и снимаем класс
                const index = selectedOptions.indexOf(option.innerText);
                if (index > -1) {
                    selectedOptions.splice(index, 1);
                    option.classList.remove('active');
                }
            } else {
                // Если не выбран, добавляем в массив и добавляем класс
                selectedOptions.push(option.innerText);
                option.classList.add('active');
            }

            // Обновляем текст выбранного элемента
            if (selectedOptions.length > 0) {
                selected.innerText = selectedOptions.join(', ');
            } else {
                // Если нет выбранных вариантов, показываем начальный текст
                selected.innerText = 'Выбрать'; 
            }

            // Снимаем классы для закрытия выпадающего списка
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
        });
    });
});


    // Получаем элементы DOM
    const cityDropdown = document.getElementById('cityDropdown');
    const citySelect = cityDropdown.querySelector('.select');
    const cityMenu = cityDropdown.querySelector('.menu');
    const cityItems = cityMenu.querySelectorAll('li');

    // Обработчик клика на выпадающий список
    citySelect.addEventListener('click', () => {
      cityMenu.style.display = cityMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Обработчик клика на элементы списка
    cityItems.forEach(item => {
      item.addEventListener('click', () => {
        const selectedValue = item.dataset.value;
        citySelect.querySelector('.selected').textContent = selectedValue;
        cityMenu.style.display = 'none';
      });
    });

    // Дополнительная логика для выбора только одного элемента (необязательно)
    cityItems.forEach(item => {
      item.addEventListener('click', () => {
        // Сбрасываем выделение у других элементов
        cityItems.forEach(otherItem => {
          otherItem.classList.remove('selected');
        });

        // Выделяем выбранный элемент
        item.classList.add('selected');
      });
    });