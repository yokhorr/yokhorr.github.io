import os
import glob


def clear_cache():
    "clears films, films_images, jsons folders and all .html files"

    direcrories_to_clear = ['films', 'films_images', 'jsons']
    
    for directory in direcrories_to_clear:
        for file in glob.glob(f'{directory}/*'):
            os.remove(file)
    
    for file in glob.glob('*.html'):
        os.remove(file)
    
    print("Cleared cache", end='\n\n')


if __name__ == '__main__':
    running_file_directory = os.path.dirname(os.path.abspath(__file__))
    os.chdir(f'{running_file_directory}/data')

    clear_cache()
