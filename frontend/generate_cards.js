let jsonData;

fetch('data/films_vladivostok_19_07_2024.json')  // path, relevant data
  .then(response => response.json())
  .then(data => {
    jsonData = data;
    console.log(jsonData); // Use jsonData here
  })
  .catch(error => console.error('Error:', error));

console.log(jsonData)
