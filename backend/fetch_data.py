# © 2024 Solyanik Egor   <yokhor06@mail.ru>
#
# This code is part of Vkadre project, a service for finding film shows.
# It is licensed under the AGPL-3.0,
# you may not use this file except in compliance with the license.
#
# License text: https://www.gnu.org/licenses/agpl-3.0.en.html
# About project: https://github.com/yokhorr/yokhorr.github.io
# SPDX-License-Identifier: AGPL-3.0


import os
import requests
import json
import time
import random
import glob
from bs4 import BeautifulSoup
import cosmetics


# main lists of dictionaries, storing parsed data
seances: list[dict] = []  # date, time, filmId, theatre, cost, is3d, buyLink, seanceId
films: list[dict] = []  # filmId, name, rating, genres, length


# clear variables from previous parsing
# I don't know why they are not cleared automatically tbh
def clear_variables():
    global seances, films
    seances = []
    films = []


# add a small delay not to hurt the server
# the delay is random to pretend a user, but kino.vl.ru doesn't ban anyway
def prevent_ddos():
    time.sleep(random.randint(1, 5))


# get the HTML document from kino.vl.ru
def collect_data(city: str) -> str:
    response = requests.get(url=f'https://kino.vl.ru/films/seances/?city={city}')
    print(f'https://kino.vl.ru/films/seances/?city={city} fetched')  # log
    prevent_ddos()
    if response.status_code != 200:  # error
        raise KeyError(f'Response is {response.status_code}')
    return response.text


# save film data to the list
def write_film(name: str, rating: int, genres: list[str], length: int, picture_href: str, film_id: str) -> None:
    # add an empty dictionary to the end of list
    # and fill it
    films.append({})
    key_value = [('filmId', film_id), ('name', name), ('rating', rating), ('genres', genres),
                 ('length', length)]
    for key, value in key_value:
        films[-1][key] = value

    # download and save picture if it exists and was not saved before
    # actually, picture existence can be checked by O(1) using set
    # built of previously saved and currently parsed films
    # but the number of images is small, so it's not a big problem
    if picture_href and not os.path.isfile(f'../../films_images/{film_id}.jpg'):
        img_data = requests.get(f'https://kino.vl.ru/kino/images/{picture_href}').content
        print(f'https://kino.vl.ru/kino/images/{picture_href} fetched')
        prevent_ddos()
        with open(f'../../films_images/{film_id}.jpg', 'wb') as handler:
            handler.write(img_data)


# get general film info, same for any seance
# and instantly write it to the list with `write_film`
def parse_film(elem: BeautifulSoup, film_id: str):
    # obtain name
    name: str = elem.find(class_='film__title').get_text().strip()

    # obtain duration
    duration: int = -1  # default value
    main_info: BeautifulSoup = elem.find(class_='film__info-main')
    for info in main_info.find_all(class_='film__info-text'):  # loop tags to obtain duration
        if 'Продолжительность' in info.get_text().strip():  # right tag
            if 'ч' not in info.get_text().strip():  # `MM` format
                duration = int(info.get_text().strip().split('\n')[-1].strip().split(' ')[0])
            else:  # `H:MM` format
                text = info.get_text().strip().split('\n')[-1].strip()
                parts = text.split(' ')
                hours = int(parts[0])
                # kino.vl.ru, I'm tired to make crutches for your bugs
                if parts[-2] == '4о':
                    minutes = 40
                else:
                    minutes = int(parts[-2])
                duration = hours * 60 + minutes
            break

    # prepare elems to obtain other data
    rating_elem: BeautifulSoup = elem.find(class_='text-value age')
    genres_elem: BeautifulSoup = elem.find(class_='genre')
    trailer_elem: BeautifulSoup = elem.find(class_='film__trailer')
    picture_href_elem: BeautifulSoup = elem.find(class_='js-film-pictures-swiper-wrapper')
    if not trailer_elem:  # if no trailer, cover has other class
        picture_href_elem = elem.find(class_='film__info-visual')

    # prepare variables
    picture_href: str = ''
    genres: list[str] = []
    rating: int = 0

    #  obtain picture_href to download image then
    if picture_href_elem and len(picture_href_elem) > 1:  # NOTE: find what's wrong
        picture_href = picture_href_elem.contents[1]['href'].split('/')[-1]
    else:  # some films don't have cover ever
        with open('../../no_image.txt', 'a') as file:
            file.write(film_id + '\n')

    # obtain genres
    if genres_elem:
        genres = genres_elem.find_next().get_text(strip=True).split(', ')

    # obtain rating
    if rating_elem:
        rating = int(rating_elem.get_text().strip()[:-1])

    write_film(name, rating, genres, duration, picture_href, film_id)


