gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.5,
    delay: 2,
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
    duration: 2,
    delay: 0.5,
  }
);

// Заблокировать прокрутку до начала анимации прелоадера
document.body.style.overflowY = "hidden"; 
