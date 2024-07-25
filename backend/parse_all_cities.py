import time
import fetch_data


def main() -> None:
    start_time = time.time()

    cities = [
        'vladivostok', 'artem', 'arsenyev', 'ussuriysk', 'nakhodka', 'spassk', 'vrangel', 'dalnegorsk',
        'partizansk', 'chernigovka'
    ]

    for city in cities:
        fetch_data.fetch_data(city)

    end_time = time.time()
    print(f'Parsing all cities finished in {int(end_time - start_time)} seconds')


if __name__ == '__main__':
    main()
