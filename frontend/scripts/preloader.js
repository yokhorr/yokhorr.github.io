// Сбросить позицию прокрутки до начала страницы
window.scrollTo(0, 0);

// Заблокировать прокрутку до начала анимации прелоадера
document.body.style.overflowY = "hidden"; 

gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.1,
    delay: 1,
    onComplete: () => {
      // Разрешить прокрутку после завершения анимации прелоадера
      document.body.style.overflowY = "auto";
    },
  }
);

gsap.fromTo(
  ".logo-name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 1
  }
);
