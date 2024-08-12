import time
import fetch_data
import os


def main() -> None:
    start_time = time.time()
    start_time_str = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime(start_time))
    print(f'Parsing all cities started at {start_time_str}', end='\n\n')


    cities = [
        'vladivostok', 'nakhodka', 'artem', 'arsenyev', 'ussuriysk', 'spassk', 'vrangel', 'dalnegorsk',
        'partizansk', 'chernigovka'
    ]

    # clear no_image.txt
    open('backend/data/no_image.txt', 'w').close()

    for city in cities:
        fetch_data.fetch_data(city)

    # update last_time_parsed.txt in data directory
    with open(f'backend/data/last_time_parsed.txt', 'w') as file:
        file.write(time.strftime("%d.%m %H:%M", time.localtime(time.time())))

    end_time = time.time()
    end_time_str = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime(end_time))
    print(f'Parsing all cities finished at {end_time_str} in {int(end_time - start_time)} seconds')


if __name__ == '__main__':
    main()