# parse seance cost, 3d flag and buy link
def parse_seance_details(ref: str, theatre: str, date: str, film_time: str, city: str) -> (int, str, str):
    new_film: bool = False
    # ref constitutes '/film/50183' (films has a uniq id)
    film_id = ref.split('/')[-2]  # separate id

    # first check if file exists not to request it twice
    if not os.path.isfile(f'films/{film_id}.html'):
        new_film = True
        response = requests.get(f'https://kino.vl.ru{ref}?city={city}')
        print(f'https://kino.vl.ru{ref}?city={city} fetched')
        prevent_ddos()
        if response.status_code != 200:
            raise KeyError(f'Response is {response.status_code}')
        # save this one, needed for further parsing
        with open(f'films/{film_id}.html', 'w') as file:
            file.write(response.text)

    # prepare soup
    with open(f'films/{film_id}.html') as file:
        soup = BeautifulSoup(file, "html.parser")

    # crutch for kino.vl.ru bug
    if not soup.find_all(id="film__seances"):
        return

    # parse film and write it, if it has not been done yet
    if new_film:
        parse_film(soup, film_id)

    # Note: for every seanse we need to loop through the table
    # of all particular film seances, which is not optimal
    # actually, a better way would be not to loop through the table of all seances
    # but the table of films and then loop through the table of seances for a specific film
    # because the last one contains all needed info about date, time and theatre
    # Unfortunately, that changes core parsing logic
    # I leave this as is, because we don't need that level of optimization.
    
    date_headings = soup.find_all(id="film__seances")[0].contents  # headers with dates of tables with times
    i = 0
    rows = ''

    # find seances rows for correct date
    while i < len(date_headings):
        elem = date_headings[i]
        if (elem != '\n' and elem.string != 'Нет сеансов'
                and elem['class'][0] == 'day-title' and date in elem['data-ga-label']):  # right date found
            # save seances and exit
            rows = (date_headings[i + 2].find_next().find_all(class_='film_list seances-table__data-row') +
                    date_headings[i + 2].find_next()
                    .find_all(class_='film_list seances-table__data-row without-border'))  # messy source structure
            break
        i += 1

    # find correct seance based on time
    for row in rows:
        if row.contents[1].get_text().strip() == film_time and theatre in row.contents[3].get_text().strip():
            # and parse details
            is_3d = '3D' in row.contents[5].text
            buy_field = row.contents[9].contents
            price_str = row.contents[7].string.strip().split()

            buy_link = None  # buy link is not set
            if buy_field != ['\n']:
                buy_link = buy_field[1]['data-session-id']  # buy link is set

            price = -1  # price is not set
            if len(price_str) >= 2:
                price = int(price_str[1])  # price is set
                
            return price, is_3d, buy_link
    
    # occurs only when film was parsed after seance has expired
    print(f'No details for {film_id} in {theatre} on {date} at {film_time}')


