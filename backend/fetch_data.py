import os
import requests
import json
import time
import random
import glob
from datetime import datetime
from bs4 import BeautifulSoup

t_date = datetime.now().strftime('%d_%m_%Y')
seances: list[dict] = []
films: list[dict] = []
theatres_seancesIds: dict[str, list[int]] = {}
genre_namesIds: dict[str, set[str]] = {}
dates_days_of_week: dict[str, str] = {}
films_ids: set[str] = set()
all_films_ids: list[str] = []


# clear variables from previous parsing
# I don't know why they are not cleared automatically tbh
def clear_variables():
    global seances, films, theatres_seancesIds, genre_namesIds, dates_days_of_week, films_ids, all_films_ids
    seances = []
    films = []
    theatres_seancesIds = {}
    genre_namesIds = {}
    dates_days_of_week = {}
    films_ids = set()
    all_films_ids = []


# get the HTML document
def collect_data(city: str) -> str:
    # note: removed save to file and check for it
    # if not os.path.isfile(f'data_{city}_{t_date}.html'):
    response = requests.get(url=f'https://kino.vl.ru/films/seances/?city={city}')
    print(f'https://kino.vl.ru/films/seances/?city={city} fetched')
    time.sleep(random.randint(1, 5))  # prevent DDOS
    if response.status_code != 200:
        raise KeyError(f'Response is {response.status_code}')
    return response.text
    # with open(f'data_{city}_{t_date}.html', 'w') as file:
    #     file.write(response.text)


# 1 апреля -> 01.04
def strict_date_format(text: str) -> str:
    text = text.split()
    day = text[0]
    month = text[1]
    if len(day) == 1:
        day = '0' + day
    months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
              'августа', 'сентября', 'октября', 'ноября', 'декабря']
    month = str(months.index(month) + 1)
    if len(month) == 1:
        month = '0' + month
    return day + '.' + month


# separate the day of the week and delete extra whitespaces
def get_clear_text(text: str) -> tuple[str, str]:
    text = text.strip()
    days_of_week = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
    found_day = None
    for day in days_of_week:
        rubbish = str(day + ', ')
        if rubbish in text:
            text = text.removeprefix(rubbish)
            found_day = day
            break
    return text, found_day


def write_film(name: str, rating: int, genres: list[str], length: int,
               description: str, picture_href: str, film_id: str) -> None:
    for genre in genres:
        if genre not in genre_namesIds:
            genre_namesIds[genre] = set()
        genre_namesIds[genre].add(film_id)

    films.append({})
    data = [('filmId', film_id), ('name', name), ('rating', rating), ('genres', genres),
            ('length', length), ('description', description)]
    for elem in data:
        films[-1][elem[0]] = elem[1]

    # download and save picture if it exists and was not saved before
    # actually, picture existence can be checked by O(1) using set
    # built of previously saved and currently parsed films
    # but the number of images is small, so it's not a big problem
    if picture_href and not os.path.isfile(f'../../films_images/{film_id}.jpg'):
        img_data = requests.get(f'https://kino.vl.ru/kino/images/{picture_href}').content
        print(f'https://kino.vl.ru/kino/images/{picture_href} fetched')
        time.sleep(random.randint(1, 5))  # prevent DDOS
        with open(f'../../films_images/{film_id}.jpg', 'wb') as handler:
            handler.write(img_data)


