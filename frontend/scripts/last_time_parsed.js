fetch('../backend/data/last_time_parsed.txt')
  .then(response => response.text())
  .then(data => {
    document.getElementById('last-time-parsed').innerHTML = data;
  });
