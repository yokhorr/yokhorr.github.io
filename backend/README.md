# Backend structure

## [`requirements.txt`](requirements.txt)
Project dependencies are listed in `requirements.txt` and can be installed with:

`pip install -r requirements.txt`

## Scripts

- [`fetch_data.py`](fetch_data.py) is the base backend script. It collects data from kino.vl.ru, parses it and saves to jsons.
- [`parse_all_cities.py`](parse_all_cities.py) is a wrapper for the main script, running it for every city, presented by kino.vl.ru.
- [`cosmetics.py`](cosmetics.py) contains some scripts for date formatting.

## [`data`](data) directory

`data` directory contains files [`last_time_parsed.txt`](data/last_time_parsed.txt) to which last parser run is saved by `parse_all_cities.py` and file [`no_image.txt`](data/no_image.txt) where are listed films ids which don't have a picture on kino.vl.ru, which is a rare case.

There are two subdirectories in `data`: [`films_images`](data/films_images) and [`cities`](data/cities).

`films_images` contains pictures for every film. Every picture name is corresponding film id.

`cities` contains a directory for every city, for example `vladivostok`, which contains two more subdirectories: `films` and `jsons`.

`films` is a temporary storage for html documents for every film during parsing. They are stored not to request them twice.

`jsons` stores two files, created with `fetch_data.py`: `seances.json` and `films.json`.

# `fetch_data.py`
This script scrapes the https://kino.vl.ru/films/seances/ page, presenting information about all seances for a given city. Every row of this table becomes a data entry in `seances.json` and then becomes a card on frontend.

Every seance is set with three key parameters: time (including date), film name and theatre. File `seances.json` also contains information about its cost, whether film is shown in 3D and a link to buy ticket (only for Vladivostok).

Basic film details, such as length, age rating, genres and picture are collected for every film from a separate page. Film details are saved to `films.json`.

`films.json` and `seances.json` are connected with `filmId`.

