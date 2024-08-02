// Сбросить позицию прокрутки до начала страницы
document.body.style.overflowY = "hidden";

gsap.fromTo(
    ".loading-page",
    { opacity: 1 },
    {
      opacity: 0.9,
      display: "none",
      duration: 1,
      onComplete: () => {
        window.scrollTo(0, 0); // Сбросьте прокрутку после завершения анимации
        // Разрешить прокрутку после завершения анимации прелоадера
        document.body.style.overflowY = "auto";
      },
      delay: 1,
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
      opacity: 0.5,
      duration: 0.9,
      delay: 0,
    }
  );