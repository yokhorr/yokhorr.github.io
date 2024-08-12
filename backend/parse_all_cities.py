import time
import fetch_data


def main() -> None:
    start_time = time.time()
    start_time_str = time.strftime("%H:%M:%S", time.localtime(start_time))
    print(f'Parsing all cities started at {start_time_str}', end='\n\n')

    cities = [
        'vladivostok', 'artem', 'arsenyev', 'ussuriysk', 'nakhodka', 'spassk', 'vrangel', 'dalnegorsk',
        'partizansk', 'chernigovka'
    ]

    for city in cities:
        fetch_data.fetch_data(city)

    end_time = time.time()
    end_time_str = time.strftime("%H:%M:%S", time.localtime(end_time))
    print(f'Parsing all cities finished at {end_time_str} in {int(end_time - start_time)} seconds')


if __name__ == '__main__':
    main()
