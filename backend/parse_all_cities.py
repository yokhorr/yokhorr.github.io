# © 2024 Solyanik Egor   <yokhor06@mail.ru>
#
# This code is part of Vkadre project, a service for finding film shows.
# It is licensed under the AGPL-3.0,
# you may not use this file except in compliance with the license.
#
# License text: https://www.gnu.org/licenses/agpl-3.0.en.html
# About project: https://github.com/yokhorr/yokhorr.github.io


import time
import fetch_data
import os


def main() -> None:
    # measure working time
    start_time = time.time()
    start_time_str = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime(start_time))
    print(f'Parsing all cities started at {start_time_str}', end='\n\n')

    # needed to run correctly whatever directory is run from
    running_file_directory = os.path.dirname(os.path.abspath(__file__))

    # cities to parse
    cities = [
        'vladivostok', 'nakhodka', 'artem', 'arsenyev', 'ussuriysk', 'spassk', 'vrangel', 'dalnegorsk',
        'partizansk', 'chernigovka'
    ]

    # clear no_image.txt
    open(f'{running_file_directory}/data/no_image.txt', 'w').close()

    # parse all cities
    for city in cities:
        fetch_data.fetch_data(city)

    # update last_time_parsed.txt in data directory
    with open(f'{running_file_directory}/data/last_time_parsed.txt', 'w') as file:
        file.write(time.strftime("%d.%m %H:%M", time.localtime(time.time())))

    # log working time, save time of run in last_time_parsed.txt
    end_time = time.time()
    end_time_str = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime(end_time))
    print(f'Parsing all cities finished at {end_time_str} in {int(end_time - start_time)} seconds')


if __name__ == '__main__':
    main()