def parse_film(elem: BeautifulSoup, film_id: str):
    name: str = elem.find(class_='film__title').get_text().strip()
    if name in films:
        return
    duration: int = -1
    main_info: BeautifulSoup = elem.find(class_='film__info-main')
    for info in main_info.find_all(class_='film__info-text'):
        if 'Продолжительность' in info.get_text().strip():
            if 'ч' not in info.get_text().strip():  # `mm` format
                duration = int(info.get_text().strip().split('\n')[-1].strip().split(' ')[0])
            else:  # `h:mm` format
                text = info.get_text().strip().split('\n')[-1].strip()
                parts = text.split(' ')
                hours = int(parts[0])
                minutes = int(parts[-2])
                duration = hours * 60 + minutes
            break
    description: str = elem.find(class_='film__description').get_text().strip()
    rating_elem: BeautifulSoup = elem.find(class_='text-value age')
    genres_elem: BeautifulSoup = elem.find(class_='genre')
    trailer_elem: BeautifulSoup = elem.find(class_='film__trailer')
    picture_href_elem: BeautifulSoup = elem.find(class_='js-film-pictures-swiper-wrapper')
    if not trailer_elem:  # if no trailer, cover has other class
        picture_href_elem = elem.find(class_='film__info-visual')

    picture_href: str = ''
    genres: list[str] = []
    rating: int = 0
    if len(picture_href_elem) > 1:
        picture_href = picture_href_elem.contents[1]['href'].split('/')[-1]
    else:  # some films don't have cover ever
        with open('../../no_image.txt', 'a') as file:
            file.write(film_id + '\n')
    if genres_elem:
        genres = genres_elem.find_next().get_text(strip=True).split(', ')
    if rating_elem:
        rating = int(rating_elem.get_text().strip()[:-1])
    write_film(name, rating, genres, duration, description, picture_href, film_id)


# parse seance cost, 3d flag and buy link
def parse_film_details(ref: str, theatre: str, date: str, film_time: str, city: str) -> (int, str):
    global t_date
    new_film: bool = False
    # ref constitutes '/film/50183' (films has a uniq id)
    film_id = ref.split('/')[-2]  # separate id
    films_ids.add(film_id)

    # first check if file exists not to request it twice
    if not os.path.isfile(f'films/{film_id}.html'):  # NOTE: can remove city and date
        new_film = True
        response = requests.get(f'https://kino.vl.ru{ref}?city={city}')
        print(f'https://kino.vl.ru{ref}?city={city} fetched')
        time.sleep(random.randint(1, 5))  # prevent DDOS
        if response.status_code != 200:
            raise KeyError(f'Response is {response.status_code}')
        with open(f'films/{film_id}.html', 'w') as file:
            file.write(response.text)
    with open(f'films/{film_id}.html') as file:
        soup = BeautifulSoup(file, "html.parser")
    if new_film:
        parse_film(soup, film_id)
    date_headings = soup.find_all(id="film__seances")[0].contents  # headers with dates of tables with times
    i = 0
    rows = ''
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
    for row in rows:
        if row.contents[1].get_text().strip() == film_time and theatre in row.contents[3].get_text().strip():
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
    print(f'No details for {film_id} in {theatre} on {date} at {film_time}')


# list of tuples (name_id, theatre, cost) (possibly more than one theatre for the same film)
def name_to_theatre(elem: BeautifulSoup, date: str, time: str, city: str) -> list[tuple[str, str, int, bool, str]]:
    result = []
    name_id: str = elem.find('a')['href'].split('/')[-2]
    for theatre in elem.parent.find(class_='table-responsive__theatre-name').find_all('a'):
        _theatre = theatre.get_text().strip()
        details = parse_film_details(elem.find_next()["href"], _theatre, date, time, city)
        if not details:  # apparently when page is parsed at the last minute
            continue     # there are no details for this seance
        cost, is3d, buy_link = details
        result.append((name_id, _theatre, cost, is3d, buy_link))
    return result


# write the seance to the dict
def write_seance(curr_date: str, curr_time: str, parameters: list) -> None:
    for [nameId, theatre, cost, is_3d, buy_link] in parameters:
        seances.append({})  # create new seance for *every* triplet
        if theatre == 'Шахтер':  # cosmetics
            theatre = 'Шахтёр'
        elems = [("date", strict_date_format(curr_date)), ("time", curr_time), ("filmId", nameId),
                 ("theatre", theatre), ("cost", cost), ("is3d", is_3d), ("buyLink", buy_link), ("seanceId", -1)]
        for [key, value] in elems:
            seances[-1][key] = value


