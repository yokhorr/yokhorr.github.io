const urls = ['../backend/data/jsons/seances_artem_20_07_2024.json', '../backend/data/jsons/dates-days-of-week_artem_20_07_2024.json', '../backend/data/jsons/films_artem_20_07_2024.json',
  '../backend/data/jsons/films-ids_artem_20_07_2024.json', '../backend/data/jsons/genre-namesIds_artem_20_07_2024.json', '../backend/data/jsons/theatres-seancesIds_artem_20_07_2024.json'
];

console.log(urls.length)


const promises = urls.map(url => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
});
let jsonData2;
const filmsDictionary = {};

Promise.all(promises)
  .then(results => {
    jsonData2 = results;
    console.log(jsonData2);
    Object.keys(jsonData2[2]).forEach(key => {
      filmsDictionary[jsonData2[2][key].filmId] = jsonData2[2][key];
    });
    console.log(filmsDictionary);
    let cards = document.getElementById('cards'); 
    Object.keys(jsonData2[0]).forEach(key => {
      let item = document.createElement('div');
      item.classList.add('item');
      item.setAttribute('data-city', jsonData2[0][key].theatre);
      item.setAttribute('data-theatre', jsonData2[0][key].theatre);
      item.setAttribute('data-genres', filmsDictionary[jsonData2[0][key].filmId].genres);
      item.setAttribute('data-time', jsonData2[0][key].time);
      item.setAttribute('data-date', jsonData2[0][key].date);
      item.setAttribute('data-filmId', jsonData2[0][key].filmId);
      item.setAttribute('data-rating', filmsDictionary[jsonData2[0][key].filmId].rating);
      item.setAttribute('data-cost', jsonData2[0][key].cost);
      item.setAttribute('data-seancesId', jsonData2[0][key].seanceId);
      cards.appendChild(item);
      let card = document.createElement('div');
      card.className = "card";
      let poster = document.createElement('div'); 
      let re = document.createElement('img'); 
      if(`../backend/data/films_images/${jsonData2[0][key].filmId}.jpg` !== undefined){
        re.src = `../backend/data/films_images/${jsonData2[0][key].filmId}.jpg`;
      }
      else{
        re.src = '../frontend/defaultImage.jpg';
      }
      
      poster.appendChild(re); 
      poster.classList.add('before-element');
      poster.className = "poster";
      card.appendChild(poster); 
      let details = document.createElement('div'); 
      details.className = "details";
      let idf = document.createElement('p');
      idf.innerHTML= `${filmsDictionary[jsonData2[0][key].filmId].name}` 
      details.appendChild(idf); 
      let h3 = document.createElement('h3');
      let genres = document.createElement('div'); 
      genres.className = "genres";
      details.appendChild(h3); 
      let genre = document.createElement('span');
      genre.innerHTML = `Sci-fi`;
      genres.appendChild(genre); 
      details.appendChild(genres); 
      card.appendChild(details);
      item.appendChild(card);
    });
  })
console.log(promises);

