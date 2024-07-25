const debugCard = document.querySelector('#debug');
const grid = document.getElementById('cards');

for (let i = 0; i < 15; i++) {
  const newCard = debugCard.cloneNode(true);
  grid.appendChild(newCard);
}

const posters = document.querySelectorAll('#poster');
for(let i = 0; i < posters.length; i++) {
  const randomImage = Math.floor(Math.random() * 41);
  posters[i].src = `../backend/data/films_images/${randomImage}.jpg`;
}

const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
  card.addEventListener('mouseenter', function() {
    card.lastElementChild.classList.remove('hidden');
  });
});
