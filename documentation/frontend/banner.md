## Документация CSS кода для эффекта "glitch"

Этот код CSS реализует эффект "glitch" для текста, используя комбинацию стилей, псевдоэлементов и анимации.

### Общая структура

- .banner: Класс для общего контейнера текста, устанавливает выравнивание по центру и отступ сверху.
- .glitch: Основной класс для текста с эффектом "glitch".
  - font-size, font-weight, text-transform: Устанавливают базовые стили текста.
  - position: relative: Размещает текст как родительский элемент для псевдоэлементов.
  - text-shadow: Создает начальный эффект "glitch" с помощью теневых эффектов.
  - animation: Анимирует текст с помощью ключевых кадров @keyframes glitch.

### Псевдоэлементы

- .glitch span: Два псевдоэлемента (span:first-child и span:last-child) создают визуальный эффект "glitchа" путем частичного скрытия текста.
  - position: absolute, top: 0, left: 0: Позиционирует псевдоэлементы относительно родительского элемента.
  - clip-path: Определяет форму обрезки для каждого псевдоэлемента.
  - transform: Немного смещает псевдоэлементы для усиления эффекта "glitchа".
  - opacity: Уменьшает непрозрачность псевдоэлементов для более плавного эффекта.
  - animation: Анимирует псевдоэлементы с помощью ключевых кадров @keyframes glitch с разными временными параметрами.

### Ключевые кадры @keyframes glitch

- 0%: Определяет начальное состояние теней, используемых для эффекта "glitchа".
- 15%: Сохраняет начальное состояние теней.
- 16%: Меняет положение и цвет теней, создавая эффект "перемешивания".
- 49%: Сохраняет состояние теней, созданное в 16%.
- 50%: Снова меняет положение и цвет теней.
- 99%: Сохраняет состояние теней, созданное в 50%.
- 100%: Возвращает тени в начальное состояние (0%).

### Реализация

Этот код создает эффект "glitchа" с помощью анимации теней и частичного скрытия текста с использованием псевдоэлементов. Изменение ключевых кадров анимации @keyframes glitch и стилей псевдоэлементов (clip-path, transform, opacity) позволит вам настроить эффект "glitchа" по своему вкусу.