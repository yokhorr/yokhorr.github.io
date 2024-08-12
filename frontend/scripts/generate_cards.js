function showPage() {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("filters").classList.remove("hidden");
  document.getElementById("calendar").classList.remove("hidden");
  document.getElementById("endButton").classList.remove("hidden");
}

const citiesTranslation = new Map();


const translationPairs = [
    ["vladivostok", "Владивосток"],
    ["artem", "Артём"],
    ["ussuriysk", "Уссурийск"],
    ["arsenyev", "Арсеньев"],
    ["chernigovka", "Черниговка"],
    ["dalnegorsk", "Дальнегорск"],
    ["nakhodka", "Находка"],
    ["partizansk", "Партизанск"],
    ["spassk", "Спасск-Дальний"],
    ["vrangel", "Врангель"]
]

for (let i = 0; i < translationPairs.length; i++) {
    citiesTranslation.set(translationPairs[i][0], translationPairs[i][1]);
}

const jsons = [
    "seances",
    "films"
];

const dir = "../backend/data/cities/";
const cities = ["vladivostok", "nakhodka", "ussuriysk", "artem", "arsenyev", "chernigovka", "dalnegorsk", "partizansk", "spassk", "vrangel"];

let noImages;

fetch('../backend/data/no_image.txt')
  .then(response => response.text())
  .then(data => {
    const rows = data.split('\n');
    noImages = new Set(rows);
  })
  .catch(error => console.error(error));

