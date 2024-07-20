let jsonData;

fetch('seances_artem_20_07_2024.json')  // path, relevant data
  .then(response => response.json())
  .then(data => {
    jsonData = data;
    console.log(jsonData); // Use jsonData here

    // Ваш код, зависящий от jsonData, должен быть здесь
    let cards = document.getElementById('cards'); 
    for(let i = 0; i < jsonData.length; i++) {
      let item = document.createElement('div');
      item.classList.add('item');
      item.setAttribute('data-city', jsonData[i].theatre);
      item.setAttribute('data-theatre', jsonData[i].theatre);
      item.setAttribute('data-genres', jsonData[i].filmId);
      item.setAttribute('data-time', jsonData[i].time);
      item.setAttribute('data-date', jsonData[i].date);
      item.setAttribute('data-filmId', jsonData[i].filmId);
      item.setAttribute('data-rating', jsonData[i].cost);
      item.setAttribute('data-cost', jsonData[i].cost);
      item.setAttribute('data-seancesId', jsonData[i].seanceId);
      cards.appendChild(item);
      let card = document.createElement('div');
      card.className = "card";
      let poster = document.createElement('div'); 
      let re = document.createElement('img'); 
      re.src = `../backend/data/films_images/${jsonData[i].filmId}.jpg`; 
      poster.appendChild(re); 
      poster.classList.add('before-element');
      poster.className = "poster";
      card.appendChild(poster); 
      let details = document.createElement('div'); 
      details.className = "details";
      let idf = document.createElement('p');
      idf.innerHTML= `${jsonData[i].filmId}` 
      details.appendChild(idf); 
      let h3 = document.createElement('h3');
      let genres = document.createElement('div'); 
      details.appendChild(h3); 
      let genre = document.createElement('span');
      genre.innerHTML = `Sci-fi`;
      genres.appendChild(genre); 
      details.appendChild(genres); 
      card.appendChild(details);
      item.appendChild(card);
    }
  })
  .catch(error => console.error('Error:', error));

