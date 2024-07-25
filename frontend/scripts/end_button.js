//Кнопка_____________________________________________
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Добавьте плавную прокрутку
  });
}

const endButton = document.querySelector('.btn');
endButton.addEventListener('click', scrollToTop);