// console.log(jsons.length);
for(let y = 0; y < cities.length; y++) {
  const promises = jsons.map((url) => {
    return fetch(
      `${dir}${cities[y]}/jsons/${url}.json`).then((response) => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();
    });
  });
  let jsonData2;
  const filmsDictionary = {};
  // console.log(1);
  Promise.all(promises).then((results) => {
    jsonData2 = results;
    // console.log(jsonData2);
    Object.keys(jsonData2[1]).forEach((key) => {
        filmsDictionary[jsonData2[1][key].filmId] = jsonData2[1][key];
    });
    //console.log(filmsDictionary);
    let cards = document.getElementById("cards");
    cards.className = "grid";
    Object.keys(jsonData2[0]).forEach((key) => {
        let item = document.createElement("div");
        item.classList.add("item");
        // hide all cards, needed ones will be unhided in filter.js
        item.classList.add("hidden");
        item.setAttribute("data-city", citiesTranslation.get(cities[y]));
        item.setAttribute("data-theatre", jsonData2[0][key].theatre);
        item.setAttribute(
            "data-genres",
            filmsDictionary[jsonData2[0][key].filmId].genres
        );
        item.setAttribute("data-time", jsonData2[0][key].time);
        item.setAttribute("data-date", jsonData2[0][key].date);
        item.setAttribute("data-filmId", jsonData2[0][key].filmId);
        item.setAttribute(
            "data-rating",
            filmsDictionary[jsonData2[0][key].filmId].rating
        );
        item.setAttribute("data-cost", jsonData2[0][key].cost);
        item.setAttribute("data-seancesId", jsonData2[0][key].seanceId);
        item.setAttribute("data-buyLink", jsonData2[0][key].buyLink);
        const [days, monthes] = `${jsonData2[0][key].date}`.split('.').map(Number);
        const [Hour, Minute] = `${jsonData2[0][key].time}`.split(':').map(Number);
        const NowTime = new Date();
        const currentTime = new Date(NowTime.getFullYear(), monthes - 1, days, Hour, Minute, 0, 0);
        // console.log(currentTime);
        if(NowTime < currentTime) {
            cards.appendChild(item);
        }
        let card = document.createElement("div");
        card.className = "card";
        let poster = document.createElement("div");
        let re = document.createElement("img");
        re.id = "poster";
        if (!noImages.has(jsonData2[0][key].filmId)) {
            re.src = `../backend/data/films_images/${jsonData2[0][key].filmId}.jpg`;
        } 
        else {
            re.src = `images/noImage.png`;
        }
        poster.appendChild(re);
        poster.classList.add("before-element");
        poster.className = "poster";
        card.appendChild(poster);
        let detailsTop = document.createElement("div");
        detailsTop.className = "detailsTop";
        let genre = document.createElement("div");
        genre.className = "genres";
        let tre = document.createElement("span");
        tre.innerHTML = jsonData2[0][key].theatre;
        genre.appendChild(tre);
        if(jsonData2[0][key].is3d === true) {
          let dd = document.createElement("span");
          dd.className = "price" 
          dd.innerHTML = "3D";
          genre.appendChild(dd);
        }
        detailsTop.appendChild(genre);
        card.appendChild(detailsTop);
        let details = document.createElement("div");
        details.className = "details";
        let genress = document.createElement("div");
        genress.className = "genres";
        let date = document.createElement("span");
        const [day, month] = `${jsonData2[0][key].date}`.split('.').map(Number);
        let month2; 
        if(month === 1) {
          month2 = "января";
        }
        if(month === 2) {
          month2 = "февраля";
        } 
        if(month === 3) {
          month2 = "марта";
        } 
        if(month === 4) {
          month2 = "апреля";
        } 
        if(month === 5) {
          month2 = "мая";
        } 
        if(month === 6) {
          month2 = "июня";
        } 
        if(month === 7) {
          month2 = "июля";
        } 
        if(month === 8) {
          month2 = "августа";
        }
        if(month === 9) {
          month2 = "сентября";
        }
        if(month === 10) {
          month2 = "октября";
        }
        if(month === 11) {
          month2 = "ноября";
        }
        if(month === 12) {
          month2 = "декабря";
        }
        date.innerHTML = `${day} ${month2}`; 
        genress.appendChild(date);

        let startTime = document.createElement("span");
        startTime.className = "startTime";
        startTime.innerHTML = `${jsonData2[0][key].time}`;
        let length = document.createElement("div");
        length.className = "length";
        length.id = "length";
        duration = filmsDictionary[jsonData2[0][key].filmId].length;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        length.innerHTML = `· ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        const [startHour, startMinute] = `${jsonData2[0][key].time}`.split(':').map(Number);
        let endHour = Math.floor((startHour * 60 + startMinute + duration) / 60) % 24;
        let endMinute = (startMinute + duration) % 60;
        const endTime2 = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
        if (duration !== -1) {
          startTime.appendChild(length);
          item.setAttribute("data-endTime", endTime2);
        } else {
          item.setAttribute("data-endTime", jsonData2[0][key].time);
        }

        genress.appendChild(startTime);
        let price = document.createElement("span"); 
        price.className = "price";
        price.innerHTML = `${jsonData2[0][key].cost} ₽`; 
        if (jsonData2[0][key].cost !== -1 && jsonData2[0][key].cost) { // price is not set
          genress.appendChild(price);
        }
        let detailshiddenDetailshidden = document.createElement("div");
        detailshiddenDetailshidden.className = "details hiddenDetails hidden";
        let genres2 = document.createElement("div");
        genres2.className = "genres";
        for(let i = 0; i < filmsDictionary[jsonData2[0][key].filmId].genres.length; i++) {
          let genrem = document.createElement("span");
          genrem.innerHTML = filmsDictionary[jsonData2[0][key].filmId].genres[i];
          genres2.appendChild(genrem);
        }
        // console.log(genres2);
        detailshiddenDetailshidden.appendChild(genres2);
        details.appendChild(genress);
        card.appendChild(details);
        card.appendChild(detailshiddenDetailshidden);
        item.appendChild(card);
        let subcard = document.createElement("div");
        subcard.className = "subcard";
        let details2 = document.createElement("span");
        const element = document.querySelector('.subcard');
        const text = `${filmsDictionary[jsonData2[0][key].filmId].name}`;
        const characterCount = text.length;
        // console.log(characterCount, `${filmsDictionary[jsonData2[0][key].filmId].name}`);
        details2.className = "details2";
        if(characterCount > 35) {
          details2.style.fontSize = "18px";
        }
        else{
          details2.style.fontSize = "25px";
        }
        
        const fontSize = window.getComputedStyle(element).getPropertyValue('font-size');

        // console.log(fontSize);
        details2.innerHTML = `${filmsDictionary[jsonData2[0][key].filmId].name}`;
        subcard.appendChild(details2);

        if (jsonData2[0][key].buyLink) {
          // Create the image element
          let subcardImage = document.createElement("img");
          subcardImage.src = "images/ticket.png";
          subcardImage.className = "subcardImage";

          // Append the image to the subcard
          subcard.appendChild(subcardImage);
        }

        item.appendChild(subcard);
      });

      // console.log(`city ${cities[y]} generated`);
      // report cards generation if it was the last cities
      if (y === cities.length - 1) {
        showPage();
        const cardsGenerated = new CustomEvent('cardsGenerated');
        document.dispatchEvent(cardsGenerated);
        const now = new Date();
        const milliseconds = now.getMilliseconds();
        console.log(`Shout cards generation at ${now.toLocaleTimeString()} (${milliseconds} milliseconds)`);
      }
  });
}

