const citiesTranslation = new Map();

const translationPairs = [
    ["vladivostok", "Владивосток"],
    ["artem", "Артём"],
    ["ussuriysk", "Уссурийск"]
]

for (let i = 0; i < translationPairs.length; i++) {
    citiesTranslation.set(translationPairs[i][0], translationPairs[i][1]);
}

const jsons = [
    "seances",
    "dates-days-of-week",
    "films",
    "films-ids",
    "genre-namesIds",
    "theatres-seancesIds",
];

const dir = "../backend/data/jsons/";
const city = "vladivostok";

// console.log(jsons.length);

const promises = jsons.map((url) => {
    return fetch(`${dir}${url}_${city}.json`).then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    });
});
let jsonData2;
const filmsDictionary = {};

Promise.all(promises).then((results) => {
    jsonData2 = results;
    // console.log(jsonData2);
    Object.keys(jsonData2[2]).forEach((key) => {
        filmsDictionary[jsonData2[2][key].filmId] = jsonData2[2][key];
    });
    // console.log(filmsDictionary);
    let cards = document.getElementById("cards");
    Object.keys(jsonData2[0]).forEach((key) => {
        let item = document.createElement("div");
        item.classList.add("item");
        item.setAttribute("data-city", citiesTranslation.get(city));
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
        if (jsonData2[0][key].filmId !== undefined) {
            re.src = `../backend/data/films_images/${jsonData2[0][key].filmId}.jpg`;
        } 
        else {
            console.log("no image");
            re.src = `../backend/data/films_images/No_Image_Available.jpg`;
        }

    poster.appendChild(re);
    poster.classList.add("before-element");
    poster.className = "poster";
    card.appendChild(poster);
    let details = document.createElement("div");
    details.className = "details";
    let idf = document.createElement("p");
    idf.innerHTML = `${filmsDictionary[jsonData2[0][key].filmId].name}`;
    details.appendChild(idf);
    let age = document.createElement("h3");
    age.innerHTML = `${filmsDictionary[jsonData2[0][key].filmId].rating}+`;
    details.appendChild(age);
    let h3 = document.createElement("h3");
    let genres = document.createElement("div");
    genres.className = "genres";
    details.appendChild(h3);
    let theatre = document.createElement("span"); 
    theatre.innerHTML = `${jsonData2[0][key].theatre}`;
    genres.appendChild(theatre);
    for(let i = 0; i < filmsDictionary[jsonData2[0][key].filmId].genres.length; i++) {
      let genre = document.createElement("span");
      genre.innerHTML = filmsDictionary[jsonData2[0][key].filmId].genres[i];
      genres.appendChild(genre);
    }
    const startTime = `${jsonData2[0][key].time}`; 
    let duration = 0; 
    if(filmsDictionary[jsonData2[0][key].filmId].length === -1){
      duration = 61;
    }
    else{
      duration = filmsDictionary[jsonData2[0][key].filmId].length;
    }
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let endHour = Math.floor((startHour * 60 + startMinute + duration) / 60) % 24;
    let endMinute = (startMinute + duration) % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    let time= document.createElement("span");
    time.innerHTML = `${jsonData2[0][key].time} - ${endTime}`;
    genres.appendChild(time);
    let date = document.createElement("span");
    const [day, month] = `${jsonData2[0][key].date}`.split('.').map(Number);
    // console.log(day, month);
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
    genres.appendChild(date);
    let cost = document.createElement("span"); 
    let p = document.createElement("a"); 
    p.href = "#"; 
    p.style = "text-decoration: none; color: black"; 
    p.innerHTML = `${jsonData2[0][key].cost}₽`; 
    cost.appendChild(p);
    genres.appendChild(cost);
    details.appendChild(genres);
    card.appendChild(details);
    item.appendChild(card);
  });
  // report cards generation
  const cardsGenerated = new CustomEvent('cardsGenerated');
  document.dispatchEvent(cardsGenerated);
});
// console.log(promises);