# parse films from the HTML document
def parse_data(city: str, html_seances: str) -> None:
    # note: removed reading from file, because it's now not saved
    # `date` means the real today's date; `curr_date` and `curr_time` are intended for currently parsing elements
    # with open(f'data_{city}_{t_date}.html') as file:
    #     soup = BeautifulSoup(file, 'html.parser')
    soup = BeautifulSoup(html_seances, 'html.parser')

    curr_date = ""

    trs = soup.find_all('tr')
    i = 0
    while i < len(trs):  # while-loop is chosen to be able to skip some elements from the inside
        tr = trs[i]
        for_date = tr.find(class_="films-seances__seance-date")
        for_time = tr.find(class_='time')
        if for_date:  # new date mark
            curr_date, day_of_week = get_clear_text(for_date.get_text())
            dates_days_of_week[strict_date_format(curr_date)] = day_of_week
            # seances[curr_date] = {}
        elif for_time:  # new time mark (they have one time tag for several films)
            curr_time, _ = get_clear_text(for_time.get_text())
            # seances[curr_date][curr_time] = []
            for_name = trs[i].find(class_='table-responsive__film-name')
            write_seance(curr_date, curr_time, name_to_theatre(for_name, curr_date, curr_time, city))
            if 'rowspan' in for_time.attrs:
                for j in range(int(for_time['rowspan']) - 1):  # the next `rowspan` elems contain films for `curr_time`
                    i += 1
                    for_name = trs[i].find(class_='table-responsive__film-name')
                    write_seance(curr_date, curr_time, name_to_theatre(for_name, curr_date, curr_time, city))
        i += 1


def save_data() -> None:
    # add ids to seances and theatres
    seance_id = 0
    for seance in seances:
        seance['seanceId'] = seance_id
        theatre = seance['theatre']
        if theatre not in theatres_seancesIds:
            theatres_seancesIds[theatre] = []
        theatres_seancesIds[theatre].append(seance_id)
        seance_id += 1

    # theatres_seancesIds to fine format
    theatres_seancesIds_fine: list[dict] = []
    for theatre in theatres_seancesIds:
        theatres_seancesIds_fine.append({})
        theatres_seancesIds_fine[-1]['theatre'] = theatre
        theatres_seancesIds_fine[-1]['seance_ids'] = theatres_seancesIds[theatre]

    # replace sets with lists in genre_namesIds
    genre_names_dict: list[dict] = []
    for genre in genre_namesIds:
        genre_names_dict.append({})
        genre_names_dict[-1]['genre'] = genre
        genre_names_dict[-1]['filmIds'] = list(genre_namesIds[genre])

    for film in films:
        all_films_ids.append(film['filmId'])

    # create jsons
    data = [(seances, 'seances'), (films, 'films')]

    # deprecated
    # (theatres_seancesIds_fine, 'theatres-seancesIds'),
    # (genre_names_dict, 'genre-namesIds'), (dates_days_of_week, 'dates-days-of-week'),
    # (all_films_ids, 'films-ids')

    clear_cache('jsons')
    for elem in data:
        json.dump(elem[0], open(f'jsons/{elem[1]}.json', 'a', encoding='utf-8'), indent=4, ensure_ascii=False)
    print(f'Saved jsons')


def clear_cache(directory: str) -> None:
    for file in glob.glob(f'{directory}/*'):
        os.remove(file)
    print(f'Cleared {directory}')


def main(city: str) -> None:
    # measure working time
    start_time = time.time()

    print(f'Parsing {city} started')

    # go to data directory
    running_file_directory = os.path.dirname(os.path.abspath(__file__))
    os.chdir(f'{running_file_directory}/data/cities/{city}')

    html_seances: str = collect_data(city)
    parse_data(city, html_seances)
    save_data()
    clear_variables()
    clear_cache('films')

    os.chdir('../../..')  # return to backend directory
    
    print(f'\nParsing {city} finished in {int(time.time() - start_time)} seconds')


def fetch_data(city: str) -> None:
    main(city)


if __name__ == '__main__':
    main('vladivostok')