# list of tuples: (name_id, theatre, cost, is_3d, buy_link)
# there are possibly more than one theatre for the same film
def several_theatres(elem: BeautifulSoup, date: str, time: str, city: str) -> list[tuple[str, str, int, bool, str]]:
    result = []
    name_id: str = elem.find('a')['href'].split('/')[-2]
    # loop all theatres for this date, time and film
    for theatre in elem.parent.find(class_='table-responsive__theatre-name').find_all('a'):
        _theatre = theatre.get_text().strip()
        details = parse_seance_details(elem.find_next()["href"], _theatre, date, time, city)
        if not details:  # page parsed after seance has expired # or empty page
            continue
        cost, is3d, buy_link = details
        result.append((name_id, _theatre, cost, is3d, buy_link))
    return result


# write the seance to the dict
def write_seance(curr_date: str, curr_time: str, parameters: list) -> None:
    for [nameId, theatre, cost, is_3d, buy_link] in parameters:
        seances.append({})  # create new seance for *every* combination of parameters
        if theatre == 'Шахтер':  # we respect the 'ё' letter
            theatre = 'Шахтёр'
        key_value = [("date", cosmetics.strict_date_format(curr_date)), ("time", curr_time), ("filmId", nameId),
                     ("theatre", theatre), ("cost", cost), ("is3d", is_3d), ("buyLink", buy_link)]
        for key, value in key_value:
            seances[-1][key] = value


# parse films from the HTML document
def parse_data(city: str, html_seances: str) -> None:
    # make soup of dowloaded document
    soup = BeautifulSoup(html_seances, 'html.parser')

    # date of currently processing seance
    curr_date = ""

    # site contains seances in <tr> tags
    trs = soup.find_all('tr')
    i = 0
    while i < len(trs):  # while-loop is chosen to be able to skip some elements from the inside
        tr = trs[i]
        for_date = tr.find(class_="films-seances__seance-date")  # tag containing date
        for_time = tr.find(class_='time')  # tag containing time
        if for_date:  # new date mark
            curr_date, day_of_week = cosmetics.get_clear_text(for_date.get_text())
        elif for_time:  # new time mark (they have one time tag for several films)
            curr_time, _ = cosmetics.get_clear_text(for_time.get_text())  # time of currently processed seance
            for_name = trs[i].find(class_='table-responsive__film-name')  # tag containing film name
            write_seance(curr_date, curr_time, several_theatres(for_name, curr_date, curr_time, city))
            if 'rowspan' in for_time.attrs:
                # the next N elems contain films for `curr_time`
                # N is stated in `rowspan` attribute
                for _ in range(int(for_time['rowspan']) - 1):  
                    i += 1
                    for_name = trs[i].find(class_='table-responsive__film-name')
                    write_seance(curr_date, curr_time, several_theatres(for_name, curr_date, curr_time, city))
        i += 1


# save data to jsons
def save_data() -> None:
    # what jsons to create and what to fill with
    data = [('seances', seances), ('films', films)]

    # delete old jsons
    clear_cache('jsons')

    for name, value in data:
        json.dump(value, open(f'jsons/{name}.json', 'a', encoding='utf-8'), indent=4, ensure_ascii=False)

    print(f'Saved jsons')


# delete unneeded files
def clear_cache(directory: str) -> None:
    for file in glob.glob(f'{directory}/*'):
        os.remove(file)

    print(f'Cleared {directory}')


def main(city: str) -> None:
    # measure working time
    start_time = time.time()

    print(f'Parsing {city} started')

    # go to data directory, whatever directory we are in
    running_file_directory = os.path.dirname(os.path.abspath(__file__))
    os.chdir(f'{running_file_directory}/data/cities/{city}')

    html_seances: str = collect_data(city)
    parse_data(city, html_seances)
    save_data()
    clear_variables()
    clear_cache('films')

    os.chdir('../../..')  # return to backend directory
    
    print(f'\nParsing {city} finished in {int(time.time() - start_time)} seconds')


# parser is actually run from here
def fetch_data(city: str) -> None:
    main(city)


# running as main, vladivostok is default
if __name__ == '__main__':
    main('arsenyev')
